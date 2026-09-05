'use client'

import { useState, useEffect } from 'react'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'

const LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#topics', label: 'Topics' },
  { href: '/#issues', label: 'Issues' },
  { href: '/#subscribe', label: 'Subscribe' },
]

export default function PublicNav({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dateline, setDateline] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    setDateline(new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Toronto' }))
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!showModal && !open) { document.body.style.overflow = ''; return }
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setShowModal(false); setOpen(false) } }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [showModal, open])

  return (
    <>
      <header className={`mast${theme === 'light' ? ' mast--light' : ''}${scrolled || open ? ' is-scrolled' : ''}`}>
        <a href="/" className="mast-brand" aria-label="Daily Brief home">
          <span className="mast-word">Daily<i>.</i>Brief</span>
          {dateline && <span className="mast-date">{dateline}</span>}
        </a>
        <nav aria-label="Sections">
          <ul className="mast-links">
            {LINKS.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </nav>
        <div className="mast-right">
          <button className="btn btn--red hide-sm" onClick={() => setShowModal(true)}>Subscribe</button>
          <button className="mast-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="drawer">{open ? 'Close' : 'Menu'}</button>
        </div>
      </header>

      {open && (
        <div className="drawer" id="drawer">
          {LINKS.map(l => <a key={l.href} href={l.href} className="big t-display" onClick={() => setOpen(false)}>{l.label}</a>)}
          <a href="/about" className="big t-display" onClick={() => setOpen(false)}>Joseph</a>
          <div className="drawer-form">
            <p className="eyebrow">Subscribe</p>
            <PublicSubscribeForm />
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true" aria-label="Subscribe to Daily Brief">
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">&#x2715;</button>
            <p className="eyebrow">Subscribe</p>
            <h2 className="t-display">Tomorrow&apos;s issue, in your inbox.</h2>
            <p className="copy" style={{ marginBottom: 24 }}>Pick a language and how often. Unsubscribe with one click, any time.</p>
            <PublicSubscribeForm />
          </div>
        </div>
      )}
    </>
  )
}
