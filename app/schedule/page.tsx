'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

type LogRow = { id: number; job: string; issueDate: string | null; status: string; message: string | null; createdAt: string }

const FREQ = [
  { value: 'daily', label: 'Every day', sub: 'Seven mornings a week' },
  { value: 'weekdays', label: 'Weekdays', sub: 'Monday to Friday' },
  { value: 'manual', label: 'Off', sub: 'Only what you send by hand' },
]

export default function SchedulePage() {
  const [frequency, setFrequency] = useState('daily')
  const [autosend, setAutosend] = useState(false)
  const [nextSend, setNextSend] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [log, setLog] = useState<LogRow[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const data = await fetch('/api/schedule').then(r => r.json())
    setFrequency(data.schedule_frequency || 'daily')
    setAutosend(data.autosend_enabled === 'true')
    setNextSend(data.nextSend || '')
    setIssueDate(data.issueDate || '')
    setLog(data.log || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function save(next: { frequency?: string; autosend?: boolean }) {
    setSaving(true)
    const f = next.frequency ?? frequency
    const a = next.autosend ?? autosend
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule_frequency: f, autosend_enabled: a }),
      })
      if (!res.ok) throw new Error('Failed')
      setFrequency(f); setAutosend(a)
      await load()
      toast.success(a ? 'Automatic sending is on' : 'Saved')
    } catch {
      toast.error('Could not save the schedule')
    } finally {
      setSaving(false)
    }
  }

  const label = 'font-mono text-[9px] tracking-[0.2em] uppercase block mb-3'

  return (
    <div className="p-8 lg:p-12 max-w-2xl">
      <div className="mb-10 animate-fade-up">
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--muted)', opacity: 0.5 }}>Automation</p>
        <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--cream)' }}>Schedule</h2>
      </div>

      <div className="px-5 py-4 mb-8 text-xs font-sans leading-relaxed animate-fade-up delay-1" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', color: 'var(--cream)' }}>
        <p className="mb-1"><strong>How a morning works.</strong> About 5:00 AM Toronto the issue is written and a preview lands in your inbox with a Skip link. About 7:00 AM it goes to subscribers unless you skipped it.</p>
        <p style={{ color: 'var(--muted)' }}>Runs on Vercel cron, no computer needed. In winter the clock shifts an hour earlier (cron is UTC). Today&apos;s issue date: {issueDate || '…'}.</p>
      </div>

      {loading ? (
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse py-16 text-center" style={{ color: 'var(--muted)', opacity: 0.5 }}>Loading…</p>
      ) : (
        <div className="animate-fade-up delay-2 space-y-6">
          {/* Kill switch */}
          <div className="p-6 flex items-center justify-between gap-6" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div>
              <p className="font-sans text-sm font-medium" style={{ color: 'var(--cream)' }}>Automatic sending</p>
              <p className="font-sans text-xs mt-1" style={{ color: 'var(--muted)' }}>{nextSend}</p>
            </div>
            <button
              role="switch"
              aria-checked={autosend}
              disabled={saving}
              onClick={() => save({ autosend: !autosend })}
              className="relative flex-shrink-0 w-14 h-8 transition-colors disabled:opacity-40"
              style={{ background: autosend ? 'var(--accent)' : 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <span className="absolute top-1 w-6 h-6 transition-transform" style={{ left: 3, background: autosend ? 'var(--bg)' : 'var(--muted)', transform: autosend ? 'translateX(24px)' : 'translateX(0)' }} />
              <span className="sr-only">Toggle automatic sending</span>
            </button>
          </div>

          {/* Frequency */}
          <div className="p-6" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <label className={label} style={{ color: 'var(--muted)' }}>Which mornings</label>
            <div className="grid grid-cols-3 gap-2">
              {FREQ.map(f => (
                <button
                  key={f.value}
                  disabled={saving}
                  onClick={() => save({ frequency: f.value })}
                  className="px-3 py-3 text-left transition-all duration-150 disabled:opacity-40"
                  style={{
                    background: frequency === f.value ? 'var(--accent-dim)' : 'transparent',
                    color: frequency === f.value ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${frequency === f.value ? 'var(--border-accent)' : 'var(--border)'}`,
                  }}
                >
                  <span className="block font-sans text-xs font-medium">{f.label}</span>
                  <span className="block font-mono text-[9px] mt-1 opacity-70">{f.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Run log */}
      <div className="mt-10 animate-fade-up delay-3">
        <div className="flex items-center gap-4 mb-5">
          <h3 className="font-display text-lg font-bold" style={{ color: 'var(--cream)' }}>Recent runs</h3>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>
        {log.length === 0 ? (
          <p className="font-sans text-xs" style={{ color: 'var(--muted)' }}>Nothing has run yet. The first row appears after tomorrow&apos;s 5 AM job.</p>
        ) : (
          <div style={{ border: '1px solid var(--border)' }}>
            {log.map((r, i) => (
              <div key={r.id} className="px-5 py-3 flex items-start gap-4" style={{ borderBottom: i < log.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--surface)' }}>
                <span className="font-mono text-[9px] tracking-widest uppercase w-16 flex-shrink-0 pt-0.5" style={{ color: r.status === 'error' ? '#f87171' : r.status === 'ok' ? '#6ee7b7' : 'var(--muted)' }}>{r.job} · {r.status}</span>
                <span className="font-sans text-xs flex-1" style={{ color: 'var(--cream)' }}>{r.message}</span>
                <span className="font-mono text-[10px] flex-shrink-0" style={{ color: 'var(--muted)' }}>
                  {new Date(r.createdAt).toLocaleString('en-CA', { timeZone: 'America/Toronto', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
