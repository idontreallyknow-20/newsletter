import type { Metadata, Viewport } from 'next'
import { Fraunces, Newsreader, Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import DashboardShell from '@/components/DashboardShell'
import { SITE_URL, HUB_URL, SITE_DESCRIPTION, AUTHOR_NAME, personJsonLd, publicationJsonLd, websiteJsonLd } from '@/lib/seo'
import './globals.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
})

const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['italic', 'normal'],
  axes: ['opsz'],
  display: 'swap',
})

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
// Labels only, so it is not worth a preload slot ahead of the headline and body fonts.
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap', preload: false })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `Daily Brief (dailybriefhq) by ${AUTHOR_NAME}: economics and AI, before school`, template: '%s | Daily Brief by Joseph Leung' },
  description: SITE_DESCRIPTION,
  applicationName: 'Daily Brief',
  authors: [{ name: AUTHOR_NAME, url: HUB_URL }],
  creator: AUTHOR_NAME,
  publisher: 'Daily Brief',
  keywords: ['dailybriefhq', 'dailybriefhq.com', 'Daily Brief HQ', 'Daily Brief', 'Joseph Leung', 'Joseph Leung newsletter', 'Joseph Leung chess', 'Joseph Leung Richmond Hill', 'economics newsletter', 'AI newsletter', 'Canadian economics newsletter', 'Richmond Hill', 'Ontario', 'chess champion', 'Grade 11', 'Canadian economy', 'artificial intelligence', 'Bank of Canada'],
  alternates: { types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'Daily Brief RSS' }] } },
  openGraph: {
    siteName: 'Daily Brief',
    title: `Daily Brief by ${AUTHOR_NAME}`,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'en_CA',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `Daily Brief by ${AUTHOR_NAME}` }],
  },
  twitter: { card: 'summary_large_image', title: `Daily Brief by ${AUTHOR_NAME}`, description: SITE_DESCRIPTION, images: ['/opengraph-image'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  category: 'news',
}

export const viewport: Viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#F4F2ED' }, { media: '(prefers-color-scheme: dark)', color: '#121212' }], width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = [personJsonLd(), publicationJsonLd(), websiteJsonLd()]
  return (
    <html lang="en-CA" className={`${display.variable} ${serif.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('db-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})()` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <DashboardShell>{children}</DashboardShell>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#121212', color: '#F4F2ED', border: '1px solid rgba(244,242,237,0.15)', fontFamily: 'var(--font-geist)', fontSize: '14px', borderRadius: 0 } }} />
      </body>
    </html>
  )
}
