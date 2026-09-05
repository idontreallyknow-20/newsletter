'use client'

import { useState } from 'react'
import { isValidEmail } from '@/lib/validate-email'

type Lang = 'en' | 'zh'
type Freq = 'daily' | 'weekly' | 'both'

export default function PublicSubscribeForm({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [language, setLanguage] = useState<Lang>('en')
  const [frequency, setFrequency] = useState<Freq>('daily')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [inputError, setInputError] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setInputError(true); setErrMsg('That email address does not look right.'); setStatus('error'); return
    }
    setInputError(false); setErrMsg(''); setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language, frequency, website: honeypot }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.error === 'Already subscribed' ? 'You are already on the list.' : (data.error || 'Something went wrong.'))
        setStatus('error'); return
      }
      setStatus('done')
    } catch {
      setErrMsg('Something went wrong. Try again.'); setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="done" role="status">
        <strong>You&apos;re in. The next issue lands about 7:00 AM ET.</strong>
        <span>If it is not in your inbox, check spam or promotions once and drag it out.</span>
        <a href="/#issues">Read the archive while you wait</a>
      </div>
    )
  }

  const id = light ? 'sub-email-light' : compact ? 'sub-email-hero' : 'sub-email'

  return (
    <div className={light ? 'on-light' : ''}>
      <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }} />

      {!compact && (
        <div className="prefs" role="group" aria-label="Preferences">
          {([['en', 'English'], ['zh', '中文']] as [Lang, string][]).map(([v, l]) => (
            <button key={v} type="button" className="chip" aria-pressed={language === v} onClick={() => setLanguage(v)}>{l}</button>
          ))}
          <span style={{ width: 8 }} />
          {([['daily', 'Daily'], ['weekly', 'Weekly'], ['both', 'Both']] as [Freq, string][]).map(([v, l]) => (
            <button key={v} type="button" className="chip" aria-pressed={frequency === v} onClick={() => setFrequency(v)}>{l}</button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className={`field${light ? ' field--light' : ''}`} noValidate>
        <label htmlFor={id} style={{ position: 'absolute', left: '-9999px' }}>Email address</label>
        <input
          id={id} type="email" value={email} placeholder="you@email.com" autoComplete="email"
          onChange={e => { setEmail(e.target.value); if (inputError) { setInputError(false); setErrMsg(''); setStatus('idle') } }}
          aria-invalid={inputError ? 'true' : undefined}
          aria-describedby={inputError ? `${id}-error` : undefined}
        />
        <button type="submit" className="btn btn--signal" disabled={status === 'loading'}>
          {status === 'loading' ? 'Joining…' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p id={`${id}-error`} role="alert" className="field-error">{errMsg}</p>}
      <p className="field-note">{compact ? 'Daily, in English. Change it any time from the email.' : 'No spam. One click to leave.'}</p>
    </div>
  )
}
