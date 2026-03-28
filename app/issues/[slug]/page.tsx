import { notFound } from 'next/navigation'
import { ARTICLES, getArticle } from '@/lib/articles'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { markdownToHtml } from '@/lib/markdown'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticle(params.slug)
  if (article) {
    const title = `${article.title} — Joseph`
    return {
      title,
      description: article.intro,
      openGraph: {
        title,
        description: article.intro,
        type: 'article',
        publishedTime: article.date,
      },
      twitter: {
        card: 'summary',
        title,
        description: article.intro,
      },
    }
  }

  // Fall back to DB
  const [email] = await db.select().from(sentEmails).where(eq(sentEmails.slug, params.slug)).limit(1)
  if (!email) return {}
  const title = `${email.subject} — Joseph`
  const description = email.previewText ?? undefined
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary', title, description },
  }
}

export default async function IssuePage({ params }: { params: { slug: string } }) {
  const staticArticle = getArticle(params.slug)

  if (staticArticle) {
    const article = staticArticle
    const currentIndex = ARTICLES.findIndex(a => a.slug === article.slug)
    const prev = ARTICLES[currentIndex + 1] ?? null
    const next = ARTICLES[currentIndex - 1] ?? null

    return (
      <>
        {/* Nav */}
        <nav className="pub-nav">
          <a href="/" className="pub-logo">Joseph<span>.</span></a>
          <ul className="pub-nav-links">
            <li><a href="/#about">About</a></li>
            <li><a href="/#topics">Topics</a></li>
            <li><a href="/#issues">Issues</a></li>
            <li><a href="/#subscribe">Subscribe</a></li>
          </ul>
        </nav>

        {/* Article */}
        <article style={{ maxWidth: '720px', margin: '0 auto', padding: '120px 48px 96px' }}>

          {/* Meta */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--red)', background: 'rgba(200,64,42,0.07)',
                border: '1px solid rgba(200,64,42,0.2)', padding: '3px 10px',
              }}>{article.tag}</span>
              <span style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', color: 'var(--tan)' }}>
                {article.num} · {article.date} · {article.readTime}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              marginBottom: '24px',
            }}>
              {article.title}
            </h1>

            <p style={{
              fontFamily: 'var(--font-dm)', fontSize: '18px', fontWeight: 300,
              color: 'var(--tan)', lineHeight: 1.7,
              borderLeft: '3px solid var(--red)', paddingLeft: '20px',
            }}>
              {article.intro}
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0' }} />

          {/* Body */}
          <div>
            {article.sections.map((section, i) => (
              <div key={i} style={{ marginBottom: '36px' }}>
                {section.heading && (
                  <h2 style={{
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: '22px', fontWeight: 700,
                    color: 'var(--ink)', marginBottom: '14px', lineHeight: 1.25,
                  }}>
                    {section.heading}
                  </h2>
                )}
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j} style={{
                    fontFamily: 'var(--font-dm)', fontSize: '17px', fontWeight: 300,
                    color: 'var(--ink)', lineHeight: 1.8, marginBottom: '16px',
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0' }} />

          {/* Prev / Next */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '64px' }}>
            {prev ? (
              <a href={`/issues/${prev.slug}`} style={{
                fontFamily: 'var(--font-dm)', fontSize: '13px', color: 'var(--tan)',
                textDecoration: 'none', flex: 1,
              }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.6 }}>← Previous</div>
                <div style={{ color: 'var(--ink)', fontWeight: 500, lineHeight: 1.3 }}>{prev.title}</div>
              </a>
            ) : <div />}
            {next && (
              <a href={`/issues/${next.slug}`} style={{
                fontFamily: 'var(--font-dm)', fontSize: '13px', color: 'var(--tan)',
                textDecoration: 'none', flex: 1, textAlign: 'right',
              }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.6 }}>Next →</div>
                <div style={{ color: 'var(--ink)', fontWeight: 500, lineHeight: 1.3 }}>{next.title}</div>
              </a>
            )}
          </div>
        </article>

        <SubscribeCta />
        <SiteFooter />
      </>
    )
  }

  // DB-driven article fallback
  const [email] = await db.select().from(sentEmails).where(eq(sentEmails.slug, params.slug)).limit(1)
  if (!email) notFound()

  const bodyHtml = email.bodyMarkdown ? markdownToHtml(email.bodyMarkdown) : (email.bodyHtml ?? '')
  const sentDate = new Date(email.sentAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <nav className="pub-nav">
        <a href="/" className="pub-logo">Joseph<span>.</span></a>
        <ul className="pub-nav-links">
          <li><a href="/#about">About</a></li>
          <li><a href="/#topics">Topics</a></li>
          <li><a href="/#issues">Issues</a></li>
          <li><a href="/#subscribe">Subscribe</a></li>
        </ul>
      </nav>

      <article style={{ maxWidth: '720px', margin: '0 auto', padding: '120px 48px 96px' }}>
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', color: 'var(--tan)' }}>{sentDate}</span>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.02em', color: 'var(--ink)',
            margin: '16px 0 24px',
          }}>
            {email.subject}
          </h1>
          {email.previewText && (
            <p style={{
              fontFamily: 'var(--font-dm)', fontSize: '18px', fontWeight: 300,
              color: 'var(--tan)', lineHeight: 1.7,
              borderLeft: '3px solid var(--red)', paddingLeft: '20px',
            }}>
              {email.previewText}
            </p>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0' }} />

        <div
          className="prose-issue"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>

      <SubscribeCta />
      <SiteFooter />
    </>
  )
}

function SubscribeCta() {
  return (
    <section style={{ background: 'var(--ink)', padding: '72px 48px' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--red)', marginBottom: '16px',
        }}>
          Enjoyed this issue?
        </p>
        <h2 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900,
          color: '#f5f0e8', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '14px',
        }}>
          Get the next one in your inbox.
        </h2>
        <p style={{ fontFamily: 'var(--font-dm)', fontSize: '15px', fontWeight: 300, color: '#a09890', lineHeight: 1.65, marginBottom: '32px' }}>
          Free, weekly, and worth your five minutes.
        </p>
        <PublicSubscribeForm />
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="pub-footer">
      <span className="pub-footer-copy">© 2026 Joseph. Made with curiosity.</span>
      <nav className="pub-footer-links">
        <a href="/">← Back to home</a>
        <a href="/#issues">All issues</a>
      </nav>
    </footer>
  )
}
