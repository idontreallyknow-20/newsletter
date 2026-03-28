import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings } from '@/lib/schema'
import { buildEmailHtml, sendToRecipients } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'

export async function POST(req: Request) {
  try {
    const { subject, bodyMarkdown } = await req.json()
    if (!subject || !bodyMarkdown) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 })
    }

    const settingRows = await db.select().from(settings)
    const s: Record<string, string> = {}
    for (const row of settingRows) { if (row.value) s[row.key] = row.value }

    const fromName = s.from_name || 'Newsletter'
    const fromEmail = s.from_email || process.env.FROM_EMAIL || ''
    const ownerEmail = s.owner_email || process.env.OWNER_EMAIL || ''
    const newsletterName = s.newsletter_name || 'Newsletter'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    if (!ownerEmail) {
      return NextResponse.json({ error: 'Owner email not configured in Settings' }, { status: 400 })
    }

    const bodyHtml = markdownToHtml(bodyMarkdown)
    const html = buildEmailHtml({ newsletterName, bodyHtml, recipientEmail: ownerEmail, baseUrl })

    await sendToRecipients({ to: [ownerEmail], subject: `[TEST] ${subject}`, html, fromName, fromEmail })

    return NextResponse.json({ success: true, sentTo: ownerEmail })
  } catch {
    return NextResponse.json({ error: 'Test send failed' }, { status: 500 })
  }
}
