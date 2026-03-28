import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings } from '@/lib/schema'

export async function GET() {
  try {
    const rows = await db.select().from(settings)
    const map: Record<string, string> = {}
    for (const row of rows) {
      if (row.value !== null) map[row.key] = row.value
    }
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as Record<string, string>
    for (const [key, value] of Object.entries(body)) {
      await db
        .insert(settings)
        .values({ key, value })
        .onConflictDoUpdate({ target: settings.key, set: { value } })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
