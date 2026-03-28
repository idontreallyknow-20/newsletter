import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { drafts } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10)
    const [row] = await db.select().from(drafts).where(eq(drafts.id, id))
    if (!row) return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch draft' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10)
    await db.delete(drafts).where(eq(drafts.id, id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 })
  }
}
