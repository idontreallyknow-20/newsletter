import fs from 'fs'
import path from 'path'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'
import IssueStack, { type StackPage } from '@/components/hero/IssueStack'

export default function FrontPage({ pages, issueCount, dateline, volume }: { pages: StackPage[]; issueCount: number; dateline: string; volume: string }) {
  const hasPortrait = fs.existsSync(path.join(process.cwd(), 'public', 'joseph.jpg'))
  return (
    <section className="front" id="top" aria-label="Daily Brief front page">
      <div className="wrap">
        <header className="masthead">
          <div className="masthead-word">Daily<i>.</i>Brief</div>
          <div className="masthead-line">
            <span>{volume} · No. {String(issueCount).padStart(3, '0')}</span>
            <span className="t-serif-i">{dateline}</span>
            <span>Richmond Hill, Ontario · Free</span>
          </div>
        </header>

        <div className="front-grid">
          <div>
            <div className="front-kicker"><span className="t-mono">Economics and AI</span><span className="t-mono">Daily and weekly</span></div>
            <h1 className="t-display">The economy and AI, explained <em>before school.</em></h1>
            <p className="lede">
              One topic a morning. What actually moved, why it matters to someone who is not a fund manager, and what to watch next. Five minutes, no jargon, one clear take. Sent about 7:00 AM Eastern in English or Chinese.
            </p>
            <PublicSubscribeForm id="sub-front" />
            <div className="byline">
              <div className="byline-photo">
                {hasPortrait
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src="/joseph.jpg" alt="Joseph" width={128} height={128} />
                  : <span aria-hidden="true">J</span>}
              </div>
              <div>
                <strong>Written by Joseph</strong>
                <span>Grade 11, Richmond Hill. Three-time national team chess champion. Reads the filings so you do not have to.</span>
              </div>
            </div>
          </div>
          <IssueStack pages={pages} />
        </div>
      </div>
    </section>
  )
}
