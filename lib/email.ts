import { Resend } from 'resend'
export { buildEmailHtml } from './email-template'

let _resend: Resend | undefined
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

// RFC 8058 one-click unsubscribe headers. Gmail/Yahoo require these for bulk
// senders — they surface the native "Unsubscribe" button and protect sender
// reputation (which keeps emails out of spam).
function unsubscribeHeaders(unsubscribeUrl?: string): Record<string, string> | undefined {
  if (!unsubscribeUrl) return undefined
  return {
    'List-Unsubscribe': `<${unsubscribeUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

export async function sendToRecipients(opts: {
  to: string[]
  subject: string
  html: string
  fromName: string
  fromEmail: string
  unsubscribeUrl?: string
}) {
  const { to, subject, html, fromName, fromEmail, unsubscribeUrl } = opts

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
      headers: unsubscribeHeaders(unsubscribeUrl),
    })
    results.push(result)
  }

  return results
}

// Send personalized emails (different HTML per recipient) using Resend's batch API.
// One HTTP request per 100 recipients instead of one per subscriber.
export async function sendBatch(opts: {
  recipients: Array<{ email: string; html: string; unsubscribeUrl?: string }>
  subject: string
  fromName: string
  fromEmail: string
}) {
  const { recipients, subject, fromName, fromEmail } = opts
  const from = `${fromName} <${fromEmail}>`
  const batchSize = 100
  const results = []

  for (let i = 0; i < recipients.length; i += batchSize) {
    const chunk = recipients.slice(i, i + batchSize)
    const result = await getResend().batch.send(
      chunk.map(r => ({
        from,
        to: [r.email],
        subject,
        html: r.html,
        headers: unsubscribeHeaders(r.unsubscribeUrl),
      }))
    )
    results.push(result)
  }

  return results
}

// Sync a subscriber to Resend Audiences so they appear in the Resend dashboard.
// Requires RESEND_AUDIENCE_ID env var. Fails silently so it never blocks subscription.
export async function syncToResendAudience(opts: {
  email: string
  firstName?: string
  unsubscribed?: boolean
  language?: string
}) {
  const audienceId = opts.language === 'zh'
    ? (process.env.RESEND_AUDIENCE_ID_ZH || process.env.RESEND_AUDIENCE_ID)
    : (process.env.RESEND_AUDIENCE_ID_EN || process.env.RESEND_AUDIENCE_ID)
  if (!audienceId) return

  try {
    await getResend().contacts.create({
      audienceId,
      email: opts.email,
      firstName: opts.firstName,
      unsubscribed: opts.unsubscribed ?? false,
    })
  } catch (err) {
    console.error('[resend-audience] sync failed:', err instanceof Error ? err.message : err)
  }
}
