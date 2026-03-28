import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import DashboardShell from '@/components/DashboardShell'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Joseph — Economics & AI Newsletter',
  description: 'A weekly newsletter breaking down economic forces and AI breakthroughs shaping our world.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <DashboardShell>
          {children}
        </DashboardShell>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#1a1a1a',
              border: '1px solid #d6cfc4',
              fontFamily: 'var(--font-dm)',
              fontSize: '14px',
              boxShadow: '4px 4px 0 #d6cfc4',
            },
          }}
        />
      </body>
    </html>
  )
}
