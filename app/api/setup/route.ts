import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id serial PRIMARY KEY,
        name text,
        email text UNIQUE NOT NULL,
        status text NOT NULL DEFAULT 'active',
        language text NOT NULL DEFAULT 'en',
        frequency text NOT NULL DEFAULT 'weekly',
        created_at timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sent_emails (
        id serial PRIMARY KEY,
        subject text NOT NULL,
        preview_text text,
        body_html text,
        body_markdown text,
        slug text,
        sent_at timestamp DEFAULT now() NOT NULL,
        recipient_count integer,
        status text NOT NULL DEFAULT 'sent'
      );

      CREATE TABLE IF NOT EXISTS drafts (
        id serial PRIMARY KEY,
        subject text,
        preview_text text,
        body_markdown text,
        updated_at timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key text PRIMARY KEY,
        value text
      );

      ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en';
      ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS frequency text NOT NULL DEFAULT 'weekly';
      ALTER TABLE sent_emails ADD COLUMN IF NOT EXISTS slug text;
    `)

    return NextResponse.json({ ok: true, message: 'Database ready' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
