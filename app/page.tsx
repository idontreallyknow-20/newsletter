export const dynamic = 'force-dynamic'

import Link from 'next/link'
import StatsCard from '@/components/StatsCard'
import { db } from '@/lib/db'
import { subscribers, sentEmails } from '@/lib/schema'
import { eq, count, desc } from 'drizzle-orm'

async function getStats() {
  const [subCount] = await db.select({ count: count() }).from(subscribers).where(eq(subscribers.status, 'active'))
  const [sentCount] = await db.select({ count: count() }).from(sentEmails)
  const recentSends = await db.select().from(sentEmails).orderBy(desc(sentEmails.sentAt)).limit(10)
  return { subCount: subCount.count, sentCount: sentCount.count, recentSends }
}

export default async function DashboardPage() {
  const { subCount, sentCount, recentSends } = await getStats()

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <div className="mb-10">
        <h2 className="font-display text-3xl font-bold text-cream mb-1">Dashboard</h2>
        <p className="text-muted text-sm font-sans">Your newsletter at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard label="Active Subscribers" value={subCount} delay={0} />
        <StatsCard label="Emails Sent" value={sentCount} delay={80} />
        <StatsCard label="Open Rate" value="—" subtitle="Not tracked yet" delay={160} />
        <StatsCard label="Next Send" value="See Schedule" subtitle="→ /schedule" delay={240} />
      </div>

      {/* Quick compose */}
      <div className="mb-10">
        <Link
          href="/compose"
          className="inline-flex items-center gap-2 px-5 py-3 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 rounded-lg text-sm font-sans transition-colors"
        >
          ✦ Compose New Email
        </Link>
      </div>

      {/* Recent sends */}
      <div>
        <h3 className="font-display text-lg font-bold text-cream mb-4">Recent Sends</h3>
        {recentSends.length === 0 ? (
          <div className="bg-surface border border-white/10 rounded-lg p-8 text-center">
            <p className="text-muted text-sm font-sans">No emails sent yet.</p>
          </div>
        ) : (
          <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Subject</th>
                  <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Recipients</th>
                  <th className="text-left px-4 py-3 text-muted font-normal text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSends.map((email, i) => (
                  <tr key={email.id} className={i < recentSends.length - 1 ? 'border-b border-white/5' : ''}>
                    <td className="px-4 py-3 text-cream truncate max-w-[240px]">{email.subject}</td>
                    <td className="px-4 py-3 text-muted">{email.sentAt.toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-muted">{email.recipientCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        email.status === 'sent'
                          ? 'bg-green-900/30 text-green-400 border border-green-800/30'
                          : email.status === 'partial'
                          ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/30'
                          : 'bg-red-900/30 text-red-400 border border-red-800/30'
                      }`}>
                        {email.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
