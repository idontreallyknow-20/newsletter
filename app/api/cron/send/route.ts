import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings, subscribers, sentEmails, drafts } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { shouldSendNow } from '@/lib/schedule'
import { buildEmailHtml, sendToRecipients } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'
import { subscriberFrequenciesFor } from '@/lib/preferences'

export async function GET(req: Request) {
  // Verify cron secret to prevent unauthorized triggers
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

    // Map cron schedule type → subscriber frequency filter
    const scheduleFreq = s.schedule_frequency
    const sendType: 'weekly' | 'daily' | null =
      scheduleFreq === 'weekly' ? 'weekly' :
      (scheduleFreq === 'daily' || scheduleFreq === 'weekdays') ? 'daily' :
      null

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
    const subject = latestDraft.subject || newsletterName
    const bodyHtml = markdownToHtml(latestDraft.bodyMarkdown)

    let errorCount = 0
    for (const sub of targets) {
      const html = buildEmailHtml({ newsletterName, bodyHtml, recipientEmail: sub.email, baseUrl })
      try {
        await sendToRecipients({ to: [sub.email], subject, html, fromName, fromEmail })
      } catch {
        errorCount++
      }
    }

    await db.insert(sentEmails).values({
      subject,
      previewText: latestDraft.previewText,
      bodyHtml,
      bodyMarkdown: latestDraft.bodyMarkdown,
      slug: slugify(subject),
      recipientCount: targets.length,
      status: errorCount === 0 ? 'sent' : 'partial',
    })

    return NextResponse.json({ success: true, sent: targets.length - errorCount })
  } catch {
    return NextResponse.json({ error: 'Cron send failed' }, { status: 500 })
  }
}
