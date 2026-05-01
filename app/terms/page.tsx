import type { Metadata } from 'next'
import PublicNav from '@/components/PublicNav'

export const metadata: Metadata = {
  title: 'Terms of Service | Joseph',
  description: 'Terms of using the Joseph newsletter site and content.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <>
      <PublicNav />
      <main id="main-content" style={{ background: 'var(--pub-cream)', minHeight: '60vh' }}>
        <article style={{ maxWidth: '720px', margin: '0 auto', padding: '120px 48px 96px' }}>
          <p className="pub-label">Legal</p>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-0.02em',
            color: 'var(--ink)', margin: '12px 0 8px',
          }}>Terms of service</h1>
          <p style={{ fontFamily: 'var(--font-dm)', fontSize: '13px', color: 'var(--tan)', marginBottom: '40px' }}>
            Last updated: May 1, 2026
          </p>

          <Section title="Acceptance">
            <p>
              By accessing this site or subscribing to the newsletter, you agree to these
              terms. If you don&apos;t, please don&apos;t use the site.
            </p>
          </Section>

          <Section title="Editorial content">
            <p>
              Newsletter issues represent the author&apos;s independent analysis of public
              economic and AI developments. Issues cite primary sources where possible and
              are written without paid sponsorship. Nothing on this site is investment,
              legal, or tax advice. Always do your own research before acting on any
              information published here.
            </p>
          </Section>

          <Section title="Use of content">
            <p>
              You may share, quote, and link to issues with attribution. Wholesale
              republication of full issues, paywalled-feed scraping, or use of issue content
              to train commercial machine-learning models is not permitted without prior
              written permission.
            </p>
          </Section>

          <Section title="Account and access">
            <p>
              The newsletter is free. We reserve the right to refuse service, suspend
              subscriptions for abusive behavior, or remove subscribers whose addresses bounce
              repeatedly.
            </p>
          </Section>

          <Section title="Disclaimers">
            <p>
              The site and newsletter are provided &ldquo;as is.&rdquo; While we try to be
              accurate, we make no warranty that the content is current, complete, or fit for
              any particular purpose. To the fullest extent permitted by law, we are not
              liable for any indirect or consequential damages arising from use of the site.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We may update these terms. Material changes will be noted on this page.
              Continued use of the site after a change constitutes acceptance.
            </p>
          </Section>
        </article>
      </main>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '36px' }}>
      <h2 style={{
        fontFamily: 'var(--font-playfair), Georgia, serif',
        fontSize: '22px', fontWeight: 700,
        color: 'var(--ink)', marginBottom: '12px',
      }}>{title}</h2>
      <div style={{
        fontFamily: 'var(--font-dm)', fontSize: '16px', fontWeight: 300,
        color: 'var(--ink)', lineHeight: 1.7,
      }}>
        {children}
      </div>
    </section>
  )
}
