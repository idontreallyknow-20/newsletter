export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { drafts } from '@/lib/schema'
import { cronAuthorized } from '@/lib/cron'

/**
 * Queue tomorrow's issue from outside the dashboard (a Claude Routine, a script).
 * Bearer CRON_SECRET. The draft is stored unassigned; the 5 AM job stamps it
 * with the day and previews it to the owner before anything is sent.
 */
export async function POST(req: Request) {
  if (!cronAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: { subject?: string; previewText?: string; bodyMarkdown?: string; language?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 }) }

  const subject = (body.subject || '').trim().slice(0, 200)
  const bodyMarkdown = (body.bodyMarkdown || '').replace(/—|–/g, ', ').trim()
  const language = body.language === 'zh' ? 'zh' : 'en'
  if (!subject || bodyMarkdown.length < 200) {
    return NextResponse.json({ error: 'subject and a bodyMarkdown of at least 200 characters are required' }, { status: 400 })
  }
  const previewText = (body.previewText || bodyMarkdown.split('\n').map(l => l.trim()).find(l => l && !l.startsWith('#')) || '')
    .replace(/[*_`]/g, '').slice(0, 140)

  try {
    const [row] = await db.insert(drafts).values({ subject, previewText, bodyMarkdown, language }).returning({ id: drafts.id })
    return NextResponse.json({ ok: true, id: row.id, language, subject, words: bodyMarkdown.split(/\s+/).length })
  } catch {
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}
