import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAdminPath } from '@/lib/admin-paths'

// API routes that need no dashboard session. Matched with a path-segment boundary
// so that e.g. '/api/subscribe' does NOT expose '/api/subscribers' (admin-only PII).
const PUBLIC_API_PREFIXES = [
  '/api/login',
  '/api/subscribe',
  '/api/unsubscribe',
  '/api/logout',
  '/api/setup', // performs its own session check
  '/api/preferences',
  '/api/skip', // signed, date-scoped token
  '/api/drafts/queue', // bearer CRON_SECRET, checked in the route
  '/api/cron', // bearer CRON_SECRET, checked in the route
]

// Pages are public unless they belong to the dashboard; API routes are private
// unless listed above.
function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith('/api/') || pathname === '/api') {
    return PUBLIC_API_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
  }
  return !isAdminPath(pathname)
}

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

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Block all access if no password is configured (fail closed)
  const stored = process.env.DASHBOARD_PASSWORD
  if (!stored) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check session cookie against derived token (not the raw password)
  const session = req.cookies.get('nhq_session')
  if (session?.value) {
    const expected = await deriveSessionToken(stored)
    if (hexEqual(session.value, expected)) return NextResponse.next()
  }

  // API routes get a JSON 401; pages redirect to login, preserving destination
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const from = encodeURIComponent(pathname)
  return NextResponse.redirect(new URL(`/login?from=${from}`, req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
