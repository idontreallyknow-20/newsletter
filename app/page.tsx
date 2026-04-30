import PublicNav from '@/components/PublicNav'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import TopicsFilter from '@/components/TopicsFilter'
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

      {/* Hero subscribe */}
      <section className="pub-hero-dark" id="hero">
        <div className="pub-hero-dark-inner">
          <p className="pub-hero-dark-eyebrow">Economics &amp; AI &middot; Newsletter</p>
          <h1 className="pub-hero-dark-heading">The economy and AI, explained without the jargon.</h1>
          <p className="pub-hero-dark-sub">
            A free newsletter decoding what actually moves markets and reshapes work. Choose daily or weekly delivery.
          </p>
          <PublicSubscribeForm />
          <div className="pub-hero-dark-stats">
            <span>200+ subscribers</span><span aria-hidden="true">&middot;</span>
            <span>Free</span><span aria-hidden="true">&middot;</span>
            <span>Daily &amp; Weekly</span>
          </div>
        </div>
      </section>

      {/* Research callout */}
      <section className="research-callout" aria-label="Research">
        <div className="pub-wrap research-callout-inner">
          <div>
            <p className="pub-label" style={{ marginBottom: '10px' }}>New</p>
            <p className="research-callout-text">
              Beyond the newsletter — I publish equity research. Real stock pitches, real valuations. No fluff.
            </p>
          </div>
          <a href="/research" className="research-callout-link">Browse research &rarr;</a>
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
              <div className="pub-about-photo-frame" aria-hidden="true">
                <span>Photo</span>
              </div>
              <p className="pub-about-photo-cap">
                <strong>Joseph</strong>
                <span>16 · Toronto · Writer of Daily Brief</span>
              </p>
            </div>
            <div className="pub-about-text">
              <p className="pub-label">About</p>
              <h2 className="pub-heading" style={{ maxWidth: '640px' }}>
                I&apos;m Joseph, 16, from Toronto. I started this because the way we talk about AI and the economy is broken.
              </h2>
              <p className="pub-copy" style={{ maxWidth: '560px' }}>
                Most coverage is either breathless hype or doom. I write the piece I wish existed: clear, specific, and grounded in the actual numbers — without the jargon or insider assumptions.
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

      <hr className="pub-rule" />

      {/* Testimonials */}
      <section id="testimonials" aria-label="What readers are saying">
        <div className="pub-testimonials">
          <div className="pub-wrap">
            <div style={{ marginBottom: '40px' }}>
              <p className="pub-label">What readers are saying</p>
              <h2 className="pub-heading">Quotes from the inbox.</h2>
            </div>
            <div className="testimonial-grid">
              {[
                { quote: 'Placeholder testimonial — a few honest sentences from a real reader will live here.', name: 'Reader Name', desc: 'High school student, Toronto' },
                { quote: 'Placeholder testimonial — short, specific, and concrete about what Joseph nailed.', name: 'Reader Name', desc: 'University student, Vancouver' },
                { quote: 'Placeholder testimonial — replace this with a real line from a subscriber I trust.', name: 'Reader Name', desc: 'Investor, New York' },
              ].map((t, i) => (
                <figure key={i} className="testimonial-card">
                  <blockquote className="testimonial-quote">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="testimonial-cap">
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-desc">{t.desc}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
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
        <span className="pub-footer-copy">&copy; 2026 Joseph &nbsp;|&nbsp; dailybriefhq.com</span>
        <nav className="pub-footer-links">
          <a href="/#issues">Archive</a>
          <a href="/research">Research</a>
          <a href="/#subscribe">Subscribe</a>
          <a href="/#about">About</a>
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
        </nav>
      </footer>
    </>
  )
}
