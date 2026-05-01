import PublicNav from '@/components/PublicNav'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import TopicsFilter from '@/components/TopicsFilter'
import FeatureGrid from '@/components/FeatureGrid'
import ArticleListClient, { type ArticleItem } from '@/components/ArticleListClient'
import AudioIntro from '@/components/AudioIntro'
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dailybriefhq.com'
  const homeJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Joseph — Economics & AI',
      url: baseUrl,
      description: 'A free newsletter decoding what actually moves markets and reshapes work.',
      potentialAction: {
        '@type': 'SubscribeAction',
        target: `${baseUrl}/#hero`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Joseph',
      url: baseUrl,
      jobTitle: 'Newsletter Author',
      description: '16-year-old writer covering economics and AI without the jargon.',
    },
  ]

  return (
    <>
      <PublicNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      {/* Skip-link target */}
      <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      {/* Hero subscribe */}
      <section className="pub-hero-dark" id="hero">
        <div className="pub-hero-dark-inner">
          <p className="pub-hero-dark-eyebrow">Economics &amp; AI &middot; Newsletter</p>
          <h1 className="pub-hero-dark-heading">The economy and AI, explained without the jargon.</h1>
          <p className="pub-hero-dark-sub">
            A free newsletter decoding what actually moves markets and reshapes work. Choose daily or weekly delivery.
          </p>
          <PublicSubscribeForm minimal />
          <div className="pub-hero-dark-stats">
            <span>40+ issues</span><span aria-hidden="true">&middot;</span>
            <span>Free</span><span aria-hidden="true">&middot;</span>
            <span>Daily &amp; Weekly</span>
          </div>
        </div>
      </section>

      <hr className="pub-rule" />

      {/* Feature Grid */}
      <FeatureGrid />

      <hr className="pub-rule" />

      {/* About — feature */}
      <section id="about">
        <div className="pub-about-condensed">
          <div className="pub-wrap">
            <div className="pub-about-grid">
              <div className="pub-about-portrait">
                <span className="pub-about-portrait-fallback" aria-hidden="true">J</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/joseph.jpg"
                  alt="Joseph at his desk, working on the newsletter"
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="1000"
                />
              </div>
              <div className="pub-about-body">
                <p className="pub-label">About &amp; Research</p>
                <h2 className="pub-heading">
                  I&apos;m 16, and I think the way we talk about AI is broken.
                </h2>
                <p className="pub-copy">
                  Most coverage is either breathless hype or doom. I started this newsletter to
                  decode the real economics behind AI headlines, without the jargon or insider
                  assumptions.
                </p>
                <p className="pub-copy">
                  Every issue starts with primary research: papers, filings, central-bank notes,
                  and earnings transcripts. Then I cut it down to the part that actually matters
                  for how you work, save, and think about what&apos;s next.
                </p>
                <AudioIntro />
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
