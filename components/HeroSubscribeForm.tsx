'use client'

import { useState } from 'react'
import { isValidEmail } from '@/lib/validate-email'

export default function HeroSubscribeForm() {
  const [email, setEmail] = useState('')
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
        body: JSON.stringify({ email, language: 'en', frequency: 'weekly' }),
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
        <p style={{
          fontFamily: 'var(--font-dm)', fontSize: '15px', fontWeight: 500,
          color: '#2d7a3a', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span>✓</span><span>You&apos;re in! Check your inbox.</span>
        </p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="hero-subscribe-form">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (inputError) { setInputError(false); setErrMsg(''); setStatus('idle') } }}
              placeholder="your@email.com"
              className="hero-subscribe-input"
              style={{ borderColor: inputError ? '#c0392b' : 'rgba(26,26,26,0.2)' }}
              onFocus={e => (e.target.style.borderColor = inputError ? '#c0392b' : 'rgba(26,26,26,0.5)')}
              onBlur={e => (e.target.style.borderColor = inputError ? '#c0392b' : 'rgba(26,26,26,0.2)')}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="hero-subscribe-btn"
              style={{ opacity: status === 'loading' ? 0.65 : 1 }}
            >
              {status === 'loading' ? 'Joining…' : 'Subscribe →'}
            </button>
          </form>

          {status === 'error' && (
            <p style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', color: '#c0392b', marginTop: '8px' }}>{errMsg}</p>
          )}

          <p style={{
            fontFamily: 'var(--font-dm)', fontSize: '12px',
            color: 'rgba(26,26,26,0.45)', marginTop: '10px', letterSpacing: '0.01em',
          }}>
            No spam. Unsubscribe anytime.
          </p>
        </>
      )}

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
    </div>
  )
}
