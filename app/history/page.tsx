'use client'

import { useEffect, useState } from 'react'
import type { SentEmail } from '@/lib/schema'

export default function HistoryPage() {
  const [emails, setEmails] = useState<SentEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<SentEmail | null>(null)

  useEffect(() => {
    fetch('/api/history').then(r => r.json()).then(data => {
      setEmails(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-cream mb-1">History</h2>
        <p className="text-muted text-sm font-sans">All sent emails.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted text-sm font-sans">Loading…</div>
      ) : emails.length === 0 ? (
        <div className="bg-surface border border-white/10 rounded-lg p-10 text-center">
          <p className="text-muted text-sm font-sans">No emails sent yet.</p>
        </div>
      ) : (
        <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Subject</th>
                <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Sent</th>
                <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Recipients</th>
                <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email, i) => (
                <tr key={email.id} className={i < emails.length - 1 ? 'border-b border-white/5' : ''}>
                  <td className="px-4 py-3 text-cream max-w-[240px] truncate">{email.subject}</td>
                  <td className="px-4 py-3 text-muted">{new Date(email.sentAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted">{email.recipientCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      email.status === 'sent' ? 'bg-green-900/30 text-green-400 border border-green-800/30'
                      : email.status === 'partial' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/30'
                      : 'bg-red-900/30 text-red-400 border border-red-800/30'
                    }`}>{email.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setPreview(email)} className="text-muted hover:text-cream text-xs transition-colors">
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPreview(null)} />
          <div className="relative bg-surface border border-white/10 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <div>
                <h3 className="font-display text-base font-bold text-cream">{preview.subject}</h3>
                <p className="text-muted text-xs font-sans mt-0.5">{new Date(preview.sentAt).toLocaleString()} · {preview.recipientCount} recipients</p>
              </div>
              <button onClick={() => setPreview(null)} className="text-muted hover:text-cream transition-colors text-lg">✕</button>
            </div>
            <div className="flex-1 overflow-hidden">
              {preview.bodyHtml ? (
                <iframe srcDoc={preview.bodyHtml} title="Email preview" className="w-full h-full min-h-[400px]" sandbox="allow-same-origin" />
              ) : (
                <div className="p-6 text-muted text-sm font-sans">No HTML preview available.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
