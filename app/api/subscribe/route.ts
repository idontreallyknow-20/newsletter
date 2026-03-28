import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers, settings } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { rateLimit } from '@/lib/rate-limit'
import { buildEmailHtml, sendToRecipients } from '@/lib/email'
import { FREQUENCIES } from '@/lib/preferences'

const FREQ_LABEL = Object.fromEntries(FREQUENCIES.map(f => [f.value, f.sub]))

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`subscribe:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { name, email, language, frequency } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const lang = language === 'zh' ? 'zh' : 'en'
    const freq = frequency === 'daily' ? 'daily' : frequency === 'both' ? 'both' : 'weekly'

    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email))
    if (existing.length > 0) {
      if (existing[0].status === 'unsubscribed') {
        await db.update(subscribers).set({ status: 'active', language: lang, frequency: freq }).where(eq(subscribers.email, email))
        return NextResponse.json({ success: true, resubscribed: true })
      }
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
    }

    await db.insert(subscribers).values({ name, email, status: 'active', language: lang, frequency: freq })

    // Send welcome email (best-effort — don't fail the subscription if it errors)
    try {
      const settingRows = await db.select().from(settings)
      const s: Record<string, string> = {}
      for (const row of settingRows) { if (row.value) s[row.key] = row.value }

      const fromName = s.from_name || 'Joseph'
      const fromEmail = s.from_email || process.env.FROM_EMAIL || ''
      const newsletterName = s.newsletter_name || 'AI & Economy'
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

      if (fromEmail) {
        const freqLabel = FREQ_LABEL[freq] ?? freq
        const bodyHtml = `
          <p>You're in.</p>
          <p>Thanks for subscribing to <strong>${newsletterName}</strong>. You'll receive <strong>${freqLabel}</strong> — clear analysis on economics and AI, without the noise.</p>
          <p>The next issue lands in your inbox soon. In the meantime, <a href="${baseUrl}/#issues" style="color:#c9a84c;">browse past issues</a> on the site.</p>
          <p>— Joseph</p>
        `
        const html = buildEmailHtml({ newsletterName, bodyHtml, recipientEmail: email, baseUrl })
        await sendToRecipients({
          to: [email],
          subject: `Welcome to ${newsletterName}`,
          html,
          fromName,
          fromEmail,
        })
      }
    } catch (emailErr) {
      console.error('[subscribe] welcome email failed:', emailErr instanceof Error ? emailErr.message : emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[subscribe]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
