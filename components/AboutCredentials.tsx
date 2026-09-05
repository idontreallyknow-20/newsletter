import fs from 'fs'
import path from 'path'
import Reveal from '@/components/Reveal'

export default function AboutCredentials() {
  const hasPortrait = fs.existsSync(path.join(process.cwd(), 'public', 'joseph.jpg'))
  return (
    <div className="about-grid">
      <Reveal>
        <div className="portrait">
          {/* Drop a photo at public/joseph.jpg to replace the monogram. */}
          {hasPortrait
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src="/joseph.jpg" alt="Joseph" width={800} height={1000} loading="lazy" decoding="async" style={{ position: 'relative', zIndex: 1 }} />
            : <div className="portrait-mono" aria-hidden="true"><span>J.</span></div>}
          <div className="portrait-cap">
            <span className="t-mono">Joseph</span>
            <span className="t-mono">Richmond Hill, ON</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120} className="about">
        <p className="eyebrow">About</p>
        <h2 className="t-display">I write this before school. Here is why it is worth your five minutes.</h2>
        <p className="copy">
          Most coverage of AI is either a press release or a panic. I read the earnings calls, the central bank statements, and the model release notes, then write down what actually changed and why it matters to someone who is not a fund manager. Five minutes, no jargon, one clear take.
        </p>
        <p className="copy">
          I am 16 and in Grade 11. Chess taught me to sit with a position until I understand it, and that is the whole method here. If a claim will not survive a second look, it does not go in.
        </p>

        <dl className="ledger">
          <div className="ledger-row"><dt className="t-mono">Chess</dt><dd>Three-time national team champion. Competed at the national level before retiring from tournament play.</dd></div>
          <div className="ledger-row"><dt className="t-mono">Training</dt><dd>Calisthenics athlete. Same rule as chess: fundamentals every day, no shortcuts.</dd></div>
          <div className="ledger-row"><dt className="t-mono">School</dt><dd>Grade 11, York Region District School Board. Working toward Rotman Commerce at the University of Toronto, then startups.</dd></div>
          <div className="ledger-row"><dt className="t-mono">This brief</dt><dd>Written every morning, sent about 7:00 AM Eastern, in English and Simplified Chinese. <a href="/about" style={{ textDecoration: 'none', borderBottom: '1px solid currentColor' }}>More about me</a></dd></div>
        </dl>
      </Reveal>
    </div>
  )
}
