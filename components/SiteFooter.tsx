export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <a href="/" className="pub-logo">Joseph<span>.</span></a>
            <p className="site-footer-tagline">
              The economy and AI, explained without the jargon. A free newsletter
              decoding what actually moves markets and reshapes work.
            </p>
          </div>
          <nav className="site-footer-col" aria-label="Explore">
            <p className="site-footer-head">Explore</p>
            <a href="/#about">About</a>
            <a href="/#topics">Topics</a>
            <a href="/#issues">Archive</a>
          </nav>
          <nav className="site-footer-col" aria-label="Newsletter">
            <p className="site-footer-head">Newsletter</p>
            <a href="/#subscribe">Subscribe</a>
            <a href="/preferences">Preferences</a>
            <a href="/#issues">Latest issue</a>
          </nav>
        </div>
        <div className="site-footer-bottom">
          <span>&copy; 2026 Joseph. Made with curiosity.</span>
          <span className="site-footer-fine">No spam. No tracking. Unsubscribe anytime.</span>
        </div>
      </div>
    </footer>
  )
}
