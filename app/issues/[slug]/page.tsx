import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { eq } from 'drizzle-orm'
import fs from 'fs'
import path from 'path'
import { ARTICLES, getArticle } from '@/lib/articles'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'
import { markdownToHtml } from '@/lib/markdown'
import { SITE_URL, articleJsonLd, breadcrumbJsonLd, toIsoDate } from '@/lib/seo'
import PublicNav from '@/components/PublicNav'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import ReadingProgress from '@/components/ReadingProgress'
import ShareRow from '@/components/ShareRow'
import SiteFooter from '@/components/SiteFooter'
import SmoothScroll from '@/components/SmoothScroll'
import Figure from '@/components/Figure'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticle(params.slug)
  const images = [{ url: `/issues/${params.slug}/opengraph-image`, width: 1200, height: 630 }]
  if (article) {
    const title = article.title
    const description = article.summary || article.intro
    return {
      title, description,
      alternates: { canonical: `/issues/${params.slug}` },
      openGraph: { title, description, type: 'article', publishedTime: toIsoDate(article.date), authors: [`${SITE_URL}/about`], section: article.tag, images },
      twitter: { card: 'summary_large_image', title, description, images: images.map(i => i.url) },
    }
  }
  try {
    const [email] = await db.select().from(sentEmails).where(eq(sentEmails.slug, params.slug)).limit(1)
    if (!email) return {}
    const title = email.subject
    const description = email.previewText ?? undefined
    return {
      title, description,
      alternates: { canonical: `/issues/${params.slug}` },
      openGraph: { title, description, type: 'article', images },
      twitter: { card: 'summary_large_image', title, description, images: images.map(i => i.url) },
    }
  } catch { return {} }
}

function Head({ tag, num, date, readTime, title, intro }: { tag: string; num: string; date: string; readTime: string; title: string; intro: string }) {
  return (
    <header className="art-head">
      <div className="wrap">
        <p className="eyebrow">{tag}</p>
        <h1 className="t-display art-title">{title}</h1>
        <div className="art-meta">
          <span>{num}</span><span>{date}</span><span>{readTime}</span><span>By <a href="/about" style={{ textDecoration: 'none', borderBottom: '1px solid currentColor' }}>Joseph Leung</a></span>
        </div>
        <p className="lede" style={{ marginTop: 28, maxWidth: '60ch' }}>{intro}</p>
      </div>
    </header>
  )
}

function Author() {
  const hasPortrait = fs.existsSync(path.join(process.cwd(), 'public', 'joseph.jpg'))
  return (
    <div className="author">
      <div className="byline-photo">{hasPortrait
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src="/joseph.jpg" alt="Joseph" width={88} height={88} /> : <span aria-hidden="true">J</span>}</div>
      <div><strong style={{ display: 'block', fontSize: 14 }}>Joseph</strong><span style={{ fontSize: 12, color: 'var(--muted)' }}>Grade 11, Richmond Hill · <a href="/about">About</a></span></div>
    </div>
  )
}

function Closing() {
  return (
    <section className="band band--ink closing">
      <div className="wrap closing-grid">
        <div>
          <p className="eyebrow" style={{ color: '#E3453A' }}>Subscribe</p>
          <h2 className="t-display" style={{ fontSize: 'clamp(36px, 6vw, 88px)' }}>The next one, <em>in your inbox.</em></h2>
        </div>
        <div>
          <p className="copy" style={{ marginBottom: 20 }}>Free, about 7:00 AM Eastern. English or Chinese, daily or weekly.</p>
          <PublicSubscribeForm id="sub-issue" />
        </div>
      </div>
    </section>
  )
}

export default async function IssuePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)

  if (article) {
    const idx = ARTICLES.findIndex(a => a.slug === article.slug)
    const prev = ARTICLES[idx + 1] ?? null
    const next = ARTICLES[idx - 1] ?? null
    const words = article.sections.reduce((n, s) => n + s.body.split(/\s+/).length, 0)
    const ld = [
      articleJsonLd({ slug: article.slug, title: article.title, description: article.summary || article.intro, datePublished: toIsoDate(article.date), section: article.tag, wordCount: words }),
      breadcrumbJsonLd([{ name: 'Daily Brief', url: SITE_URL }, { name: 'Issues', url: `${SITE_URL}/#issues` }, { name: article.title, url: `${SITE_URL}/issues/${article.slug}` }]),
    ]
    const mid = Math.max(1, Math.floor(article.sections.length / 2))
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <ReadingProgress />
        <SmoothScroll />
        <PublicNav />
        <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />
        <Head tag={article.tag} num={article.num} date={article.date} readTime={article.readTime} title={article.title} intro={article.intro} />
        <div className="art-body">
          <div className="wrap art-cols">
            <aside className="art-side">
              <Author />
              <div><span className="t-mono">In this issue</span>
                <ol>{article.sections.filter(s => s.heading).map((s, i) => <li key={i}>{s.heading}</li>)}</ol>
              </div>
            </aside>
            <article>
              {article.sections.map((s, i) => (
                <div key={i}>
                  {s.heading && <h2 className="h">{s.heading}</h2>}
                  {s.body.split('\n\n').map((para, j) => <p key={j} className="p">{para}</p>)}
                  {i === mid - 1 && article.figure && <Figure figure={article.figure} id={`fig-${article.slug}`} />}
                </div>
              ))}
              <ShareRow title={article.title} />
              <nav className="art-nav" aria-label="Neighbouring issues">
                {prev ? <a href={`/issues/${prev.slug}`}><span className="t-mono">Previous</span><span className="title">{prev.title}</span></a> : <span />}
                {next ? <a href={`/issues/${next.slug}`} className="right"><span className="t-mono">Next</span><span className="title">{next.title}</span></a>
                  : <span className="right"><span className="t-mono">Latest</span><span className="title" style={{ color: 'var(--muted)' }}>You are up to date.</span></span>}
              </nav>
            </article>
          </div>
        </div>
        <Closing />
        <SiteFooter />
      </>
    )
  }

  let email: typeof sentEmails.$inferSelect | undefined
  try { [email] = await db.select().from(sentEmails).where(eq(sentEmails.slug, params.slug)).limit(1) } catch { email = undefined }
  if (!email || email.status === 'archived') notFound()

  const bodyHtml = email.bodyMarkdown ? markdownToHtml(email.bodyMarkdown) : (email.bodyHtml ?? '')
  const sentDate = new Date(email.sentAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Toronto' })
  const words = (email.bodyMarkdown || '').split(/\s+/).length
  const ld = articleJsonLd({ slug: params.slug, title: email.subject, description: email.previewText || email.subject, datePublished: new Date(email.sentAt).toISOString().slice(0, 10), section: 'Daily', wordCount: words })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ReadingProgress />
      <SmoothScroll />
      <PublicNav />
      <Head tag="Daily" num={email.issueDate ?? ''} date={sentDate} readTime={`${Math.max(2, Math.round(words / 220))} min read`} title={email.subject} intro={email.previewText ?? ''} />
      <div className="art-body">
        <div className="wrap art-cols">
          <aside className="art-side"><Author /><span className="t-mono">Sent to subscribers on {sentDate}</span></aside>
          <article>
            <div className="prose-issue" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            <ShareRow title={email.subject} />
          </article>
        </div>
      </div>
      <Closing />
      <SiteFooter />
    </>
  )
}
