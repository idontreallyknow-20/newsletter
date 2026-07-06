import PublicNav from '@/components/PublicNav'
import SiteFooter from '@/components/SiteFooter'
import ResubscribeButton from '@/components/ResubscribeButton'

export const metadata = { title: 'Unsubscribed | Joseph' }

export default function UnsubscribedPage({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email ?? ''

  return (
    <>
      <PublicNav />
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div className="fade-up" style={{ maxWidth: '460px', width: '100%', textAlign: 'center' }}>
          <p className="pub-label" style={{ textAlign: 'center' }}>Unsubscribed</p>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '32px', fontWeight: 900, color: 'var(--ink)', marginBottom: '14px', lineHeight: 1.15 }}>
            You&apos;re off the list.
          </h1>
          <p style={{ fontFamily: 'var(--font-dm), sans-serif', fontSize: '15px', color: 'var(--tan)', lineHeight: 1.7, marginBottom: '8px' }}>
            {email ? <><strong style={{ color: 'var(--ink)', fontWeight: 500 }}>{email}</strong> won&apos;t receive any more issues.</> : 'You won’t receive any more issues.'}
          </p>
          <p style={{ fontFamily: 'var(--font-dm), sans-serif', fontSize: '13px', color: 'var(--tan)', opacity: 0.75, marginBottom: '36px' }}>
            Changed your mind? You can come back anytime.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {email && <ResubscribeButton email={email} />}
            <a href="/#issues" className="pub-btn-ghost">Browse the archive</a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
