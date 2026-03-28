export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { subscribers, sentEmails } from '@/lib/schema'
import { eq, count, desc, isNotNull } from 'drizzle-orm'
import HeroTypewriter from '@/components/HeroTypewriter'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import PublicNav from '@/components/PublicNav'
import { ARTICLES } from '@/lib/articles'
import { IconMarkets, IconAI, IconGlobe, IconWork, IconAnalysis, IconDigest } from '@/components/TopicIcons'
import { ARTICLE_ILLUSTRATIONS } from '@/components/ArticleIllustrations'

const TOPICS = [
  { icon: <IconMarkets />, title: 'Macro & Markets', desc: 'Interest rates, inflation, central bank policy, and what it all means for your wallet and the broader economy.' },
  { icon: <IconAI />, title: 'AI & Technology', desc: 'Model releases, capability jumps, and the business of artificial intelligence — stripped of the hype.' },
  { icon: <IconGlobe />, title: 'Global Economy', desc: 'Trade flows, geopolitical shifts, and the economic forces reshaping how nations compete and collaborate.' },
  { icon: <IconWork />, title: 'Future of Work', desc: 'How automation, remote culture, and AI are rewriting the rules of employment and productivity.' },
  { icon: <IconAnalysis />, title: 'Ideas & Analysis', desc: 'Original takes on big questions — why economic predictions fail, what history tells us, and what to watch next.' },
  { icon: <IconDigest />, title: 'Weekly Digest', desc: 'Five links worth your time, one chart that matters, and one thing everyone got wrong this week.' },
]


async function getData() {
  try {
    const [[subRow], [sentRow], dbIssues] = await Promise.all([
      db.select({ count: count() }).from(subscribers).where(eq(subscribers.status, 'active')),
      db.select({ count: count() }).from(sentEmails),
      db.select({ id: sentEmails.id, subject: sentEmails.subject, slug: sentEmails.slug, sentAt: sentEmails.sentAt })
        .from(sentEmails)
        .where(isNotNull(sentEmails.slug))
        .orderBy(desc(sentEmails.sentAt))
        .limit(10),
    ])
    return { subCount: subRow.count, sentCount: sentRow.count, dbIssues }
  } catch {
    return { subCount: 0, sentCount: 0, dbIssues: [] }
  }
}

export default async function HomePage() {
  const { subCount, sentCount, dbIssues } = await getData()

  return (
    <>
      <PublicNav />

      {/* Hero */}
      <section id="about">
        <div className="pub-hero">
          <div className="pub-eyebrow fade-up d0">Newsletter · Economics &amp; AI</div>
          <HeroTypewriter />
          <p className="pub-sub fade-up d2">
            A weekly newsletter for curious minds — breaking down the economic forces and AI breakthroughs shaping our world, without the jargon.
          </p>
          <div className="pub-buttons fade-up d3">
            <a href="#subscribe" className="pub-btn-primary">Subscribe free →</a>
            <a href="#issues" className="pub-btn-ghost">Browse issues</a>
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
                  Most financial and tech news is written for insiders. Joseph writes for everyone else — people with real jobs who still want a clear-eyed view of how AI and the global economy are changing the ground beneath their feet.
                </p>
                <p className="pub-copy">
                  Each issue takes one big topic, cuts through the noise, and tells you what it means. No buzzwords, no breathless predictions — just honest, well-researched analysis you can read in five minutes.
                </p>
              </div>
              <div className="pub-stats">
                {[
                  { n: sentCount > 0 ? `${sentCount}+` : '41+', l: 'Issues Published' },
                  { n: 'Weekly', l: 'Delivery Cadence' },
                  { n: subCount > 0 ? `${subCount}` : '—', l: 'Readers' },
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
            <div className="pub-topics-grid">
              {TOPICS.map(t => (
                <div key={t.title} className="pub-topic">
                  <div className="pub-topic-icon-wrap">{t.icon}</div>
                  <div className="pub-topic-title">{t.title}</div>
                  <p className="pub-topic-desc">{t.desc}</p>
                </div>
              ))}
            </div>
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
                <p className="pub-label">Recent Issues</p>
                <h2 className="pub-heading">From the archive.</h2>
              </div>
              <a href="#subscribe" className="pub-issues-link">Subscribe for more →</a>
            </div>

            <div className="pub-article-list">
              {dbIssues.length > 0
                ? dbIssues.map((issue, i) => {
                    const illus = issue.slug ? ARTICLE_ILLUSTRATIONS[issue.slug] : undefined
                    return (
                      <a key={issue.id} href={`/issues/${issue.slug}`} className="pub-article-card" style={{ textDecoration: 'none' }}>
                        <div className="pub-article-img">
                          {illus ? illus.svg : <span className="pub-article-img-num">#{String(dbIssues.length - i).padStart(3, '0')}</span>}
                        </div>
                        <div className="pub-article-body">
                          <span className="pub-issue-date">{new Date(issue.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <div className="pub-article-title">{issue.subject}</div>
                          <span className="pub-article-read">Read issue →</span>
                        </div>
                      </a>
                    )
                  })
                : ARTICLES.map(article => {
                    const illus = ARTICLE_ILLUSTRATIONS[article.slug]
                    return (
                      <a key={article.slug} href={`/issues/${article.slug}`} className="pub-article-card" style={{ textDecoration: 'none' }}>
                        <div className="pub-article-img">
                          {illus ? illus.svg : <span className="pub-article-img-num">{article.num}</span>}
                        </div>
                        <div className="pub-article-body">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <span className="pub-issue-tag">{article.tag}</span>
                            <span className="pub-issue-date" style={{ width: 'auto', textAlign: 'left' }}>{article.date.replace('March', 'Mar').replace('February', 'Feb')} · {article.readTime}</span>
                          </div>
                          <div className="pub-article-title">{article.title}</div>
                          <p className="pub-article-intro">{article.intro.slice(0, 140)}…</p>
                          <span className="pub-article-read">Read issue →</span>
                        </div>
                      </a>
                    )
                  })
              }
            </div>
          </div>
        </div>
      </section>

      <hr className="pub-rule" />

      {/* Subscribe */}
      <section id="subscribe">
        <div className="pub-sub-section">
          <div className="pub-sub-inner">
            <h2 className="pub-sub-heading">Stay one step ahead.</h2>
            <p className="pub-sub-body">
              Join readers who get the clearest take on economics and AI — delivered to your inbox every week.
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
          <a href="#issues">Archive</a>
          <a href="#subscribe">Subscribe</a>
          <a href="#about">About</a>
          <a href="/login" style={{ opacity: 0.5 }}>Admin</a>
        </nav>
      </footer>
    </>
  )
}
