// Shared plumbing for the two cron routes and the skip endpoint.
import { db } from '@/lib/db'
import { settings, sendLog } from '@/lib/schema'
import { sendToRecipients } from '@/lib/email'

export function cronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = req.headers.get('authorization') || ''
  return header === `Bearer ${secret}`
}

export async function loadSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settings)
  const s: Record<string, string> = {}
  for (const row of rows) if (row.value) s[row.key] = row.value
  return s
}

export function senderFrom(s: Record<string, string>) {
  return {
    fromName: s.from_name || 'Joseph',
    fromEmail: s.from_email || process.env.FROM_EMAIL || '',
    ownerEmail: s.owner_email || process.env.OWNER_EMAIL || '',
    newsletterName: s.newsletter_name || 'Daily Brief',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://dailybriefhq.com',
    emailSecret: process.env.EMAIL_TOKEN_SECRET || process.env.DASHBOARD_PASSWORD || '',
  }
}

export async function logRun(entry: {
  job: 'generate' | 'send' | 'skip'
  issueDate: string
  status: 'ok' | 'skipped' | 'error'
  message: string
  detail?: unknown
}) {
  try {
    await db.insert(sendLog).values({
      job: entry.job,
      issueDate: entry.issueDate,
      status: entry.status,
      message: entry.message,
      detail: entry.detail === undefined ? null : JSON.stringify(entry.detail).slice(0, 4000),
    })
  } catch (err) {
    console.error('[send_log] write failed:', err instanceof Error ? err.message : err)
  }
}

/** Email the owner when a cron step fails. Never throws. */
export async function notifyOwner(s: Record<string, string>, subject: string, text: string) {
  const { fromName, fromEmail, ownerEmail } = senderFrom(s)
  if (!ownerEmail || !fromEmail) return
  try {
    const html = `<pre style="font:14px/1.5 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${escape(text)}</pre>`
    await sendToRecipients({ to: [ownerEmail], subject, html, fromName, fromEmail })
  } catch (err) {
    console.error('[notifyOwner] failed:', err instanceof Error ? err.message : err)
  }
}

function escape(s: string) {
  return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}
