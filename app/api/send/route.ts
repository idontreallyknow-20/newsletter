import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers, sentEmails, settings } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { buildEmailHtml, sendToRecipients } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'

export async function POST(req: Request) {
  try {
    const { subject, previewText, bodyMarkdown } = await req.json()
    if (!subject || !bodyMarkdown) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 })
    }

    // Fetch settings
    const settingRows = await db.select().from(settings)
    const s: Record<string, string> = {}
    for (const row of settingRows) { if (row.value) s[row.key] = row.value }

    const fromName = s.from_name || 'Newsletter'
    const fromEmail = s.from_email || process.env.FROM_EMAIL || ''
    const newsletterName = s.newsletter_name || 'Newsletter'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Get active subscribers
    const activeSubscribers = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.status, 'active'))

    if (activeSubscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
    }

    const bodyHtml = markdownToHtml(bodyMarkdown)

    // Send to each subscriber with their personal unsubscribe link
    let errorCount = 0
    for (const sub of activeSubscribers) {
      const html = buildEmailHtml({ newsletterName, bodyHtml, recipientEmail: sub.email, baseUrl })
      try {
        await sendToRecipients({ to: [sub.email], subject, html, fromName, fromEmail })
      } catch {
        errorCount++
      }
    }

    // Log to history
    await db.insert(sentEmails).values({
      subject,
      previewText,
      bodyHtml: markdownToHtml(bodyMarkdown),
      bodyMarkdown,
      slug: slugify(subject),
      recipientCount: activeSubscribers.length,
      status: errorCount === 0 ? 'sent' : 'partial',
    })

    return NextResponse.json({
      success: true,
      sent: activeSubscribers.length - errorCount,
      errors: errorCount,
    })
  } catch {
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }
}
