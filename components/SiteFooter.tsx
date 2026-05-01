type Social = { label: string; href: string; icon: React.ReactNode }

const SOCIALS: Social[] = [
  process.env.NEXT_PUBLIC_TWITTER_URL && {
    label: 'X (Twitter)',
    href: process.env.NEXT_PUBLIC_TWITTER_URL,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z"/>
      </svg>
    ),
  },
  process.env.NEXT_PUBLIC_LINKEDIN_URL && {
    label: 'LinkedIn',
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.555v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.602 0 4.27 2.37 4.27 5.455v6.284zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.78 13.017H3.555V9h3.561v11.45zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  process.env.NEXT_PUBLIC_GITHUB_URL && {
    label: 'GitHub',
    href: process.env.NEXT_PUBLIC_GITHUB_URL,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.95 10.95 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z"/>
      </svg>
    ),
  },
  process.env.NEXT_PUBLIC_RSS_VISIBLE !== 'false' && {
    label: 'RSS feed',
    href: '/feed.xml',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M6.5 17a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM2 7v3a11 11 0 0 1 11 11h3A14 14 0 0 0 2 7Zm0-5v3a16 16 0 0 1 16 16h3A19 19 0 0 0 2 2Z"/>
      </svg>
    ),
  },
].filter(Boolean) as Social[]

export default function SiteFooter() {
  return (
    <footer className="pub-footer">
      <span className="pub-footer-copy">&copy; 2026 Joseph. Made with curiosity.</span>
      <nav className="pub-footer-links" aria-label="Footer">
        <a href="/#issues">Archive</a>
        <a href="/#subscribe">Subscribe</a>
        <a href="/#about">About</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </nav>
      {SOCIALS.length > 0 && (
        <ul className="pub-footer-socials" aria-label="Follow Joseph">
          {SOCIALS.map(s => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                target={s.href.startsWith('http') ? '_blank' : undefined}
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      )}
    </footer>
  )
}
