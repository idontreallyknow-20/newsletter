'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { BEATS } from '@/components/Beats'
import Figure from '@/components/Figure'
import type { Figure as FigureSpec } from '@/lib/articles'
import Reveal from '@/components/Reveal'

export interface ArchiveItem { slug: string; num: string; title: string; tag: string; date: string; readTime: string; intro: string; figure?: FigureSpec }

export default function ArchiveGrid({ items }: { items: ArchiveItem[] }) {
  const params = useSearchParams()
  const [topic, setTopic] = useState<string | null>(null)
  useEffect(() => { setTopic(params.get('topic')) }, [params])

  const active = BEATS.find(t => t.key === topic)
  const list = useMemo(() => active ? items.filter(a => active.tags.includes(a.tag)) : items, [items, active])
  const [feature, ...rest] = list
  const cards = rest.slice(0, 3)
  const rows = rest.slice(3)

  return (
    <div>
      <div className="sec-head">
        <div>
          <p className="eyebrow">Issues</p>
          <h2 className="t-display">{active ? active.name : 'Every issue so far.'}</h2>
        </div>
        {active
          ? <a href="/#issues" className="sec-link" onClick={() => setTopic(null)}>Show all {items.length}</a>
          : <a href="/#subscribe" className="sec-link">Get the next one</a>}
      </div>

      {feature && (
        <Reveal>
          <a href={`/issues/${feature.slug}`} className="arch-feature">
            <div>
              <div className="meta"><span className="t-mono" style={{ color: 'var(--red)' }}>{feature.num}</span><span className="t-mono" style={{ color: 'var(--muted)' }}>{feature.tag} · {feature.date}</span></div>
              <h3 className="t-display">{feature.title}</h3>
              <p>{feature.intro}</p>
              <p style={{ marginTop: 22 }}><span className="btn btn--ink" style={{ height: 40 }}>Read the issue · {feature.readTime}</span></p>
            </div>
            {feature.figure && <div className="art"><Figure figure={feature.figure} id={`f-${feature.slug}`} /></div>}
          </a>
        </Reveal>
      )}

      <div className="arch-grid">
        {cards.map((a, i) => (
          <Reveal key={a.slug} delay={i * 80}>
            <a href={`/issues/${a.slug}`} className="arch-card">
              <div className="meta"><span className="t-mono" style={{ color: 'var(--red)' }}>{a.num}</span><span className="t-mono" style={{ color: 'var(--muted)' }}>{a.tag}</span></div>
              <h3 className="t-display">{a.title}</h3>
              <p>{a.intro.length > 150 ? a.intro.slice(0, 147).trimEnd() + '…' : a.intro}</p>
              {a.figure && <div className="thumb"><Figure figure={a.figure} mini id={`m-${a.slug}`} /></div>}
              <div className="meta" style={{ marginTop: 14 }}><span className="t-mono" style={{ color: 'var(--muted)' }}>{a.date}</span><span className="t-mono" style={{ color: 'var(--muted)' }}>{a.readTime}</span></div>
            </a>
          </Reveal>
        ))}
      </div>

      {rows.length > 0 && (
        <div className="arch-list">
          {rows.map(a => (
            <a key={a.slug} href={`/issues/${a.slug}`} className="arch-row">
              <span className="t-mono">{a.num}</span>
              <span className="title">{a.title}</span>
              <span className="t-mono">{a.tag}</span>
              <span className="t-mono">{a.date}</span>
            </a>
          ))}
        </div>
      )}
      {list.length === 0 && <p className="copy">Nothing filed under this lens yet.</p>}
    </div>
  )
}
