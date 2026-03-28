'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ConfirmModal from '@/components/ConfirmModal'
import type { Subscriber } from '@/lib/schema'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null)
  const [importing, setImporting] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/subscribers')
    const data = await res.json()
    setSubscribers(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function addSubscriber(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setAdding(true)
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Subscriber added')
      setName(''); setEmail('')
      load()
    } catch (err) {
      toast.error((err instanceof Error && err.message) || 'Failed to add subscriber')
    } finally {
      setAdding(false)
    }
  }

  async function deleteSubscriber() {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/subscribers/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Subscriber removed')
      setDeleteTarget(null)
      load()
    } catch {
      toast.error('Failed to delete subscriber')
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const text = await file.text()
      const lines = text.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
      const nameIdx = headers.indexOf('name')
      const emailIdx = headers.indexOf('email')
      if (emailIdx === -1) throw new Error('CSV must have an "email" column')

      const rows = lines.slice(1).map(line => {
        const cols = line.split(',').map(c => c.trim().replace(/"/g, ''))
        return { name: nameIdx >= 0 ? cols[nameIdx] : '', email: cols[emailIdx] }
      }).filter(r => r.email)

      const res = await fetch('/api/subscribers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Imported ${data.inserted}, skipped ${data.skipped}`)
      load()
    } catch (err) {
      toast.error((err instanceof Error && err.message) || 'Import failed')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  async function handleExport() {
    const res = await fetch('/api/subscribers/export')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'subscribers.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const active = subscribers.filter(s => s.status === 'active').length
  const unsub = subscribers.filter(s => s.status === 'unsubscribed').length

  return (
    <div className="p-8 lg:p-12 max-w-5xl">
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4 animate-fade-up">
        <div>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--muted)', opacity: 0.5 }}>Manage</p>
          <h2 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--cream)' }}>Subscribers</h2>
          <p className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--muted)' }}>{active} active · {unsub} unsubscribed</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <label className={`px-4 py-2.5 text-xs font-sans tracking-wide transition-colors cursor-pointer ${importing ? 'opacity-40 pointer-events-none' : ''}`} style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>
            {importing ? 'Importing…' : 'Import CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleExport} className="px-4 py-2.5 text-xs font-sans tracking-wide transition-colors" style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={addSubscriber} className="flex gap-3 flex-wrap mb-8 pb-8 animate-fade-up delay-1" style={{ borderBottom: '1px solid var(--border)' }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name (optional)"
          className="flex-1 min-w-[140px] px-3 py-2.5 text-sm font-sans"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cream)', outline: 'none' }}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="flex-1 min-w-[200px] px-3 py-2.5 text-sm font-sans"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cream)', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={adding || !email}
          className="px-5 py-2.5 text-xs font-sans tracking-wide transition-all duration-150 disabled:opacity-40"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
        >
          {adding ? 'Adding…' : '+ Add Subscriber'}
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="py-16 text-center">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse" style={{ color: 'var(--muted)', opacity: 0.5 }}>Loading…</p>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="py-16 text-center" style={{ border: '1px solid var(--border)' }}>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.5 }}>No subscribers yet</p>
        </div>
      ) : (
        <div className="animate-fade-up delay-2" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm font-sans">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left px-4 py-3 font-normal font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.6 }}>Name</th>
                <th className="text-left px-4 py-3 font-normal font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.6 }}>Email</th>
                <th className="text-left px-4 py-3 font-normal font-mono text-[9px] tracking-[0.2em] uppercase hidden sm:table-cell" style={{ color: 'var(--muted)', opacity: 0.6 }}>Added</th>
                <th className="text-left px-4 py-3 font-normal font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.6 }}>Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={s.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: i < subscribers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--cream)' }}>{s.name || <span style={{ color: 'var(--muted)', opacity: 0.4 }}>—</span>}</td>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--muted)', fontSize: '11px' }}>{s.email}</td>
                  <td className="px-4 py-3 hidden sm:table-cell font-mono text-[10px]" style={{ color: 'var(--muted)', opacity: 0.6 }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-1" style={{
                      color: s.status === 'active' ? '#6ee7b7' : 'var(--muted)',
                      background: s.status === 'active' ? 'rgba(110,231,183,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${s.status === 'active' ? 'rgba(110,231,183,0.2)' : 'var(--border)'}`,
                    }}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteTarget(s)} className="font-mono text-[9px] tracking-widest uppercase transition-colors" style={{ color: 'var(--muted)', opacity: 0.5 }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove subscriber?"
        message={`This will permanently remove ${deleteTarget?.email} from your list.`}
        confirmLabel="Remove"
        onConfirm={deleteSubscriber}
        onCancel={() => setDeleteTarget(null)}
        dangerous
      />
    </div>
  )
}
