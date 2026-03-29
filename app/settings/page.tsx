'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const FIELDS = [
  { key: 'newsletter_name', label: 'Newsletter Name', placeholder: "Joseph's Newsletter" },
  { key: 'newsletter_description', label: 'Description', placeholder: 'Daily AI & economy updates' },
  { key: 'from_name', label: 'From Name', placeholder: 'Joseph' },
  { key: 'from_email', label: 'From Email', placeholder: 'newsletter@yourdomain.com', type: 'email' },
  { key: 'owner_email', label: 'Your Email (for test sends)', placeholder: 'you@gmail.com', type: 'email' },
]

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setValues(data)
      setLoading(false)
    })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 lg:p-12 max-w-xl">
      <div className="mb-10 animate-fade-up">
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--muted)', opacity: 0.5 }}>Configure</p>
        <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--cream)' }}>Settings</h2>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse" style={{ color: 'var(--muted)', opacity: 0.5 }}>Loading…</p>
        </div>
      ) : (
        <form onSubmit={save} className="animate-fade-up delay-1 p-6 space-y-5" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
          {FIELDS.map(field => (
            <div key={field.key}>
              <label className="font-mono text-[9px] tracking-[0.2em] uppercase block mb-2" style={{ color: 'var(--muted)' }}>
                {field.label}
              </label>
              <input
                type={field.type || 'text'}
                value={values[field.key] || ''}
                onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-3 py-2.5 text-sm font-sans"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = 'var(--border-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          ))}

          <div className="pt-2 space-y-4">
            <div className="px-4 py-3 text-xs font-sans leading-relaxed" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--cream)', fontWeight: 500 }}>Resend API Key</span>
              <span style={{ color: 'var(--muted)' }}>, set as </span>
              <code className="font-mono" style={{ color: 'var(--accent)' }}>RESEND_API_KEY</code>
              <span style={{ color: 'var(--muted)' }}> in Vercel environment variables. Cannot be stored here.</span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-2.5 text-sm font-sans tracking-wide transition-all duration-150 disabled:opacity-40"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
            >
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
