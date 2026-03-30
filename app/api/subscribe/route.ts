import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers, settings } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { rateLimit } from '@/lib/rate-limit'
import { isValidEmail } from '@/lib/validate-email'
import { buildEmailHtml, sendToRecipients, syncToResendAudience } from '@/lib/email'
import { signEmailToken } from '@/lib/token'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`subscribe:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { name, email, language, frequency, website } = await req.json()
    // Honeypot: bots fill hidden fields, real users never see them
    if (website) return NextResponse.json({ success: true })
    if (!email || !isValidEmail(email)) return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })

    const lang = language === 'zh' ? 'zh' : 'en'
    const freq = frequency === 'daily' ? 'daily' : frequency === 'both' ? 'both' : 'weekly'

    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email))
    if (existing.length > 0) {
      if (existing[0].status === 'unsubscribed') {
        await db.update(subscribers).set({ status: 'active', language: lang, frequency: freq }).where(eq(subscribers.email, email))
        await syncToResendAudience({ email, firstName: name, unsubscribed: false, language: lang })
        return NextResponse.json({ success: true, resubscribed: true })
      }
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
    }

    await db.insert(subscribers).values({ name, email, status: 'active', language: lang, frequency: freq })
    await syncToResendAudience({ email, firstName: name, unsubscribed: false, language: lang })

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
        const emailSecret = process.env.DASHBOARD_PASSWORD || ''
        const emailToken = signEmailToken(email, emailSecret)
        const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${emailToken}`
        const prefBase = `${baseUrl}/api/preferences?email=${encodeURIComponent(email)}&token=${emailToken}`
        const freqLabel = freq === 'daily' ? (lang === 'zh' ? '每日' : 'Daily') : freq === 'both' ? (lang === 'zh' ? '每日 + 每周' : 'Daily + Weekly') : (lang === 'zh' ? '每周' : 'Weekly')
        const langLabel = lang === 'zh' ? '中文' : 'English'

        const bodyHtml = lang === 'zh' ? `
          <p style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1a1a1a;margin:0 0 24px;">欢迎。</p>
          <p>您已成功订阅 <strong>${newsletterName}</strong>。您的第一期将很快发送到您的收件箱。</p>
          <p>同时，您可以 <a href="${baseUrl}/#issues" style="color:#c8402a;">浏览往期内容</a>。</p>
          <hr style="border:none;border-top:1px solid #e0dbd3;margin:32px 0;">
          <p style="font-size:13px;color:#6b6459;margin-bottom:12px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;">您的偏好设置</p>
          <p style="font-size:14px;color:#3a3530;margin-bottom:8px;">当前设置：<strong>${freqLabel} · ${langLabel}</strong></p>
          <p style="font-size:14px;color:#6b6459;margin-bottom:16px;">想要更改？一键切换：</p>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right:8px;">
                <a href="${prefBase}&freq=daily" style="display:inline-block;padding:8px 16px;background:#f5f0e8;border:1px solid #d6cfc4;color:#1a1a1a;font-size:13px;font-weight:500;text-decoration:none;">每日推送</a>
              </td>
              <td style="padding-right:8px;">
                <a href="${prefBase}&lang=en" style="display:inline-block;padding:8px 16px;background:#f5f0e8;border:1px solid #d6cfc4;color:#1a1a1a;font-size:13px;font-weight:500;text-decoration:none;">Switch to English</a>
              </td>
              <td>
                <a href="${prefBase}&freq=weekly" style="display:inline-block;padding:8px 16px;background:#f5f0e8;border:1px solid #d6cfc4;color:#1a1a1a;font-size:13px;font-weight:500;text-decoration:none;">每周推送</a>
              </td>
            </tr>
          </table>
          <p style="margin-top:32px;">Joseph</p>
        ` : `
          <p style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1a1a1a;margin:0 0 24px;">Welcome.</p>
          <p>You're now subscribed to <strong>${newsletterName}</strong>. Your first issue will land in your inbox soon.</p>
          <p>In the meantime, <a href="${baseUrl}/#issues" style="color:#c8402a;">browse the archive</a> on the site.</p>
          <hr style="border:none;border-top:1px solid #e0dbd3;margin:32px 0;">
          <p style="font-size:13px;color:#6b6459;margin-bottom:12px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;">Your preferences</p>
          <p style="font-size:14px;color:#3a3530;margin-bottom:8px;">Currently set to: <strong>${freqLabel} · ${langLabel}</strong></p>
          <p style="font-size:14px;color:#6b6459;margin-bottom:16px;">Want something different? One click to change:</p>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right:8px;">
                <a href="${prefBase}&freq=daily" style="display:inline-block;padding:8px 16px;background:#f5f0e8;border:1px solid #d6cfc4;color:#1a1a1a;font-size:13px;font-weight:500;text-decoration:none;">Daily digest</a>
              </td>
              <td style="padding-right:8px;">
                <a href="${prefBase}&lang=zh" style="display:inline-block;padding:8px 16px;background:#f5f0e8;border:1px solid #d6cfc4;color:#1a1a1a;font-size:13px;font-weight:500;text-decoration:none;">切换中文</a>
              </td>
              <td>
                <a href="${prefBase}&freq=both" style="display:inline-block;padding:8px 16px;background:#f5f0e8;border:1px solid #d6cfc4;color:#1a1a1a;font-size:13px;font-weight:500;text-decoration:none;">Weekly + Daily</a>
              </td>
            </tr>
          </table>
          <p style="margin-top:32px;">Joseph</p>
        `
        const welcomeSubject = lang === 'zh' ? `欢迎订阅 ${newsletterName}` : `Welcome to ${newsletterName}`
        const html = buildEmailHtml({ newsletterName, bodyHtml, unsubscribeUrl })
        await sendToRecipients({
          to: [email],
          subject: welcomeSubject,
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
    console.error('[subscribe]', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
