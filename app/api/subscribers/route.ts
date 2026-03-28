import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const rows = await db.select().from(subscribers).orderBy(subscribers.createdAt)
    return NextResponse.json(rows)
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
