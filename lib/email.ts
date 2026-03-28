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
<body style="margin:0;padding:0;background:#f0ebe1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0ebe1;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:28px 40px;">
              <span style="color:#f5f0e8;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:700;letter-spacing:-0.3px;">${newsletterName}<span style="color:#c8402a;">.</span></span>
            </td>
          </tr>

          <!-- Red rule -->
          <tr><td style="height:3px;background:#c8402a;"></td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;color:#1a1a1a;font-size:16px;line-height:1.8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#f5f0e8;border-top:1px solid #ddd8d0;">
              <p style="margin:0;font-size:11px;color:#8a7f75;text-align:center;line-height:1.7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0.03em;">
                You subscribed to <strong style="color:#1a1a1a;">${newsletterName}</strong> · Economics &amp; AI<br>
                <a href="${unsubscribeUrl}" style="color:#c8402a;text-decoration:underline;">Unsubscribe</a>
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
