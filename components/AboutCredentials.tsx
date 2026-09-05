import fs from 'fs'
import path from 'path'
import Reveal from '@/components/Reveal'
import { CHESS_PROFILES } from '@/lib/seo'

export default function AboutCredentials() {
  const hasPortrait = fs.existsSync(path.join(process.cwd(), 'public', 'joseph.jpg'))
  return (
    <div className="about-grid">
      <Reveal>
        <div className="portrait">
          {/* Drop a photo at public/joseph.jpg to replace the monogram. */}
          {hasPortrait
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src="/joseph.jpg" alt="Joseph Leung, writer of Daily Brief" width={800} height={1000} loading="lazy" decoding="async" style={{ position: 'relative', zIndex: 1 }} />
            : <div className="portrait-mono" aria-hidden="true"><span>J.</span></div>}
          <div className="portrait-cap">
            <span className="t-mono">Joseph Leung</span>
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
          I am Joseph Leung, 16 and in Grade 11. Chess taught me to sit with a position until I understand it, and that is the whole method here. If a claim will not survive a second look, it does not go in.
        </p>

        <dl className="ledger">
          <div className="ledger-row"><dt className="t-mono">Chess</dt><dd>Three-time national team champion. Competed at the national level before retiring from tournament play (<a href={CHESS_PROFILES.fide.url} rel="me noopener" target="_blank" style={{ textDecoration: 'none', borderBottom: '1px solid currentColor' }}>FIDE</a>, <a href={CHESS_PROFILES.cfc.url} rel="me noopener" target="_blank" style={{ textDecoration: 'none', borderBottom: '1px solid currentColor' }}>CFC</a>).</dd></div>
          <div className="ledger-row"><dt className="t-mono">School</dt><dd>Grade 11, York Region District School Board.</dd></div>
          <div className="ledger-row"><dt className="t-mono">Ambition</dt><dd>Rotman Commerce at the University of Toronto, then build companies. This newsletter is the first one.</dd></div>
          <div className="ledger-row"><dt className="t-mono">This brief</dt><dd>Written every morning, sent about 7:00 AM Eastern, in English and Simplified Chinese. <a href="/about" style={{ textDecoration: 'none', borderBottom: '1px solid currentColor' }}>More about me</a></dd></div>
        </dl>
      </Reveal>
    </div>
  )
}
