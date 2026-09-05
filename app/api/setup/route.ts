import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { deriveSessionToken } from '@/lib/token'
import { timingSafeEqual } from 'crypto'
import { SCHEMA_STATEMENTS, DEFAULT_SETTINGS } from '@/lib/ensure-schema'

function safeEqual(a: string, b: string) {
  try {
    const ab = Buffer.from(a), bb = Buffer.from(b)
    if (ab.length !== bb.length) return false
    return timingSafeEqual(ab, bb)
  } catch { return false }
}

export async function GET() {
  const stored = process.env.DASHBOARD_PASSWORD
  if (!stored) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  const cookieStore = await cookies()
  const session = cookieStore.get('nhq_session')
  const expected = deriveSessionToken(stored)
  if (!session?.value || !safeEqual(session.value, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pre-load default settings (never overwrites values you've already set)
  const statements = [
    ...SCHEMA_STATEMENTS,
    ...DEFAULT_SETTINGS.map(([key, value]) => sql`INSERT INTO settings (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO NOTHING`),
  ]

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
