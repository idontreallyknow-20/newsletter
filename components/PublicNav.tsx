'use client'

import { useState, useEffect } from 'react'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import ThemeToggle from '@/components/ThemeToggle'

export default function PublicNav() {
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
      setShowTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowModal(false) }
      window.addEventListener('keydown', onKey)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKey)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [showModal])

  function close() { setOpen(false) }

  return (
    <>
      {/* Sticky top nav — logo, in-page links, subscribe */}
      <nav className="pub-nav" style={scrolled ? { boxShadow: '0 2px 16px rgba(0,0,0,0.06)' } : {}}>
        <div className="pub-nav-left">
          <a href="/" className="pub-logo">Joseph<span>.</span></a>
          <ul className="pub-nav-links" role="list">
            <li><a href="/#about">About</a></li>
            <li><a href="/#topics">Topics</a></li>
            <li><a href="/#issues">Issues</a></li>
          </ul>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
          <button className="pub-nav-subscribe" onClick={() => setShowModal(true)}>
            Subscribe free →
          </button>
          <button className="pub-nav-toggle" onClick={() => setOpen(o => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[99] pub-drawer">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--pub-border)', height: '62px' }}>
            <a href="/" className="pub-logo" onClick={close}>Joseph<span>.</span></a>
            <button onClick={close} className="pub-nav-toggle" style={{ display: 'block' }}>Close</button>
          </div>
          <nav className="px-6 pt-10 flex flex-col gap-2">
            {[
              { href: '/#about', label: 'About' },
              { href: '/#topics', label: 'Topics' },
              { href: '/#issues', label: 'Issues' },
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
              <button onClick={() => { close(); setShowModal(true) }} className="pub-btn-primary">
                Subscribe free →
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Subscribe modal */}
      {showModal && (
        <div
          className="sub-modal-overlay"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Subscribe to newsletter"
        >
          <div className="sub-modal-card" onClick={e => e.stopPropagation()}>
            <button className="sub-modal-close" onClick={() => setShowModal(false)} aria-label="Close">
              &#x2715;
            </button>
            <p className="pub-label" style={{ marginBottom: '12px' }}>Newsletter</p>
            <h2 className="sub-modal-heading">Subscribe to AI &amp; Economy</h2>
            <p className="sub-modal-sub">Free daily or weekly delivery. No spam, ever.</p>
            <PublicSubscribeForm />
          </div>
        </div>
      )}

      {/* Scroll to top */}
      <button
        className={`scroll-to-top${showTop ? ' scroll-to-top-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        &#8593;
      </button>
    </>
  )
}
