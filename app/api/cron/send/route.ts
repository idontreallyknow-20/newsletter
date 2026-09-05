export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { subscribers, sentEmails, drafts } from '@/lib/schema'
import { getIssueDate, evaluateSend } from '@/lib/schedule'
import { buildEmailHtml, sendBatch } from '@/lib/email'
import { signEmailToken } from '@/lib/token'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'
import { subscriberFrequenciesFor, scheduleToSendType } from '@/lib/preferences'
import { cronAuthorized, loadSettings, senderFrom, logRun, notifyOwner, errorMessage } from '@/lib/cron'

export async function GET(req: Request) {
  if (!cronAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const issueDate = getIssueDate()
  let s: Record<string, string> = {}
  try {
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
      const sendType = scheduleToSendType(s.schedule_frequency || 'manual')
      const wants = (sub: typeof allActive[number]) =>
        sendType ? subscriberFrequenciesFor(sendType).includes(sub.frequency as 'weekly' | 'daily' | 'both') : true
      const enTargets = allActive.filter(sub => (sub.language || 'en') === 'en' && wants(sub))
      const zhTargets = allActive.filter(sub => sub.language === 'zh' && wants(sub))

      const zhSubject = zhDraft?.bodyMarkdown ? (zhDraft.subject || enSubject) : enSubject
      const zhBodyHtml = zhDraft?.bodyMarkdown ? markdownToHtml(zhDraft.bodyMarkdown) : enBodyHtml

      const buildRecipients = (subs: typeof allActive, bodyHtml: string) =>
        subs.map(sub => {
          const token = signEmailToken(sub.email, emailSecret)
          const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(sub.email)}&token=${token}`
          const preferencesUrl = `${baseUrl}/preferences?email=${encodeURIComponent(sub.email)}&token=${token}`
          return {
            email: sub.email,
            unsubscribeUrl,
            html: buildEmailHtml({ newsletterName, bodyHtml, unsubscribeUrl, preferencesUrl, previewText: enDraft.previewText || undefined }),
          }
        })

      const [enResults, zhResults] = await Promise.all([
        enTargets.length > 0
          ? sendBatch({ recipients: buildRecipients(enTargets, enBodyHtml), subject: enSubject, fromName, fromEmail })
          : Promise.resolve([]),
        zhTargets.length > 0
          ? sendBatch({ recipients: buildRecipients(zhTargets, zhBodyHtml), subject: zhSubject, fromName, fromEmail })
          : Promise.resolve([]),
      ])

      const allResults = [...enResults, ...zhResults]
      const errorCount = allResults.reduce((n, r) => n + (r.error ? 1 : 0), 0)
      const total = enTargets.length + zhTargets.length
      const status = errorCount === 0 ? 'sent' : 'partial'

      await db.update(sentEmails).set({ recipientCount: total, status, sentAt: new Date() }).where(eq(sentEmails.id, sentId))
      await logRun({
        job: 'send', issueDate, status: errorCount === 0 ? 'ok' : 'error',
        message: `Sent "${enSubject}" to ${total} subscribers (${enTargets.length} en, ${zhTargets.length} zh)${errorCount ? `, ${errorCount} batch errors` : ''}`,
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
