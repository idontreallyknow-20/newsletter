'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const nav = [
  { href: '/dashboard', label: 'Dashboard', abbr: '01' },
  { href: '/compose', label: 'Compose', abbr: '02' },
  { href: '/subscribers', label: 'Subscribers', abbr: '03' },
  { href: '/schedule', label: 'Schedule', abbr: '04' },
  { href: '/history', label: 'History', abbr: '05' },
  { href: '/settings', label: 'Settings', abbr: '06' },
]

function NavLinks({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname()
  return (
    <ul className="space-y-0.5">
      {nav.map(item => {
        const active = pathname === item.href
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNav}
              className="group flex items-center gap-4 px-4 py-2.5 text-sm transition-all duration-150 relative"
              style={{
                color: active ? 'var(--accent)' : 'var(--muted)',
                background: active ? 'var(--accent-dim)' : 'transparent',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--muted)' }}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5" style={{ background: 'var(--accent)' }} />
              )}
              <span className="font-mono text-[10px] tracking-widest opacity-40 w-4 flex-shrink-0">{item.abbr}</span>
              <span className="font-sans tracking-wide uppercase text-xs">{item.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-4 px-4 py-2.5 text-sm transition-all duration-150 disabled:opacity-40"
      style={{ color: 'var(--muted)' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
    >
      <span className="font-mono text-[10px] tracking-widest opacity-40 w-4 flex-shrink-0">↩</span>
      <span className="font-sans tracking-wide uppercase text-xs">{loading ? 'Logging out…' : 'Log out'}</span>
    </button>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 z-40" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        {/* Brand */}
        <Link href="/dashboard" className="block px-6 py-7 transition-opacity hover:opacity-80" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-start gap-2.5">
            <div className="w-[2px] h-8 mt-0.5 flex-shrink-0" style={{ background: 'var(--accent)' }} />
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--muted)' }}>AI & Economy</p>
              <h1 className="font-display text-base font-bold leading-tight" style={{ color: 'var(--cream)' }}>Newsletter<br />HQ</h1>
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 py-5 overflow-y-auto">
          <p className="px-6 mb-3 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.35 }}>Navigation</p>
          <NavLinks />
        </nav>

        {/* View public site */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-4 px-4 py-3 text-sm transition-all duration-150"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            <span className="font-mono text-[10px] tracking-widest opacity-40 w-4 flex-shrink-0">↗</span>
            <span className="font-sans tracking-wide uppercase text-xs">View site</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-[2px] h-5" style={{ background: 'var(--accent)' }} />
          <span className="font-display text-sm font-bold" style={{ color: 'var(--cream)' }}>NewsletterHQ</span>
        </Link>
        <button onClick={() => setOpen(o => !o)} className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-56 flex flex-col" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
            <div className="px-6 py-7" style={{ borderBottom: '1px solid var(--border)' }}>
              <h1 className="font-display text-lg font-bold" style={{ color: 'var(--cream)' }}>NewsletterHQ</h1>
            </div>
            <nav className="flex-1 py-5">
              <NavLinks onNav={() => setOpen(false)} />
            </nav>
            <div style={{ borderTop: '1px solid var(--border)' }}>
              <LogoutButton />
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
