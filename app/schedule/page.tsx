'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12
  const ampm = i < 12 ? 'AM' : 'PM'
  return { value: String(i), label: `${h}:00 ${ampm} UTC` }
})

export default function SchedulePage() {
  const [frequency, setFrequency] = useState('daily')
  const [hour, setHour] = useState('8')
  const [day, setDay] = useState('1')
  const [nextTimes, setNextTimes] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/schedule').then(r => r.json()).then(data => {
      setFrequency(data.schedule_frequency || 'daily')
      setHour(data.schedule_time_hour || '8')
      setDay(data.schedule_day || '1')
      setNextTimes((data.nextTimes || []).map((t: string) => new Date(t).toLocaleString()))
      setLoading(false)
    })
  }, [])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule_frequency: frequency, schedule_time_hour: hour, schedule_day: day }),
      })
      if (!res.ok) throw new Error('Failed')
      // Refresh next times
      const updated = await fetch('/api/schedule').then(r => r.json())
      setNextTimes((updated.nextTimes || []).map((t: string) => new Date(t).toLocaleString()))
      toast.success('Schedule saved')
    } catch {
      toast.error('Failed to save schedule')
    } finally {
      setSaving(false)
    }
  }

  const cronExpr = frequency === 'manual' ? 'disabled' : `0 ${hour} * * ${
    frequency === 'weekly' ? day : frequency === 'weekdays' ? '1-5' : '*'
  }`

  return (
    <div className="p-8 lg:p-12 max-w-2xl">
      <div className="mb-10 animate-fade-up">
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--muted)', opacity: 0.5 }}>Configure</p>
        <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--cream)' }}>Schedule</h2>
      </div>

      <div className="px-5 py-4 mb-8 text-xs font-sans animate-fade-up delay-1" style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.2)', color: 'rgba(200,169,110,0.8)' }}>
        The cron job fires daily at 8:00 UTC (Hobby plan). Changing frequency/hour here updates what the cron handler checks — no redeploy needed.
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse" style={{ color: 'var(--muted)', opacity: 0.5 }}>Loading…</p>
        </div>
      ) : (
        <div className="animate-fade-up delay-2 p-6 space-y-6" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
          {/* Frequency */}
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase block mb-3" style={{ color: 'var(--muted)' }}>Frequency</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {['daily', 'weekdays', 'weekly', 'manual'].map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className="px-3 py-2 text-xs font-sans capitalize transition-all duration-150"
                  style={{
                    background: frequency === f ? 'var(--accent-dim)' : 'transparent',
                    color: frequency === f ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${frequency === f ? 'var(--border-accent)' : 'var(--border)'}`,
                  }}
                >
                  {f === 'weekdays' ? 'Weekdays' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          {frequency !== 'manual' && (
            <div>
              <label className="font-mono text-[9px] tracking-[0.2em] uppercase block mb-3" style={{ color: 'var(--muted)' }}>Send Time</label>
              <select
                value={hour}
                onChange={e => setHour(e.target.value)}
                className="w-full px-3 py-2.5 text-sm font-sans"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', outline: 'none' }}
              >
                {HOURS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
            </div>
          )}

          {/* Day picker for weekly */}
          {frequency === 'weekly' && (
            <div>
              <label className="font-mono text-[9px] tracking-[0.2em] uppercase block mb-3" style={{ color: 'var(--muted)' }}>Day of Week</label>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setDay(String(i))}
                    className="py-2 text-xs font-sans transition-all duration-150"
                    style={{
                      background: day === String(i) ? 'var(--accent-dim)' : 'transparent',
                      color: day === String(i) ? 'var(--accent)' : 'var(--muted)',
                      border: `1px solid ${day === String(i) ? 'var(--border-accent)' : 'var(--border)'}`,
                    }}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cron expression */}
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase block mb-2" style={{ color: 'var(--muted)' }}>Cron Expression</label>
            <code className="text-sm font-mono px-3 py-2.5 block" style={{ background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--border)' }}>{cronExpr}</code>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full px-4 py-2.5 text-sm font-sans tracking-wide transition-all duration-150 disabled:opacity-40"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
          >
            {saving ? 'Saving…' : 'Save Schedule'}
          </button>
        </div>
      )}

      {/* Next sends */}
      {nextTimes.length > 0 && (
        <div className="mt-8 animate-fade-up delay-3">
          <div className="flex items-center gap-4 mb-5">
            <h3 className="font-display text-lg font-bold" style={{ color: 'var(--cream)' }}>Upcoming Sends</h3>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>
          <div style={{ border: '1px solid var(--border)' }}>
            {nextTimes.map((t, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4" style={{ borderBottom: i < nextTimes.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span className="font-mono text-[10px] w-4 flex-shrink-0" style={{ color: 'var(--muted)', opacity: 0.4 }}>{i + 1}</span>
                <span className="font-mono text-[11px]" style={{ color: 'var(--cream)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
