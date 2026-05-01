import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that start with these prefixes are public (no auth needed)
const PUBLIC_PREFIXES = ['/login', '/subscribe', '/preferences', '/issues', '/topics', '/feed.xml', '/sitemap.xml', '/robots.txt', '/opengraph-image', '/api/login', '/api/subscribe', '/api/unsubscribe', '/api/logout', '/api/setup', '/api/preferences', '/_next', '/favicon.ico']

// Derive a session token from the admin password using Web Crypto (Edge-compatible).
// The cookie stores this derived token — never the raw password.
async function deriveSessionToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('nhq_session_v1'))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Constant-time hex string comparison
function hexEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow homepage exactly
  if (pathname === '/') return NextResponse.next()

  // Allow public path prefixes
  if (PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow cron routes (secured by CRON_SECRET header, not cookie)
  if (pathname.startsWith('/api/cron/')) {
    return NextResponse.next()
  }

  // Allow preferences (used in email links)
  if (pathname.startsWith('/api/preferences')) {
    return NextResponse.next()
  }

  // Block all access if no password is configured (fail closed)
  const stored = process.env.DASHBOARD_PASSWORD
  if (!stored) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check session cookie against derived token (not the raw password)
  const session = req.cookies.get('nhq_session')
  if (session?.value) {
    const expected = await deriveSessionToken(stored)
    if (hexEqual(session.value, expected)) return NextResponse.next()
  }

  // Redirect unauthenticated requests to login, preserving destination
  const from = encodeURIComponent(pathname)
  return NextResponse.redirect(new URL(`/login?from=${from}`, req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|webp|svg|ico|mp3|mp4|webm|wav|ogg|pdf|woff|woff2|ttf|eot|txt|xml)).*)'],
}
