import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Newsreader } from 'next/font/google'
import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast'
import DashboardShell from '@/components/DashboardShell'
import './globals.css'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['wdth', 'opsz'],
  display: 'swap',
})

const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['italic', 'normal'],
  weight: ['400', '500'],
  display: 'swap',
})

const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
  display: 'swap',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
})

const BASE_URL = 'https://dailybriefhq.com'
const DESCRIPTION = 'A short morning newsletter on economics and AI, written by Joseph, a Grade 11 student in Richmond Hill, before school. Free, in English and Chinese.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Daily Brief by Joseph',
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'Daily Brief',
    title: 'Daily Brief by Joseph',
    description: DESCRIPTION,
    type: 'website',
    url: '/',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Daily Brief by Joseph' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Brief by Joseph',
    description: DESCRIPTION,
    images: ['/opengraph-image'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0C0E14',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <DashboardShell>
          {children}
        </DashboardShell>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#141721',
              color: '#E7E9E6',
              border: '1px solid rgba(231,233,230,0.12)',
              fontFamily: 'var(--font-geist)',
              fontSize: '14px',
              borderRadius: 0,
            },
          }}
        />
      </body>
    </html>
  )
}
