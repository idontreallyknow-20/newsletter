'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
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
        body: JSON.stringify({ password, remember }),
      })
      if (!res.ok) {
        setError('Incorrect password.')
        return
      }
      const from = searchParams.get('from') || '/dashboard'
      router.push(from)
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-dm)',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--tan)',
          marginBottom: '10px',
        }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
          required
          style={{
            width: '100%',
            padding: '12px 16px',
            fontFamily: 'var(--font-dm)',
            fontSize: '15px',
            background: '#fff',
            border: '1px solid var(--pub-border)',
            color: 'var(--ink)',
            outline: 'none',
            letterSpacing: '0.08em',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--red)')}
          onBlur={e => (e.target.style.borderColor = 'var(--pub-border)')}
        />
      </div>

      {error && (
        <p style={{
          fontFamily: 'var(--font-dm)',
          fontSize: '12px',
          color: 'var(--red)',
          marginBottom: '16px',
          letterSpacing: '0.02em',
        }}>
          {error}
        </p>
      )}

      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={remember}
          onChange={e => setRemember(e.target.checked)}
          style={{ accentColor: 'var(--red)', width: '14px', height: '14px', cursor: 'pointer' }}
        />
        <span style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', color: 'var(--tan)', letterSpacing: '0.03em' }}>
          Remember me for 30 days
        </span>
      </label>

      <button
        type="submit"
        disabled={loading || !password}
        style={{
          width: '100%',
          padding: '13px',
          fontFamily: 'var(--font-dm)',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          background: loading || !password ? 'transparent' : 'var(--ink)',
          color: loading || !password ? 'var(--tan)' : '#f5f0e8',
          border: `1px solid ${loading || !password ? 'var(--pub-border)' : 'var(--ink)'}`,
          cursor: loading || !password ? 'default' : 'pointer',
          transition: 'all 0.15s',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Signing in…' : 'Enter dashboard'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--pub-cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>

        {/* Brand */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{
            fontFamily: 'var(--font-dm)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--red)',
            marginBottom: '12px',
          }}>
            Admin access
          </p>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '36px',
            fontWeight: 900,
            color: 'var(--ink)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: '10px',
          }}>
            Newsletter<br />Dashboard
          </h1>
          <div style={{ width: '32px', height: '2px', background: 'var(--red)' }} />
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--pub-border)',
          padding: '32px',
        }}>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Back link */}
        <p style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/" style={{
            fontFamily: 'var(--font-dm)',
            fontSize: '11px',
            color: 'var(--tan)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            borderBottom: '1px solid transparent',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)'
            ;(e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'var(--pub-border)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--tan)'
            ;(e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent'
          }}
          >
            ← Back to site
          </a>
        </p>

      </div>
    </div>
  )
}
