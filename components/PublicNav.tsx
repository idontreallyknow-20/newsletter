'use client'

import { useState, useEffect } from 'react'

export default function PublicNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function close() { setOpen(false) }

  return (
    <>
      <nav className="pub-nav" style={scrolled ? { boxShadow: '0 2px 16px rgba(0,0,0,0.06)' } : {}}>
        <a href="/" className="pub-logo">Joseph<span>.</span></a>
        <ul className="pub-nav-links">
          <li><a href="/#about" onClick={close}>About</a></li>
          <li><a href="/#topics" onClick={close}>Topics</a></li>
          <li><a href="/#issues" onClick={close}>Issues</a></li>
        </ul>
        <a href="/#subscribe" className="pub-nav-subscribe">Subscribe free →</a>
        <button className="pub-nav-toggle" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[99]" style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--pub-border)', height: '62px' }}>
            <a href="/" className="pub-logo" onClick={close}>Joseph<span>.</span></a>
            <button onClick={close} className="pub-nav-toggle" style={{ display: 'block' }}>Close</button>
          </div>
          <nav className="px-6 pt-10 flex flex-col gap-2">
            {[
              { href: '/#about', label: 'About' },
              { href: '/#topics', label: 'Topics' },
              { href: '/#issues', label: 'Issues' },
              { href: '/#subscribe', label: 'Subscribe' },
            ].map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', textDecoration: 'none', lineHeight: 1.4 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-8">
              <a href="/#subscribe" onClick={close} className="pub-btn-primary" style={{ display: 'inline-block' }}>
                Subscribe free →
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
