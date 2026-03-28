export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { subscribers, sentEmails } from '@/lib/schema'
import { eq, count, desc } from 'drizzle-orm'
import HeroTypewriter from '@/components/HeroTypewriter'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'

const TOPICS = [
  { icon: '📈', title: 'Macro & Markets', desc: 'Interest rates, inflation, central bank policy, and what it all means for your wallet and the broader economy.' },
  { icon: '🤖', title: 'AI & Technology', desc: 'Model releases, capability jumps, and the business of artificial intelligence — stripped of the hype.' },
  { icon: '🌐', title: 'Global Economy', desc: 'Trade flows, geopolitical shifts, and the economic forces reshaping how nations compete and collaborate.' },
  { icon: '🔮', title: 'Future of Work', desc: 'How automation, remote culture, and AI are rewriting the rules of employment and productivity.' },
  { icon: '💡', title: 'Ideas & Analysis', desc: 'Original takes on big questions — why economic predictions fail, what history tells us, and what to watch next.' },
  { icon: '📰', title: 'Weekly Digest', desc: 'Five links worth your time, one chart that matters, and one thing everyone got wrong this week.' },
]

const PLACEHOLDER_ISSUES = [
  { num: '#041', title: "The Fed's Impossible Dilemma: Growth vs. Inflation in 2026", tag: 'Economics', date: 'Mar 24, 2026' },
  { num: '#040', title: 'GPT-5 and the Arms Race Nobody Is Talking About', tag: 'AI', date: 'Mar 17, 2026' },
  { num: '#039', title: 'Why Every Recession Prediction Has Been Wrong (So Far)', tag: 'Markets', date: 'Mar 10, 2026' },
  { num: '#038', title: 'The Quiet AI Takeover of White-Collar Work', tag: 'AI', date: 'Mar 3, 2026' },
  { num: '#037', title: 'Deglobalization: Myth or Megatrend?', tag: 'Global', date: 'Feb 24, 2026' },
]

async function getData() {
  try {
    const [subRow] = await db.select({ count: count() }).from(subscribers).where(eq(subscribers.status, 'active'))
    const [sentRow] = await db.select({ count: count() }).from(sentEmails)
    const recent = await db.select().from(sentEmails).orderBy(desc(sentEmails.sentAt)).limit(5)
    return { subCount: subRow.count, sentCount: sentRow.count, recent }
  } catch {
    return { subCount: 0, sentCount: 0, recent: [] }
  }
}

export default async function HomePage() {
  const { subCount, sentCount, recent } = await getData()

  return (
    <>
      {/* Nav */}
      <nav className="pub-nav">
        <a href="/" className="pub-logo">Joseph<span>.</span></a>
        <ul className="pub-nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#topics">Topics</a></li>
          <li><a href="#issues">Issues</a></li>
          <li><a href="#subscribe">Subscribe</a></li>
        </ul>
      </nav>

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
                  <span className="pub-topic-icon">{t.icon}</span>
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

            {recent.length > 0 ? (
              <div>
                {recent.map((email, i) => (
                  <div key={email.id} className="pub-issue-row">
                    <span className="pub-issue-num">#{String(recent.length - i).padStart(3, '0')}</span>
                    <span className="pub-issue-title">{email.subject}</span>
                    <span className="pub-issue-date">
                      {new Date(email.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {PLACEHOLDER_ISSUES.map(issue => (
                  <div key={issue.num} className="pub-issue-row">
                    <span className="pub-issue-num">{issue.num}</span>
                    <span className="pub-issue-title">{issue.title}</span>
                    <span className="pub-issue-tag">{issue.tag}</span>
                    <span className="pub-issue-date">{issue.date}</span>
                  </div>
                ))}
              </div>
            )}
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
          <a href="#">Twitter/X</a>
          <a href="#">LinkedIn</a>
          <a href="#">Archive</a>
          <a href="#">RSS</a>
        </nav>
      </footer>
    </>
  )
}
