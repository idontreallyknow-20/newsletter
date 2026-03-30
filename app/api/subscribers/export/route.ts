import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'

function csvSafe(val: string): string {
  const s = val.replace(/"/g, '""')
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s
}

export async function GET() {
  try {
    const rows = await db.select().from(subscribers).orderBy(subscribers.createdAt)
    const csv = [
      'id,name,email,status,created_at',
      ...rows.map(r => `${r.id},"${csvSafe(r.name || '')}","${csvSafe(r.email)}","${r.status}","${r.createdAt.toISOString()}"`)
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="subscribers.csv"',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
