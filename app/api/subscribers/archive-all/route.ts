import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'

/** Archive every active subscriber. Archived readers never receive sends and can re-subscribe from the site. */
export async function POST() {
  try {
    const rows = await db.update(subscribers).set({ status: 'archived' }).where(eq(subscribers.status, 'active')).returning({ id: subscribers.id })
    return NextResponse.json({ success: true, archived: rows.length })
  } catch {
    return NextResponse.json({ error: 'Failed to archive subscribers' }, { status: 500 })
  }
}
