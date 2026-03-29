import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers, sentEmails, settings } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { buildEmailHtml, sendBatch } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'
import { subscriberFrequenciesFor } from '@/lib/preferences'

export async function POST(req: Request) {
  try {
    const { subject, previewText, bodyMarkdown, frequency } = await req.json()
    if (!subject || !bodyMarkdown) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 })
    }

    const [settingRows, allActive] = await Promise.all([
      db.select().from(settings),
      db.select().from(subscribers).where(eq(subscribers.status, 'active')),
    ])

    const s: Record<string, string> = {}
    for (const row of settingRows) { if (row.value) s[row.key] = row.value }

    const fromName = s.from_name || 'Newsletter'
    const fromEmail = s.from_email || process.env.FROM_EMAIL || ''
    const newsletterName = s.newsletter_name || 'Newsletter'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Filter by frequency preference if specified
    const targets = (frequency === 'weekly' || frequency === 'daily')
      ? allActive.filter(sub => subscriberFrequenciesFor(frequency).includes(sub.frequency as 'weekly' | 'daily' | 'both'))
      : allActive

    if (targets.length === 0) {
      return NextResponse.json({ error: 'No matching subscribers' }, { status: 400 })
    }

    const bodyHtml = markdownToHtml(bodyMarkdown)

    const recipients = targets.map(sub => ({
      email: sub.email,
      html: buildEmailHtml({ newsletterName, bodyHtml, recipientEmail: sub.email, baseUrl }),
    }))

    const batchResults = await sendBatch({ recipients, subject, fromName, fromEmail })
    const errorCount = batchResults.reduce((n, r) => n + (r.error ? 1 : 0), 0)

    await db.insert(sentEmails).values({
      subject,
      previewText,
      bodyHtml,
      bodyMarkdown,
      slug: slugify(subject),
      recipientCount: targets.length,
      status: errorCount === 0 ? 'sent' : 'partial',
    })

    return NextResponse.json({
      success: true,
      sent: targets.length - errorCount,
      errors: errorCount,
    })
  } catch {
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }
}
