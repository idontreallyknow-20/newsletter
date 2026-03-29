import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { count } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100', 10), 500)
    const offset = parseInt(searchParams.get('offset') ?? '0', 10)

    const [rows, [{ total }]] = await Promise.all([
      db.select().from(subscribers).orderBy(subscribers.createdAt).limit(limit).offset(offset),
      db.select({ total: count() }).from(subscribers),
    ])

    return NextResponse.json({ subscribers: rows, total, limit, offset })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email))
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    const [row] = await db.insert(subscribers).values({ name, email, status: 'active' }).returning()
    return NextResponse.json(row, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to add subscriber' }, { status: 500 })
  }
}
