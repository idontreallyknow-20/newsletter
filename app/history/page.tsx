'use client'

import { useEffect, useState } from 'react'
import type { SentEmail } from '@/lib/schema'

const PAGE_SIZE = 50

export default function HistoryPage() {
  const [emails, setEmails] = useState<SentEmail[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [preview, setPreview] = useState<SentEmail | null>(null)

  useEffect(() => {
    fetch(`/api/history?limit=${PAGE_SIZE}&offset=0`)
      .then(r => r.json())
      .then(data => {
        setEmails(data.emails)
        setTotal(data.total)
        setLoading(false)
      })
  }, [])

  function loadMore() {
    setLoadingMore(true)
    fetch(`/api/history?limit=${PAGE_SIZE}&offset=${emails.length}`)
      .then(r => r.json())
      .then(data => {
        setEmails(prev => [...prev, ...data.emails])
        setTotal(data.total)
        setLoadingMore(false)
      })
  }

  const hasMore = emails.length < total

  async function archiveAll() {
    if (!confirm('Archive every sent issue? They disappear from the site and stay here marked archived. Nothing is deleted.')) return
    const res = await fetch('/api/history/archive-all', { method: 'POST' })
    if (!res.ok) return
    const data = await fetch(`/api/history?limit=${PAGE_SIZE}&offset=0`).then(r => r.json())
    setEmails(data.emails); setTotal(data.total)
  }

  return (
    <div className="p-5 sm:p-8 lg:p-12 max-w-5xl">
      <div className="mb-8 sm:mb-10 animate-fade-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--muted)', opacity: 0.5 }}>Archive</p>
        <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--cream)' }}>History</h2>
        </div>
        {emails.length > 0 && (
          <button onClick={archiveAll} className="self-start px-4 py-2.5 text-xs font-sans tracking-wide" style={{ color: 'var(--red)', border: '1px solid var(--border-accent)' }}>Archive all issues</button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse" style={{ color: 'var(--muted)', opacity: 0.5 }}>Loading…</p>
        </div>
      ) : emails.length === 0 ? (
        <div className="py-16 text-center" style={{ border: '1px solid var(--border)' }}>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.5 }}>No emails sent yet</p>
        </div>
      ) : (
        <div className="animate-fade-up delay-1" style={{ border: '1px solid var(--border)' }}>
          {/* Phones: one card per issue */}
          <ul className="sm:hidden">
            {emails.map((email, i) => (
              <li key={email.id} className="px-4 py-3.5" style={{ borderBottom: i < emails.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--surface)' }}>
                <button onClick={() => setPreview(email)} className="block w-full text-left">
                  <p className="text-sm leading-snug" style={{ color: 'var(--cream)' }}>{email.subject}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-mono text-[10px]" style={{ color: 'var(--muted)' }}>{new Date(email.sentAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="font-mono text-[10px]" style={{ color: 'var(--muted)' }}>{email.recipientCount ?? 0} sent</span>
                    <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 ml-auto" style={{
                      color: email.status === 'sent' ? '#6ee7b7' : email.status === 'partial' ? '#fcd34d' : '#fca5a5',
                      background: email.status === 'sent' ? 'rgba(110,231,183,0.08)' : email.status === 'partial' ? 'rgba(252,211,77,0.08)' : 'rgba(252,165,165,0.08)',
                      border: `1px solid ${email.status === 'sent' ? 'rgba(110,231,183,0.2)' : email.status === 'partial' ? 'rgba(252,211,77,0.2)' : 'rgba(252,165,165,0.2)'}`,
                    }}>{email.status}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <table className="hidden sm:table w-full text-sm font-sans">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left px-4 py-3 font-normal font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.6 }}>Subject</th>
                <th className="text-left px-4 py-3 font-normal font-mono text-[9px] tracking-[0.2em] uppercase hidden md:table-cell" style={{ color: 'var(--muted)', opacity: 0.6 }}>Sent</th>
                <th className="text-left px-4 py-3 font-normal font-mono text-[9px] tracking-[0.2em] uppercase hidden sm:table-cell" style={{ color: 'var(--muted)', opacity: 0.6 }}>Recipients</th>
                <th className="text-left px-4 py-3 font-normal font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.6 }}>Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email, i) => (
                <tr key={email.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: i < emails.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td className="px-4 py-3 max-w-[240px] truncate text-sm" style={{ color: 'var(--cream)' }}>{email.subject}</td>
                  <td className="px-4 py-3 font-mono text-[10px] hidden md:table-cell" style={{ color: 'var(--muted)' }}>{new Date(email.sentAt).toLocaleString('en-CA', { timeZone: 'America/Toronto', dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="px-4 py-3 font-mono text-[10px] hidden sm:table-cell" style={{ color: 'var(--muted)' }}>{email.recipientCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-1" style={{
                      color: email.status === 'sent' ? '#6ee7b7' : email.status === 'partial' ? '#fcd34d' : '#fca5a5',
                      background: email.status === 'sent' ? 'rgba(110,231,183,0.08)' : email.status === 'partial' ? 'rgba(252,211,77,0.08)' : 'rgba(252,165,165,0.08)',
                      border: `1px solid ${email.status === 'sent' ? 'rgba(110,231,183,0.2)' : email.status === 'partial' ? 'rgba(252,211,77,0.2)' : 'rgba(252,165,165,0.2)'}`,
                    }}>
                      {email.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setPreview(email)} className="font-mono text-[9px] tracking-widest uppercase transition-colors" style={{ color: 'var(--muted)', opacity: 0.5 }}>
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="font-mono text-[10px] tracking-[0.2em] uppercase px-5 py-2 transition-colors"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)', opacity: loadingMore ? 0.4 : 0.7 }}
          >
            {loadingMore ? 'Loading…' : `Load more (${total - emails.length} remaining)`}
          </button>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreview(null)} />
          <div className="relative w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[80vh] flex flex-col shadow-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between gap-4 px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold leading-snug" style={{ color: 'var(--cream)' }}>{preview.subject}</h3>
                <p className="font-mono text-[10px] tracking-widest mt-1" style={{ color: 'var(--muted)' }}>{new Date(preview.sentAt).toLocaleString('en-CA', { timeZone: 'America/Toronto', dateStyle: 'medium', timeStyle: 'short' })} · {preview.recipientCount} recipients</p>
              </div>
              <button onClick={() => setPreview(null)} className="font-mono text-[10px] tracking-widest uppercase transition-colors flex-shrink-0 py-1" style={{ color: 'var(--muted)' }}>Close</button>
            </div>
            <div className="flex-1 overflow-hidden">
              {preview.bodyHtml ? (
                <iframe srcDoc={preview.bodyHtml} title="Email preview" className="w-full h-full min-h-[400px]" sandbox="" />
              ) : (
                <div className="p-6 text-sm font-sans" style={{ color: 'var(--muted)' }}>No HTML preview available.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
