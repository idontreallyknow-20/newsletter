import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import PublicNav from '@/components/PublicNav'
import SiteFooter from '@/components/SiteFooter'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import { ARTICLES } from '@/lib/articles'
import { SITE_URL, AUTHOR_DESCRIPTION, personJsonLd, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'About Joseph, writer of Daily Brief',
  description: AUTHOR_DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: { title: 'About Joseph', description: AUTHOR_DESCRIPTION, type: 'profile', url: '/about', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
}

export default function AboutPage() {
  const hasPortrait = fs.existsSync(path.join(process.cwd(), 'public', 'joseph.jpg'))
  const ld = [
    { ...personJsonLd(), mainEntityOfPage: `${SITE_URL}/about` },
    { '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: { '@id': `${SITE_URL}/#joseph` }, url: `${SITE_URL}/about` },
    breadcrumbJsonLd([{ name: 'Daily Brief', url: SITE_URL }, { name: 'About Joseph', url: `${SITE_URL}/about` }]),
  ]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PublicNav />
      <main className="simple" id="main-content">
        <div className="wrap about-grid">
          <div>
            <div className="portrait">
              {hasPortrait
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src="/joseph.jpg" alt="Joseph, writer of Daily Brief" width={800} height={1000} />
                : <div className="portrait-mono" aria-hidden="true"><span>J.</span></div>}
              <div className="portrait-cap"><span className="t-mono">Joseph</span><span className="t-mono">Richmond Hill, ON</span></div>
            </div>
          </div>
          <article className="about">
            <p className="eyebrow">About</p>
            <h1 className="t-display" style={{ fontSize: 'clamp(40px, 6vw, 84px)', marginBottom: 24 }}>Joseph writes Daily Brief.</h1>
            <p className="copy">I am a Grade 11 student in Richmond Hill, Ontario. Every school morning I write a short newsletter on economics and AI, send it to readers in English and Chinese, and then go to first period.</p>
            <p className="copy">Before this I played chess at the national level. I won the national team championship three times and retired from tournament play to spend the same hours on this. The habit carried over: sit with a position until you understand it, and do not publish a claim that will not survive a second look.</p>
            <p className="copy">The plan is Rotman Commerce at the University of Toronto, then companies of my own. I treat this newsletter as the first one: a product, a reader base, and a deadline every morning.</p>
            <dl className="ledger">
              <div className="ledger-row"><dt className="t-mono">Name</dt><dd>Joseph</dd></div>
              <div className="ledger-row"><dt className="t-mono">Based in</dt><dd>Richmond Hill, Ontario, Canada</dd></div>
              <div className="ledger-row"><dt className="t-mono">School</dt><dd>Grade 11, York Region District School Board</dd></div>
              <div className="ledger-row"><dt className="t-mono">Chess</dt><dd>Three-time national team champion; national-level competitor, retired</dd></div>
              <div className="ledger-row"><dt className="t-mono">Writes about</dt><dd>Monetary policy, the Canadian economy, AI economics, semiconductors, labour and housing markets</dd></div>
              <div className="ledger-row"><dt className="t-mono">Issues published</dt><dd>{ARTICLES.length} weekly issues plus the daily brief</dd></div>
              <div className="ledger-row"><dt className="t-mono">Contact</dt><dd>Reply to any issue. I read every reply.</dd></div>
            </dl>
            <div style={{ marginTop: 40 }}>
              <p className="eyebrow">Subscribe</p>
              <PublicSubscribeForm id="sub-about" />
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
