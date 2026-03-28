'use client'

import { useState, useEffect } from 'react'

const HEADLINE = 'Where economics meets the age of AI.'

export default function HeroTypewriter() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(HEADLINE.slice(0, i))
      if (i >= HEADLINE.length) { clearInterval(id); setDone(true) }
    }, 45)
    return () => clearInterval(id)
  }, [])

  const h1Style: React.CSSProperties = {
    fontFamily: 'var(--font-playfair), Georgia, serif',
    fontSize: 'clamp(42px, 7vw, 82px)',
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
    color: 'var(--ink)',
    marginBottom: '28px',
    position: 'relative',
  }

  return (
    <h1 style={h1Style}>
      {/* Invisible full text reserves the exact final layout height from frame 1 */}
      <span style={{ visibility: 'hidden', userSelect: 'none' }} aria-hidden="true">
        {HEADLINE}
      </span>
      {/* Visible typed text sits on top via absolute positioning */}
      <span style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
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
      </span>
    </h1>
  )
}
