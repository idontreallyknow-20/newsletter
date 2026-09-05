'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { PreviewItem } from '@/app/api/preview/route'

function longDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

export default function PreviewPage() {
  const [items, setItems] = useState<PreviewItem[]>([])
  const [today, setToday] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [lang, setLang] = useState<'en' | 'zh'>('en')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/preview')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      setItems(data.items); setToday(data.today); setOwnerEmail(data.ownerEmail || '')
      setSelected(prev => prev && data.items.some((i: PreviewItem) => i.issueDate === prev) ? prev : (data.items[0]?.issueDate ?? null))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  async function act(date: string, action: 'email' | 'skip' | 'unskip' | 'import') {
    if (action === 'skip' && !confirm(`Skip the ${date} send? Nothing goes to subscribers that morning.`)) return
    setBusy(`${date}:${action}`)
    try {
      const res = await fetch('/api/preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date, action }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.success(action === 'email' || action === 'import' ? `Preview sent to ${data.sentTo}` : action === 'skip' ? 'Send skipped' : 'Send restored')
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally { setBusy(null) }
  }

  const current = items.find(i => i.issueDate === selected) || null
  const html = current ? (lang === 'zh' && current.zhHtml ? current.zhHtml : current.html) : ''
  const chip = 'font-mono text-[9px] tracking-widest uppercase px-2 py-0.5'

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-5 sm:p-8 lg:px-12 lg:pt-12 lg:pb-6">
        <div className="mb-6 animate-fade-up">
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--muted)', opacity: 0.5 }}>Tomorrow, today</p>
          <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--cream)' }}>Preview</h2>
          <p className="font-sans text-sm mt-2 max-w-xl" style={{ color: 'var(--muted)' }}>
            Every issue queued for today or later, rendered exactly as subscribers will get it. This is the same thing the preview email shows{ownerEmail ? `, sent to ${ownerEmail}` : ''}. Skip or resend from here any time.
          </p>
        </div>

        {loading ? (
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse py-10" style={{ color: 'var(--muted)', opacity: 0.5 }}>Loading…</p>
        ) : error ? (
          <p className="font-sans text-sm" style={{ color: '#f87171' }}>{error}</p>
        ) : items.length === 0 ? (
          <div className="py-12 text-center" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--muted)', opacity: 0.6 }}>Nothing queued for {today || 'today'} or later</p>
            <p className="font-sans text-xs" style={{ color: 'var(--muted)' }}>The Routine commits tomorrow&apos;s issue overnight. It will show up here the moment it lands on GitHub.</p>
          </div>
        ) : (
          <div className="animate-fade-up delay-1 flex flex-col gap-2">
            {items.map(item => {
              const active = item.issueDate === selected
              return (
                <div key={item.issueDate} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3" style={{ border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`, background: 'var(--surface)' }}>
                  <button onClick={() => setSelected(item.issueDate)} className="flex-1 min-w-0 text-left">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}>
                        {item.issueDate === today ? 'Today' : longDate(item.issueDate)} · {item.issueDate}
                      </span>
                      {item.sent && <span className={chip} style={{ color: '#6ee7b7', border: '1px solid rgba(110,231,183,0.3)' }}>Sent</span>}
                      {item.skipped && <span className={chip} style={{ color: '#fcd34d', border: '1px solid rgba(252,211,77,0.3)' }}>Skipped</span>}
                      {item.source === 'github' && <span className={chip} style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>On GitHub only</span>}
                      {item.hasZh && <span className={chip} style={{ color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>中文</span>}
                    </div>
                    <p className="font-sans text-sm leading-snug" style={{ color: 'var(--cream)' }}>{item.subject}</p>
                    <p className="font-mono text-[10px] mt-1" style={{ color: item.blocker && !item.sent ? '#fcd34d' : 'var(--muted)' }}>
                      {item.sent ? 'Went out to subscribers.' : item.blocker ? item.blocker : `Ready. Preview sent ${item.previewSentAt ? new Date(item.previewSentAt).toLocaleString('en-CA', { timeZone: 'America/Toronto', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}. Sends about 7:00 AM Toronto.`}
                      {' '}· {item.words} words
                    </p>
                  </button>
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    {item.source === 'github' ? (
                      <button disabled={!!busy} onClick={() => act(item.issueDate, 'import')} className="px-3 py-2 text-[11px] font-mono tracking-wide disabled:opacity-40" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>
                        {busy === `${item.issueDate}:import` ? 'Importing…' : 'Import + email preview'}
                      </button>
                    ) : (
                      <>
                        <button disabled={!!busy} onClick={() => act(item.issueDate, 'email')} className="px-3 py-2 text-[11px] font-mono tracking-wide disabled:opacity-40" style={{ color: 'var(--cream)', border: '1px solid var(--border)' }}>
                          {busy === `${item.issueDate}:email` ? 'Sending…' : 'Email me the preview'}
                        </button>
                        {!item.sent && (item.skipped ? (
                          <button disabled={!!busy} onClick={() => act(item.issueDate, 'unskip')} className="px-3 py-2 text-[11px] font-mono tracking-wide disabled:opacity-40" style={{ color: '#6ee7b7', border: '1px solid rgba(110,231,183,0.3)' }}>Restore send</button>
                        ) : (
                          <button disabled={!!busy} onClick={() => act(item.issueDate, 'skip')} className="px-3 py-2 text-[11px] font-mono tracking-wide disabled:opacity-40" style={{ color: 'var(--red)', border: '1px solid var(--border-accent)' }}>Skip this send</button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {current && (
        <div className="flex-1 flex flex-col px-5 sm:px-8 lg:px-12 pb-8">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--muted)' }}>As subscribers will see it</span>
            {current.zhHtml && (
              <div className="flex" style={{ border: '1px solid var(--border)' }}>
                {(['en', 'zh'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} className="px-3 py-1 font-mono text-[10px] tracking-widest uppercase" style={{ color: lang === l ? 'var(--accent)' : 'var(--muted)', background: lang === l ? 'var(--accent-dim)' : 'transparent' }}>{l === 'en' ? 'English' : '中文'}</button>
                ))}
              </div>
            )}
          </div>
          <iframe srcDoc={html} title="Issue preview" sandbox="" className="w-full flex-1" style={{ minHeight: '80vh', border: '1px solid var(--border)', background: '#F4F2ED' }} />
        </div>
      )}
    </div>
  )
}
