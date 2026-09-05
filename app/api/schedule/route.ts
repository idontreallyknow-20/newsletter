export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { settings, sendLog } from '@/lib/schema'
import { nextSendLabel, normalizeFrequency, getIssueDate } from '@/lib/schedule'

const SCHEDULE_KEYS = ['schedule_frequency', 'autosend_enabled'] as const

export async function GET() {
  try {
    const [rows, log] = await Promise.all([
      db.select().from(settings),
      db.select().from(sendLog).orderBy(desc(sendLog.createdAt)).limit(10).catch(() => []),
    ])
    const map: Record<string, string> = {}
    for (const row of rows) if (row.value !== null) map[row.key] = row.value

    const current = {
      schedule_frequency: normalizeFrequency(map.schedule_frequency),
      autosend_enabled: map.autosend_enabled === 'true' ? 'true' : 'false',
    }
    return NextResponse.json({
      ...current,
      nextSend: nextSendLabel(current),
      issueDate: getIssueDate(),
      log,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    for (const key of SCHEDULE_KEYS) {
      if (body[key] === undefined) continue
      const value = key === 'schedule_frequency' ? normalizeFrequency(String(body[key])) : (body[key] === true || body[key] === 'true' ? 'true' : 'false')
      await db.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 })
  }
}
