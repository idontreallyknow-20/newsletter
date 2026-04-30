import PublicNav from '@/components/PublicNav'
import { RESEARCH } from '@/lib/research'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research — Joseph',
  description: 'Equity research and stock pitches. Real valuations, real theses, no fluff.',
  alternates: { canonical: '/research' },
}

const RATING_COLORS: Record<string, string> = {
  Buy: '#1f7a4d',
  Hold: '#a8741a',
  Sell: '#a8341f',
}

export default function ResearchPage() {
  return (
    <>
      <PublicNav />
      <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      {/* Header */}
      <section className="pub-hero-dark" id="research-hero">
        <div className="pub-hero-dark-inner">
          <p className="pub-hero-dark-eyebrow">Equity Research</p>
          <h1 className="pub-hero-dark-heading">Real stock pitches. Real valuations.</h1>
          <p className="pub-hero-dark-sub">
            Beyond the newsletter — long-form theses on companies I&apos;ve actually done the work on. Buy, hold, or sell, with the math behind it.
          </p>
        </div>
      </section>

      <hr className="pub-rule" />

      {/* Archive */}
      <section id="research">
        <div className="pub-issues">
          <div className="pub-wrap">
            <div className="pub-issues-head">
              <div>
                <p className="pub-label">Archive</p>
                <h2 className="pub-heading">Pitches.</h2>
              </div>
              <a href="/#subscribe" className="pub-issues-link">Get new pitches in your inbox &rarr;</a>
            </div>

            <div className="research-list">
              {RESEARCH.map(entry => (
                <a
                  key={entry.slug}
                  href={`/research/${entry.slug}`}
                  className="research-card"
                >
                  <div className="research-card-head">
                    <div className="research-card-id">
                      <span className="research-card-ticker">{entry.ticker}</span>
                      <span className="research-card-company">{entry.company}</span>
                    </div>
                    <span
                      className="research-card-rating"
                      style={{ color: RATING_COLORS[entry.rating] ?? 'var(--ink)', borderColor: RATING_COLORS[entry.rating] ?? 'var(--ink)' }}
                    >
                      {entry.rating}
                    </span>
                  </div>
                  <p className="research-card-thesis">{entry.thesis}</p>
                  <div className="research-card-foot">
                    <span className="research-card-date">{entry.date}</span>
                    <span className="research-card-read">Read pitch &rarr;</span>
                  </div>
                </a>
              ))}
            </div>
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
