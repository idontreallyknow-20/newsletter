export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { subscribers, sentEmails } from '@/lib/schema'
import { eq, count, desc, isNotNull } from 'drizzle-orm'
import HeroTypewriter from '@/components/HeroTypewriter'
import HeroSubscribeForm from '@/components/HeroSubscribeForm'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import PublicNav from '@/components/PublicNav'
import { ARTICLES } from '@/lib/articles'
import TopicsFilter from '@/components/TopicsFilter'
import ArticleListClient, { type ArticleItem } from '@/components/ArticleListClient'


async function getData() {
  try {
    const [[subRow], dbIssues] = await Promise.all([
      db.select({ count: count() }).from(subscribers).where(eq(subscribers.status, 'active')),
      db.select({ id: sentEmails.id, subject: sentEmails.subject, slug: sentEmails.slug, sentAt: sentEmails.sentAt })
        .from(sentEmails)
        .where(isNotNull(sentEmails.slug))
        .orderBy(desc(sentEmails.sentAt))
        .limit(10),
    ])
    return { subCount: subRow.count, dbIssues }
  } catch {
    return { subCount: 0, dbIssues: [] }
  }
}

export default async function HomePage() {
  const { dbIssues } = await getData()

  return (
    <>
      <PublicNav />

      {/* Skip-link target */}
      <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      {/* Hero */}
      <section id="about">
        <div className="pub-hero">
          <div className="pub-eyebrow fade-up d0">Newsletter · Economics &amp; AI</div>
          <HeroTypewriter />
          <p className="pub-sub fade-up d2">
            A weekly newsletter for curious minds. Breaking down the economic forces and AI breakthroughs shaping our world, without the jargon.
          </p>
          <div className="fade-up d3">
            <HeroSubscribeForm />
          </div>
        </div>
      </section>

      <hr className="pub-rule" />

      {/* About */}
      <section>
        <div className="pub-about">
          <div className="pub-wrap">
            <div className="pub-about-grid">
              <div>
                <p className="pub-label">About</p>
                <h2 className="pub-heading">Written for people who want to understand what&apos;s actually happening.</h2>
                <p className="pub-copy">
                  Most financial and tech news is written for insiders. I write for everyone else: people with real jobs who want a clear view of how AI and the global economy are changing things.
                </p>
                <p className="pub-copy">
                  Each issue takes one big topic and tells you what it actually means. No buzzwords, no breathless predictions. Just my honest take, written so you can read it in five minutes.
                </p>
              </div>
              <div className="pub-stats">
                {[
                  { n: '40+', l: 'Issues Published' },
                  { n: 'Weekly', l: 'Delivery Cadence' },
                  { n: '5 min', l: 'Avg. Read' },
                  { n: 'Free', l: 'Always' },
                ].map(s => (
                  <div key={s.l} className="pub-stat">
                    <div className="pub-stat-n">{s.n}</div>
                    <div className="pub-stat-l">{s.l}</div>
                  </div>
                ))}
              </div>
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

      {/* Recent Issues */}
      <section id="issues">
        <div className="pub-issues">
          <div className="pub-wrap">
            <div className="pub-issues-head">
              <div>
                <p className="pub-label">Archive</p>
                <h2 className="pub-heading">From the archive.</h2>
              </div>
              <a href="#subscribe" className="pub-issues-link">Get all issues in your inbox →</a>
            </div>

            <ArticleListClient items={
              dbIssues.length > 0
                ? dbIssues.map(issue => ({
                    slug: issue.slug!,
                    title: issue.subject,
                    displayDate: new Date(issue.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  } satisfies ArticleItem))
                : ARTICLES.map(a => ({
                    slug: a.slug,
                    title: a.title,
                    displayDate: a.date,
                    tag: a.tag,
                    readTime: a.readTime,
                    intro: a.intro,
                  } satisfies ArticleItem))
            } />
          </div>
        </div>
      </section>

      <hr className="pub-rule" />

      {/* About / Personal section */}
      <section style={{ background: 'var(--pub-cream-2)', borderTop: '1px solid var(--pub-border)', padding: '80px 0' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 32px' }}>
          <p className="pub-eyebrow" style={{ marginBottom: '20px' }}>About</p>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '32px' }}>
            I&apos;m 16, and I think the way we talk about AI is broken.
          </h2>
          <div style={{ fontFamily: 'var(--font-dm)', fontSize: '16px', lineHeight: 1.8, color: 'var(--tan)' }}>
            <p style={{ marginBottom: '20px' }}>
              Most coverage of AI is either breathless hype or doom. Neither helps anyone understand what&apos;s actually happening, or what it means for their job, their savings, or the economy around them.
            </p>
            <p style={{ marginBottom: '20px' }}>
              I started this newsletter because I wanted to read something that treated people as smart adults — that explained the real economics behind the headlines without assuming you already work in tech or finance.
            </p>
            <p>
              My goal is simple: make AI and economic analysis accessible to everyone, not just insiders. One clear, honest issue at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe">
        <div className="pub-sub-section">
          <div className="pub-sub-inner">
            <h2 className="pub-sub-heading">Stay one step ahead.</h2>
            <p className="pub-sub-body">
              Join readers who get a clear take on economics and AI, delivered to their inbox every week.
            </p>
            <PublicSubscribeForm />
            <p className="pub-sub-fine">No spam. No tracking. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pub-footer">
        <span className="pub-footer-copy">© 2026 Joseph. Made with curiosity.</span>
        <nav className="pub-footer-links">
          <a href="/#issues">Archive</a>
          <a href="/#subscribe">Subscribe</a>
          <a href="/#about">About</a>
        </nav>
      </footer>
    </>
  )
}
