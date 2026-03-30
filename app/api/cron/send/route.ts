import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings, subscribers, sentEmails, drafts } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { shouldSendNow } from '@/lib/schedule'
import { buildEmailHtml, sendBatch } from '@/lib/email'
import { signEmailToken } from '@/lib/token'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'
import { subscriberFrequenciesFor, scheduleToSendType } from '@/lib/preferences'
import Anthropic from '@anthropic-ai/sdk'

async function translateToZh(subject: string, markdown: string): Promise<{ subject: string; markdown: string }> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const result = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `Translate the following newsletter from English to Simplified Chinese (简体中文).

Rules:
- Keep the first-person voice and analytical tone
- Keep proper nouns and widely-used terms in English where natural in Chinese media (AI, GDP, Fed, IMF, etc.)
- Preserve all markdown formatting (##, **bold**, bullet points, etc.)
- Sound natural to a native Chinese reader, not word-for-word
- First line must be: SUBJECT: [translated subject]
- Then a blank line, then the translated body

Subject to translate: ${subject}

Body to translate:
${markdown}`,
    }],
  })

  const raw = (result.content[0] as { type: 'text'; text: string }).text.trim()
  const subjectMatch = raw.match(/^SUBJECT:\s*(.+)/m)
  const zhSubject = subjectMatch ? subjectMatch[1].trim() : subject
  const zhMarkdown = raw.replace(/^SUBJECT:[^\n]+\n+/, '').trim()
  return { subject: zhSubject, markdown: zhMarkdown }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [settingRows, [latestDraft], allActive] = await Promise.all([
      db.select().from(settings),
      db.select().from(drafts).orderBy(desc(drafts.updatedAt)).limit(1),
      db.select().from(subscribers).where(eq(subscribers.status, 'active')),
    ])

    const s: Record<string, string> = {}
    for (const row of settingRows) { if (row.value) s[row.key] = row.value }

    if (!shouldSendNow(s)) {
      return NextResponse.json({ skipped: true, reason: 'Not scheduled for this time' })
    }

    if (!latestDraft || !latestDraft.bodyMarkdown) {
      return NextResponse.json({ skipped: true, reason: 'No draft available to send' })
    }

    const sendType = scheduleToSendType((s.schedule_frequency || 'manual') as import('@/lib/preferences').ScheduleFrequency)
    const targets = sendType
      ? allActive.filter(sub => subscriberFrequenciesFor(sendType).includes(sub.frequency as 'weekly' | 'daily' | 'both'))
      : allActive

    if (targets.length === 0) {
      return NextResponse.json({ skipped: true, reason: 'No matching subscribers' })
    }

    const fromName = s.from_name || 'Newsletter'
    const fromEmail = s.from_email || process.env.FROM_EMAIL || ''
    const newsletterName = s.newsletter_name || 'Newsletter'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const emailSecret = process.env.DASHBOARD_PASSWORD || ''

    const enSubject = latestDraft.subject || newsletterName
    const enBodyHtml = markdownToHtml(latestDraft.bodyMarkdown)

    // Split subscribers by language preference
    const enTargets = targets.filter(sub => (sub.language || 'en') !== 'zh')
    const zhTargets = targets.filter(sub => sub.language === 'zh')

    // Translate to Chinese if needed
    let zhSubject = enSubject
    let zhBodyHtml = enBodyHtml
    if (zhTargets.length > 0 && process.env.ANTHROPIC_API_KEY) {
      try {
        const translation = await translateToZh(enSubject, latestDraft.bodyMarkdown)
        zhSubject = translation.subject
        zhBodyHtml = markdownToHtml(translation.markdown)
      } catch (err) {
        console.error('[send] zh translation failed, falling back to English:', err instanceof Error ? err.message : err)
      }
    }

    const buildRecipients = (subs: typeof targets, bodyHtml: string) =>
      subs.map(sub => {
        const token = signEmailToken(sub.email, emailSecret)
        const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(sub.email)}&token=${token}`
        return { email: sub.email, html: buildEmailHtml({ newsletterName, bodyHtml, unsubscribeUrl }) }
      })

    // Send both batches (parallel)
    const [enResults, zhResults] = await Promise.all([
      enTargets.length > 0
        ? sendBatch({ recipients: buildRecipients(enTargets, enBodyHtml), subject: enSubject, fromName, fromEmail })
        : Promise.resolve([]),
      zhTargets.length > 0
        ? sendBatch({ recipients: buildRecipients(zhTargets, zhBodyHtml), subject: zhSubject, fromName, fromEmail })
        : Promise.resolve([]),
    ])

    const allResults = [...enResults, ...zhResults]
    const errorCount = allResults.reduce((n, r) => n + (r.error ? 1 : 0), 0)

    await db.insert(sentEmails).values({
      subject: enSubject,
      previewText: latestDraft.previewText,
      bodyHtml: enBodyHtml,
      bodyMarkdown: latestDraft.bodyMarkdown,
      slug: slugify(enSubject),
      recipientCount: targets.length,
      status: errorCount === 0 ? 'sent' : 'partial',
    })

    return NextResponse.json({
      success: true,
      sent: targets.length - errorCount,
      breakdown: { en: enTargets.length, zh: zhTargets.length },
    })
  } catch {
    return NextResponse.json({ error: 'Cron send failed' }, { status: 500 })
  }
}
