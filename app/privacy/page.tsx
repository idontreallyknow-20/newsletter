import type { Metadata } from 'next'
import PublicNav from '@/components/PublicNav'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What Daily Brief collects when you subscribe (an email address and two preferences), where it is stored, who processes it, and how to delete it.',
  alternates: { canonical: '/privacy' },
}

const UPDATED = 'September 8, 2026'

export default function PrivacyPage() {
  return (
    <>
      <PublicNav />
      <main className="simple" id="main-content">
        <div className="wrap legal">
          <p className="eyebrow">Privacy</p>
          <h1 className="t-display">What I keep, and why.</h1>
          <p className="copy">Daily Brief is a newsletter written by one person, Joseph Leung, in Richmond Hill, Ontario. This page says exactly what the site collects. It is short because there is not much.</p>

          <h2>What you give me</h2>
          <p>When you subscribe, the form sends your email address, the language you picked (English or Chinese), and how often you want issues (daily or weekly). Nothing else. There is no name field on the public form; if a name reaches me some other way, such as a reply, it is stored next to the address so I know who I am talking to.</p>

          <h2>What the site records on its own</h2>
          <p>The subscribe endpoint keeps a short-lived count of requests per IP address to stop bots from flooding the list. That counter lives in memory and is gone within a minute.</p>
          <p>Page views are counted with Vercel Web Analytics. It runs without cookies, does not fingerprint your device, and reports totals (which pages were opened, from which country, on what kind of device). I cannot see who you are from it.</p>
          <p>Emails go out through Resend. Resend records that a message was accepted or bounced. Open and click tracking are switched off, so I do not know whether you opened an issue.</p>

          <h2>Cookies</h2>
          <p>The public site sets no cookies. There is one cookie on the whole domain, and it is the login session for my own dashboard. You will never receive it. Your day/night theme choice is saved in your browser&apos;s local storage and never leaves your device. Because there is nothing to consent to, there is no cookie banner.</p>

          <h2>Where the data lives</h2>
          <p>Subscriber records are stored in a PostgreSQL database hosted by Neon, on servers in the United States. The site runs on Vercel. Email is delivered by Resend. Each of these companies processes the address only to do that job. I do not sell the list, rent it, trade it, or share it with anyone who is not one of those three providers.</p>

          <h2>Your choices</h2>
          <p>Every email has an unsubscribe link and a preferences link in the footer. Both work with one click, without logging in. Unsubscribing marks your address as inactive; it is deleted outright when I next clear the inactive list, or right away if you ask. To see, change, or delete anything I hold about you, reply to any issue or email the address the newsletter is sent from. I answer within a week.</p>

          <h2>Canadian law</h2>
          <p>The list is run under Canada&apos;s Anti-Spam Legislation (CASL) and the Personal Information Protection and Electronic Documents Act (PIPEDA). You subscribed yourself, every message identifies the sender, and every message has a working unsubscribe. If you think I have handled your information badly, tell me first. If that does not fix it, the Office of the Privacy Commissioner of Canada takes complaints at priv.gc.ca.</p>

          <h2>Readers under 13</h2>
          <p>The newsletter is written for a general audience and I do not knowingly collect addresses from children under 13. If one has been added, email me and I will remove it.</p>

          <h2>Changes</h2>
          <p>If this page changes in a way that affects you, the next issue will say so. Last updated {UPDATED}.</p>

          <p className="t-mono" style={{ color: 'var(--muted)', marginTop: 48 }}>See also: <a href="/terms">Terms of use</a></p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
