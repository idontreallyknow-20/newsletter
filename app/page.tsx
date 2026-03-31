export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { subscribers, sentEmails } from '@/lib/schema'
import { eq, count, desc, isNotNull } from 'drizzle-orm'
import TopHeroBand from '@/components/TopHeroBand'
import PublicNav from '@/components/PublicNav'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import TopicsFilter from '@/components/TopicsFilter'
import FeatureGrid from '@/components/FeatureGrid'
import ArticleListClient, { type ArticleItem } from '@/components/ArticleListClient'
import { ARTICLES } from '@/lib/articles'

async function getData() {
  try {
    const [, dbIssues] = await Promise.all([
      db.select({ count: count() }).from(subscribers).where(eq(subscribers.status, 'active')),
      db.select({ id: sentEmails.id, subject: sentEmails.subject, slug: sentEmails.slug, sentAt: sentEmails.sentAt })
        .from(sentEmails)
        .where(isNotNull(sentEmails.slug))
        .orderBy(desc(sentEmails.sentAt))
        .limit(50),
    ])
    return { dbIssues }
  } catch {
    return { dbIssues: [] }
  }
}

export default async function HomePage() {
  const { dbIssues } = await getData()

  const feedItems: ArticleItem[] = dbIssues.length > 0
    ? dbIssues.map(issue => ({
        slug: issue.slug!,
        title: issue.subject,
        displayDate: new Date(issue.sentAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        }),
      }))
    : ARTICLES.map(a => ({
        slug: a.slug,
        title: a.title,
        displayDate: a.date,
        tag: a.tag,
        readTime: a.readTime,
        intro: a.intro,
      }))

  return (
    <>
      <TopHeroBand />
      <PublicNav />

      {/* Skip-link target */}
      <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      {/* Feature Grid */}
      <FeatureGrid />

      <hr className="pub-rule" />

      {/* About — condensed */}
      <section id="about">
        <div className="pub-about-condensed">
          <div className="pub-wrap">
            <p className="pub-label">About</p>
            <h2 className="pub-heading" style={{ maxWidth: '640px' }}>
              I&apos;m 16, and I think the way we talk about AI is broken.
            </h2>
            <p className="pub-copy" style={{ maxWidth: '560px' }}>
              Most coverage is either breathless hype or doom. I started this newsletter to decode
              the real economics behind AI headlines&mdash;without the jargon or insider assumptions.
            </p>
            <div className="pub-about-stats-row">
              {([
                { n: '40+', l: 'Issues' },
                { n: 'Daily', l: 'Delivery' },
                { n: '5 min', l: 'Read' },
                { n: 'Free', l: 'Always' },
              ] as const).map(s => (
                <div key={s.l} className="pub-about-stat-inline">
                  <span className="pub-stat-n">{s.n}</span>
                  <span className="pub-stat-l">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="pub-rule" />

      {/* Topics */}
      <section id="topics">
        <div className="pub-topics">
          <div className="pub-wrap">
            <div style={{ marginBottom: '48px' }}>
              <p className="pub-label">What you&apos;ll read</p>
              <h2 className="pub-heading">Six lenses on the same shifting world.</h2>
            </div>
            <TopicsFilter />
          </div>
        </div>
      </section>

      <hr className="pub-rule" />

      {/* Archive */}
      <section id="issues">
        <div className="pub-issues">
          <div className="pub-wrap">
            <div className="pub-issues-head">
              <div>
                <p className="pub-label">Archive</p>
                <h2 className="pub-heading">From the archive.</h2>
              </div>
              <a href="#subscribe" className="pub-issues-link">Get all issues in your inbox &rarr;</a>
            </div>
            <ArticleListClient items={feedItems} />
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe">
        <div className="pub-sub-section">
          <div className="pub-sub-inner">
            <h2 className="pub-sub-heading">Join readers who get a clear take on economics and AI.</h2>
            <p className="pub-sub-body">
              Delivered to your inbox. Choose daily or weekly&mdash;unsubscribe anytime.
            </p>
            <PublicSubscribeForm />
            <p className="pub-sub-fine">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pub-footer">
        <span className="pub-footer-copy">&copy; 2026 Joseph. Made with curiosity.</span>
        <nav className="pub-footer-links">
          <a href="/#issues">Archive</a>
          <a href="/#subscribe">Subscribe</a>
          <a href="/#about">About</a>
        </nav>
      </footer>
    </>
  )
}
