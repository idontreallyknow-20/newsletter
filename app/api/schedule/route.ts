import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings } from '@/lib/schema'
import { getNextSendTimes } from '@/lib/schedule'

const SCHEDULE_KEYS = ['schedule_frequency', 'schedule_time_hour', 'schedule_day']

export async function GET() {
  try {
    const rows = await db.select().from(settings)
    const map: Record<string, string> = {}
    for (const row of rows) {
      if (row.value !== null) map[row.key] = row.value
    }

    const scheduleSettings = {
      schedule_frequency: (map.schedule_frequency || 'manual') as 'daily' | 'weekdays' | 'weekly' | 'manual',
      schedule_time_hour: map.schedule_time_hour || '8',
      schedule_day: map.schedule_day || '1',
    }

    const nextTimes = getNextSendTimes(scheduleSettings)
    return NextResponse.json({ ...scheduleSettings, nextTimes })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    for (const key of SCHEDULE_KEYS) {
      if (body[key] !== undefined) {
        await db
          .insert(settings)
          .values({ key, value: String(body[key]) })
          .onConflictDoUpdate({ target: settings.key, set: { value: String(body[key]) } })
      }
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 })
  }
}
