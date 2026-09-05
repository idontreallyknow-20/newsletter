import { Suspense } from 'react'
import PublicNav from '@/components/PublicNav'
import SmoothScroll from '@/components/SmoothScroll'
import MastheadHero from '@/components/hero/MastheadHero'
import IssueTicker from '@/components/IssueTicker'
import TodaysIssue from '@/components/TodaysIssue'
import AboutCredentials from '@/components/AboutCredentials'
import TopicDeck from '@/components/TopicDeck'
import ArchiveGrid, { type ArchiveItem } from '@/components/ArchiveGrid'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import SiteFooter from '@/components/SiteFooter'
import Reveal from '@/components/Reveal'
import { ARTICLES } from '@/lib/articles'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'
import { desc, isNotNull, and, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

async function latestSent() {
  try {
    const rows = await db.select({
      subject: sentEmails.subject, previewText: sentEmails.previewText, slug: sentEmails.slug, sentAt: sentEmails.sentAt, bodyMarkdown: sentEmails.bodyMarkdown,
    }).from(sentEmails).where(and(isNotNull(sentEmails.slug), eq(sentEmails.status, 'sent'))).orderBy(desc(sentEmails.sentAt)).limit(12)
    return rows
  } catch { return [] }
}

export default async function HomePage() {
  const sent = await latestSent()
  const sentItems: ArchiveItem[] = sent.filter(r => r.slug).map((r, i) => ({
    slug: r.slug!,
    num: `#${String(ARTICLES.length + sent.length - i).padStart(3, '0')}`,
    title: r.subject,
    tag: 'Daily',
    date: new Date(r.sentAt).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Toronto' }),
    readTime: `${Math.max(2, Math.round((r.bodyMarkdown || '').split(/\s+/).length / 220))} min read`,
    intro: r.previewText || '',
  }))
  const items: ArchiveItem[] = [...sentItems, ...ARTICLES.map(a => ({ slug: a.slug, num: a.num, title: a.title, tag: a.tag, date: a.date, readTime: a.readTime, intro: a.intro }))]
  const issueCount = items.length
  const today = items[0]
  const headlines = items.slice(0, 8).map(a => a.title)
  const counts: Record<string, number> = {}
  for (const a of items) counts[a.tag] = (counts[a.tag] || 0) + 1
  const dateline = new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Toronto' })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Daily Brief by Joseph',
    url: 'https://dailybriefhq.com',
    description: 'A short morning newsletter on economics and AI, written by Joseph, a Grade 11 student in Richmond Hill, Ontario.',
    publisher: { '@type': 'Person', name: 'Joseph' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SmoothScroll />
      <PublicNav />
      <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      <MastheadHero headlines={headlines} issueCount={issueCount} dateline={dateline} />

      <IssueTicker items={items.slice(0, 10).map(a => ({ num: a.num, title: a.title }))} />

      {/* Today's issue */}
      <section className="band band--fog" id="today">
        <div className="wrap today-grid">
          <Reveal>
            <p className="eyebrow">Latest issue</p>
            <h2 className="t-display" style={{ fontSize: 'clamp(38px, 5.5vw, 80px)', marginBottom: 20 }}>What went out this morning.</h2>
            <p className="copy">Each issue is one topic, two or three short sections, and a takeaway you can act on. Written and sent before first period.</p>
          </Reveal>
          <Reveal delay={150}>
            <TodaysIssue num={today.num} title={today.title} intro={today.intro} date={today.date} readTime={today.readTime} href={`/issues/${today.slug}`} />
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      {/* About */}
      <section className="band band--fog" id="about">
        <div className="wrap"><AboutCredentials /></div>
      </section>

      {/* Topics */}
      <section className="band band--ink" id="topics">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <p className="eyebrow">Topics</p>
                <h2 className="t-display">Six lenses on the same moving world.</h2>
              </div>
              <span className="copy" style={{ maxWidth: '32ch' }}>Pick a lens to filter the archive. Most issues sit under two.</span>
            </div>
          </Reveal>
          <TopicDeck counts={counts} />
        </div>
      </section>

      {/* Issues */}
      <section className="band band--fog" id="issues">
        <div className="wrap">
          <Suspense fallback={null}>
            <ArchiveGrid items={items} />
          </Suspense>
        </div>
      </section>

      {/* Subscribe */}
      <section className="band band--ink closing" id="subscribe">
        <div className="wrap closing-grid">
          <Reveal>
            <p className="eyebrow">Subscribe</p>
            <h2 className="t-display">Tomorrow&apos;s issue, <em>7:00 AM.</em></h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="copy" style={{ marginBottom: 20 }}>Free. English or Chinese, daily or weekly. One click to leave, and I never sell the list.</p>
            <PublicSubscribeForm />
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
