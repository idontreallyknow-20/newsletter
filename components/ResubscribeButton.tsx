'use client'

import { useState } from 'react'

export default function ResubscribeButton({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function resubscribe() {
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok || data.error === 'Already subscribed') {
        setStatus('done')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '15px 30px',
        fontFamily: 'var(--font-dm), sans-serif', fontSize: '14px', fontWeight: 500,
        color: 'var(--ink)', border: '2px solid transparent',
      }}>
        ✓ Welcome back — you&apos;re resubscribed.
      </span>
    )
  }

  return (
    <button className="pub-btn-primary" onClick={resubscribe} disabled={status === 'loading'} style={status === 'loading' ? { opacity: 0.6 } : undefined}>
      {status === 'loading' ? 'Resubscribing…' : status === 'error' ? 'Try again' : 'Resubscribe'}
    </button>
  )
}
