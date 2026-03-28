import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings, subscribers, sentEmails } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { shouldSendNow } from '@/lib/schedule'
import { buildEmailHtml, sendToRecipients } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'

export async function GET(req: Request) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const settingRows = await db.select().from(settings)
    const s: Record<string, string> = {}
    for (const row of settingRows) { if (row.value) s[row.key] = row.value }

    if (!shouldSendNow(s)) {
      return NextResponse.json({ skipped: true, reason: 'Not scheduled for this time' })
    }

    // Use the most recent draft as the content to send
    const { drafts } = await import('@/lib/schema')
    const { desc } = await import('drizzle-orm')
    const [latestDraft] = await db.select().from(drafts).orderBy(desc(drafts.updatedAt)).limit(1)

    if (!latestDraft || !latestDraft.bodyMarkdown) {
      return NextResponse.json({ skipped: true, reason: 'No draft available to send' })
    }

    const activeSubscribers = await db.select().from(subscribers).where(eq(subscribers.status, 'active'))
    if (activeSubscribers.length === 0) {
      return NextResponse.json({ skipped: true, reason: 'No active subscribers' })
    }

    const fromName = s.from_name || 'Newsletter'
    const fromEmail = s.from_email || process.env.FROM_EMAIL || ''
    const newsletterName = s.newsletter_name || 'Newsletter'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const subject = latestDraft.subject || newsletterName
    const bodyHtml = markdownToHtml(latestDraft.bodyMarkdown)

    let errorCount = 0
    for (const sub of activeSubscribers) {
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
      recipientCount: activeSubscribers.length,
      status: errorCount === 0 ? 'sent' : 'partial',
    })

    return NextResponse.json({ success: true, sent: activeSubscribers.length - errorCount })
  } catch {
    return NextResponse.json({ error: 'Cron send failed' }, { status: 500 })
  }
}
