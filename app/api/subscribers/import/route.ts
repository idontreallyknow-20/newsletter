import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'

export async function POST(req: Request) {
  try {
    const { rows } = await req.json() as { rows: { name?: string; email: string }[] }
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
    }

    const valid = rows.filter(r => r.email?.trim())
    if (valid.length === 0) {
      return NextResponse.json({ inserted: 0, skipped: rows.length })
    }

    // Batch upsert — ON CONFLICT DO NOTHING skips existing emails
    const result = await db
      .insert(subscribers)
      .values(valid.map(r => ({ name: r.name ?? '', email: r.email.trim(), status: 'active' as const })))
      .onConflictDoNothing()
      .returning({ id: subscribers.id })

    return NextResponse.json({ inserted: result.length, skipped: rows.length - result.length })
  } catch {
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
