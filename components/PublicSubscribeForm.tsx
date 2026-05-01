'use client'

import { useState } from 'react'
import { isValidEmail } from '@/lib/validate-email'

type Variant = 'dark' | 'light'

function selectStyleFor(variant: Variant): React.CSSProperties {
  if (variant === 'light') {
    return {
      fontFamily: 'var(--font-dm), sans-serif',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.06em',
      color: 'var(--ink)',
      background: 'var(--pub-cream-2)',
      colorScheme: 'light',
      border: '1px solid var(--pub-border)',
      borderRadius: '2px',
      padding: '5px 22px 5px 8px',
      cursor: 'pointer',
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b6459'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 7px center',
      backgroundSize: '7px',
    }
  }
  return {
    fontFamily: 'var(--font-dm), sans-serif',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.06em',
    color: 'rgba(255,255,255,0.5)',
    background: '#1a1a1a',
    colorScheme: 'dark',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '2px',
    padding: '5px 22px 5px 8px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.4)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 7px center',
    backgroundSize: '7px',
  }
}

type Props = { minimal?: boolean; onLight?: boolean }

export default function PublicSubscribeForm({ minimal = false, onLight = false }: Props = {}) {
  const variant: Variant = onLight ? 'light' : 'dark'
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [language, setLanguage] = useState<'en' | 'zh'>('en')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'both'>('daily')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [inputError, setInputError] = useState(false)

  const palette = variant === 'light'
    ? {
        prefLabel: 'var(--tan)',
        inputBg: '#ffffff',
        inputBorder: 'var(--pub-border)',
        inputBorderFocus: 'var(--pub-border-dark)',
        inputColor: 'var(--ink)',
        helperColor: 'var(--tan)',
        successColor: '#15803d',
        successSub: 'var(--tan)',
        archiveLink: 'var(--red)',
      }
    : {
        prefLabel: 'rgba(255,255,255,0.55)',
        inputBg: 'rgba(255,255,255,0.07)',
        inputBorder: 'rgba(255,255,255,0.22)',
        inputBorderFocus: 'rgba(255,255,255,0.45)',
        inputColor: '#f5f0e8',
        helperColor: 'rgba(255,255,255,0.6)',
        successColor: '#4ade80',
        successSub: 'rgba(255,255,255,0.55)',
        archiveLink: '#c0b6a6',
      }

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
        <p style={{ color: palette.successColor, fontSize: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <span aria-hidden="true">✓</span>
          <span>You&apos;re in! Check your inbox.</span>
        </p>
        <p style={{ color: palette.successSub, fontSize: '12px', marginBottom: '10px' }}>
          Don&apos;t see it? Check your spam or promotions folder.
        </p>
        <a href="/#issues" style={{ color: palette.archiveLink, fontSize: '14px', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
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

      {/* Preferences row — hidden on minimal hero variant; collected post-signup */}
      {!minimal && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: palette.prefLabel }}>
            Preferences
          </span>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as 'en' | 'zh')}
            aria-label="Language"
            style={selectStyleFor(variant)}
          >
            <option value="en">English</option>
            <option value="zh">中文 (Simplified)</option>
          </select>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value as 'daily' | 'weekly' | 'both')}
            aria-label="Delivery frequency"
            style={selectStyleFor(variant)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="both">Daily + Weekly</option>
          </select>
        </div>
      )}

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
            background: palette.inputBg,
            border: `1px solid ${inputError ? '#dc2626' : palette.inputBorder}`,
            borderRight: 'none', color: palette.inputColor,
            fontFamily: 'var(--font-dm)', fontSize: '15px', outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = inputError ? '#dc2626' : palette.inputBorderFocus)}
          onBlur={e => (e.target.style.borderColor = inputError ? '#dc2626' : palette.inputBorder)}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-label={status === 'loading' ? 'Subscribing, please wait' : 'Subscribe to newsletter'}
          className="pub-form-subscribe-btn"
          style={{
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #c8402a 0%, #a8341f 100%)',
            color: '#f5f0e8',
            fontFamily: 'var(--font-dm)', fontSize: '14px', fontWeight: 500,
            border: 'none',
            cursor: 'pointer', whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
            opacity: status === 'loading' ? 0.6 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {status === 'loading' ? 'Joining…' : 'Subscribe →'}
        </button>
      </form>

      {status === 'error' && (
        <p id="public-email-error" role="alert" style={{ color: variant === 'light' ? '#b91c1c' : '#fca5a5', fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>
          {errMsg}
        </p>
      )}

      <p style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', color: palette.helperColor, textAlign: 'center', marginTop: '12px', letterSpacing: '0.01em' }}>
        {minimal ? 'No spam. Pick language & frequency after you sign up.' : 'No spam. Unsubscribe anytime.'}
      </p>
    </div>
  )
}
