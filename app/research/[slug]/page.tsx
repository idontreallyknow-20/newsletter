import PublicNav from '@/components/PublicNav'
import { RESEARCH } from '@/lib/research'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const RATING_COLORS: Record<string, string> = {
  Buy: '#1f7a4d',
  Hold: '#a8741a',
  Sell: '#a8341f',
}

export function generateStaticParams() {
  return RESEARCH.map(r => ({ slug: r.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const entry = RESEARCH.find(r => r.slug === params.slug)
  if (!entry) return {}
  return {
    title: `${entry.company} (${entry.ticker}) — Research`,
    description: entry.thesis,
    alternates: { canonical: `/research/${entry.slug}` },
  }
}

export default function ResearchEntryPage({ params }: { params: { slug: string } }) {
  const entry = RESEARCH.find(r => r.slug === params.slug)
  if (!entry) {
    notFound()
    return null
  }

  return (
    <>
      <PublicNav />
      <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      <article className="research-detail">
        <div className="pub-wrap" style={{ maxWidth: '720px', padding: '80px 24px 48px' }}>
          <a href="/research" className="research-back">&larr; All research</a>

          <div className="research-detail-head">
            <span
              className="research-card-rating"
              style={{ color: RATING_COLORS[entry.rating] ?? 'var(--ink)', borderColor: RATING_COLORS[entry.rating] ?? 'var(--ink)' }}
            >
              {entry.rating}
            </span>
            <p className="research-detail-ticker">{entry.ticker}</p>
            <h1 className="research-detail-title">{entry.company}</h1>
            <p className="research-detail-date">{entry.date}</p>
          </div>

          <p className="research-detail-thesis">{entry.thesis}</p>

          {entry.body ? (
            <div className="prose-issue" dangerouslySetInnerHTML={{ __html: entry.body }} />
          ) : (
            <div className="research-placeholder">
              <p className="pub-label" style={{ color: 'var(--tan)' }}>Coming soon</p>
              <p className="pub-copy">Full pitch — thesis, valuation framework, key risks, and catalysts — landing here shortly.</p>
            </div>
          )}
        </div>
      </article>

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
