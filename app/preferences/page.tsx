import PublicNav from '@/components/PublicNav'

const LABELS: Record<string, string> = {
  weekly: 'Weekly digest',
  daily: 'Daily digest',
  both: 'Weekly + Daily',
  en: 'English',
  zh: '中文',
}

export default function PreferencesPage({ searchParams }: { searchParams: { updated?: string; freq?: string; lang?: string; error?: string } }) {
  const updated = searchParams.updated === '1'
  const error = searchParams.error === '1'
  const change = searchParams.freq ? LABELS[searchParams.freq] : searchParams.lang ? LABELS[searchParams.lang] : null

  return (
    <>
      <PublicNav />
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
          {updated ? (
            <>
              <div style={{ fontSize: '40px', marginBottom: '24px' }}>✓</div>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 900, color: 'var(--ink)', marginBottom: '12px', lineHeight: 1.15 }}>
                Preferences updated.
              </h1>
              {change && (
                <p style={{ fontFamily: 'var(--font-dm), sans-serif', fontSize: '16px', color: 'var(--tan)', marginBottom: '32px' }}>
                  Switched to <strong style={{ color: 'var(--ink)' }}>{change}</strong>.
                </p>
              )}
              <a href="/" style={{ fontFamily: 'var(--font-dm), sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--red)', textDecoration: 'none', borderBottom: '1px solid var(--red)', paddingBottom: '2px' }}>
                Back to the newsletter →
              </a>
            </>
          ) : error ? (
            <>
              <div style={{ fontSize: '40px', marginBottom: '24px' }}>×</div>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 900, color: 'var(--ink)', marginBottom: '12px' }}>
                Something went wrong.
              </h1>
              <p style={{ fontFamily: 'var(--font-dm), sans-serif', fontSize: '15px', color: 'var(--tan)', marginBottom: '32px' }}>
                The link may have expired or been invalid. Try clicking the link from your welcome email again.
              </p>
              <a href="/" style={{ fontFamily: 'var(--font-dm), sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--red)', textDecoration: 'none', borderBottom: '1px solid var(--red)', paddingBottom: '2px' }}>
                Back to the newsletter →
              </a>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 900, color: 'var(--ink)', marginBottom: '12px' }}>
                Preferences
              </h1>
              <p style={{ fontFamily: 'var(--font-dm), sans-serif', fontSize: '15px', color: 'var(--tan)' }}>
                Use the links in your welcome email to update your delivery preferences.
              </p>
            </>
          )}
        </div>
      </div>
      <footer className="pub-footer">
        <span className="pub-footer-copy">© 2026 Joseph. Made with curiosity.</span>
        <nav className="pub-footer-links">
          <a href="/">← Back to home</a>
          <a href="/#issues">All issues</a>
        </nav>
      </footer>
    </>
  )
}
