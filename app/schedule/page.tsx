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
    <div className="p-6 lg:p-10 max-w-2xl">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-cream mb-1">Schedule</h2>
        <p className="text-muted text-sm font-sans">Configure when newsletters are sent automatically.</p>
      </div>

      <div className="bg-amber-950/20 border border-amber-800/20 rounded-lg px-5 py-4 mb-8 text-sm font-sans text-amber-300/80">
        The cron job fires every hour at :00. Changing the hour here takes effect immediately — no redeploy needed.
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted text-sm font-sans">Loading…</div>
      ) : (
        <div className="bg-surface border border-white/10 rounded-lg p-6 space-y-6">
          {/* Frequency */}
          <div>
            <label className="text-muted text-xs font-sans uppercase tracking-widest block mb-3">Frequency</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {['daily', 'weekdays', 'weekly', 'manual'].map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`px-3 py-2 rounded-md text-sm font-sans capitalize border transition-colors ${
                    frequency === f
                      ? 'bg-accent/20 text-accent border-accent/30'
                      : 'text-muted border-white/10 hover:text-cream hover:border-white/20'
                  }`}
                >
                  {f === 'weekdays' ? 'Weekdays' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          {frequency !== 'manual' && (
            <div>
              <label className="text-muted text-xs font-sans uppercase tracking-widest block mb-3">Send Time</label>
              <select
                value={hour}
                onChange={e => setHour(e.target.value)}
                className="w-full bg-surface-2 border border-white/10 rounded-md px-3 py-2 text-cream text-sm font-sans focus:outline-none focus:border-accent/40"
              >
                {HOURS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
            </div>
          )}

          {/* Day picker for weekly */}
          {frequency === 'weekly' && (
            <div>
              <label className="text-muted text-xs font-sans uppercase tracking-widest block mb-3">Day of Week</label>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setDay(String(i))}
                    className={`py-2 rounded-md text-xs font-sans border transition-colors ${
                      day === String(i)
                        ? 'bg-accent/20 text-accent border-accent/30'
                        : 'text-muted border-white/10 hover:text-cream hover:border-white/20'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cron expression */}
          <div>
            <label className="text-muted text-xs font-sans uppercase tracking-widest block mb-2">Cron Expression</label>
            <code className="text-accent text-sm font-mono bg-surface-2 px-3 py-2 rounded-md block">{cronExpr}</code>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full px-4 py-2.5 text-sm font-sans bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 rounded-md transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Schedule'}
          </button>
        </div>
      )}

      {/* Next sends */}
      {nextTimes.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold text-cream mb-4">Next 5 Scheduled Sends</h3>
          <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
            {nextTimes.map((t, i) => (
              <div key={i} className={`px-5 py-3 text-sm font-sans text-muted flex items-center gap-3 ${i < nextTimes.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="text-muted/50 text-xs w-4">{i + 1}</span>
                <span className="text-cream">{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
