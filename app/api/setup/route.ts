import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { deriveSessionToken } from '@/lib/token'
import { timingSafeEqual } from 'crypto'

function safeEqual(a: string, b: string) {
  try {
    const ab = Buffer.from(a), bb = Buffer.from(b)
    if (ab.length !== bb.length) return false
    return timingSafeEqual(ab, bb)
  } catch { return false }
}

const statements = [
  sql`CREATE TABLE IF NOT EXISTS subscribers (
    id serial PRIMARY KEY,
    name text,
    email text UNIQUE NOT NULL,
    status text NOT NULL DEFAULT 'active',
    language text NOT NULL DEFAULT 'en',
    frequency text NOT NULL DEFAULT 'weekly',
    created_at timestamp DEFAULT now() NOT NULL
  )`,
  sql`CREATE TABLE IF NOT EXISTS sent_emails (
    id serial PRIMARY KEY,
    subject text NOT NULL,
    preview_text text,
    body_html text,
    body_markdown text,
    slug text,
    sent_at timestamp DEFAULT now() NOT NULL,
    recipient_count integer,
    status text NOT NULL DEFAULT 'sent'
  )`,
  sql`CREATE TABLE IF NOT EXISTS drafts (
    id serial PRIMARY KEY,
    subject text,
    preview_text text,
    body_markdown text,
    updated_at timestamp DEFAULT now() NOT NULL
  )`,
  sql`CREATE TABLE IF NOT EXISTS settings (
    key text PRIMARY KEY,
    value text
  )`,
  sql`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en'`,
  sql`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS frequency text NOT NULL DEFAULT 'weekly'`,
  sql`ALTER TABLE sent_emails ADD COLUMN IF NOT EXISTS slug text`,
  sql`ALTER TABLE drafts ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en'`,
  // Daily automation: issue-date keyed drafts/sends, preview + skip state, run log
  sql`ALTER TABLE drafts ADD COLUMN IF NOT EXISTS issue_date text`,
  sql`ALTER TABLE drafts ADD COLUMN IF NOT EXISTS preview_sent_at timestamp`,
  sql`ALTER TABLE drafts ADD COLUMN IF NOT EXISTS skipped_at timestamp`,
  sql`CREATE INDEX IF NOT EXISTS drafts_issue_date_idx ON drafts (issue_date, language)`,
  sql`ALTER TABLE sent_emails ADD COLUMN IF NOT EXISTS issue_date text`,
  sql`CREATE UNIQUE INDEX IF NOT EXISTS sent_emails_issue_date_uq ON sent_emails (issue_date) WHERE issue_date IS NOT NULL`,
  sql`CREATE TABLE IF NOT EXISTS send_log (
    id serial PRIMARY KEY,
    job text NOT NULL,
    issue_date text,
    status text NOT NULL,
    message text,
    detail text,
    created_at timestamp DEFAULT now() NOT NULL
  )`,
  sql`INSERT INTO settings (key, value) VALUES ('autosend_enabled', 'false') ON CONFLICT (key) DO NOTHING`,
  sql`INSERT INTO settings (key, value) VALUES ('schedule_frequency', 'daily') ON CONFLICT (key) DO NOTHING`,
  // Pre-load default settings (won't overwrite values you've already set)
  sql`INSERT INTO settings (key, value) VALUES ('newsletter_name', 'Daily Brief') ON CONFLICT (key) DO NOTHING`,
  sql`INSERT INTO settings (key, value) VALUES ('from_name', 'Joseph') ON CONFLICT (key) DO NOTHING`,
  sql`INSERT INTO settings (key, value) VALUES ('from_email', 'onboarding@resend.dev') ON CONFLICT (key) DO NOTHING`,
  sql`INSERT INTO settings (key, value) VALUES ('owner_email', ${process.env.OWNER_EMAIL ?? ''}) ON CONFLICT (key) DO NOTHING`,
]

export async function GET() {
  const stored = process.env.DASHBOARD_PASSWORD
  if (!stored) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  const cookieStore = await cookies()
  const session = cookieStore.get('nhq_session')
  const expected = deriveSessionToken(stored)
  if (!session?.value || !safeEqual(session.value, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: string[] = []
  for (const statement of statements) {
    try {
      await db.execute(statement)
      results.push('ok')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push(`error: ${msg}`)
    }
  }
  const hasError = results.some(r => r.startsWith('error'))
  return NextResponse.json({ ok: !hasError, results })
}
