import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings, subscribers, sentEmails, drafts } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { shouldSendNow } from '@/lib/schedule'
import { buildEmailHtml, sendBatch } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'
import { subscriberFrequenciesFor, scheduleToSendType } from '@/lib/preferences'

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
    const subject = latestDraft.subject || newsletterName
    const bodyHtml = markdownToHtml(latestDraft.bodyMarkdown)

    const recipients = targets.map(sub => ({
      email: sub.email,
      html: buildEmailHtml({ newsletterName, bodyHtml, recipientEmail: sub.email, baseUrl }),
    }))
    const batchResults = await sendBatch({ recipients, subject, fromName, fromEmail })
    const errorCount = batchResults.reduce((n, r) => n + (r.error ? 1 : 0), 0)

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
