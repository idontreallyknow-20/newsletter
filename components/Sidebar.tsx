'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◈' },
  { href: '/compose', label: 'Compose', icon: '✦' },
  { href: '/subscribers', label: 'Subscribers', icon: '◉' },
  { href: '/schedule', label: 'Schedule', icon: '◷' },
  { href: '/history', label: 'History', icon: '◎' },
  { href: '/settings', label: 'Settings', icon: '◌' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="px-6 py-8 border-b border-white/10">
        <h1 className="font-display text-xl font-bold text-cream tracking-tight">NewsletterHQ</h1>
        <p className="text-muted text-xs mt-1 font-sans">by Joseph</p>
      </div>
      <ul className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-sans transition-all duration-150 ${
                  active
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-muted hover:text-cream hover:bg-white/5'
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-muted text-xs font-sans">AI & Economy Updates</p>
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-surface border-r border-white/10 z-40">
        {nav}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-surface border-b border-white/10">
        <h1 className="font-display text-lg font-bold text-cream">NewsletterHQ</h1>
        <button
          onClick={() => setOpen(o => !o)}
          className="text-muted hover:text-cream transition-colors p-1"
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-60 bg-surface border-r border-white/10 h-full">
            {nav}
          </aside>
        </div>
      )}
    </>
  )
}
