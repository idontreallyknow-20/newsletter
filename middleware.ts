import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Exact public paths (no auth needed)
const PUBLIC_EXACT = [
  '/',
  '/about',
  '/feed.xml',
  '/favicon.ico',
  '/icon.svg',
  '/robots.txt',
  '/sitemap.xml',
  '/opengraph-image',
  '/apple-icon',
  '/manifest.webmanifest',
  '/privacy',
  '/terms',
]

// Public path prefixes. Matched with a path-segment boundary so that e.g.
// '/api/subscribe' does NOT expose '/api/subscribers' (admin-only PII).
const PUBLIC_PREFIXES = [
  '/login',
  '/subscribe',
  '/preferences',
  '/issues',
  '/unsubscribed',
  '/api/login',
  '/api/subscribe',
  '/api/unsubscribe',
  '/api/logout',
  '/api/setup', // performs its own session check
  '/api/preferences',
  '/api/skip', // signed, date-scoped token
  '/api/drafts/queue', // bearer CRON_SECRET, checked in the route
  '/_next',
  '/_vercel', // Vercel Web Analytics beacon
]

// Dashboard pages. These, plus everything under /api/, require the session cookie.
const ADMIN_PREFIXES = ['/dashboard', '/preview', '/compose', '/subscribers', '/schedule', '/history', '/settings']

// Files served from /public (images, fonts, text). Never gate these behind login.
const STATIC_FILE = /\.(jpe?g|png|webp|gif|svg|ico|avif|mp3|mp4|pdf|txt|xml|json|woff2?)$/i

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true
  if (STATIC_FILE.test(pathname)) return true
  return PUBLIC_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
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

  // Force HTTPS. Vercel already redirects, but this keeps the guarantee when the
  // app runs anywhere else (and HSTS in next.config.mjs pins it afterwards).
  // Skipped for localhost so `next start` on a laptop still works over plain http.
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? ''
  const hostname = host.replace(/:\d+$/, '')
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
  if (process.env.NODE_ENV === 'production' && !isLocal && req.headers.get('x-forwarded-proto') === 'http') {
    return NextResponse.redirect(`https://${host}${pathname}${req.nextUrl.search}`, 308)
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Allow cron routes (secured by CRON_SECRET header, not cookie)
  if (pathname === '/api/cron' || pathname.startsWith('/api/cron/')) {
    return NextResponse.next()
  }

  // Anything that is neither public nor an admin page or API is a typo or a dead
  // link. Let Next render the custom 404 instead of bouncing visitors to /login.
  const isGated = pathname.startsWith('/api/') || ADMIN_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (!isGated) return NextResponse.next()

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
