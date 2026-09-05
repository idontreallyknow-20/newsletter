'use client'

import { useEffect, useState } from 'react'

type Pref = 'system' | 'light' | 'dark'
const OPTIONS: { value: Pref; label: string }[] = [
  { value: 'system', label: 'Auto' },
  { value: 'light', label: 'Day' },
  { value: 'dark', label: 'Night' },
]

function resolve(pref: Pref): 'light' | 'dark' {
  if (pref === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  return pref
}

/** System (default) / Day / Night. System follows the OS and updates live when it changes. */
export default function ThemeToggle() {
  const [pref, setPref] = useState<Pref>('system')

  useEffect(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem('db-theme') } catch { /* private mode */ }
    const initial: Pref = stored === 'light' || stored === 'dark' ? stored : 'system'
    setPref(initial)
    document.documentElement.setAttribute('data-theme', resolve(initial))
  }, [])

  useEffect(() => {
    if (pref !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => document.documentElement.setAttribute('data-theme', resolve('system'))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [pref])

  function choose(next: Pref) {
    setPref(next)
    document.documentElement.setAttribute('data-theme', resolve(next))
    try { next === 'system' ? localStorage.removeItem('db-theme') : localStorage.setItem('db-theme', next) } catch { /* private mode */ }
  }

  return (
    <div className="theme-seg" role="radiogroup" aria-label="Colour theme">
      {OPTIONS.map(o => (
        <button key={o.value} type="button" role="radio" aria-checked={pref === o.value} className="theme-seg-btn t-mono" onClick={() => choose(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
