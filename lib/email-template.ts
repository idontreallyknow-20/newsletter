// Pure HTML template, no server deps, safe to import from client components.
//
// The email is the front page of the site, folded for an inbox: paper
// background, ink type, one red. Everything structural is inline so it
// survives Gmail, Outlook and Apple Mail; the <style> block only touches the
// markdown body and the phone breakpoint.

/** Escape a string for safe interpolation into HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export type EmailLanguage = 'en' | 'zh'

export interface EmailTemplateOptions {
  newsletterName: string
  bodyHtml: string
  unsubscribeUrl: string
  preferencesUrl?: string
  previewText?: string
  /** Shown as the headline inside the email. Falls back to no headline. */
  subject?: string
  /** YYYY-MM-DD in Toronto. Rendered as the dateline. */
  issueDate?: string
  language?: EmailLanguage
  /** Public link to this issue on the site, for the "Read on the web" line. */
  readOnlineUrl?: string
  siteUrl?: string
  authorName?: string
  authorLine?: string
  /** Trusted HTML shown above the headline (the owner's preview banner). */
  banner?: string
}

const PAPER = '#F4F2ED'
const PAPER_2 = '#ECE9E2'
const INK = '#121212'
const RULE = '#CFCBC2'
const RED = '#B3261E'
const MUTED = '#5F5E59'
const CARD = '#FFFFFF'

const SERIF = "Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif"
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
const MONO = "'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"

const STRINGS = {
  en: {
    tagline: 'Economics and AI · Before school',
    readOnline: 'Read on the web',
    preferences: 'Preferences',
    unsubscribe: 'Unsubscribe',
    subscribed: 'You are getting this because you subscribed to',
    written: (author: string) => `Written before school by ${author} in Richmond Hill, Ontario.`,
    reply: 'Reply to this email and I will read it.',
  },
  zh: {
    tagline: '经济与 AI · 上学前读完',
    readOnline: '在网页上阅读',
    preferences: '订阅设置',
    unsubscribe: '退订',
    subscribed: '你收到这封邮件，是因为你订阅了',
    written: (author: string) => `${author} 在安大略省列治文山，每天上学前写成。`,
    reply: '直接回复这封邮件，我都会读。',
  },
}

/** "Saturday, September 5, 2026" from "2026-09-05", without touching the host timezone. */
export function formatIssueDate(issueDate: string, language: EmailLanguage = 'en'): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(issueDate)
  if (!m) return issueDate
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12))
  return d.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export function buildEmailHtml(opts: EmailTemplateOptions): string {
  const { bodyHtml, unsubscribeUrl, preferencesUrl, previewText, issueDate, readOnlineUrl, banner } = opts
  const language: EmailLanguage = opts.language === 'zh' ? 'zh' : 'en'
  const t = STRINGS[language]
  const newsletterName = escapeHtml(opts.newsletterName)
  const authorName = escapeHtml(opts.authorName || 'Joseph Leung')
  const authorLine = opts.authorLine ? escapeHtml(opts.authorLine) : t.written(authorName)
  const siteUrl = escapeHtml(opts.siteUrl || 'https://dailybriefhq.com')
  const siteLabel = siteUrl.replace(/^https?:\/\//, '')
  const unsubscribeHref = escapeHtml(unsubscribeUrl)
  const preferencesHref = preferencesUrl ? escapeHtml(preferencesUrl) : ''
  const readHref = readOnlineUrl ? escapeHtml(readOnlineUrl) : ''
  const subject = opts.subject ? escapeHtml(opts.subject) : ''
  const dateline = issueDate ? escapeHtml(formatIssueDate(issueDate, language)) : ''
  const title = subject ? `${subject} · ${newsletterName}` : newsletterName

  // Split "Daily Brief" into "Daily.Brief" with the red dot, like the masthead on the site.
  const words = opts.newsletterName.trim().split(/\s+/)
  const wordmark = words.length === 2
    ? `${escapeHtml(words[0])}<span style="color:${RED};">.</span>${escapeHtml(words[1])}`
    : `${newsletterName}<span style="color:${RED};">.</span>`

  // Hidden preheader: shown next to the subject line in most inboxes.
  const preheader = previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(previewText)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : ''

  const mono = `font-family:${MONO};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${MUTED};`

  return `<!DOCTYPE html>
<html lang="${language === 'zh' ? 'zh-CN' : 'en-CA'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
    a { color: ${RED}; }
    .body-content { font-family: ${SERIF}; font-size: 18px; line-height: 1.7; color: ${INK}; }
    .body-content > p:first-child { font-size: 20px; line-height: 1.6; color: #2B2B2B; }
    .body-content h1, .body-content h2, .body-content h3 {
      font-family: ${SERIF}; font-weight: 700; letter-spacing: -0.015em; color: ${INK}; line-height: 1.15;
    }
    .body-content h1 { font-size: 26px; margin: 40px 0 12px; }
    .body-content h2 { font-size: 24px; margin: 40px 0 12px; padding-top: 18px; border-top: 1px solid ${RULE}; }
    .body-content h3 { font-size: 19px; margin: 28px 0 8px; }
    .body-content h2:first-child, .body-content h1:first-child { margin-top: 0; padding-top: 0; border-top: 0; }
    .body-content p { margin: 0 0 18px; }
    .body-content strong { font-weight: 700; color: ${INK}; }
    .body-content em { font-style: italic; }
    .body-content a { color: ${RED}; text-decoration: underline; text-underline-offset: 2px; }
    .body-content ul, .body-content ol { margin: 0 0 18px; padding-left: 24px; }
    .body-content li { margin-bottom: 8px; }
    .body-content hr { border: none; border-top: 1px solid ${RULE}; margin: 32px 0; }
    .body-content blockquote { margin: 24px 0; padding: 2px 0 2px 20px; border-left: 3px solid ${RED}; font-style: italic; color: ${MUTED}; }
    .body-content img { max-width: 100%; height: auto; }
    .body-content table { border-collapse: collapse; width: 100%; margin: 0 0 18px; font-family: ${SANS}; font-size: 14px; }
    .body-content th, .body-content td { border-bottom: 1px solid ${RULE}; padding: 8px 6px; text-align: left; vertical-align: top; }
    .body-content code { font-family: ${MONO}; font-size: 15px; background: ${PAPER_2}; padding: 1px 5px; }
    @media only screen and (max-width: 620px) {
      .wrap-pad { padding: 20px 12px 32px !important; }
      .card-pad { padding: 28px 22px 26px !important; }
      .head-pad { padding: 0 6px !important; }
      .headline { font-size: 28px !important; line-height: 1.12 !important; }
      .wordmark { font-size: 30px !important; }
      .body-content { font-size: 17px !important; }
      .body-content > p:first-child { font-size: 18px !important; }
      .body-content h2 { font-size: 22px !important; }
      .stack { display: block !important; width: 100% !important; text-align: left !important; padding: 2px 0 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${PAPER};">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPER};">
    <tr>
      <td align="center" class="wrap-pad" style="padding:36px 16px 48px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <!-- Masthead -->
          <tr>
            <td class="head-pad" style="padding:0 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:0 0 14px;border-top:3px solid ${INK};padding-top:18px;">
                    <a href="${siteUrl}" style="text-decoration:none;color:${INK};">
                      <span class="wordmark" style="font-family:${SERIF};font-size:38px;font-weight:900;letter-spacing:-0.03em;line-height:1;color:${INK};">${wordmark}</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid ${RULE};border-bottom:1px solid ${INK};padding:9px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="stack" style="${mono}">${dateline || '&nbsp;'}</td>
                        <td class="stack" align="right" style="${mono}">${escapeHtml(t.tagline)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${banner ? `<tr><td style="padding:20px 4px 0;">${banner}</td></tr>` : ''}

          <!-- Headline -->
          ${subject ? `
          <tr>
            <td class="head-pad" style="padding:34px 4px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:36px;height:3px;background:${RED};font-size:0;line-height:0;">&nbsp;</td></tr></table>
              <h1 class="headline" style="margin:16px 0 0;font-family:${SERIF};font-size:34px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${INK};">${subject}</h1>
            </td>
          </tr>` : '<tr><td style="height:24px;font-size:0;line-height:0;">&nbsp;</td></tr>'}

          <!-- Body card -->
          <tr>
            <td class="card-pad" style="background:${CARD};border:1px solid ${RULE};padding:40px 44px 34px;">
              <div class="body-content">
                ${bodyHtml}
              </div>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td class="head-pad" style="padding:26px 4px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid ${INK};padding-top:14px;font-family:${SERIF};font-size:15px;line-height:1.6;color:${MUTED};">
                    ${authorLine} ${escapeHtml(t.reply)}
                    ${readHref ? `<br><a href="${readHref}" style="color:${INK};text-decoration:underline;text-underline-offset:2px;">${escapeHtml(t.readOnline)}</a>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="head-pad" style="padding:28px 4px 0;">
              <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.8;color:${MUTED};">
                ${escapeHtml(t.subscribed)} <strong style="color:${INK};font-weight:600;">${newsletterName}</strong>.
                <br>
                <a href="${siteUrl}" style="color:${MUTED};text-decoration:underline;">${siteLabel}</a>
                &nbsp;·&nbsp;
                ${preferencesHref ? `<a href="${preferencesHref}" style="color:${MUTED};text-decoration:underline;">${escapeHtml(t.preferences)}</a>&nbsp;·&nbsp;` : ''}<a href="${unsubscribeHref}" style="color:${MUTED};text-decoration:underline;">${escapeHtml(t.unsubscribe)}</a>
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
