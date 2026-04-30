import PublicNav from '@/components/PublicNav'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import TopicsFilter from '@/components/TopicsFilter'
import FeatureGrid from '@/components/FeatureGrid'
import ArticleListClient, { type ArticleItem } from '@/components/ArticleListClient'
import { ARTICLES } from '@/lib/articles'

export default async function HomePage() {
  const feedItems: ArticleItem[] = ARTICLES.slice(1).map(a => ({
    slug: a.slug,
    title: a.title,
    displayDate: a.date,
    tag: a.tag,
    readTime: a.readTime,
    intro: a.intro,
  }))

  return (
    <>
      <PublicNav />

      {/* Skip-link target */}
      <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      {/* Hero subscribe */}
      <section className="pub-hero-dark" id="hero">
        <div className="pub-hero-dark-inner">
          <p className="pub-hero-dark-eyebrow">Economics &amp; AI &middot; Newsletter</p>
          <h1 className="pub-hero-dark-heading">The economy and AI, explained without the jargon.</h1>
          <p className="pub-hero-dark-sub">
            Written by a 16-year-old who actually reads the data.
          </p>
          <PublicSubscribeForm showPreferences={false} />
          <div className="pub-hero-dark-stats">
            <span>200+ subscribers</span><span aria-hidden="true">&middot;</span>
            <span>Free</span><span aria-hidden="true">&middot;</span>
            <span>Daily &amp; Weekly</span>
          </div>
        </div>
      </section>

      <hr className="pub-rule" />

      {/* Feature Grid */}
      <FeatureGrid />

      <hr className="pub-rule" />

      {/* About — condensed */}
      <section id="about">
        <div className="pub-about-condensed">
          <div className="pub-wrap">
            <p className="pub-label">About</p>
            <img
              src="/images/joseph.jpg"
              alt="Joseph"
              className="pub-about-photo"
            />
            <h2 className="pub-heading" style={{ maxWidth: '640px' }}>
              I&apos;m 16, and I think the way we talk about AI is broken.
            </h2>
            <p className="pub-copy" style={{ maxWidth: '560px' }}>
              Most coverage is either breathless hype or doom. I started this newsletter to decode
              the real economics behind AI headlines, without the jargon or insider assumptions.
            </p>
            <div className="pub-about-stats-row">
              {([
                { n: '200+', l: 'Subscribers' },
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
              Delivered to your inbox. Choose daily or weekly. Unsubscribe anytime.
            </p>
            <PublicSubscribeForm />
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
