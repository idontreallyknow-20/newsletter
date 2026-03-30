import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { deriveSessionToken } from '@/lib/token'

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

// In-memory rate limiter (resets on cold start — good enough for a single-user admin)
const attempts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const record = attempts.get(ip)

  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (record.count >= 5) return true
  record.count++
  return false
}

function clearAttempts(ip: string) {
  attempts.delete(ip)
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      {
        status: 429,
        headers: { 'Retry-After': '900' },
      }
    )
  }

  const { password, remember } = await req.json()
  const stored = process.env.DASHBOARD_PASSWORD ?? ''

  if (!password || !stored || !safeCompare(password, stored)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  clearAttempts(ip)

  const sessionToken = deriveSessionToken(stored)
  const res = NextResponse.json({ success: true })
  res.cookies.set('nhq_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}), // 30 days if remember, else session cookie
    path: '/',
  })
  return res
}
