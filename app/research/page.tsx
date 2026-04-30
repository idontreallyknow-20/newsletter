import PublicNav from '@/components/PublicNav'

const RESEARCH_TRACKS = [
  {
    title: 'Macro Watchlist',
    description: 'Weekly charts on inflation, payrolls, consumer demand, and credit conditions with short plain-English notes on what changed and why it matters.',
    cadence: 'Updated weekly',
  },
  {
    title: 'AI Labor Tracker',
    description: 'A running set of notes on hiring freezes, role redesign, and productivity shifts across finance, law, consulting, and software teams.',
    cadence: 'Updated biweekly',
  },
  {
    title: 'Policy Briefs',
    description: 'One-page explainers on major policy moves (Fed, fiscal, trade, industrial policy) with scenario trees and second-order effects.',
    cadence: 'Updated as events happen',
  },
] as const

export default function ResearchPage() {
  return (
    <>
      <PublicNav />
      <main style={{ padding: '120px 24px 80px' }}>
        <section className="pub-wrap" style={{ maxWidth: 900 }}>
          <p className="pub-label">Research</p>
          <h1 className="pub-heading" style={{ marginBottom: 14 }}>What I&apos;m tracking in real time.</h1>
          <p className="pub-copy" style={{ maxWidth: 640, marginBottom: 36 }}>
            This page is where I publish working notes behind the newsletter: charts, assumptions, and the questions I&apos;m trying to answer before each issue.
          </p>

          <div style={{ display: 'grid', gap: 16 }}>
            {RESEARCH_TRACKS.map(track => (
              <article key={track.title} style={{ border: '1px solid var(--pub-border)', padding: 20, background: 'var(--pub-cream-2)' }}>
                <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 28, lineHeight: 1.2, marginBottom: 8, color: 'var(--ink)' }}>
                  {track.title}
                </h2>
                <p className="pub-copy" style={{ marginBottom: 8 }}>{track.description}</p>
                <p className="pub-label" style={{ marginBottom: 0 }}>{track.cadence}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
