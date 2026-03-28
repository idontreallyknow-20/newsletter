import { ARTICLES } from '@/lib/articles'
import PublicNav from '@/components/PublicNav'

export default function NotFound() {
  return (
    <>
      <PublicNav />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '160px 48px 120px', textAlign: 'center' }}>
        <p className="pub-label" style={{ textAlign: 'center' }}>404</p>
        <h1 className="pub-heading" style={{ textAlign: 'center', marginBottom: '20px' }}>
          This page doesn&apos;t exist.
        </h1>
        <p className="pub-copy" style={{ maxWidth: '440px', margin: '0 auto 40px', textAlign: 'center' }}>
          The issue or page you were looking for couldn&apos;t be found. It may have moved or never existed.
        </p>
        <div className="pub-buttons" style={{ justifyContent: 'center' }}>
          <a href="/" className="pub-btn-primary">Back to home →</a>
          <a href="/#issues" className="pub-btn-ghost">Browse issues</a>
        </div>

        <hr className="pub-rule" style={{ margin: '64px 0 48px' }} />

        <p className="pub-label" style={{ textAlign: 'center', marginBottom: '24px' }}>Recent Issues</p>
        <div>
          {ARTICLES.slice(0, 3).map(article => (
            <a key={article.slug} href={`/issues/${article.slug}`} className="pub-issue-row" style={{ textDecoration: 'none' }}>
              <span className="pub-issue-num">{article.num}</span>
              <span className="pub-issue-title">{article.title}</span>
              <span className="pub-issue-tag">{article.tag}</span>
              <span className="pub-issue-date">{article.date.replace('March', 'Mar').replace('February', 'Feb')}</span>
            </a>
          ))}
        </div>
      </div>

      <footer className="pub-footer">
        <span className="pub-footer-copy">© 2026 Joseph. Made with curiosity.</span>
        <nav className="pub-footer-links">
          <a href="/">Home</a>
          <a href="/#issues">Issues</a>
          <a href="/#subscribe">Subscribe</a>
        </nav>
      </footer>
    </>
  )
}
