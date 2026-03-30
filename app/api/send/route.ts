import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers, sentEmails, settings } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { buildEmailHtml, sendBatch } from '@/lib/email'
import { signEmailToken } from '@/lib/token'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'
import { subscriberFrequenciesFor } from '@/lib/preferences'

export async function POST(req: Request) {
  try {
    const { subject, previewText, bodyMarkdown, frequencies, languages } = await req.json()
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dailybriefhq.com'

    // Filter by frequency and language if specified
    const freqList: string[] = Array.isArray(frequencies) && frequencies.length > 0 ? frequencies : ['daily', 'weekly']
    const langList: string[] = Array.isArray(languages) && languages.length > 0 ? languages : ['en', 'zh']

    const targets = allActive.filter(sub => {
      const subFreq = sub.frequency || 'weekly'
      const subLang = sub.language || 'en'
      const freqMatch = freqList.some(f => subscriberFrequenciesFor(f as 'daily' | 'weekly').includes(subFreq as 'weekly' | 'daily' | 'both'))
      const langMatch = langList.includes(subLang)
      return freqMatch && langMatch
    })

    if (targets.length === 0) {
      return NextResponse.json({ error: 'No matching subscribers' }, { status: 400 })
    }

    const bodyHtml = markdownToHtml(bodyMarkdown)
    const emailSecret = process.env.EMAIL_TOKEN_SECRET || process.env.DASHBOARD_PASSWORD || ''

    const recipients = targets.map(sub => {
      const token = signEmailToken(sub.email, emailSecret)
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(sub.email)}&token=${token}`
      return { email: sub.email, html: buildEmailHtml({ newsletterName, bodyHtml, unsubscribeUrl }) }
    })

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
