'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function apply(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  try { localStorage.setItem('db-theme', t) } catch { /* private mode */ }
}

/** Day edition / night edition. Persists per browser; respects the OS setting on first visit. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as Theme | null
    if (current === 'dark' || current === 'light') setTheme(current)
  }, [])
  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next); apply(next)
  }
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to day edition' : 'Switch to night edition'} title={theme === 'dark' ? 'Day edition' : 'Night edition'}>
      <span className="theme-toggle-track"><span className="theme-toggle-knob" /></span>
      <span className="t-mono">{theme === 'dark' ? 'Night' : 'Day'}</span>
    </button>
  )
}
