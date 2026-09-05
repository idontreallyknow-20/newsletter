export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { drafts } from '@/lib/schema'
import { getIssueDate, NEWSLETTER_TZ } from '@/lib/schedule'
import { buildEmailHtml, sendToRecipients } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { signActionToken } from '@/lib/token'
import {
  extractText, parseIssue, usedWebSearch, topicFor,
  issueSystemPrompt, issueUserPrompt, translationPrompt,
} from '@/lib/generation'
import { cronAuthorized, loadSettings, senderFrom, logRun, notifyOwner, errorMessage } from '@/lib/cron'

const GENERATE_MODEL = 'claude-opus-5'
const TRANSLATE_MODEL = 'claude-haiku-4-5'

async function writeIssue(client: Anthropic, opts: { newsletterName: string; dateLabel: string; topic: string }) {
  const { newsletterName, dateLabel, topic } = opts
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
    }, { timeout: 45_000 })

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
  }, { timeout: 40_000 })
  if (res.stop_reason === 'refusal') throw new Error('Model refused to write the issue')
  const text = extractText(res.content)
  if (text.length < 200) throw new Error(`Generated issue too short (${text.length} chars)`)
  return { text, searched: false, model: GENERATE_MODEL }
}

async function translate(client: Anthropic, subject: string, markdown: string) {
  const res = await client.messages.create({
    model: TRANSLATE_MODEL,
    max_tokens: 3000,
    messages: [{ role: 'user', content: translationPrompt(subject, markdown) }],
  }, { timeout: 30_000 })
  return parseIssue(extractText(res.content), subject)
}

export async function GET(req: Request) {
  if (!cronAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const issueDate = getIssueDate()
  let s: Record<string, string> = {}
  try {
    s = await loadSettings()
    const { newsletterName, fromName, fromEmail, ownerEmail, baseUrl, emailSecret } = senderFrom(s)

    const [existing] = await db.select().from(drafts)
      .where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, 'en'))).limit(1)

    if (existing?.bodyMarkdown && existing.previewSentAt) {
      await logRun({ job: 'generate', issueDate, status: 'skipped', message: 'Draft and preview already exist for today' })
      return NextResponse.json({ skipped: true, reason: 'already_generated', issueDate })
    }

    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set')
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const dateLabel = new Date().toLocaleDateString('en-CA', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: NEWSLETTER_TZ,
    })

    let en = existing?.bodyMarkdown
      ? { subject: existing.subject || newsletterName, bodyMarkdown: existing.bodyMarkdown, previewText: existing.previewText || '' }
      : null
    let searched = false

    if (!en) {
      const topic = topicFor(issueDate)
      const written = await writeIssue(client, { newsletterName, dateLabel, topic })
      searched = written.searched
      en = parseIssue(written.text, `${newsletterName}, ${dateLabel}`)
      await db.insert(drafts).values({
        subject: en.subject, previewText: en.previewText, bodyMarkdown: en.bodyMarkdown,
        language: 'en', issueDate,
      })

      // Chinese edition, written ahead of time so the send step is fast.
      try {
        const zh = await translate(client, en.subject, en.bodyMarkdown)
        await db.insert(drafts).values({
          subject: zh.subject, previewText: zh.previewText, bodyMarkdown: zh.bodyMarkdown,
          language: 'zh', issueDate,
        })
      } catch (err) {
        console.error('[generate] zh translation failed (send will fall back to English):', errorMessage(err))
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
      detail: { subject: en.subject, searched, model: GENERATE_MODEL },
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
