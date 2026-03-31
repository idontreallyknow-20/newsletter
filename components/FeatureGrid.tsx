import { ARTICLES } from '@/lib/articles'

const TAG_COLORS: Record<string, string> = {
  Economics: '#c8402a',
  AI: '#2563eb',
  Policy: '#7c3aed',
  Markets: '#0891b2',
  Labor: '#059669',
  Tech: '#d97706',
}

export default function FeatureGrid() {
  const primary = ARTICLES[0]
  const secondary = ARTICLES.slice(1, 4)

  return (
    <section className="feat-grid-section" aria-label="Featured articles">
      <div className="pub-wrap">
        <div className="feat-grid">
          {/* Primary feature */}
          <a href={`/issues/${primary.slug}`} className="feat-primary">
            <span
              className="feat-tag"
              style={{ color: TAG_COLORS[primary.tag] ?? 'var(--red)' }}
            >
              {primary.tag}
            </span>
            <h2 className="feat-primary-title">{primary.title}</h2>
            <p className="feat-primary-intro">{primary.intro}</p>
            <span className="feat-read-more">Read more &rarr;</span>
            <div className="feat-primary-meta">{primary.date} &middot; {primary.readTime}</div>
          </a>

          {/* Secondary column */}
          <div className="feat-secondary-col">
            {secondary.map(a => (
              <a key={a.slug} href={`/issues/${a.slug}`} className="feat-secondary-card">
                <span
                  className="feat-tag"
                  style={{ color: TAG_COLORS[a.tag] ?? 'var(--red)' }}
                >
                  {a.tag}
                </span>
                <h3 className="feat-secondary-title">{a.title}</h3>
                <span className="feat-meta">{a.date} &middot; {a.readTime}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
