import { Suspense } from 'react'
import PublicNav from '@/components/PublicNav'
import SmoothScroll from '@/components/SmoothScroll'
import FrontPage from '@/components/hero/FrontPage'
import IssueTicker from '@/components/IssueTicker'
import TodaysIssue from '@/components/TodaysIssue'
import AboutCredentials from '@/components/AboutCredentials'
import Beats from '@/components/Beats'
import ArchiveGrid, { type ArchiveItem } from '@/components/ArchiveGrid'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import SiteFooter from '@/components/SiteFooter'
import Reveal from '@/components/Reveal'
import { ARTICLES } from '@/lib/articles'

export const dynamic = 'force-dynamic'

// The public archive is the fixed set of weekly issues in lib/articles.ts.
// Daily emails sent from the dashboard stay readable at their /issues/<slug>
// links but do not appear here, so test sends can never change the front page.
export default async function HomePage() {
  const items: ArchiveItem[] = ARTICLES.map(a => ({ slug: a.slug, num: a.num, title: a.title, tag: a.tag, date: a.date, readTime: a.readTime, intro: a.intro, figure: a.figure }))
  const issueCount = items.length
  const today = items[0]
  const counts: Record<string, number> = {}
  for (const a of items) counts[a.tag] = (counts[a.tag] || 0) + 1
  const now = new Date()
  const dateline = now.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Toronto' })
  const pages = items.slice(0, 5).reverse().map(a => ({
    num: a.num, title: a.title, tag: a.tag,
    date: a.date.replace(/, \d{4}$/, ''),
    bars: (a.figure?.data ?? [{ value: 40 }, { value: 55 }, { value: 35 }, { value: 70 }, { value: 60 }, { value: 85 }]).slice(0, 7).map(d => d.value),
  }))
  // Scale bars to percentages of the max so every mini chart fills its box.
  for (const p of pages) { const m = Math.max(...p.bars.map(Math.abs), 1); p.bars = p.bars.map(b => Math.round(Math.abs(b) / m * 100)) }

  return (
    <>
      <SmoothScroll />
      <PublicNav />
      <span id="main-content" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />

      <FrontPage pages={pages} issueCount={issueCount} dateline={dateline} volume={`Vol. ${now.getFullYear() - 2025}`} />

      <IssueTicker items={items.slice(0, 10).map(a => ({ num: a.num, title: a.title }))} />

      {/* Latest issue */}
      <section className="band band--paper-2" id="today">
        <div className="wrap today-grid">
          <Reveal>
            <p className="eyebrow">Latest weekly issue</p>
            <h2 className="t-display" style={{ fontSize: 'clamp(36px, 5vw, 72px)', marginBottom: 20 }}>The long read.</h2>
            <p className="lede">Once a week, one topic gets the full treatment: four sections, a chart, and a position I am willing to defend. The daily brief lands in your inbox; the weekly issues live here.</p>
          </Reveal>
          <Reveal delay={150}>
            <TodaysIssue num={today.num} title={today.title} intro={today.intro} date={today.date} readTime={today.readTime} href={`/issues/${today.slug}`} />
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section className="band band--paper" id="about">
        <div className="sec-num" aria-hidden="true">01</div>
        <div className="wrap"><AboutCredentials /></div>
      </section>

      <hr className="rule" />

      {/* Topics */}
      <section className="band band--paper" id="topics">
        <div className="sec-num" aria-hidden="true">02</div>
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <p className="eyebrow">Topics</p>
                <h2 className="t-display">What I cover.</h2>
              </div>
              <span className="copy" style={{ maxWidth: '34ch' }}>The same handful of beats, followed closely enough to notice when something actually changes. Pick one to filter the archive.</span>
            </div>
          </Reveal>
          <Beats counts={counts} />
        </div>
      </section>

      <hr className="rule" />

      {/* Issues */}
      <section className="band band--paper" id="issues">
        <div className="sec-num" aria-hidden="true">03</div>
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
            <p className="eyebrow" style={{ color: '#E3453A' }}>Subscribe</p>
            <h2 className="t-display">Tomorrow&apos;s issue, <em>7:00 AM.</em></h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="copy" style={{ marginBottom: 20 }}>Free. English or Chinese, daily or weekly. One click to leave, and I never sell the list.</p>
            <PublicSubscribeForm id="sub-closing" />
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
