// Pure HTML template — no server deps, safe to import from client components.

export function buildEmailHtml(opts: {
  newsletterName: string
  bodyHtml: string
  unsubscribeUrl: string
}): string {
  const { newsletterName, bodyHtml, unsubscribeUrl } = opts

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletterName}</title>
  <style>
    .body-content h2 {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #1a1a1a;
      margin: 36px 0 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e2da;
    }
    .body-content h2:first-child { margin-top: 0; }
    .body-content p {
      margin: 0 0 18px;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 17px;
      line-height: 1.85;
      color: #1a1a1a;
    }
    .body-content strong { font-weight: 700; color: #1a1a1a; }
    .body-content em { font-style: italic; }
    .body-content a { color: #c8402a; text-decoration: underline; }
    .body-content ul, .body-content ol {
      margin: 0 0 18px;
      padding-left: 22px;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 17px;
      line-height: 1.85;
      color: #1a1a1a;
    }
    .body-content li { margin-bottom: 6px; }
    .body-content hr {
      border: none;
      border-top: 1px solid #e8e2da;
      margin: 32px 0;
    }
    .body-content blockquote {
      margin: 24px 0;
      padding: 0 0 0 20px;
      border-left: 3px solid #c8402a;
      font-style: italic;
      color: #5a504a;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#ede8de;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ede8de;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1a1a1a;letter-spacing:-0.3px;">${newsletterName}<span style="color:#c8402a;">.</span></span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#9a8f85;">Economics &amp; AI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Red rule -->
          <tr><td style="height:2px;background:#c8402a;margin-bottom:0;"></td></tr>

          <!-- Body card -->
          <tr>
            <td style="background:#ffffff;padding:44px 48px 40px;">
              <div class="body-content">
                ${bodyHtml}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#9a8f85;text-align:center;line-height:1.7;letter-spacing:0.03em;">
                You're subscribed to <strong style="color:#5a504a;">${newsletterName}</strong>
                &nbsp;·&nbsp;
                <a href="${unsubscribeUrl}" style="color:#9a8f85;text-decoration:underline;">Unsubscribe</a>
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
