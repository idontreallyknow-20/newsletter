'use client'

import { useState } from 'react'
import { LANGUAGES, FREQUENCIES, type Language, type SubscriberFrequency } from '@/lib/preferences'

function SelectOption({
  selected,
  onClick,
  label,
  sub,
}: {
  selected: boolean
  onClick: () => void
  label: string
  sub: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left transition-all duration-150 relative"
      style={{
        padding: '16px 18px',
        background: selected ? 'var(--surface)' : 'transparent',
        border: `1px solid ${selected ? 'var(--border-accent)' : 'var(--border)'}`,
        cursor: 'pointer',
        width: '100%',
      }}
    >
      {selected && (
        <span className="absolute top-3 right-3 font-mono text-[10px]" style={{ color: 'var(--accent)' }}>✓</span>
      )}
      <p className="font-sans text-sm font-medium mb-1" style={{ color: selected ? 'var(--cream)' : 'var(--muted)' }}>{label}</p>
      <p className="font-mono text-[10px] tracking-wide leading-relaxed" style={{ color: 'var(--muted)', opacity: 0.7 }}>{sub}</p>
    </button>
  )
}

export default function SubscribePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState<Language>('en')
  const [frequency, setFrequency] = useState<SubscriberFrequency>('weekly')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, language, frequency }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error === 'Already subscribed' ? "You're already on the list." : data.error)
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setMessage('Something went wrong. Try again.')
      setStatus('error')
    }
  }

  const freqLabel = frequency === 'both' ? 'Weekly + Daily' : frequency === 'daily' ? 'Daily' : 'Weekly'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
        <div className="text-center max-w-sm animate-fade-up">
          <div className="mb-8">
            <div className="h-px w-16 mx-auto mb-8" style={{ background: 'var(--accent)' }} />
            <h1 className="font-display text-4xl font-bold mb-4" style={{ color: 'var(--cream)' }}>
              You&apos;re in.
            </h1>
            <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
              {frequency === 'daily'
                ? 'Your first daily briefing arrives tomorrow morning.'
                : frequency === 'both'
                ? 'Your weekly deep-dive and daily briefings are on their way.'
                : 'Your first weekly deep-dive lands next issue day.'}
              <br />Check your spam folder if it doesn&apos;t arrive.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase px-2 py-1" style={{ border: '1px solid var(--border-accent)', color: 'var(--accent)' }}>
                {language === 'zh' ? '中文' : 'English'}
              </span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase px-2 py-1" style={{ border: '1px solid var(--border-accent)', color: 'var(--accent)' }}>
                {freqLabel}
              </span>
            </div>
            <div className="h-px w-16 mx-auto mt-8" style={{ background: 'var(--accent)', opacity: 0.3 }} />
          </div>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.4 }}>
            AI & Economy · {language === 'zh' ? '中文版' : 'Daily Briefing'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Masthead */}
      <header className="border-b px-8 py-5" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-px h-6" style={{ background: 'var(--accent)' }} />
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)' }}>Daily Briefing</p>
          </div>
          <p className="font-mono text-[10px] tracking-widest hidden sm:block" style={{ color: 'var(--muted)', opacity: 0.5 }}>{today}</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-16 lg:py-24">

        {/* Publication title */}
        <div className="mb-14 animate-fade-up">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: 'var(--accent)' }}>
            Est. 2026 · Free to Read
          </p>
          <h1 className="font-display text-5xl lg:text-7xl font-bold leading-[0.95] mb-8" style={{ color: 'var(--cream)' }}>
            AI &amp;<br />Economy
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12" style={{ background: 'var(--accent)' }} />
            <p className="font-sans text-sm leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
              The most consequential developments in artificial intelligence and global markets,
              distilled into a clear read. Choose how you want to follow along.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-12 animate-fade-up delay-1" style={{ background: 'var(--border)' }} />

        {/* Subscribe form */}
        <form onSubmit={handleSubmit} className="animate-fade-up delay-1">

          {/* Language */}
          <div className="mb-8">
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--muted)', opacity: 0.6 }}>
              Language
            </p>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map(opt => (
                <SelectOption
                  key={opt.value}
                  selected={language === opt.value}
                  onClick={() => setLanguage(opt.value)}
                  label={opt.label}
                  sub={opt.sub}
                />
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="mb-10">
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--muted)', opacity: 0.6 }}>
              Frequency
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCIES.map(opt => (
                <SelectOption
                  key={opt.value}
                  selected={frequency === opt.value}
                  onClick={() => setFrequency(opt.value)}
                  label={opt.label}
                  sub={opt.sub}
                />
              ))}
            </div>
          </div>

          {/* Name + email */}
          <div className="h-px mb-8" style={{ background: 'var(--border)' }} />

          <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--muted)', opacity: 0.6 }}>
            Your details
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mb-4">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="First name (optional)"
              className="px-4 py-3 text-sm font-sans flex-1"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--cream)',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--border-accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="px-4 py-3 text-sm font-sans flex-1"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--cream)',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--border-accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className="px-7 py-3 text-sm font-sans tracking-wide transition-all duration-150 disabled:opacity-40"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontWeight: 600,
              border: '1px solid var(--accent)',
            }}
          >
            {status === 'loading' ? 'Joining…' : `Subscribe: ${freqLabel} · ${language === 'zh' ? '中文' : 'English'}`}
          </button>

          {status === 'error' && (
            <p className="mt-3 text-sm font-sans" style={{ color: '#fca5a5' }}>{message}</p>
          )}

          <p className="mt-5 font-mono text-[10px] tracking-widest" style={{ color: 'var(--muted)', opacity: 0.5 }}>
            No spam. No tracking. Unsubscribe in one click.
          </p>
        </form>
      </main>

      <footer className="border-t px-8 py-6 mt-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.4 }}>
            AI & Economy · Daily Briefing
          </p>
          <div className="flex items-center gap-5">
            <a href="/" className="font-mono text-[9px] tracking-widest uppercase transition-opacity" style={{ color: 'var(--muted)', opacity: 0.5, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
            >← Back to site</a>
            <span className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--muted)', opacity: 0.3 }}>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
