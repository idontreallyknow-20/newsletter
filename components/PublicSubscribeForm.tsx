'use client'

import { useState } from 'react'
import { isValidEmail } from '@/lib/validate-email'

const selectStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm), sans-serif',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  color: 'rgba(255,255,255,0.5)',
  background: '#1a1a1a',
  colorScheme: 'dark' as const,
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '2px',
  padding: '5px 22px 5px 8px',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.4)'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 7px center',
  backgroundSize: '7px',
}

export default function PublicSubscribeForm() {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [language, setLanguage] = useState<'en' | 'zh'>('en')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'both'>('daily')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [inputError, setInputError] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setInputError(true)
      setErrMsg('Please enter a valid email address.')
      setStatus('error')
      return
    }
    setInputError(false)
    setErrMsg('')
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language, frequency, website: honeypot }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.error === 'Already subscribed' ? "You're already on the list." : (data.error || 'Something went wrong.'))
        setStatus('error')
        return
      }
      setStatus('done')
    } catch {
      setErrMsg('Something went wrong. Try again.')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#4ade80', fontSize: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <span aria-hidden="true">✓</span>
          <span>You&apos;re in! Check your inbox.</span>
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '10px' }}>
          Don&apos;t see it? Check your spam or promotions folder.
        </p>
        <a href="/#issues" style={{ color: '#a09890', fontSize: '14px', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Browse the archive while you wait →
        </a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Honeypot */}
      <input
        type="text" name="website" value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
      />

      {/* Preferences row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
          Preferences
        </span>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value as 'en' | 'zh')}
          aria-label="Language"
          style={selectStyle}
        >
          <option value="en">English</option>
          <option value="zh">中文 (Simplified)</option>
        </select>
        <select
          value={frequency}
          onChange={e => setFrequency(e.target.value as 'daily' | 'weekly' | 'both')}
          aria-label="Delivery frequency"
          style={selectStyle}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="both">Daily + Weekly</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex' }} noValidate>
        <label htmlFor="public-email" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
          Email address
        </label>
        <input
          id="public-email"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); if (inputError) { setInputError(false); setErrMsg(''); setStatus('idle') } }}
          placeholder="your@email.com"
          autoComplete="email"
          aria-describedby={inputError ? 'public-email-error' : undefined}
          aria-invalid={inputError ? 'true' : undefined}
          style={{
            flex: 1, padding: '14px 18px',
            background: 'rgba(255,255,255,0.07)',
            border: `1px solid ${inputError ? '#fca5a5' : 'rgba(255,255,255,0.15)'}`,
            borderRight: 'none', color: '#f5f0e8',
            fontFamily: 'var(--font-dm)', fontSize: '15px', outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = inputError ? '#fca5a5' : 'rgba(255,255,255,0.35)')}
          onBlur={e => (e.target.style.borderColor = inputError ? '#fca5a5' : 'rgba(255,255,255,0.15)')}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-label={status === 'loading' ? 'Subscribing, please wait' : 'Subscribe to newsletter'}
          style={{
            padding: '14px 24px', background: 'var(--red)', color: '#f5f0e8',
            fontFamily: 'var(--font-dm)', fontSize: '14px', fontWeight: 500,
            border: '1px solid var(--red)', cursor: 'pointer', whiteSpace: 'nowrap',
            opacity: status === 'loading' ? 0.6 : 1, transition: 'opacity 0.15s',
          }}
        >
          {status === 'loading' ? 'Joining…' : 'Subscribe →'}
        </button>
      </form>

      {status === 'error' && (
        <p id="public-email-error" role="alert" style={{ color: '#fca5a5', fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>
          {errMsg}
        </p>
      )}

      <p style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: '12px', letterSpacing: '0.01em' }}>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  )
}
