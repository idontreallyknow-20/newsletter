import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
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
  // Pre-load default settings (won't overwrite values you've already set)
  sql`INSERT INTO settings (key, value) VALUES ('newsletter_name', 'AI & Economy') ON CONFLICT (key) DO NOTHING`,
  sql`INSERT INTO settings (key, value) VALUES ('from_name', 'Joseph') ON CONFLICT (key) DO NOTHING`,
  sql`INSERT INTO settings (key, value) VALUES ('from_email', 'onboarding@resend.dev') ON CONFLICT (key) DO NOTHING`,
  sql`INSERT INTO settings (key, value) VALUES ('owner_email', ${process.env.OWNER_EMAIL ?? ''}) ON CONFLICT (key) DO NOTHING`,
]

export async function GET() {
  const stored = process.env.DASHBOARD_PASSWORD
  if (!stored) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  const session = cookies().get('nhq_session')
  if (!session?.value || !safeEqual(session.value, stored)) {
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
