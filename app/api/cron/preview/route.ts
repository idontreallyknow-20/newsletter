export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { drafts, sentEmails } from '@/lib/schema'
import { cronAuthorized, loadSettings, logRun, notifyOwner, errorMessage } from '@/lib/cron'
import { ensureSchema } from '@/lib/ensure-schema'
import { queuedFromGitHub } from '@/lib/queue'
import { sendOwnerPreview } from '@/lib/preview'
import { getIssueDate } from '@/lib/schedule'

/**
 * Called by the GitHub Actions workflow the moment the Routine commits
 * queue/<date>.en.json: pull the file into the database as that day's draft
 * and email the owner the preview right away, instead of waiting for 5 AM.
 * Bearer CRON_SECRET. ?date=YYYY-MM-DD, defaults to today in Toronto.
 */
async function handle(req: Request) {
  if (!cronAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const url = new URL(req.url)
  const issueDate = url.searchParams.get('date') || getIssueDate()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(issueDate)) return NextResponse.json({ error: 'date must be YYYY-MM-DD' }, { status: 400 })

  let s: Record<string, string> = {}
  try {
    await ensureSchema()
    s = await loadSettings()

    const [sentRow] = await db.select({ id: sentEmails.id }).from(sentEmails).where(eq(sentEmails.issueDate, issueDate)).limit(1)
    if (sentRow) {
      await logRun({ job: 'generate', issueDate, status: 'skipped', message: 'Queue file changed after the issue was already sent; ignored' })
      return NextResponse.json({ skipped: true, reason: 'already_sent', issueDate })
    }

    const en = await queuedFromGitHub(issueDate, 'en')
    if (!en) {
      await logRun({ job: 'generate', issueDate, status: 'error', message: `queue/${issueDate}.en.json not found or invalid on GitHub` })
      return NextResponse.json({ error: 'not_found', issueDate }, { status: 404 })
    }
    const zh = await queuedFromGitHub(issueDate, 'zh')

    // The committed file is the source of truth for that day. Replace whatever
    // draft is there (a Compose draft the 5 AM job stamped, an older commit),
    // but keep a skip the owner already recorded.
    for (const [language, issue] of [['en', en], ['zh', zh]] as const) {
      if (!issue) continue
      const [existing] = await db.select({ id: drafts.id }).from(drafts)
        .where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, language))).limit(1)
      if (existing) await db.update(drafts).set({ ...issue, updatedAt: new Date() }).where(eq(drafts.id, existing.id))
      else await db.insert(drafts).values({ ...issue, language, issueDate })
    }

    const { to } = await sendOwnerPreview({ settings: s, issueDate, issue: en })
    await logRun({
      job: 'generate', issueDate, status: 'ok',
      message: `Queue commit picked up, preview sent to ${to}`,
      detail: { subject: en.subject, zh: !!zh, source: 'github-push' },
    })
    return NextResponse.json({ ok: true, issueDate, subject: en.subject, zh: !!zh, previewSentTo: to })
  } catch (err) {
    const message = errorMessage(err)
    console.error('[preview] failed:', message)
    await logRun({ job: 'generate', issueDate, status: 'error', message })
    await notifyOwner(s, `[Daily Brief] Preview failed for ${issueDate}`, `The queued issue was committed but the preview could not be sent.\n\nError: ${message}`)
    return NextResponse.json({ error: 'Preview failed', message, issueDate }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
