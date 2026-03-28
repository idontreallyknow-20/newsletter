'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Incorrect password')
        return
      }
      const from = searchParams.get('from') || '/dashboard'
      router.push(from)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block font-mono text-[9px] tracking-[0.25em] uppercase mb-2"
          style={{ color: 'var(--muted)' }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
          required
          className="w-full px-4 py-3 text-sm font-sans"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--cream)',
            outline: 'none',
            letterSpacing: '0.1em',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--border-accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {error && (
        <p className="font-mono text-[10px] tracking-widest" style={{ color: '#fca5a5' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full py-3 text-sm font-sans tracking-wide transition-all duration-150 disabled:opacity-40"
        style={{
          background: loading || !password ? 'transparent' : 'var(--accent)',
          color: loading || !password ? 'var(--muted)' : 'var(--bg)',
          border: `1px solid ${loading || !password ? 'var(--border)' : 'var(--accent)'}`,
          fontWeight: 600,
        }}
      >
        {loading ? 'Signing in…' : 'Enter'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-xs">

        {/* Brand */}
        <div className="mb-10">
          <div className="flex items-start gap-2.5 mb-6">
            <div className="w-px h-8 mt-0.5" style={{ background: 'var(--accent)' }} />
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--muted)' }}>
                Daily Briefing
              </p>
              <h1 className="font-display text-2xl font-bold leading-tight" style={{ color: 'var(--cream)' }}>
                Newsletter<br />HQ
              </h1>
            </div>
          </div>
          <p className="font-mono text-[10px] tracking-[0.15em]" style={{ color: 'var(--muted)', opacity: 0.5 }}>
            Dashboard access
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
