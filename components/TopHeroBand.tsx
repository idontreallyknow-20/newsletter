export default function TopHeroBand() {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="top-hero-band" aria-label="Publication header">
      <span className="top-hero-band-name">AI &amp; Economy</span>
      <span className="top-hero-band-date" aria-hidden="true">{dateStr}</span>
      <nav className="top-hero-band-nav" aria-label="Quick links">
        <a href="/#about">About</a>
        <a href="/#issues">Archive</a>
        <a href="/#subscribe">Subscribe</a>
      </nav>
    </div>
  )
}
