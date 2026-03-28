import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const rows = await db.select().from(sentEmails).orderBy(desc(sentEmails.sentAt))
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
