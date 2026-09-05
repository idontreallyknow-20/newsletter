import { ARTICLES } from '@/lib/articles'
import PublicNav from '@/components/PublicNav'
import SiteFooter from '@/components/SiteFooter'

export default function NotFound() {
  return (
    <>
      <PublicNav />
      <main className="simple">
        <div className="wrap">
          <p className="eyebrow">404</p>
          <h1 className="t-display">Nothing filed here.</h1>
          <p className="copy">The page or issue you asked for is not in the archive. It may have moved, or the link was cut off.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 64 }}>
            <a href="/" className="btn btn--red">Back to the front page</a>
            <a href="/#issues" className="btn btn--ghost" style={{ color: 'var(--ink)' }}>Browse issues</a>
          </div>
          <p className="t-mono" style={{ color: 'var(--slate)', marginBottom: 8 }}>Recent issues</p>
          <div className="arch-list">
            {ARTICLES.slice(0, 4).map(a => (
              <a key={a.slug} href={`/issues/${a.slug}`} className="arch-row">
                <span className="t-mono">{a.num}</span><span className="title">{a.title}</span><span className="t-mono">{a.tag}</span><span className="t-mono">{a.date}</span>
              </a>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
