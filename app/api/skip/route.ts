export const dynamic = 'force-dynamic'

import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { drafts } from '@/lib/schema'
import { verifyActionToken } from '@/lib/token'
import { logRun } from '@/lib/cron'

function page(title: string, body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0C0E14;color:#E7E9E6;font:16px/1.5 -apple-system,"Segoe UI",sans-serif}
main{max-width:420px;padding:32px}h1{font-size:28px;line-height:1.1;margin:0 0 12px;letter-spacing:-0.02em}p{margin:0 0 8px;color:#A9AEB8}a{color:#FF5A1F}</style></head>
<body><main><p style="color:#FF5A1F;font-size:12px;letter-spacing:.2em;text-transform:uppercase">Daily Brief</p><h1>${title}</h1>${body}</main></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } },
  )
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const date = url.searchParams.get('date') || ''
  const token = url.searchParams.get('token') || ''
  const secret = process.env.EMAIL_TOKEN_SECRET || process.env.DASHBOARD_PASSWORD || ''

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !secret || !verifyActionToken(`skip:${date}`, token, secret)) {
    return page('That link did not work', '<p>The skip link is invalid or was made for a different day.</p>', 400)
  }

  try {
    const [draft] = await db.select({ id: drafts.id, skippedAt: drafts.skippedAt }).from(drafts)
      .where(and(eq(drafts.issueDate, date), eq(drafts.language, 'en'))).limit(1)
    if (draft) {
      if (!draft.skippedAt) await db.update(drafts).set({ skippedAt: new Date() }).where(eq(drafts.id, draft.id))
    } else {
      // No draft yet (e.g. link opened before generation). Park a placeholder so the send step still stops.
      await db.insert(drafts).values({ language: 'en', issueDate: date, skippedAt: new Date(), subject: null, bodyMarkdown: null })
    }
    await logRun({ job: 'skip', issueDate: date, status: 'ok', message: 'Owner skipped today\'s send' })
    return page(`Skipped ${date}`, `<p>Nothing goes out to subscribers today. Tomorrow's issue is unaffected.</p><p><a href="/compose/en">Open compose</a> if you want to send something else.</p>`)
  } catch {
    return page('Something broke', '<p>Could not record the skip. Turn off automatic sending in Settings to be safe.</p>', 500)
  }
}
