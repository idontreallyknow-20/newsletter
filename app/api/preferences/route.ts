import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const freq = searchParams.get('freq')
  const lang = searchParams.get('lang')

  if (!email) {
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
