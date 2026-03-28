export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/lib/db'
import { subscribers, sentEmails, drafts } from '@/lib/schema'
import { eq, count, desc } from 'drizzle-orm'

async function getStats() {
  try {
    const [[activeRow], [totalSubRow], [sentRow], recentEmails, [latestDraft]] = await Promise.all([
      db.select({ count: count() }).from(subscribers).where(eq(subscribers.status, 'active')),
      db.select({ count: count() }).from(subscribers),
      db.select({ count: count() }).from(sentEmails),
      db.select({ id: sentEmails.id, subject: sentEmails.subject, sentAt: sentEmails.sentAt, recipientCount: sentEmails.recipientCount, status: sentEmails.status })
        .from(sentEmails)
        .orderBy(desc(sentEmails.sentAt))
        .limit(5),
      db.select({ subject: drafts.subject, updatedAt: drafts.updatedAt })
        .from(drafts)
        .orderBy(desc(drafts.updatedAt))
        .limit(1),
    ])
    return {
      activeSubscribers: activeRow.count,
      totalSubscribers: totalSubRow.count,
      issuesSent: sentRow.count,
      recentEmails,
      latestDraft: latestDraft ?? null,
    }
  } catch {
    return { activeSubscribers: 0, totalSubscribers: 0, issuesSent: 0, recentEmails: [], latestDraft: null }
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const statCards = [
    { label: 'Active Subscribers', value: stats.activeSubscribers, sub: `${stats.totalSubscribers} total`, href: '/subscribers' },
    { label: 'Issues Sent', value: stats.issuesSent, sub: 'all time', href: '/history' },
    { label: 'Draft in Progress', value: stats.latestDraft ? '1' : '—', sub: stats.latestDraft ? `Last: ${stats.latestDraft.subject || 'Untitled'}` : 'No drafts saved', href: '/compose' },
  ]

  return (
    <div className="p-8 lg:p-12 max-w-5xl">
      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--muted)', opacity: 0.5 }}>Overview</p>
        <h2 className="font-display text-4xl font-bold mb-1" style={{ color: 'var(--cream)' }}>Dashboard</h2>
        <p className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--muted)', opacity: 0.6 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-px animate-fade-up delay-1" style={{ border: '1px solid var(--border)' }}>
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="dash-card block p-6 group">
            <div className="h-px w-8 mb-4" style={{ background: 'var(--border-accent)' }} />
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--muted)' }}>{card.label}</p>
            <p className="font-display text-4xl font-bold leading-none mb-2 group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--cream)' }}>
              {card.value}
            </p>
            <p className="font-mono text-[10px] tracking-widest truncate" style={{ color: 'var(--muted)', opacity: 0.6 }}>{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 mb-10 animate-fade-up delay-2">
        <Link href="/compose" className="dash-action flex items-center gap-4 px-5 py-4">
          <div className="w-px h-6 flex-shrink-0" style={{ background: 'var(--accent)' }} />
          <div>
            <p className="font-sans text-sm font-medium" style={{ color: 'var(--cream)' }}>Write new issue →</p>
            <p className="font-mono text-[10px] tracking-widest mt-0.5" style={{ color: 'var(--muted)', opacity: 0.6 }}>Open compose editor</p>
          </div>
        </Link>
        <Link href="/subscribers" className="dash-action flex items-center gap-4 px-5 py-4">
          <div className="w-px h-6 flex-shrink-0" style={{ background: 'var(--accent)' }} />
          <div>
            <p className="font-sans text-sm font-medium" style={{ color: 'var(--cream)' }}>Manage subscribers →</p>
            <p className="font-mono text-[10px] tracking-widest mt-0.5" style={{ color: 'var(--muted)', opacity: 0.6 }}>View & import list</p>
          </div>
        </Link>
      </div>

      {/* Recent sends */}
      {stats.recentEmails.length > 0 && (
        <div className="animate-fade-up delay-3">
          <div className="flex items-center gap-4 mb-5">
            <h3 className="font-display text-lg font-bold" style={{ color: 'var(--cream)' }}>Recent Sends</h3>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            <Link href="/history" className="font-mono text-[9px] tracking-widest uppercase transition-colors hover:opacity-100" style={{ color: 'var(--muted)', opacity: 0.5 }}>
              View all →
            </Link>
          </div>
          <div style={{ border: '1px solid var(--border)' }}>
            {stats.recentEmails.map((email, i) => (
              <div key={email.id} className="flex items-center gap-4 px-5 py-3.5" style={{ borderBottom: i < stats.recentEmails.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--surface)' }}>
                <span className="font-mono text-[9px] w-3 flex-shrink-0 tabular-nums" style={{ color: 'var(--muted)', opacity: 0.4 }}>{i + 1}</span>
                <span className="font-sans text-sm flex-1 truncate" style={{ color: 'var(--cream)' }}>{email.subject}</span>
                <span className="font-mono text-[10px] hidden sm:block flex-shrink-0" style={{ color: 'var(--muted)' }}>
                  {new Date(email.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 flex-shrink-0" style={{
                  color: email.status === 'sent' ? '#6ee7b7' : '#fcd34d',
                  background: email.status === 'sent' ? 'rgba(110,231,183,0.08)' : 'rgba(252,211,77,0.08)',
                  border: `1px solid ${email.status === 'sent' ? 'rgba(110,231,183,0.2)' : 'rgba(252,211,77,0.2)'}`,
                }}>
                  {email.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.recentEmails.length === 0 && (
        <div className="animate-fade-up delay-2 py-16 text-center" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--muted)', opacity: 0.5 }}>No issues sent yet</p>
          <Link href="/compose" className="font-mono text-[10px] tracking-widest uppercase transition-colors" style={{ color: 'var(--accent)' }}>
            Write your first issue →
          </Link>
        </div>
      )}
    </div>
  )
}
