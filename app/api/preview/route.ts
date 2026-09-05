export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { and, eq, gte, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { drafts, sentEmails } from '@/lib/schema'
import { loadSettings, senderFrom, logRun, errorMessage } from '@/lib/cron'
import { ensureSchema } from '@/lib/ensure-schema'
import { buildEmailHtml } from '@/lib/email-template'
import { markdownToHtml } from '@/lib/markdown'
import { listQueuedDates, queuedFromGitHub } from '@/lib/queue'
import { sendOwnerPreview } from '@/lib/preview'
import { getIssueDate, evaluateSend, SEND_REASON_TEXT } from '@/lib/schedule'

export interface PreviewItem {
  issueDate: string
  source: 'database' | 'github'
  subject: string
  previewText: string
  words: number
  hasZh: boolean
  previewSentAt: string | null
  skipped: boolean
  sent: boolean
  /** Why the 7 AM job would not send this today, if it would not. */
  blocker: string | null
  html: string
  zhHtml: string | null
}

/** Today's and upcoming issues: drafts in the database plus files on GitHub not yet imported. */
export async function GET() {
  try {
    await ensureSchema()
    const s = await loadSettings()
    const { newsletterName, baseUrl } = senderFrom(s)
    const today = getIssueDate()

    const [rows, sent, ghDates] = await Promise.all([
      db.select().from(drafts).where(gte(drafts.issueDate, today)).orderBy(desc(drafts.issueDate)),
      db.select({ issueDate: sentEmails.issueDate }).from(sentEmails).where(gte(sentEmails.issueDate, today)),
      listQueuedDates(),
    ])
    const sentDates = new Set(sent.map(r => r.issueDate))
    const byDate = new Map<string, { en?: typeof rows[number]; zh?: typeof rows[number] }>()
    for (const r of rows) {
      if (!r.issueDate) continue
      const entry = byDate.get(r.issueDate) || {}
      if (r.language === 'zh') entry.zh = r; else entry.en = r
      byDate.set(r.issueDate, entry)
    }

    const render = (subject: string, bodyMarkdown: string, issueDate: string, language: 'en' | 'zh', previewText?: string | null) =>
      buildEmailHtml({ newsletterName, subject, issueDate, language, bodyHtml: markdownToHtml(bodyMarkdown), unsubscribeUrl: `${baseUrl}/preferences`, preferencesUrl: `${baseUrl}/preferences`, siteUrl: baseUrl, previewText: previewText || undefined })

    const items: PreviewItem[] = []
    for (const [issueDate, { en, zh }] of Array.from(byDate.entries())) {
      if (!en?.bodyMarkdown) {
        if (en?.skippedAt) items.push({ issueDate, source: 'database', subject: '(skipped, no draft)', previewText: '', words: 0, hasZh: false, previewSentAt: null, skipped: true, sent: false, blocker: SEND_REASON_TEXT.skipped, html: '', zhHtml: null })
        continue
      }
      const decision = evaluateSend({ settings: s, issueDate, draft: en, alreadySent: sentDates.has(issueDate) })
      items.push({
        issueDate, source: 'database',
        subject: en.subject || newsletterName, previewText: en.previewText || '',
        words: en.bodyMarkdown.split(/\s+/).length, hasZh: !!zh?.bodyMarkdown,
        previewSentAt: en.previewSentAt ? en.previewSentAt.toISOString() : null,
        skipped: !!en.skippedAt, sent: sentDates.has(issueDate),
        blocker: decision.ok ? null : SEND_REASON_TEXT[decision.reason],
        html: render(en.subject || newsletterName, en.bodyMarkdown, issueDate, 'en', en.previewText),
        zhHtml: zh?.bodyMarkdown ? render(zh.subject || en.subject || newsletterName, zh.bodyMarkdown, issueDate, 'zh', zh.previewText) : null,
      })
    }

    // Files on GitHub the 5 AM job has not imported yet.
    const pending = ghDates.filter(d => d >= today && !byDate.has(d)).slice(0, 5)
    const fetched = await Promise.all(pending.map(async d => ({ d, en: await queuedFromGitHub(d, 'en'), zh: await queuedFromGitHub(d, 'zh') })))
    for (const { d, en, zh } of fetched) {
      if (!en) continue
      items.push({
        issueDate: d, source: 'github', subject: en.subject, previewText: en.previewText,
        words: en.bodyMarkdown.split(/\s+/).length, hasZh: !!zh, previewSentAt: null, skipped: false, sent: false,
        blocker: 'Committed on GitHub but not imported yet. Import it to send the preview.',
        html: render(en.subject, en.bodyMarkdown, d, 'en', en.previewText),
        zhHtml: zh ? render(zh.subject, zh.bodyMarkdown, d, 'zh', zh.previewText) : null,
      })
    }

    items.sort((a, b) => a.issueDate.localeCompare(b.issueDate))
    return NextResponse.json({ today, items, ownerEmail: senderFrom(s).ownerEmail })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}

/** Actions on one issue date: email the preview now, skip or unskip the day, import the GitHub file. */
export async function POST(req: Request) {
  let body: { date?: string; action?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 }) }
  const issueDate = body.date || ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(issueDate)) return NextResponse.json({ error: 'date must be YYYY-MM-DD' }, { status: 400 })

  try {
    await ensureSchema()
    const s = await loadSettings()

    if (body.action === 'import') {
      const en = await queuedFromGitHub(issueDate, 'en')
      if (!en) return NextResponse.json({ error: `queue/${issueDate}.en.json not found on GitHub` }, { status: 404 })
      const zh = await queuedFromGitHub(issueDate, 'zh')
      for (const [language, issue] of [['en', en], ['zh', zh]] as const) {
        if (!issue) continue
        const [existing] = await db.select({ id: drafts.id }).from(drafts).where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, language))).limit(1)
        if (existing) await db.update(drafts).set({ ...issue, updatedAt: new Date() }).where(eq(drafts.id, existing.id))
        else await db.insert(drafts).values({ ...issue, language, issueDate })
      }
      const { to } = await sendOwnerPreview({ settings: s, issueDate, issue: en })
      await logRun({ job: 'generate', issueDate, status: 'ok', message: `Imported queue/${issueDate}.en.json from the dashboard, preview sent to ${to}` })
      return NextResponse.json({ ok: true, sentTo: to })
    }

    const [en] = await db.select().from(drafts).where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, 'en'))).limit(1)
    if (!en?.bodyMarkdown) return NextResponse.json({ error: 'No draft for that date' }, { status: 404 })

    if (body.action === 'email') {
      const [sentRow] = await db.select({ id: sentEmails.id }).from(sentEmails).where(eq(sentEmails.issueDate, issueDate)).limit(1)
      const { to } = await sendOwnerPreview({ settings: s, issueDate, issue: { subject: en.subject || 'Daily Brief', bodyMarkdown: en.bodyMarkdown, previewText: en.previewText }, alreadySent: !!sentRow })
      await logRun({ job: 'generate', issueDate, status: 'ok', message: `Preview re-sent to ${to} from the dashboard` })
      return NextResponse.json({ ok: true, sentTo: to })
    }
    if (body.action === 'skip') {
      await db.update(drafts).set({ skippedAt: new Date() }).where(eq(drafts.id, en.id))
      await logRun({ job: 'skip', issueDate, status: 'ok', message: 'Owner skipped the send from the dashboard' })
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'unskip') {
      await db.update(drafts).set({ skippedAt: null }).where(eq(drafts.id, en.id))
      await logRun({ job: 'skip', issueDate, status: 'ok', message: 'Owner restored the send from the dashboard' })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}
