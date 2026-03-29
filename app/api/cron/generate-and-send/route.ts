import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings, subscribers, sentEmails } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { buildEmailHtml, sendBatch } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'

// Called by the scheduled Claude agent which handles research + writing.
// The agent POSTs the finished newsletter content here along with CRON_SECRET.
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let subject: string, previewText: string, bodyMarkdown: string
  try {
    const body = await req.json()
    subject = body.subject
    previewText = body.previewText
    bodyMarkdown = body.bodyMarkdown
    if (!subject || !bodyMarkdown) {
      return NextResponse.json({ error: 'subject and bodyMarkdown are required' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const [settingRows, allActive] = await Promise.all([
      db.select().from(settings),
      db.select().from(subscribers).where(eq(subscribers.status, 'active')),
    ])

    const s: Record<string, string> = {}
    for (const row of settingRows) {
      if (row.value) s[row.key] = row.value
    }

    if (allActive.length === 0) {
      return NextResponse.json({ skipped: true, reason: 'No active subscribers' })
    }

    const fromName = s.from_name || 'Newsletter'
    const fromEmail = s.from_email || process.env.FROM_EMAIL || ''
    const newsletterName = s.newsletter_name || 'Newsletter'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const bodyHtml = markdownToHtml(bodyMarkdown)

    const recipients = allActive.map(sub => ({
      email: sub.email,
      html: buildEmailHtml({ newsletterName, bodyHtml, recipientEmail: sub.email, baseUrl }),
    }))

    const batchResults = await sendBatch({ recipients, subject, fromName, fromEmail })
    const errorCount = batchResults.reduce((n, r) => n + (r.error ? 1 : 0), 0)

    await db.insert(sentEmails).values({
      subject,
      previewText: previewText || null,
      bodyHtml,
      bodyMarkdown,
      slug: slugify(subject),
      recipientCount: allActive.length,
      status: errorCount === 0 ? 'sent' : 'partial',
    })

    return NextResponse.json({
      success: true,
      sent: allActive.length - errorCount,
      errors: errorCount,
      subject,
    })
  } catch (err) {
    console.error('[cron/generate-and-send]', err)
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }
}
