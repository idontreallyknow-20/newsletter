import type { Metadata } from 'next'
import PublicNav from '@/components/PublicNav'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The terms for reading Daily Brief and subscribing to the newsletter: what the writing is, what it is not, and how the list is run.',
  alternates: { canonical: '/terms' },
}

const UPDATED = 'September 8, 2026'

export default function TermsPage() {
  return (
    <>
      <PublicNav />
      <main className="simple" id="main-content">
        <div className="wrap legal">
          <p className="eyebrow">Terms</p>
          <h1 className="t-display">The deal.</h1>
          <p className="copy">Reading dailybriefhq.com or subscribing to the newsletter means you accept the terms on this page. They are written to be read, so read them.</p>

          <h2>What this is</h2>
          <p>Daily Brief is commentary on economics and artificial intelligence, written by Joseph Leung, a high school student in Ontario. It is free. It is published on this site and sent by email in English and Chinese.</p>

          <h2>What it is not</h2>
          <p>Nothing here is financial, investment, legal, or tax advice. I am not a licensed advisor of any kind. Issues describe what I think is happening and why. If you buy, sell, or hold anything because of something you read here, that decision and its results are yours. Check the primary sources yourself; issues link to them for that reason.</p>

          <h2>Accuracy</h2>
          <p>I try to get the facts right and I correct mistakes in a later issue when I find them. Figures are as of the date on the issue and are not updated afterward. I make no promise that any issue is complete, current, or free of errors.</p>

          <h2>Copyright</h2>
          <p>The writing, charts, and design on this site and in the newsletter are &copy; Joseph Leung. You may quote up to a paragraph with a link back to the issue. You may forward an issue to a friend. You may not republish whole issues, put them behind your own paywall, or feed them into a product without asking. Ask by replying to any issue; I usually say yes.</p>

          <h2>The list</h2>
          <p>Subscribing adds your address to the mailing list described in the <a href="/privacy">privacy policy</a>. You can leave with one click at any time. I can remove an address at any time, for example if it bounces repeatedly or if the subscription looks automated.</p>

          <h2>Links</h2>
          <p>Issues link to other sites. I do not control them and am not responsible for what is on them.</p>

          <h2>Availability</h2>
          <p>The site and the newsletter are provided as they are. I may pause, change, or stop publishing at any time without notice. I am not liable for any loss that comes from reading, relying on, or being unable to reach the site or the emails.</p>

          <h2>Law</h2>
          <p>These terms are governed by the laws of Ontario and the federal laws of Canada that apply there. If any part of this page turns out to be unenforceable, the rest still stands.</p>

          <h2>Changes</h2>
          <p>If these terms change, the date below changes and the next issue mentions it. Continuing to read after that is acceptance. Last updated {UPDATED}.</p>

          <p className="t-mono" style={{ color: 'var(--muted)', marginTop: 48 }}>See also: <a href="/privacy">Privacy policy</a></p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
