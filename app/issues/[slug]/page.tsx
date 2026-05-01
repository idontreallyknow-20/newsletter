import { notFound } from 'next/navigation'
import { ARTICLES, getArticle } from '@/lib/articles'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import PublicNav from '@/components/PublicNav'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { markdownToHtml } from '@/lib/markdown'
import { ARTICLE_ILLUSTRATIONS } from '@/components/ArticleIllustrations'
import ReadingProgress from '@/components/ReadingProgress'
import ShareRow from '@/components/ShareRow'

export const dynamic = 'force-dynamic'

function toIsoDate(dateStr: string): string {
  try { return new Date(dateStr).toISOString() } catch { return dateStr }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticle(params.slug)
  if (article) {
    const title = `${article.title} | Joseph`
    const images = [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }]
    return {
      title,
      description: article.intro,
      alternates: { canonical: `/issues/${params.slug}` },
      openGraph: {
        title,
        description: article.intro,
        type: 'article',
        publishedTime: toIsoDate(article.date),
        images,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: article.intro,
        images: ['/opengraph-image'],
      },
    }
  }

  // Fall back to DB
  const [email] = await db.select().from(sentEmails).where(eq(sentEmails.slug, params.slug)).limit(1)
  if (!email) return {}
  const title = `${email.subject} | Joseph`
  const description = email.previewText ?? undefined
  const images = [{ url: '/opengraph-image', width: 1200, height: 630 }]
  return {
    title,
    description,
    alternates: { canonical: `/issues/${params.slug}` },
    openGraph: { title, description, type: 'article', images },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
  }
}

export default async function IssuePage({ params }: { params: { slug: string } }) {
  const staticArticle = getArticle(params.slug)

  if (staticArticle) {
    const article = staticArticle
    const currentIndex = ARTICLES.findIndex(a => a.slug === article.slug)
    const prev = ARTICLES[currentIndex + 1] ?? null
    const next = ARTICLES[currentIndex - 1] ?? null
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dailybriefhq.com'
    const articleUrl = `${baseUrl}/issues/${article.slug}`
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.intro,
      datePublished: toIsoDate(article.date),
      dateModified: toIsoDate(article.date),
      author: { '@type': 'Person', name: 'Joseph', url: baseUrl },
      publisher: {
        '@type': 'Organization',
        name: 'Joseph — Economics & AI',
        url: baseUrl,
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
      url: articleUrl,
      image: `${baseUrl}/opengraph-image`,
      articleSection: article.tag,
    }

    return (
      <>
        <ReadingProgress />
        <PublicNav />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Article */}
        <article style={{ maxWidth: '720px', margin: '0 auto', padding: '120px 48px 32px' }}>

          {/* Meta */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#c0392b', background: 'transparent',
                border: '1px solid #c0392b', borderRadius: '999px', padding: '4px 10px',
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

          {/* Illustration — centered hero between intro and body */}
          {ARTICLE_ILLUSTRATIONS[article.slug] && (
            <div style={{
              maxWidth: '480px', margin: '0 auto 40px',
              padding: '32px',
              background: 'var(--pub-cream-2)',
              border: '1px solid var(--pub-border)',
              color: 'var(--tan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {ARTICLE_ILLUSTRATIONS[article.slug].svg}
            </div>
          )}

          {/* Body */}
          <div>
            {article.sections.map((section, i) => {
              const midpoint = Math.floor(article.sections.length / 2)
              return (
                <div key={i} style={{ marginBottom: '36px' }}>
                  {section.heading && (
                    <h2 style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      fontSize: '22px', fontWeight: 700,
                      color: 'var(--ink)', marginTop: '2.25rem', marginBottom: '0.75rem', lineHeight: 1.25,
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
                  {i === midpoint && article.sections.length >= 3 && <InlineSubscribe />}
                </div>
              )
            })}
          </div>

          <ShareRow title={article.title} />

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0' }} />

          <RelatedIssues currentSlug={article.slug} tag={article.tag} />

          {/* Prev / Next */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '24px' }}>
            {prev ? (
              <a href={`/issues/${prev.slug}`} style={{
                fontFamily: 'var(--font-dm)', fontSize: '13px', color: 'var(--tan)',
                textDecoration: 'none', flex: 1,
              }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.6 }}>← Previous</div>
                <div style={{ color: 'var(--ink)', fontWeight: 500, lineHeight: 1.3 }}>{prev.title}</div>
              </a>
            ) : <div style={{ flex: 1 }} />}
            {next ? (
              <a href={`/issues/${next.slug}`} style={{
                fontFamily: 'var(--font-dm)', fontSize: '13px', color: 'var(--tan)',
                textDecoration: 'none', flex: 1, textAlign: 'right',
              }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.6 }}>Next →</div>
                <div style={{ color: 'var(--ink)', fontWeight: 500, lineHeight: 1.3 }}>{next.title}</div>
              </a>
            ) : (
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.35, fontFamily: 'var(--font-dm)' }}>You&apos;re up to date</div>
                <div style={{ color: 'var(--tan)', fontWeight: 500, lineHeight: 1.3, fontFamily: 'var(--font-dm)', fontSize: '13px', opacity: 0.4 }}>Latest issue ✓</div>
              </div>
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
      <PublicNav />

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

        <ShareRow title={email.subject} />
      </article>

      <SubscribeCta />
      <SiteFooter />
    </>
  )
}


function SubscribeCta() {
  return (
    <section style={{ background: '#1a1a1a', padding: '72px 48px' }}>
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

function RelatedIssues({ currentSlug, tag }: { currentSlug: string; tag: string }) {
  const sameTag = ARTICLES.filter(a => a.tag === tag && a.slug !== currentSlug).slice(0, 3)
  const filler = sameTag.length < 3
    ? ARTICLES.filter(a => a.slug !== currentSlug && a.tag !== tag).slice(0, 3 - sameTag.length)
    : []
  const related = [...sameTag, ...filler]
  if (related.length === 0) return null
  return (
    <section aria-label="Related issues" style={{ margin: '8px 0 32px' }}>
      <p className="pub-label" style={{ marginBottom: '20px' }}>Keep reading</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {related.map(a => (
          <a key={a.slug} href={`/issues/${a.slug}`} style={{
            display: 'block',
            padding: '20px',
            background: 'var(--pub-cream-2)',
            border: '1px solid var(--pub-border)',
            textDecoration: 'none',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{
                fontFamily: 'var(--font-dm)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--red)', borderBottom: '1px solid var(--red)',
              }}>{a.tag}</span>
              <span style={{ fontFamily: 'var(--font-dm)', fontSize: '11px', color: 'var(--tan)' }}>
                {a.readTime}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '17px', fontWeight: 700, lineHeight: 1.3,
              color: 'var(--ink)',
            }}>{a.title}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

function InlineSubscribe() {
  return (
    <aside
      aria-label="Subscribe to the newsletter"
      style={{
        margin: '40px 0',
        padding: '28px 28px 24px',
        background: '#1a1a1a',
        color: '#f5f0e8',
        borderLeft: '4px solid var(--red)',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'var(--red)', marginBottom: '10px',
      }}>
        Liking this issue?
      </p>
      <p style={{
        fontFamily: 'var(--font-playfair), Georgia, serif',
        fontSize: '22px', fontWeight: 700, lineHeight: 1.25,
        color: '#f5f0e8', marginBottom: '18px',
      }}>
        Get the next one in your inbox. Free, ~5 minutes a read.
      </p>
      <PublicSubscribeForm minimal />
    </aside>
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
