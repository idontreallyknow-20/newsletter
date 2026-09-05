'use client'

import Reveal from '@/components/Reveal'

/* What the newsletter actually covers, written like a paper's section index. */
export const BEATS = [
  { key: 'rates', name: 'Rates and the Bank of Canada', tags: ['Economics', 'Markets'], blurb: 'What the Bank did, what the bond market thinks it will do next, and what that does to a mortgage renewal in York Region.' },
  { key: 'ai', name: 'AI, chips and who pays', tags: ['AI'], blurb: 'Model prices, the labs\' balance sheets, the fabs in Taiwan and Arizona, and the electricity bill behind all of it.' },
  { key: 'canada', name: 'The Canadian economy', tags: ['Analysis'], blurb: 'Productivity, the deficit, provincial budgets, and the numbers Ottawa would rather you did not compare with the US.' },
  { key: 'work', name: 'Jobs and the first rung', tags: ['Work'], blurb: 'Hiring data, the entry-level squeeze, and what a first job looks like when a model does the junior work.' },
  { key: 'housing', name: 'Housing in the GTA', tags: ['Economics'], blurb: 'Supply, zoning, immigration and rents, followed weekly because it is the biggest line in most household budgets.' },
  { key: 'trade', name: 'Trade, tariffs and the border', tags: ['Global'], blurb: 'CUSMA, steel and auto tariffs, and which side of the border the next plant gets built on.' },
]

export default function Beats({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="beats">
      {BEATS.map((b, i) => {
        const n = b.tags.reduce((s, t) => s + (counts[t] || 0), 0)
        return (
          <Reveal key={b.key} delay={i * 60} as="div" className="beat-wrap">
            <a href={`/?topic=${b.key}#issues`} className="beat">
              <span className="beat-num t-mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="beat-body">
                <span className="beat-name t-display">{b.name}</span>
                <span className="beat-blurb">{b.blurb}</span>
              </span>
              <span className="beat-meta">
                <span className="t-mono">{n} {n === 1 ? 'issue' : 'issues'}</span>
                <span className="beat-arrow" aria-hidden="true">→</span>
              </span>
            </a>
          </Reveal>
        )
      })}
    </div>
  )
}
