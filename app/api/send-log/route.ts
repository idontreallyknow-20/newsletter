export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { sendLog } from '@/lib/schema'

export async function GET() {
  try {
    const rows = await db.select().from(sendLog).orderBy(desc(sendLog.createdAt)).limit(20)
    return NextResponse.json({ rows })
  } catch {
    return NextResponse.json({ rows: [] })
  }
}
