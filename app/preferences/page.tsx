import PublicNav from '@/components/PublicNav'
import SiteFooter from '@/components/SiteFooter'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { verifyEmailToken } from '@/lib/token'
import { normalizeEmail } from '@/lib/validate-email'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Email Preferences | Joseph' }

const LABELS: Record<string, string> = {
  weekly: 'Weekly digest',
  daily: 'Daily digest',
  both: 'Weekly + Daily',
  en: 'English',
  zh: '中文',
}

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: '28px', fontWeight: 900, color: 'var(--ink)',
  marginBottom: '12px', lineHeight: 1.15,
}
const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm), sans-serif',
  fontSize: '15px', color: 'var(--tan)', lineHeight: 1.7,
}
const backLink: React.CSSProperties = {
  fontFamily: 'var(--font-dm), sans-serif', fontSize: '14px', fontWeight: 500,
  color: 'var(--red)', textDecoration: 'none',
  borderBottom: '1px solid var(--red)', paddingBottom: '2px',
}

function OptionLink({ href, label, sub, active }: { href: string; label: string; sub: string; active: boolean }) {
  return (
    <a
      href={href}
      style={{
        display: 'block', padding: '16px 18px', textAlign: 'left', textDecoration: 'none',
        background: active ? '#fff' : 'transparent',
        border: `1px solid ${active ? 'rgba(200,64,42,0.35)' : 'var(--pub-border)'}`,
        position: 'relative',
      }}
    >
      {active && (
        <span style={{ position: 'absolute', top: '12px', right: '14px', color: 'var(--red)', fontSize: '12px' }}>✓ Current</span>
      )}
      <span style={{ display: 'block', fontFamily: 'var(--font-dm), sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '4px' }}>{label}</span>
      <span style={{ display: 'block', fontFamily: 'var(--font-dm), sans-serif', fontSize: '12px', color: 'var(--tan)' }}>{sub}</span>
    </a>
  )
}

export default async function PreferencesPage({ searchParams }: { searchParams: { updated?: string; freq?: string; lang?: string; error?: string; email?: string; token?: string } }) {
  const updated = searchParams.updated === '1'
  const error = searchParams.error === '1'
  const change = searchParams.freq ? LABELS[searchParams.freq] : searchParams.lang ? LABELS[searchParams.lang] : null

  // Signed self-service mode: opened from the "Preferences" link in an email footer
  const email = normalizeEmail(searchParams.email)
  const token = searchParams.token ?? ''
  const secret = process.env.EMAIL_TOKEN_SECRET || process.env.DASHBOARD_PASSWORD || ''
  let subscriber: { frequency: string | null; language: string | null } | null = null
  if (email && token && secret && verifyEmailToken(email, token, secret)) {
    try {
      const [row] = await db
        .select({ frequency: subscribers.frequency, language: subscribers.language })
        .from(subscribers)
        .where(eq(subscribers.email, email))
        .limit(1)
      subscriber = row ?? null
    } catch {
      subscriber = null
    }
  }
  const apiBase = subscriber ? `/api/preferences?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}` : ''

  return (
    <>
      <PublicNav />
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 80px' }}>
        <div className="fade-up" style={{ maxWidth: '460px', width: '100%', textAlign: 'center' }}>
          {updated && subscriber ? (
            <>
              <p className="pub-label" style={{ textAlign: 'center' }}>Preferences</p>
              <h1 style={headingStyle}>Updated.</h1>
              <p style={{ ...bodyStyle, marginBottom: '32px' }}>
                {change ? <>Switched to <strong style={{ color: 'var(--ink)' }}>{change}</strong>. </> : null}
                Your current settings:
              </p>
              <div style={{ display: 'grid', gap: '8px', marginBottom: '28px' }}>
                <OptionLink href={`${apiBase}&freq=daily`} label="Daily digest" sub="Every morning — a five-minute read" active={subscriber.frequency === 'daily'} />
                <OptionLink href={`${apiBase}&freq=weekly`} label="Weekly digest" sub="One deeper issue, once a week" active={subscriber.frequency === 'weekly'} />
                <OptionLink href={`${apiBase}&freq=both`} label="Daily + Weekly" sub="Everything, as it publishes" active={subscriber.frequency === 'both'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '36px' }}>
                <OptionLink href={`${apiBase}&lang=en`} label="English" sub="Original edition" active={(subscriber.language ?? 'en') === 'en'} />
                <OptionLink href={`${apiBase}&lang=zh`} label="中文" sub="简体中文版" active={subscriber.language === 'zh'} />
              </div>
              <a href="/" style={backLink}>Back to the newsletter →</a>
            </>
          ) : updated ? (
            <>
              <p className="pub-label" style={{ textAlign: 'center' }}>Preferences</p>
              <h1 style={headingStyle}>Preferences updated.</h1>
              {change && (
                <p style={{ ...bodyStyle, marginBottom: '32px' }}>
                  Switched to <strong style={{ color: 'var(--ink)' }}>{change}</strong>.
                </p>
              )}
              <a href="/" style={backLink}>Back to the newsletter →</a>
            </>
          ) : error ? (
            <>
              <p className="pub-label" style={{ textAlign: 'center' }}>Preferences</p>
              <h1 style={headingStyle}>Something went wrong.</h1>
              <p style={{ ...bodyStyle, marginBottom: '32px' }}>
                The link may have expired or been invalid. Try clicking the link from a recent email again.
              </p>
              <a href="/" style={backLink}>Back to the newsletter →</a>
            </>
          ) : subscriber ? (
            <>
              <p className="pub-label" style={{ textAlign: 'center' }}>Preferences</p>
              <h1 style={headingStyle}>How should we deliver?</h1>
              <p style={{ ...bodyStyle, marginBottom: '32px' }}>
                Settings for <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>{email}</strong>. One click to change — it applies immediately.
              </p>
              <div style={{ display: 'grid', gap: '8px', marginBottom: '28px' }}>
                <OptionLink href={`${apiBase}&freq=daily`} label="Daily digest" sub="Every morning — a five-minute read" active={subscriber.frequency === 'daily'} />
                <OptionLink href={`${apiBase}&freq=weekly`} label="Weekly digest" sub="One deeper issue, once a week" active={subscriber.frequency === 'weekly'} />
                <OptionLink href={`${apiBase}&freq=both`} label="Daily + Weekly" sub="Everything, as it publishes" active={subscriber.frequency === 'both'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '36px' }}>
                <OptionLink href={`${apiBase}&lang=en`} label="English" sub="Original edition" active={(subscriber.language ?? 'en') === 'en'} />
                <OptionLink href={`${apiBase}&lang=zh`} label="中文" sub="简体中文版" active={subscriber.language === 'zh'} />
              </div>
              <a href="/" style={backLink}>Back to the newsletter →</a>
            </>
          ) : (
            <>
              <p className="pub-label" style={{ textAlign: 'center' }}>Preferences</p>
              <h1 style={headingStyle}>Manage your subscription.</h1>
              <p style={bodyStyle}>
                Open the <strong style={{ color: 'var(--ink)' }}>Preferences</strong> link in the footer of any issue
                to change your delivery frequency or language — no password needed.
              </p>
            </>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
