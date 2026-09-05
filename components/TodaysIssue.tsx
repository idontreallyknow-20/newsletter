'use client'

import { useEffect, useRef, useState } from 'react'

export default function TodaysIssue({ num, title, intro, date, readTime, href }: {
  num: string; title: string; intro: string; date: string; readTime: string; href: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [flat, setFlat] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setFlat(true); return }
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { setFlat(true); io.disconnect() } }, { threshold: 0.45 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div className="sheet-stage" ref={ref}>
      <article className={`sheet${flat ? ' is-flat' : ''}`}>
        <div className="sheet-head">
          <span className="mast-word">Daily<i>.</i>Brief</span>
          <span className="t-mono" style={{ color: 'var(--slate)' }}>{num} · {date}</span>
        </div>
        <h3 className="t-display">{title}</h3>
        <p>{intro}</p>
        <div className="sheet-foot">
          <a href={href}>Read the issue</a>
          <span className="t-mono" style={{ color: 'var(--slate)' }}>{readTime}</span>
        </div>
        <div className="sheet-edge" aria-hidden="true" />
      </article>
    </div>
  )
}
