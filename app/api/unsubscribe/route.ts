import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { rateLimit } from '@/lib/rate-limit'
import { verifyEmailToken } from '@/lib/token'

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`unsubscribe:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token') ?? ''
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const secret = process.env.EMAIL_TOKEN_SECRET || process.env.DASHBOARD_PASSWORD || ''
    if (!token || !verifyEmailToken(email, token, secret)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
    }

    await db
      .update(subscribers)
      .set({ status: 'unsubscribed' })
      .where(eq(subscribers.email, email))

    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:Georgia,serif;text-align:center;padding:80px;background:#0A0A0A;color:#F5F0E8;">
        <h1 style="font-size:24px;">You've been unsubscribed.</h1>
        <p style="color:#9b9b8f;">You won't receive any more emails from this newsletter.</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch {
    return NextResponse.json({ error: 'Unsubscribe failed' }, { status: 500 })
  }
}
