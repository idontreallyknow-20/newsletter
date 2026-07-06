import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { rateLimit } from '@/lib/rate-limit'
import { verifyEmailToken } from '@/lib/token'
import { normalizeEmail } from '@/lib/validate-email'

async function handleUnsubscribe(req: Request): Promise<{ ok: boolean; status?: number; error?: string }> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`unsubscribe:${ip}`, 10, 60_000)) {
    return { ok: false, status: 429, error: 'Too many requests' }
  }

  const { searchParams } = new URL(req.url)
  const email = normalizeEmail(searchParams.get('email'))
  const token = searchParams.get('token') ?? ''
  if (!email) return { ok: false, status: 400, error: 'Email required' }

  const secret = process.env.EMAIL_TOKEN_SECRET || process.env.DASHBOARD_PASSWORD || ''
  if (!token || !verifyEmailToken(email, token, secret)) {
    return { ok: false, status: 403, error: 'Invalid token' }
  }

  await db
    .update(subscribers)
    .set({ status: 'unsubscribed' })
    .where(eq(subscribers.email, email))

  return { ok: true }
}

export async function GET(req: Request) {
  try {
    const result = await handleUnsubscribe(req)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }
    // Show the branded confirmation page (with one-click resubscribe)
    const { searchParams } = new URL(req.url)
    const email = normalizeEmail(searchParams.get('email'))
    return NextResponse.redirect(new URL(`/unsubscribed?email=${encodeURIComponent(email)}`, req.url))
  } catch {
    return NextResponse.json({ error: 'Unsubscribe failed' }, { status: 500 })
  }
}

// RFC 8058 one-click unsubscribe: mail clients POST to the List-Unsubscribe
// URL with no user interaction, so this must succeed silently.
export async function POST(req: Request) {
  try {
    const result = await handleUnsubscribe(req)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unsubscribe failed' }, { status: 500 })
  }
}
