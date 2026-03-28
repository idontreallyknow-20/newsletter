import { Resend } from 'resend'

let _resend: Resend | undefined
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export function buildEmailHtml(opts: {
  newsletterName: string
  bodyHtml: string
  recipientEmail: string
  baseUrl: string
}): string {
  const { newsletterName, bodyHtml, recipientEmail, baseUrl } = opts
  const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(recipientEmail)}`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletterName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0A0A0A;padding:32px 40px;">
              <h1 style="margin:0;color:#F5F0E8;font-family:Georgia,serif;font-size:26px;font-weight:700;letter-spacing:-0.5px;">${newsletterName}</h1>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#c9a84c,#e8d5a3);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;color:#1a1a1a;font-size:16px;line-height:1.75;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#f9f9f7;border-top:1px solid #eee;">
              <p style="margin:0;font-size:12px;color:#999;text-align:center;line-height:1.6;">
                You're receiving this because you subscribed to <strong>${newsletterName}</strong>.<br>
                <a href="${unsubscribeUrl}" style="color:#c9a84c;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendToRecipients(opts: {
  to: string[]
  subject: string
  html: string
  fromName: string
  fromEmail: string
}) {
  const { to, subject, html, fromName, fromEmail } = opts

  // Resend supports up to 50 recipients per call — batch if needed
  const batchSize = 50
  const results = []

  for (let i = 0; i < to.length; i += batchSize) {
    const batch = to.slice(i, i + batchSize)
    const result = await getResend().emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: batch,
      subject,
      html,
    })
    results.push(result)
  }

  return results
}
