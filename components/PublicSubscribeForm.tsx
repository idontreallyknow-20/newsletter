'use client'

import { useState } from 'react'

type Language = 'en' | 'zh'
type Frequency = 'weekly' | 'daily'

const LANGUAGES: { value: Language; label: string; sub: string }[] = [
  { value: 'en', label: 'English', sub: 'English' },
  { value: 'zh', label: '中文', sub: 'Simplified Chinese' },
]

const FREQUENCIES: { value: Frequency; label: string; sub: string }[] = [
  { value: 'weekly', label: 'Weekly deep-dive', sub: 'One long-form article per week' },
  { value: 'daily', label: 'Daily updates', sub: 'AI & economy briefing every day' },
]

export default function PublicSubscribeForm() {
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState<Language>('en')
  const [frequency, setFrequency] = useState<Frequency>('weekly')
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
        body: JSON.stringify({ email, language, frequency }),
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
        <p style={{ color: '#4ade80', fontSize: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <span>✓</span>
          <span>You&apos;re in! Check your inbox.</span>
        </p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontFamily: 'var(--font-dm)' }}>
          {frequency === 'weekly' ? 'Weekly' : 'Daily'} · {language === 'zh' ? '中文' : 'English'}
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Preference selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {/* Language */}
        {LANGUAGES.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLanguage(opt.value)}
            style={{
              padding: '12px 14px',
              background: language === opt.value ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${language === opt.value ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
              color: language === opt.value ? '#f5f0e8' : 'rgba(245,240,232,0.45)',
              fontFamily: 'var(--font-dm)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              position: 'relative',
            }}
          >
            {language === opt.value && (
              <span style={{ position: 'absolute', top: '8px', right: '10px', fontSize: '10px', color: '#4ade80' }}>✓</span>
            )}
            <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{opt.label}</div>
            <div style={{ fontSize: '11px', opacity: 0.6, letterSpacing: '0.03em' }}>{opt.sub}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
        {/* Frequency */}
        {FREQUENCIES.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFrequency(opt.value)}
            style={{
              padding: '12px 14px',
              background: frequency === opt.value ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${frequency === opt.value ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
              color: frequency === opt.value ? '#f5f0e8' : 'rgba(245,240,232,0.45)',
              fontFamily: 'var(--font-dm)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              position: 'relative',
            }}
          >
            {frequency === opt.value && (
              <span style={{ position: 'absolute', top: '8px', right: '10px', fontSize: '10px', color: '#4ade80' }}>✓</span>
            )}
            <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{opt.label}</div>
            <div style={{ fontSize: '11px', opacity: 0.6, letterSpacing: '0.03em', lineHeight: 1.4 }}>{opt.sub}</div>
          </button>
        ))}
      </div>

      {/* Email + submit */}
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
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
            transition: 'opacity 0.15s',
          }}
        >
          {status === 'loading' ? 'Joining…' : 'Subscribe →'}
        </button>
      </form>

      {status === 'error' && (
        <p style={{ color: '#fca5a5', fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>{errMsg}</p>
      )}
    </div>
  )
}
