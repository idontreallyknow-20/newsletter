export default function TopHeroBand() {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="top-hero-band" aria-label="Publication header">
      <span className="top-hero-band-name">AI &amp; Economy</span>
      <span className="top-hero-band-date" aria-hidden="true">{dateStr}</span>
      <span className="top-hero-band-tag">Free · Daily &amp; Weekly</span>
    </div>
  )
}
