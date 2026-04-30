'use client'

import { useState, type FormEvent } from 'react'
import { isValidEmail } from '@/lib/validate-email'

type Lang = 'en' | 'zh'
type Freq = 'daily' | 'weekly' | 'both'

interface Props {
  showPreferences?: boolean
  /** Pass `true` when rendered on the dark navy modal so input/button colors flip */
  modalVariant?: boolean
}

export default function PublicSubscribeForm({ showPreferences = false, modalVariant = false }: Props) {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [language, setLanguage] = useState<Lang>('en')
  const [frequency, setFrequency] = useState<Freq>('daily')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [inputError, setInputError] = useState(false)

  async function handleSubmit(e: FormEvent) {
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
    <div className={`sub-form${modalVariant ? ' sub-form-modal' : ''}`} style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Honeypot */}
      <input
        type="text" name="website" value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
      />

      {showPreferences && (
        <div className="pref-stack">
          <div className="pref-row" role="group" aria-label="Language">
            <span className="pref-label">Language</span>
            <div className="pref-pills">
              {([
                { v: 'en', label: 'English' },
                { v: 'zh', label: '中文' },
              ] as const).map(opt => (
                <button
                  key={opt.v}
                  type="button"
                  className={`pref-pill${language === opt.v ? ' pref-pill-active' : ''}`}
                  aria-pressed={language === opt.v}
                  onClick={() => setLanguage(opt.v)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pref-row" role="group" aria-label="Delivery frequency">
            <span className="pref-label">Frequency</span>
            <div className="pref-pills">
              {([
                { v: 'daily', label: 'Daily' },
                { v: 'weekly', label: 'Weekly' },
                { v: 'both', label: 'Daily + Weekly' },
              ] as const).map(opt => (
                <button
                  key={opt.v}
                  type="button"
                  className={`pref-pill${frequency === opt.v ? ' pref-pill-active' : ''}`}
                  aria-pressed={frequency === opt.v}
                  onClick={() => setFrequency(opt.v)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="sub-form-row" noValidate>
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
          className={`sub-form-input${inputError ? ' sub-form-input-err' : ''}`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-label={status === 'loading' ? 'Subscribing, please wait' : 'Subscribe to newsletter'}
          className="pub-form-subscribe-btn"
        >
          {status === 'loading' ? 'Joining…' : 'Subscribe →'}
        </button>
      </form>

      {status === 'error' && (
        <p id="public-email-error" role="alert" className="sub-form-err">
          {errMsg}
        </p>
      )}

      <p className="sub-form-foot">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  )
}
