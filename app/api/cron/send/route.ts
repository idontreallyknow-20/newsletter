export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { subscribers, sentEmails, drafts } from '@/lib/schema'
import Anthropic from '@anthropic-ai/sdk'
import { getIssueDate, evaluateSend, recipientFrequenciesFor } from '@/lib/schedule'
import { translateIssue } from '@/lib/translate'
import { buildEmailHtml, sendBatch } from '@/lib/email'
import { signEmailToken } from '@/lib/token'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'
import { cronAuthorized, loadSettings, senderFrom, logRun, notifyOwner, errorMessage } from '@/lib/cron'
import { ensureSchema } from '@/lib/ensure-schema'

export async function GET(req: Request) {
  if (!cronAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const issueDate = getIssueDate()
  let s: Record<string, string> = {}
  try {
    // Idempotent. A deploy that adds a column must not be able to break the morning.
    await ensureSchema()
    s = await loadSettings()

    const [[enDraft], [zhDraft], [sentRow]] = await Promise.all([
      db.select().from(drafts).where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, 'en'))).limit(1),
      db.select().from(drafts).where(and(eq(drafts.issueDate, issueDate), eq(drafts.language, 'zh'))).limit(1),
      db.select({ id: sentEmails.id }).from(sentEmails).where(eq(sentEmails.issueDate, issueDate)).limit(1),
    ])

    const decision = evaluateSend({ settings: s, issueDate, draft: enDraft, alreadySent: !!sentRow })
    if (!decision.ok) {
      await logRun({ job: 'send', issueDate, status: 'skipped', message: decision.reason })
      return NextResponse.json({ skipped: true, reason: decision.reason, issueDate })
    }

    const { fromName, fromEmail, newsletterName, baseUrl, emailSecret } = senderFrom(s)
    if (!fromEmail) throw new Error('No from email configured (Settings or FROM_EMAIL)')

    const enSubject = enDraft.subject || newsletterName
    const enBodyHtml = markdownToHtml(enDraft.bodyMarkdown!)

    // Claim today's slot. The unique index on issue_date means a second
    // trigger (cron retry, cron-job.org, a manual curl) gets nothing back.
    const claimed = await db.insert(sentEmails).values({
      subject: enSubject,
      previewText: enDraft.previewText,
      bodyHtml: enBodyHtml,
      bodyMarkdown: enDraft.bodyMarkdown,
      slug: slugify(enSubject),
      issueDate,
      recipientCount: 0,
      status: 'sending',
    }).onConflictDoNothing().returning({ id: sentEmails.id })
    if (claimed.length === 0) {
      await logRun({ job: 'send', issueDate, status: 'skipped', message: 'already_sent' })
      return NextResponse.json({ skipped: true, reason: 'already_sent', issueDate })
    }
    const sentId = claimed[0].id

    try {
      const allActive = await db.select().from(subscribers).where(eq(subscribers.status, 'active'))
      const audiences = recipientFrequenciesFor(s, issueDate)
      const wants = (sub: typeof allActive[number]) => audiences.includes((sub.frequency || 'weekly') as 'weekly' | 'daily' | 'both')
      const enTargets = allActive.filter(sub => (sub.language || 'en') === 'en' && wants(sub))
      const zhTargets = allActive.filter(sub => sub.language === 'zh' && wants(sub))

      // Chinese edition: use the pre-written draft, translate now if the
      // generate step ran out of time, and fall back to English as a last resort.
      let zhSubject = enSubject
      let zhBodyHtml = enBodyHtml
      if (zhTargets.length > 0) {
        if (zhDraft?.bodyMarkdown) {
          zhSubject = zhDraft.subject || enSubject
          zhBodyHtml = markdownToHtml(zhDraft.bodyMarkdown)
        } else if (process.env.ANTHROPIC_API_KEY) {
          try {
            const zh = await translateIssue(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }), enSubject, enDraft.bodyMarkdown!, 25_000)
            zhSubject = zh.subject
            zhBodyHtml = markdownToHtml(zh.bodyMarkdown)
            await db.insert(drafts).values({ subject: zh.subject, previewText: zh.previewText, bodyMarkdown: zh.bodyMarkdown, language: 'zh', issueDate })
          } catch (err) {
            console.error('[send] zh translation failed, sending English to Chinese readers:', errorMessage(err))
          }
        }
      }

      const readOnlineUrl = `${baseUrl}/issues/${slugify(enSubject)}`
      const buildRecipients = (subs: typeof allActive, bodyHtml: string, language: 'en' | 'zh', subject: string) =>
        subs.map(sub => {
          const token = signEmailToken(sub.email, emailSecret)
          const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(sub.email)}&token=${token}`
          const preferencesUrl = `${baseUrl}/preferences?email=${encodeURIComponent(sub.email)}&token=${token}`
          return {
            email: sub.email,
            unsubscribeUrl,
            html: buildEmailHtml({ newsletterName, subject, issueDate, language, bodyHtml, unsubscribeUrl, preferencesUrl, readOnlineUrl, siteUrl: baseUrl, previewText: (language === 'zh' ? zhDraft?.previewText : enDraft.previewText) || undefined }),
          }
        })

      const [enResults, zhResults] = await Promise.all([
        enTargets.length > 0
          ? sendBatch({ recipients: buildRecipients(enTargets, enBodyHtml, 'en', enSubject), subject: enSubject, fromName, fromEmail })
          : Promise.resolve([]),
        zhTargets.length > 0
          ? sendBatch({ recipients: buildRecipients(zhTargets, zhBodyHtml, 'zh', zhSubject), subject: zhSubject, fromName, fromEmail })
          : Promise.resolve([]),
      ])

      const allResults = [...enResults, ...zhResults]
      const errorCount = allResults.reduce((n, r) => n + (r.error ? 1 : 0), 0)
      const total = enTargets.length + zhTargets.length
      const status = errorCount === 0 ? 'sent' : 'partial'

      await db.update(sentEmails).set({ recipientCount: total, status, sentAt: new Date() }).where(eq(sentEmails.id, sentId))
      await logRun({
        job: 'send', issueDate, status: errorCount === 0 ? 'ok' : 'error',
        message: `Sent "${enSubject}" to ${total} subscribers (${enTargets.length} en, ${zhTargets.length} zh; ${audiences.join('/')} readers)${errorCount ? `, ${errorCount} batch errors` : ''}`,
        detail: errorCount ? allResults.filter(r => r.error).map(r => r.error) : undefined,
      })
      if (errorCount > 0) {
        await notifyOwner(s, `[Daily Brief] Partial send for ${issueDate}`,
          `${errorCount} of ${allResults.length} batches failed.\n\n${JSON.stringify(allResults.filter(r => r.error).map(r => r.error), null, 2)}`)
      }
      return NextResponse.json({ ok: true, issueDate, subject: enSubject, sent: total, breakdown: { en: enTargets.length, zh: zhTargets.length }, errors: errorCount })
    } catch (err) {
      await db.update(sentEmails).set({ status: 'failed' }).where(eq(sentEmails.id, sentId))
      throw err
    }
  } catch (err) {
    const message = errorMessage(err)
    console.error('[send] failed:', message)
    await logRun({ job: 'send', issueDate, status: 'error', message })
    await notifyOwner(s, `[Daily Brief] Send failed for ${issueDate}`, `Today's issue did not go out.\n\nError: ${message}`)
    return NextResponse.json({ error: 'Send failed', message, issueDate }, { status: 500 })
  }
}
