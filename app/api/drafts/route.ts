import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { drafts } from '@/lib/schema'

export async function GET() {
  try {
    const rows = await db.select().from(drafts).orderBy(drafts.updatedAt)
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, subject, previewText, bodyMarkdown } = body

    if (id) {
      const { eq } = await import('drizzle-orm')
      const [row] = await db
        .update(drafts)
        .set({ subject, previewText, bodyMarkdown, updatedAt: new Date() })
        .where(eq(drafts.id, id))
        .returning()
      return NextResponse.json(row)
    } else {
      const [row] = await db.insert(drafts).values({ subject, previewText, bodyMarkdown }).returning()
      return NextResponse.json(row, { status: 201 })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}
