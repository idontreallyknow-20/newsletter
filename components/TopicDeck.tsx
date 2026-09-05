'use client'

import { useRef } from 'react'
import { IconMarkets, IconAI, IconGlobe, IconWork, IconAnalysis, IconDigest } from '@/components/TopicIcons'

export const TOPICS = [
  { key: 'markets', title: 'Macro and markets', tags: ['Economics', 'Markets'], icon: <IconMarkets />, desc: 'Rates, inflation, and central banks, translated into what it costs you.' },
  { key: 'ai', title: 'AI and technology', tags: ['AI'], icon: <IconAI />, desc: 'What the labs shipped, what it costs to run, and who is actually paying for it.' },
  { key: 'global', title: 'Global economy', tags: ['Global'], icon: <IconGlobe />, desc: 'Trade flows, chips, and the map of who depends on whom.' },
  { key: 'work', title: 'Future of work', tags: ['Work'], icon: <IconWork />, desc: 'Which jobs are changing first, and what the hiring data already shows.' },
  { key: 'ideas', title: 'Ideas and analysis', tags: ['Analysis'], icon: <IconAnalysis />, desc: 'Why forecasts miss, what history says, and what I would watch next.' },
  { key: 'digest', title: 'Weekly digest', tags: ['Digest'], icon: <IconDigest />, desc: 'The five things worth your time this week, and one thing everyone got wrong.' },
]

function Card({ t, count, index }: { t: typeof TOPICS[number]; count: number; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg) translateY(-4px)`
  }
  function onLeave() { if (ref.current) ref.current.style.transform = '' }
  return (
    <a ref={ref} href={`/?topic=${t.key}#issues`} className="tilt-card" onMouseMove={onMove} onMouseLeave={onLeave}>
      <span className="glare" aria-hidden="true" />
      <span className="num">Lens {String(index + 1).padStart(2, '0')}</span>
      <span className="count">{count} issues</span>
      <h3 className="t-display">{t.title}</h3>
      <p>{t.desc}</p>
      <span className="icon" aria-hidden="true">{t.icon}</span>
    </a>
  )
}

export default function TopicDeck({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="deck">
      {TOPICS.map((t, i) => <Card key={t.key} t={t} index={i} count={t.tags.reduce((n, tag) => n + (counts[tag] || 0), 0)} />)}
    </div>
  )
}
