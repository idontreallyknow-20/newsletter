'use client'

import { useState } from 'react'
import { isValidEmail } from '@/lib/validate-email'

const selectStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm), sans-serif',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  color: 'var(--tan)',
  background: 'transparent',
  border: '1px solid rgba(26,26,26,0.18)',
  borderRadius: '2px',
  padding: '5px 22px 5px 8px',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b6459'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 7px center',
  backgroundSize: '7px',
  transition: 'border-color 0.15s, color 0.15s',
}

export default function HeroSubscribeForm() {
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

  return (
    <div className="hero-subscribe-wrap">
      {status === 'done' ? (
        <div>
          <p style={{
            fontFamily: 'var(--font-dm)', fontSize: '15px', fontWeight: 500,
            color: '#2d7a3a', display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '10px',
          }}>
            <span aria-hidden="true">✓</span>
            <span>You&apos;re in! Check your inbox.</span>
          </p>
          <p style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', color: 'rgba(26,26,26,0.45)', marginBottom: '10px' }}>
            Don&apos;t see it? Check your spam or promotions folder.
          </p>
          <a href="/#issues" style={{
            fontFamily: 'var(--font-dm)', fontSize: '13px',
            color: 'rgba(26,26,26,0.6)', textDecoration: 'underline', textUnderlineOffset: '3px',
          }}>
            Browse the archive while you wait →
          </a>
        </div>
      ) : (
        <>
          {/* Honeypot */}
          <input
            type="text" name="website" value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
            tabIndex={-1} autoComplete="off" aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
          />

          {/* Preferences row */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)' }}>
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

          <form onSubmit={handleSubmit} className="hero-subscribe-form" noValidate>
            <label htmlFor="hero-email" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
              Email address
            </label>
            <input
              id="hero-email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (inputError) { setInputError(false); setErrMsg(''); setStatus('idle') } }}
              placeholder="your@email.com"
              className="hero-subscribe-input"
              autoComplete="email"
              aria-describedby={inputError ? 'hero-email-error' : undefined}
              aria-invalid={inputError ? 'true' : undefined}
              style={{ borderColor: inputError ? '#c0392b' : 'rgba(26,26,26,0.2)' }}
              onFocus={e => (e.target.style.borderColor = inputError ? '#c0392b' : 'rgba(26,26,26,0.5)')}
              onBlur={e => (e.target.style.borderColor = inputError ? '#c0392b' : 'rgba(26,26,26,0.2)')}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="hero-subscribe-btn"
              aria-label={status === 'loading' ? 'Subscribing, please wait' : 'Subscribe to newsletter'}
              style={{ opacity: status === 'loading' ? 0.65 : 1 }}
            >
              {status === 'loading' ? 'Joining…' : 'Subscribe →'}
            </button>
          </form>

          {status === 'error' && (
            <p id="hero-email-error" role="alert" style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', color: '#c0392b', marginTop: '8px' }}>
              {errMsg}
            </p>
          )}

          <p style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', color: 'rgba(26,26,26,0.5)', marginTop: '10px', letterSpacing: '0.01em' }}>
            No spam. Unsubscribe anytime.
          </p>
        </>
      )}

      {status !== 'done' && (
        <a
          href="#issues"
          style={{
            display: 'inline-block', marginTop: '14px',
            fontFamily: 'var(--font-dm)', fontSize: '13px', fontWeight: 400,
            color: 'rgba(26,26,26,0.5)', textDecoration: 'underline',
            textUnderlineOffset: '3px', textDecorationColor: 'rgba(26,26,26,0.25)',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = 'rgba(26,26,26,0.8)')}
          onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = 'rgba(26,26,26,0.5)')}
        >
          Browse issues
        </a>
      )}
    </div>
  )
}
