export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { and, eq, isNull, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { drafts } from '@/lib/schema'
import { getIssueDate, NEWSLETTER_TZ } from '@/lib/schedule'
import { buildEmailHtml, sendToRecipients } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { signActionToken } from '@/lib/token'
import {
  extractText, parseIssue, usedWebSearch, topicFor,
  issueSystemPrompt, issueUserPrompt,
} from '@/lib/generation'
import { translateIssue } from '@/lib/translate'
import { cronAuthorized, loadSettings, senderFrom, logRun, notifyOwner, errorMessage } from '@/lib/cron'
import { ensureSchema } from '@/lib/ensure-schema'

const GENERATE_MODEL = 'claude-opus-5'
const QUEUE_REPO = 'https://raw.githubusercontent.com/idontreallyknow-20/newsletter'
// The nightly Routine commits to the `queue` branch, which does not trigger a
// Vercel deploy. `main` is checked second so a hand-committed file also works.
const QUEUE_REFS = ['queue', 'main'] as const

/** A draft committed to the repo's queue folder for this date, if any. */
async function queuedFromGitHub(issueDate: string, lang: 'en' | 'zh'): Promise<{ subject: string; bodyMarkdown: string; previewText: string } | null> {
  for (const ref of QUEUE_REFS) {
    try {
      const res = await fetch(`${QUEUE_REPO}/${ref}/queue/${issueDate}.${lang}.json?t=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(8_000) })
      if (!res.ok) continue
      const j = await res.json() as { subject?: string; bodyMarkdown?: string; previewText?: string }
      if (!j.subject || !j.bodyMarkdown || j.bodyMarkdown.length < 200) continue
      const bodyMarkdown = j.bodyMarkdown.replace(/—|–/g, ', ').trim()
      const previewText = (j.previewText || bodyMarkdown.split('\n').map(l => l.trim()).find(l => l && !l.startsWith('#')) || '').replace(/[*_`]/g, '').slice(0, 140)
      return { subject: j.subject.trim().slice(0, 200), bodyMarkdown, previewText }
    } catch { /* try the next ref */ }
  }
  return null
}

// Vercel caps this route at maxDuration. Every network call below takes its
// timeout from the time left, so a slow search can never starve the preview.
const BUDGET_MS = 55_000
const SEARCH_MS = 28_000
const FALLBACK_MS = 15_000
const TRANSLATE_MIN_MS = 12_000

function remaining(started: number) { return BUDGET_MS - (Date.now() - started) }

async function writeIssue(client: Anthropic, opts: { newsletterName: string; dateLabel: string; topic: string; started: number }) {
  const { newsletterName, dateLabel, topic, started } = opts
  const system = issueSystemPrompt(newsletterName)

  // First attempt: grounded in that morning's news via server-side web search.
  try {
    const res = await client.messages.create({
      model: GENERATE_MODEL,
      max_tokens: 4000,
      system,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'low' },
      tools: [{
        type: 'web_search_20260209',
        name: 'web_search',
        max_uses: 3,
        user_location: { type: 'approximate', city: 'Toronto', country: 'CA', timezone: NEWSLETTER_TZ },
      }],
      messages: [{ role: 'user', content: issueUserPrompt({ dateLabel, topic, withSearch: true }) }],
    }, { timeout: Math.min(SEARCH_MS, Math.max(5_000, remaining(started) - FALLBACK_MS - 5_000)), maxRetries: 0 })

    const text = extractText(res.content)
    const okStop = res.stop_reason === 'end_turn' || res.stop_reason === 'stop_sequence'
    if (okStop && text.length > 400) {
      return { text, searched: usedWebSearch(res.content), model: GENERATE_MODEL }
    }
    console.warn('[generate] search attempt unusable, stop_reason=', res.stop_reason, 'len=', text.length)
  } catch (err) {
    console.warn('[generate] search attempt failed:', errorMessage(err))
  }

  // Fallback: no tools, and the prompt forbids invented citations.
  const res = await client.messages.create({
    model: GENERATE_MODEL,
    max_tokens: 3000,
    system,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'low' },
    messages: [{ role: 'user', content: issueUserPrompt({ dateLabel, topic, withSearch: false }) }],
  }, { timeout: Math.min(FALLBACK_MS, Math.max(5_000, remaining(started) - 5_000)), maxRetries: 0 })
  if (res.stop_reason === 'refusal') throw new Error('Model refused to write the issue')
  const text = extractText(res.content)
  if (text.length < 200) throw new Error(`Generated issue too short (${text.length} chars)`)
  return { text, searched: false, model: GENERATE_MODEL }
}

export async function GET(req: Request) {
  if (!cronAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const started = Date.now()
  const issueDate = getIssueDate()
  let s: Record<string, string> = {}
  try {
    // Idempotent. A deploy that adds a column must not be able to break the morning.
    await ensureSchema()
    s = await loadSettings()
    const { newsletterName, fromName, fromEmail, ownerEmail, baseUrl, emailSecret } = senderFrom(s)

    const [existing] = await db.select().from(drafts)
      .where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, 'en'))).limit(1)

    if (existing?.bodyMarkdown && existing.previewSentAt) {
      await logRun({ job: 'generate', issueDate, status: 'skipped', message: 'Draft and preview already exist for today' })
      return NextResponse.json({ skipped: true, reason: 'already_generated', issueDate })
    }

    // A file committed to the repo's queue folder for today wins over everything.
    if (!existing?.bodyMarkdown) {
      const gh = await queuedFromGitHub(issueDate, 'en')
      if (gh) {
        await db.insert(drafts).values({ ...gh, language: 'en', issueDate })
        const ghZh = await queuedFromGitHub(issueDate, 'zh')
        if (ghZh) await db.insert(drafts).values({ ...ghZh, language: 'zh', issueDate })
        await logRun({ job: 'generate', issueDate, status: 'ok', message: `Picked up queue/${issueDate}.en.json from GitHub${ghZh ? ' plus the Chinese edition' : ''}` })
      }
    }

    const [fromGitHub] = existing?.bodyMarkdown ? [existing] : await db.select().from(drafts)
      .where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, 'en'))).limit(1)

    // No API key and nothing queued on GitHub: take the newest draft written in
    // Compose that has not been assigned to a day yet, stamp it, and preview it.
    if (!fromGitHub?.bodyMarkdown && !process.env.ANTHROPIC_API_KEY) {
      const [queued] = await db.select().from(drafts)
        .where(and(eq(drafts.language, 'en'), isNull(drafts.issueDate)))
        .orderBy(desc(drafts.updatedAt)).limit(1)
      if (!queued?.bodyMarkdown) {
        await logRun({ job: 'generate', issueDate, status: 'skipped', message: 'No draft queued and no API key to write one' })
        await notifyOwner(s, `[Daily Brief] Nothing queued for ${issueDate}`,
          `No issue is queued for today, so nothing will be sent.\n\nEither the nightly Routine did not commit queue/${issueDate}.en.json to GitHub, or nothing was written in Compose (dailybriefhq.com/compose/en). Fix one of those before 5:00 AM tomorrow.`)
        return NextResponse.json({ skipped: true, reason: 'no_draft', issueDate })
      }
      await db.update(drafts).set({ issueDate }).where(eq(drafts.id, queued.id))
      const [queuedZh] = await db.select().from(drafts)
        .where(and(eq(drafts.language, 'zh'), isNull(drafts.issueDate)))
        .orderBy(desc(drafts.updatedAt)).limit(1)
      if (queuedZh?.bodyMarkdown) await db.update(drafts).set({ issueDate }).where(eq(drafts.id, queuedZh.id))
    }

    const [today] = fromGitHub?.bodyMarkdown ? [fromGitHub] : await db.select().from(drafts)
      .where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, 'en'))).limit(1)

    const client = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null

    const dateLabel = new Date().toLocaleDateString('en-CA', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: NEWSLETTER_TZ,
    })

    let en = today?.bodyMarkdown
      ? { subject: today.subject || newsletterName, bodyMarkdown: today.bodyMarkdown, previewText: today.previewText || '' }
      : null
    let searched = false

    if (!en) {
      if (!client) throw new Error('No draft for today and ANTHROPIC_API_KEY is not set')
      const topic = topicFor(issueDate)
      const written = await writeIssue(client, { newsletterName, dateLabel, topic, started })
      searched = written.searched
      en = parseIssue(written.text, `${newsletterName}, ${dateLabel}`)
      await db.insert(drafts).values({
        subject: en.subject, previewText: en.previewText, bodyMarkdown: en.bodyMarkdown,
        language: 'en', issueDate,
      })

      // Chinese edition, written now if there is time. Otherwise the send
      // route translates on the fly for Chinese readers.
      if (client && remaining(started) > TRANSLATE_MIN_MS + 5_000) {
        try {
          const zh = await translateIssue(client, en.subject, en.bodyMarkdown, Math.min(20_000, remaining(started) - 5_000))
          await db.insert(drafts).values({
            subject: zh.subject, previewText: zh.previewText, bodyMarkdown: zh.bodyMarkdown,
            language: 'zh', issueDate,
          })
        } catch (err) {
          console.error('[generate] zh translation deferred to send time:', errorMessage(err))
        }
      }
    }

    // Preview to the owner. Sending is refused until this succeeds.
    if (!ownerEmail) throw new Error('No owner email configured (Settings or OWNER_EMAIL)')
    if (!fromEmail) throw new Error('No from email configured (Settings or FROM_EMAIL)')

    const skipToken = signActionToken(`skip:${issueDate}`, emailSecret)
    const skipUrl = `${baseUrl}/api/skip?date=${issueDate}&token=${skipToken}`
    const composeUrl = `${baseUrl}/compose/en`
    const banner = `
      <div style="margin:0 0 24px;padding:16px 18px;background:#0C0E14;color:#E7E9E6;font:14px/1.5 -apple-system,Segoe UI,sans-serif">
        <p style="margin:0 0 10px"><strong>Preview for ${issueDate}.</strong> This goes to subscribers at about 7:00 AM Toronto unless you stop it.</p>
        <p style="margin:0">
          <a href="${skipUrl}" style="display:inline-block;padding:10px 14px;background:#FF5A1F;color:#0C0E14;text-decoration:none;font-weight:600">Skip today's send</a>
          &nbsp;&nbsp;<a href="${composeUrl}" style="color:#E7E9E6">Edit in compose</a>
        </p>
      </div>`
    const html = buildEmailHtml({
      newsletterName,
      bodyHtml: banner + markdownToHtml(en.bodyMarkdown),
      unsubscribeUrl: `${baseUrl}/preferences`,
      previewText: en.previewText || undefined,
    })
    await sendToRecipients({
      to: [ownerEmail], subject: `[Preview ${issueDate}] ${en.subject}`, html, fromName, fromEmail,
    })
    await db.update(drafts).set({ previewSentAt: new Date() })
      .where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, 'en')))

    await logRun({
      job: 'generate', issueDate, status: 'ok',
      message: `Draft ready, preview sent to ${ownerEmail}`,
      detail: { subject: en.subject, searched, model: client ? GENERATE_MODEL : 'hand-written', elapsedMs: Date.now() - started },
    })
    return NextResponse.json({ ok: true, issueDate, subject: en.subject, searched, previewSentTo: ownerEmail })
  } catch (err) {
    const message = errorMessage(err)
    console.error('[generate] failed:', message)
    await logRun({ job: 'generate', issueDate, status: 'error', message })
    await notifyOwner(s, `[Daily Brief] Generation failed for ${issueDate}`,
      `This morning's issue was not generated.\n\nError: ${message}\n\nNothing will be sent today unless you write and send an issue from the dashboard.`)
    return NextResponse.json({ error: 'Generation failed', message, issueDate }, { status: 500 })
  }
}
