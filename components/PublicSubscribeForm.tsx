'use client'

import { useState } from 'react'

export default function PublicSubscribeForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
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
      <p style={{ color: '#4ade80', fontSize: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>✓</span>
        <span>You&apos;re in! Check your inbox for a confirmation.</span>
      </p>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', maxWidth: '480px', margin: '0 auto 12px' }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          style={{
            flex: 1,
            padding: '14px 18px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRight: 'none',
            color: '#f5f0e8',
            fontFamily: 'var(--font-dm)',
            fontSize: '15px',
            outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.35)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            padding: '14px 24px',
            background: 'var(--red)',
            color: '#f5f0e8',
            fontFamily: 'var(--font-dm)',
            fontSize: '14px',
            fontWeight: 500,
            border: '1px solid var(--red)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            opacity: status === 'loading' ? 0.6 : 1,
          }}
        >
          {status === 'loading' ? 'Joining…' : 'Subscribe →'}
        </button>
      </form>
      {status === 'error' && (
        <p style={{ color: '#fca5a5', fontSize: '13px', textAlign: 'center' }}>{errMsg}</p>
      )}
    </>
  )
}
