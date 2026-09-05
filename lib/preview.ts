// The owner's preview: the exact email subscribers will get, with a banner on
// top that carries the one-tap Skip link. Sending it is what arms the 7 AM job.
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { drafts } from '@/lib/schema'
import { buildEmailHtml, sendToRecipients } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { signActionToken } from '@/lib/token'
import { senderFrom } from '@/lib/cron'

export function previewBanner(opts: { issueDate: string; skipUrl: string; previewUrl: string; alreadySent?: boolean }) {
  const { issueDate, skipUrl, previewUrl, alreadySent } = opts
  const note = alreadySent
    ? `This is what went out on ${issueDate}.`
    : `<strong>Preview for ${issueDate}.</strong> This goes to subscribers at about 7:00 AM Toronto unless you stop it.`
  return `
    <div style="padding:16px 18px;background:#121212;color:#F4F2ED;font:14px/1.5 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
      <p style="margin:0 0 12px;">${note}</p>
      <p style="margin:0;">
        ${alreadySent ? '' : `<a href="${skipUrl}" style="display:inline-block;padding:10px 14px;background:#E3453A;color:#121212;text-decoration:none;font-weight:600;">Skip this send</a>&nbsp;&nbsp;`}
        <a href="${previewUrl}" style="color:#F4F2ED;">Open in the dashboard</a>
      </p>
    </div>`
}

/**
 * Email the owner the preview for an issue date and record it on the draft.
 * Throws if the email cannot be sent, so callers can log the failure.
 */
export async function sendOwnerPreview(opts: {
  settings: Record<string, string>
  issueDate: string
  issue: { subject: string; bodyMarkdown: string; previewText?: string | null }
  /** Override the recipient (Settings owner email by default). */
  to?: string
  /** True when the issue already went out and the banner should say so. */
  alreadySent?: boolean
}): Promise<{ to: string }> {
  const { settings: s, issueDate, issue } = opts
  const { newsletterName, fromName, fromEmail, ownerEmail, baseUrl, emailSecret } = senderFrom(s)
  const to = opts.to || ownerEmail
  if (!to) throw new Error('No owner email configured (Settings or OWNER_EMAIL)')
  if (!fromEmail) throw new Error('No from email configured (Settings or FROM_EMAIL)')

  const skipToken = signActionToken(`skip:${issueDate}`, emailSecret)
  const skipUrl = `${baseUrl}/api/skip?date=${issueDate}&token=${skipToken}`
  const previewUrl = `${baseUrl}/preview`
  const html = buildEmailHtml({
    newsletterName,
    subject: issue.subject,
    issueDate,
    bodyHtml: markdownToHtml(issue.bodyMarkdown),
    banner: previewBanner({ issueDate, skipUrl, previewUrl, alreadySent: opts.alreadySent }),
    unsubscribeUrl: `${baseUrl}/preferences`,
    previewText: issue.previewText || undefined,
    siteUrl: baseUrl,
  })
  await sendToRecipients({ to: [to], subject: `[Preview ${issueDate}] ${issue.subject}`, html, fromName, fromEmail })
  await db.update(drafts).set({ previewSentAt: new Date() })
    .where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, 'en')))
  return { to }
}
