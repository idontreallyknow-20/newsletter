'use client'

import { useState } from 'react'

export default function SubscribePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error === 'Already subscribed' ? "You're already on the list!" : data.error)
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setMessage('Something went wrong. Try again.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {status === 'success' ? (
          <div className="text-center">
            <div className="text-4xl mb-6">✦</div>
            <h1 className="font-display text-3xl font-bold text-cream mb-3">You&apos;re in.</h1>
            <p className="text-muted font-sans text-sm leading-relaxed">
              Thanks for subscribing. You&apos;ll get the next issue straight to your inbox.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-10">
              <p className="text-accent text-xs font-sans uppercase tracking-widest mb-3">Daily Newsletter</p>
              <h1 className="font-display text-4xl font-bold text-cream leading-tight mb-4">
                AI & Economy,<br />curated daily.
              </h1>
              <p className="text-muted font-sans text-sm leading-relaxed">
                The most important developments in artificial intelligence and global markets,
                delivered every morning in plain English.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full bg-surface border border-white/10 rounded-md px-4 py-3 text-cream text-sm font-sans placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-surface border border-white/10 rounded-md px-4 py-3 text-cream text-sm font-sans placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
              />
              {status === 'error' && (
                <p className="text-red-400 text-xs font-sans">{message}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="w-full px-4 py-3 text-sm font-sans bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 rounded-md transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe — it\'s free'}
              </button>
            </form>

            <p className="text-muted text-xs font-sans text-center mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
