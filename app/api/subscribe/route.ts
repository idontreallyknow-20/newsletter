import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`subscribe:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { name, email, language, frequency } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const lang = language === 'zh' ? 'zh' : 'en'
    const freq = frequency === 'daily' ? 'daily' : 'weekly'

    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email))
    if (existing.length > 0) {
      if (existing[0].status === 'unsubscribed') {
        await db.update(subscribers).set({ status: 'active', language: lang, frequency: freq }).where(eq(subscribers.email, email))
        return NextResponse.json({ success: true, resubscribed: true })
      }
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
    }

    await db.insert(subscribers).values({ name, email, status: 'active', language: lang, frequency: freq })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
