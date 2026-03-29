import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { verifyEmailToken } from '@/lib/token'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`preferences:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const token = searchParams.get('token') ?? ''
  const freq = searchParams.get('freq')
  const lang = searchParams.get('lang')

  if (!email) {
    return NextResponse.redirect(new URL('/preferences?error=1', req.url))
  }

  const secret = process.env.DASHBOARD_PASSWORD ?? ''
  if (!token || !verifyEmailToken(email, token, secret)) {
    return NextResponse.redirect(new URL('/preferences?error=1', req.url))
  }

  const updates: Record<string, string> = {}
  if (freq === 'daily' || freq === 'weekly' || freq === 'both') updates.frequency = freq
  if (lang === 'en' || lang === 'zh') updates.language = lang

  if (Object.keys(updates).length === 0) {
    return NextResponse.redirect(new URL('/preferences?error=1', req.url))
  }

  try {
    await db.update(subscribers).set(updates).where(eq(subscribers.email, email))
    const params = new URLSearchParams({ updated: '1', ...(freq ? { freq } : {}), ...(lang ? { lang } : {}) })
    return NextResponse.redirect(new URL(`/preferences?${params}`, req.url))
  } catch {
    return NextResponse.redirect(new URL('/preferences?error=1', req.url))
  }
}
