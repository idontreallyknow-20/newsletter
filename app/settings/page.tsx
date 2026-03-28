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
    <div className="p-6 lg:p-10 max-w-xl">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-cream mb-1">Settings</h2>
        <p className="text-muted text-sm font-sans">Configure your newsletter identity.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted text-sm font-sans">Loading…</div>
      ) : (
        <form onSubmit={save} className="bg-surface border border-white/10 rounded-lg p-6 space-y-5">
          {FIELDS.map(field => (
            <div key={field.key}>
              <label className="text-muted text-xs font-sans uppercase tracking-widest block mb-1.5">
                {field.label}
              </label>
              <input
                type={field.type || 'text'}
                value={values[field.key] || ''}
                onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full bg-surface-2 border border-white/10 rounded-md px-3 py-2.5 text-cream text-sm font-sans placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
          ))}

          <div className="pt-2">
            <div className="bg-surface-2 border border-white/10 rounded-lg px-4 py-3 mb-5">
              <p className="text-muted text-xs font-sans leading-relaxed">
                <span className="text-cream font-medium">Resend API Key</span> — Set this in your Vercel dashboard under Environment Variables as{' '}
                <code className="text-accent font-mono">RESEND_API_KEY</code>. It&apos;s a secret and cannot be stored here.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-2.5 text-sm font-sans bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 rounded-md transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
