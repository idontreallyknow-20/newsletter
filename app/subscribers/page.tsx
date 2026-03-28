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
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-cream mb-1">Subscribers</h2>
          <p className="text-muted text-sm font-sans">{active} active · {unsub} unsubscribed</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <label className={`px-4 py-2 text-sm font-sans text-muted hover:text-cream border border-white/10 rounded-md cursor-pointer transition-colors ${importing ? 'opacity-50 pointer-events-none' : ''}`}>
            {importing ? 'Importing…' : 'Import CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleExport} className="px-4 py-2 text-sm font-sans text-muted hover:text-cream border border-white/10 rounded-md transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={addSubscriber} className="bg-surface border border-white/10 rounded-lg p-5 mb-6 flex gap-3 flex-wrap">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name (optional)"
          className="flex-1 min-w-[140px] bg-surface-2 border border-white/10 rounded-md px-3 py-2 text-cream text-sm font-sans placeholder:text-muted focus:outline-none focus:border-accent/40"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="flex-1 min-w-[200px] bg-surface-2 border border-white/10 rounded-md px-3 py-2 text-cream text-sm font-sans placeholder:text-muted focus:outline-none focus:border-accent/40"
        />
        <button
          type="submit"
          disabled={adding || !email}
          className="px-4 py-2 text-sm font-sans bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 rounded-md transition-colors disabled:opacity-50"
        >
          {adding ? 'Adding…' : '+ Add'}
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-muted text-sm font-sans">Loading…</div>
      ) : subscribers.length === 0 ? (
        <div className="bg-surface border border-white/10 rounded-lg p-10 text-center">
          <p className="text-muted text-sm font-sans">No subscribers yet. Add one above or import a CSV.</p>
        </div>
      ) : (
        <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Added</th>
                <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={s.id} className={i < subscribers.length - 1 ? 'border-b border-white/5' : ''}>
                  <td className="px-4 py-3 text-cream">{s.name || '—'}</td>
                  <td className="px-4 py-3 text-muted">{s.email}</td>
                  <td className="px-4 py-3 text-muted">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${s.status === 'active' ? 'bg-green-900/30 text-green-400 border border-green-800/30' : 'bg-white/5 text-muted border border-white/10'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteTarget(s)} className="text-muted hover:text-red-400 transition-colors text-xs">
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
