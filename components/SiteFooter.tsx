import { HUB_URL } from '@/lib/seo'

export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <a href="/" className="mast-brand"><span className="mast-word">Daily<i>.</i>Brief</span></a>
        <nav aria-label="Footer">
          <a href="/about">About Joseph Leung</a>
          <a href="/#topics">Topics</a>
          <a href="/#issues">Issues</a>
          <a href="/#subscribe">Subscribe</a>
          <a href="/preferences">Preferences</a>
          <a href="/feed.xml">RSS</a>
        </nav>
        <small>Built by <a href={HUB_URL} rel="author">Joseph Leung</a> in Richmond Hill, Ontario. &copy; {new Date().getFullYear()} Daily Brief (dailybriefhq.com). No tracking, no spam.</small>
      </div>
    </footer>
  )
}
