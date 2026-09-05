import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { eq } from 'drizzle-orm'
import { ARTICLES, getArticle } from '@/lib/articles'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'
import { markdownToHtml } from '@/lib/markdown'
import PublicNav from '@/components/PublicNav'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import ReadingProgress from '@/components/ReadingProgress'
import ShareRow from '@/components/ShareRow'
import SiteFooter from '@/components/SiteFooter'
import SmoothScroll from '@/components/SmoothScroll'
import { ARTICLE_ILLUSTRATIONS } from '@/components/ArticleIllustrations'

export const dynamic = 'force-dynamic'

function toIsoDate(dateStr: string): string {
  try { return new Date(dateStr).toISOString() } catch { return dateStr }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticle(params.slug)
  const images = [{ url: '/opengraph-image', width: 1200, height: 630 }]
  if (article) {
    const title = `${article.title} | Daily Brief`
    return {
      title, description: article.intro,
      alternates: { canonical: `/issues/${params.slug}` },
      openGraph: { title, description: article.intro, type: 'article', publishedTime: toIsoDate(article.date), images },
      twitter: { card: 'summary_large_image', title, description: article.intro, images: ['/opengraph-image'] },
    }
  }
  try {
    const [email] = await db.select().from(sentEmails).where(eq(sentEmails.slug, params.slug)).limit(1)
    if (!email) return {}
    const title = `${email.subject} | Daily Brief`
    const description = email.previewText ?? undefined
    return {
      title, description,
      alternates: { canonical: `/issues/${params.slug}` },
      openGraph: { title, description, type: 'article', images },
      twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
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
          <span>{num}</span><span>{date}</span><span>{readTime}</span><span>By Joseph</span>
        </div>
        <p className="lede" style={{ color: 'var(--slate-2)', marginTop: 28, maxWidth: '60ch' }}>{intro}</p>
      </div>
    </header>
  )
}

function Closing() {
  return (
    <section className="band band--ink closing">
      <div className="wrap closing-grid">
        <div>
          <p className="eyebrow">Subscribe</p>
          <h2 className="t-display" style={{ fontSize: 'clamp(38px, 6vw, 96px)' }}>The next one, <em>in your inbox.</em></h2>
        </div>
        <div>
          <p className="copy" style={{ marginBottom: 20 }}>Free, about 7:00 AM Eastern. English or Chinese.</p>
          <PublicSubscribeForm />
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
    const ill = ARTICLE_ILLUSTRATIONS[article.slug]
    return (
      <>
        <ReadingProgress />
        <SmoothScroll />
        <PublicNav />
        <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />
        <Head tag={article.tag} num={article.num} date={article.date} readTime={article.readTime} title={article.title} intro={article.intro} />
        <div className="art-body">
          <div className="wrap art-cols">
            <aside className="art-side">
              {ill && <div className="ill" aria-hidden="true">{ill.svg}</div>}
              <div><span className="t-mono">In this issue</span>
                <ol style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 14, lineHeight: 1.5, color: 'var(--slate)' }}>
                  {article.sections.filter(s => s.heading).map((s, i) => <li key={i}>{s.heading}</li>)}
                </ol>
              </div>
            </aside>
            <article>
              {article.sections.map((s, i) => (
                <div key={i}>
                  {s.heading && <h2 className="h">{s.heading}</h2>}
                  {s.body.split('\n\n').map((para, j) => <p key={j} className="p">{para}</p>)}
                </div>
              ))}
              <ShareRow title={article.title} />
              <nav className="art-nav" aria-label="Neighbouring issues">
                {prev ? <a href={`/issues/${prev.slug}`}><span className="t-mono">Previous</span><span className="title">{prev.title}</span></a> : <span />}
                {next ? <a href={`/issues/${next.slug}`} className="right"><span className="t-mono">Next</span><span className="title">{next.title}</span></a>
                  : <span className="right"><span className="t-mono">Latest</span><span className="title" style={{ color: 'var(--slate)' }}>You are up to date.</span></span>}
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
  if (!email) notFound()

  const bodyHtml = email.bodyMarkdown ? markdownToHtml(email.bodyMarkdown) : (email.bodyHtml ?? '')
  const sentDate = new Date(email.sentAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Toronto' })
  const words = (email.bodyMarkdown || '').split(/\s+/).length
  return (
    <>
      <ReadingProgress />
      <SmoothScroll />
      <PublicNav />
      <Head tag="Daily" num={email.issueDate ?? ''} date={sentDate} readTime={`${Math.max(2, Math.round(words / 220))} min read`} title={email.subject} intro={email.previewText ?? ''} />
      <div className="art-body">
        <div className="wrap art-cols">
          <aside className="art-side"><span className="t-mono">Sent to subscribers on {sentDate}</span></aside>
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
