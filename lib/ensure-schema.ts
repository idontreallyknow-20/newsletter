// Idempotent schema migration. Every statement is CREATE/ALTER ... IF NOT EXISTS,
// so it is safe to run on every cold start. The cron routes call this before
// touching the database: a deploy that adds a column must never be able to
// break the morning send just because nobody opened /api/setup afterwards.
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export const SCHEMA_STATEMENTS = [
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
]

export const DEFAULT_SETTINGS: Array<[string, string]> = [
  ['autosend_enabled', 'false'],
  ['schedule_frequency', 'daily'],
  ['newsletter_name', 'Daily Brief'],
  ['from_name', 'Joseph'],
  ['from_email', 'onboarding@resend.dev'],
  ['owner_email', process.env.OWNER_EMAIL ?? ''],
]

// One-off data migrations, keyed so each runs exactly once per database.
// Settings changed later in the dashboard are never overwritten again.
export const DATA_MIGRATIONS: Array<{ key: string; statement: ReturnType<typeof sql> }> = [
  {
    key: 'owner_email_2026_09_05',
    statement: sql`INSERT INTO settings (key, value) VALUES ('owner_email', 'josephislockedin@gmail.com')
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
  },
]

async function runDataMigrations() {
  for (const m of DATA_MIGRATIONS) {
    const markerKey = `migration:${m.key}`
    const { rows } = await db.execute(sql`SELECT 1 FROM settings WHERE key = ${markerKey}`)
    if (rows.length > 0) continue
    await db.execute(m.statement)
    await db.execute(sql`INSERT INTO settings (key, value) VALUES (${markerKey}, ${new Date().toISOString()}) ON CONFLICT (key) DO NOTHING`)
  }
}

let done: Promise<void> | null = null

/**
 * Bring the database up to the current schema. Runs at most once per server
 * instance; a failure resets that so the next request tries again.
 */
export function ensureSchema(): Promise<void> {
  if (!done) {
    done = (async () => {
      for (const statement of SCHEMA_STATEMENTS) await db.execute(statement)
      await runDataMigrations()
    })().catch(err => { done = null; throw err })
  }
  return done
}
