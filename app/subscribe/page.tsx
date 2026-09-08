import type { Metadata } from 'next'
import PublicNav from '@/components/PublicNav'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Subscribe',
  description: 'Get Daily Brief, a free morning newsletter on economics and AI by Joseph Leung, in English or Chinese, daily or weekly. One click to unsubscribe.',
  alternates: { canonical: '/subscribe' },
}

export default function SubscribePage() {
  return (
    <>
      <PublicNav />
      <main className="simple" id="main-content">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="eyebrow">Subscribe</p>
          <h1 className="t-display">Economics and AI, before school.</h1>
          <p className="copy">One topic a morning, explained plainly, with a takeaway. Pick a language and how often you want it. It is free and there is a one-click unsubscribe in every email.</p>
          <PublicSubscribeForm id="sub-page" />
          <p className="t-mono" style={{ color: 'var(--slate)', marginTop: 48 }}>Sent about 7:00 AM Eastern · English and 简体中文</p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
