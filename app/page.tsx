import PublicNav from '@/components/PublicNav'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import FeatureGrid from '@/components/FeatureGrid'
import ArticleListClient, { type ArticleItem } from '@/components/ArticleListClient'
import { ARTICLES } from '@/lib/articles'

export default async function HomePage() {
  const feedItems: ArticleItem[] = ARTICLES.map(a => ({
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

      {/* Hero — just headline, subhead, email */}
      <section className="pub-hero-dark" id="hero">
        <div className="pub-hero-dark-inner">
          <p className="pub-hero-dark-eyebrow">Economics &amp; AI &middot; Newsletter</p>
          <h1 className="pub-hero-dark-heading">The economy and AI, explained without the jargon.</h1>
          <p className="pub-hero-dark-sub">
            A free newsletter decoding what actually moves markets and reshapes work.
          </p>
          <PublicSubscribeForm />
        </div>
      </section>

      <hr className="pub-rule" />

      {/* Feature Grid */}
      <FeatureGrid />

      <hr className="pub-rule" />

      {/* About — condensed */}
      <section id="about">
        <div className="pub-about-condensed">
          <div className="pub-wrap pub-about-row">
            <div className="pub-about-photo">
              <div className="pub-about-photo-frame" aria-hidden="true" />
            </div>
            <div className="pub-about-text">
              <p className="pub-label">About</p>
              <h2 className="pub-heading" style={{ maxWidth: '640px' }}>
                I&apos;m Joseph, 16, from Toronto. I write the AI and economics piece I wish existed — clear, specific, no hype.
              </h2>
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
              Delivered to your inbox. Unsubscribe anytime.
            </p>
            <PublicSubscribeForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pub-footer pub-footer-min">
        <span className="pub-footer-copy">
          &copy; 2026 Joseph &middot; <a href="/">dailybriefhq.com</a> &middot; <a href="#" aria-label="LinkedIn">LinkedIn</a>
        </span>
      </footer>
    </>
  )
}
