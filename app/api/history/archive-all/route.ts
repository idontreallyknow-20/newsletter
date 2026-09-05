import { NextResponse } from 'next/server'
import { ne } from 'drizzle-orm'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'

/** Archive every sent issue. Archived issues stop resolving at /issues/<slug>. */
export async function POST() {
  try {
    const rows = await db.update(sentEmails).set({ status: 'archived' }).where(ne(sentEmails.status, 'archived')).returning({ id: sentEmails.id })
    return NextResponse.json({ success: true, archived: rows.length })
  } catch {
    return NextResponse.json({ error: 'Failed to archive issues' }, { status: 500 })
  }
}
