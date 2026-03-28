import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers, settings } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { rateLimit } from '@/lib/rate-limit'
import { sendToRecipients } from '@/lib/email'

const FREQ_LABEL: Record<string, string> = {
  weekly: 'Weekly deep-dive',
  daily: 'Daily updates',
  both: 'Weekly + daily',
}

function buildWelcomeHtml(newsletterName: string, freq: string, baseUrl: string, recipientEmail: string) {
  const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
  const freqLabel = FREQ_LABEL[freq] ?? freq
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
        <tr><td style="background:#0A0A0A;padding:32px 40px;">
          <h1 style="margin:0;color:#F5F0E8;font-family:Georgia,serif;font-size:26px;font-weight:700;">${newsletterName}</h1>
        </td></tr>
        <tr><td style="height:3px;background:linear-gradient(90deg,#c9a84c,#e8d5a3);"></td></tr>
        <tr><td style="padding:40px;color:#1a1a1a;font-size:16px;line-height:1.75;">
          <p style="margin:0 0 16px;">You're in.</p>
          <p style="margin:0 0 16px;">Thanks for subscribing to <strong>${newsletterName}</strong>. You'll receive <strong>${freqLabel}</strong> — clear, well-researched analysis on economics and AI, without the noise.</p>
          <p style="margin:0 0 16px;">The next issue lands in your inbox soon. In the meantime, you can browse past issues on the site.</p>
          <p style="margin:0;">— Joseph</p>
        </td></tr>
        <tr><td style="padding:24px 40px;background:#f9f9f7;border-top:1px solid #eee;">
          <p style="margin:0;font-size:12px;color:#999;text-align:center;line-height:1.6;">
            You subscribed to <strong>${newsletterName}</strong>.<br>
            <a href="${unsubscribeUrl}" style="color:#c9a84c;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

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
        const html = buildWelcomeHtml(newsletterName, freq, baseUrl, email)
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
