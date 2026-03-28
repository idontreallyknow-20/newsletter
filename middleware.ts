import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/subscribe', '/issues', '/api/subscribe', '/api/unsubscribe', '/api/logout', '/api/setup', '/_next', '/favicon.ico']

// Constant-time string comparison for Edge runtime (no Node crypto available)
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow cron (secured by CRON_SECRET header, not cookie)
  if (pathname === '/api/cron/send') {
    return NextResponse.next()
  }

  // Block all access if no password is configured (fail closed)
  const stored = process.env.DASHBOARD_PASSWORD
  if (!stored) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check session cookie
  const session = req.cookies.get('nhq_session')
  if (session?.value && safeEqual(session.value, stored)) {
    return NextResponse.next()
  }

  // Redirect unauthenticated requests to login, preserving destination
  const from = encodeURIComponent(pathname)
  return NextResponse.redirect(new URL(`/login?from=${from}`, req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
