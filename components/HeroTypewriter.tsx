'use client'

import { useState, useEffect } from 'react'

const HEADLINE = 'Where economics meets the age of AI.'

export default function HeroTypewriter() {
  // Start with full text — prevents CLS on SSR and for returning visitors
  const [displayed, setDisplayed] = useState(HEADLINE)
  const [done, setDone] = useState(true)

  useEffect(() => {
    // Only animate on first visit — returning visitors see the text instantly
    try {
      if (localStorage.getItem('jtw_seen')) return
      localStorage.setItem('jtw_seen', '1')
    } catch {
      return
    }

    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(HEADLINE.slice(0, i))
      if (i >= HEADLINE.length) { clearInterval(id); setDone(true) }
    }, 45)
    return () => clearInterval(id)
  }, [])

  return (
    <h1 style={{
      fontFamily: 'var(--font-playfair), Georgia, serif',
      fontSize: 'clamp(42px, 7vw, 82px)',
      fontWeight: 900,
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: 'var(--ink)',
      marginBottom: '28px',
    }}>
      {displayed}
      {!done && (
        <span style={{
          display: 'inline-block',
          width: '3px',
          height: '0.8em',
          background: 'var(--red)',
          marginLeft: '4px',
          verticalAlign: 'middle',
          animation: 'cursorBlink 1s step-start infinite',
        }} />
      )}
    </h1>
  )
}
