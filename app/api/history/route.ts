import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'
import { desc, sql } from 'drizzle-orm'

const DEFAULT_LIMIT = 50

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10), 200)
    const offset = parseInt(searchParams.get('offset') ?? '0', 10)

    const [rows, [{ count }]] = await Promise.all([
      db.select().from(sentEmails).orderBy(desc(sentEmails.sentAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(sentEmails),
    ])

    return NextResponse.json({ emails: rows, total: count, limit, offset })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
