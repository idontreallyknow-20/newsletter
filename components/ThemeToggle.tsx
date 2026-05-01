'use client'

import { useEffect, useState } from 'react'

type Mode = 'light' | 'dark'

function getInitial(): Mode {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('pub-theme') as Mode | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMode(getInitial())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.dataset.theme = mode
    localStorage.setItem('pub-theme', mode)
  }, [mode, mounted])

  function toggle() { setMode(m => (m === 'dark' ? 'light' : 'dark')) }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="pub-theme-toggle"
    >
      <span aria-hidden="true" style={{ display: 'inline-block', width: 16, height: 16 }}>
        {mounted && mode === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </span>
    </button>
  )
}
