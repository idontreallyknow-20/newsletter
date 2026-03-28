import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/subscribe', '/api/subscribe', '/api/unsubscribe', '/_next', '/favicon.ico']

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

  // Check session cookie
  const session = req.cookies.get('nhq_session')
  if (session?.value === process.env.DASHBOARD_PASSWORD) {
    return NextResponse.next()
  }

  // Redirect public visitors to the subscribe page
  return NextResponse.redirect(new URL('/subscribe', req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
