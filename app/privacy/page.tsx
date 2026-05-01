import type { Metadata } from 'next'
import PublicNav from '@/components/PublicNav'

export const metadata: Metadata = {
  title: 'Privacy Policy | Joseph',
  description: 'How the Joseph newsletter collects, uses, and protects your data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
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
          }}>Privacy policy</h1>
          <p style={{ fontFamily: 'var(--font-dm)', fontSize: '13px', color: 'var(--tan)', marginBottom: '40px' }}>
            Last updated: May 1, 2026
          </p>

          <Section title="What we collect">
            <p>
              When you subscribe, we collect your email address and your delivery preferences
              (language and frequency). That&apos;s it. We do not ask for, store, or process
              other personal information.
            </p>
            <p>
              Like most websites, we may receive standard server logs (IP address, user agent,
              referring page) when you visit. These logs are used only to detect abuse and
              keep the site online; they are not used to build a profile of you.
            </p>
          </Section>

          <Section title="How we use your email">
            <p>
              Your email is used solely to deliver newsletter issues you opted into. We do not
              sell, rent, or share your email with anyone. We may use a transactional email
              provider (currently Resend) to send issues; that provider processes the email on
              our behalf under their own privacy commitments.
            </p>
          </Section>

          <Section title="Cookies and tracking">
            <p>
              The public site does not set advertising or third-party tracking cookies. A
              first-party cookie may be used solely to remember your theme preference
              (light/dark) and to authenticate the author&apos;s admin dashboard.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You can unsubscribe at any time using the link in any newsletter, or by replying
              to a newsletter email. On request, we will permanently delete your email and any
              associated preferences from our database.
            </p>
            <p>
              If you are in the EU/UK, you have rights under GDPR including access, correction,
              deletion, and portability. To exercise any of these, contact us using the email
              address listed in the footer.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If this policy changes in a meaningful way, we will note the update on this page
              and, where appropriate, in a newsletter issue.
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
