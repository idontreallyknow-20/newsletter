import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  try {
    const { rows } = await req.json() as { rows: { name?: string; email: string }[] }
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
    }

    let inserted = 0
    let skipped = 0

    for (const row of rows) {
      if (!row.email) { skipped++; continue }
      const existing = await db.select().from(subscribers).where(eq(subscribers.email, row.email))
      if (existing.length > 0) { skipped++; continue }
      await db.insert(subscribers).values({ name: row.name || '', email: row.email, status: 'active' })
      inserted++
    }

    return NextResponse.json({ inserted, skipped })
  } catch {
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
