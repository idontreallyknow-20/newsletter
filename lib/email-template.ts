// Pure HTML template, no server deps, safe to import from client components.

/** Escape a string for safe interpolation into HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function buildEmailHtml(opts: {
  newsletterName: string
  bodyHtml: string
  unsubscribeUrl: string
  preferencesUrl?: string
  previewText?: string
}): string {
  const { bodyHtml, unsubscribeUrl, preferencesUrl, previewText } = opts
  const newsletterName = escapeHtml(opts.newsletterName)
  const unsubscribeHref = escapeHtml(unsubscribeUrl)
  const preferencesHref = preferencesUrl ? escapeHtml(preferencesUrl) : ''

  // Hidden preheader: shown next to the subject line in most inboxes.
  const preheader = previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(previewText)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletterName}</title>
  <style>
    .body-content h2 {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #0C0E14;
      margin: 36px 0 12px;
      line-height: 1.15;
    }
    .body-content h2:first-child { margin-top: 0; }
    .body-content p {
      margin: 0 0 18px;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 17px;
      line-height: 1.85;
      color: #0C0E14;
    }
    .body-content strong { font-weight: 700; color: #0C0E14; }
    .body-content em { font-style: italic; }
    .body-content a { color: #D9440C; text-decoration: underline; }
    .body-content ul, .body-content ol {
      margin: 0 0 18px;
      padding-left: 22px;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 17px;
      line-height: 1.85;
      color: #0C0E14;
    }
    .body-content li { margin-bottom: 6px; }
    .body-content hr {
      border: none;
      border-top: 1px solid #DCDFDB;
      margin: 32px 0;
    }
    .body-content blockquote {
      margin: 24px 0;
      padding: 0 0 0 20px;
      border-left: 3px solid #FF5A1F;
      font-style: italic;
      color: #6E7480;
    }
    @media (max-width: 620px) {
      .card-pad { padding: 32px 24px 28px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#E7E9E6;font-family:Georgia,'Times New Roman',serif;">
  ${preheader}
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E7E9E6;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:20px;font-weight:800;color:#0C0E14;letter-spacing:0.06em;text-transform:uppercase;">${newsletterName}<span style="color:#FF5A1F;">.</span></span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#6E7480;">Economics &amp; AI · Before school</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Red rule -->
          <tr><td style="height:3px;background:#0C0E14;margin-bottom:0;"></td></tr>

          <!-- Body card -->
          <tr>
            <td class="card-pad" style="background:#ffffff;padding:44px 48px 40px;">
              <div class="body-content">
                ${bodyHtml}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#6E7480;text-align:center;line-height:1.7;letter-spacing:0.03em;">
                You're subscribed to <strong style="color:#0C0E14;">${newsletterName}</strong>
                &nbsp;·&nbsp;
                ${preferencesHref ? `<a href="${preferencesHref}" style="color:#6E7480;text-decoration:underline;">Preferences</a>&nbsp;·&nbsp;` : ''}<a href="${unsubscribeHref}" style="color:#6E7480;text-decoration:underline;">Unsubscribe</a>
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
