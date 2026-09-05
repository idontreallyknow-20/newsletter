'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export interface StackPage { num: string; title: string; tag: string; date: string; bars: number[] }

/**
 * A pile of front pages in 3D. Idle: a slow breathing float and pointer
 * parallax. Scroll: the pile fans out and lifts, scrubbed to the scrollbar.
 */
export default function IssueStack({ pages }: { pages: StackPage[] }) {
  const stage = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stack.current, st = stage.current
    if (!el || !st) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.page'))
    const n = cards.length

    cards.forEach((c, i) => {
      const depth = n - 1 - i
      gsap.set(c, { z: -depth * 26, y: depth * 10, rotateZ: (i % 2 ? 1 : -1) * (depth * 1.4), x: 0, opacity: 1 })
    })
    gsap.set(el, { rotateX: 52, rotateZ: -8, y: 30 })
    if (reduced) return

    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: st, start: 'top 60%', end: 'bottom 5%', scrub: 0.6 } })
      tl.to(el, { rotateX: 24, rotateZ: 0, y: -30, ease: 'none' }, 0)
      cards.forEach((c, i) => {
        const depth = n - 1 - i
        const spread = i - (n - 1) / 2
        tl.to(c, { x: spread * 120, y: -depth * 18 + Math.abs(spread) * 22, z: depth * 10, rotateZ: spread * 9, ease: 'none' }, 0)
      })
      gsap.to(el, { y: '+=10', duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }, st)

    const onMove = (e: PointerEvent) => {
      const r = st.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      gsap.to(el, { rotateY: px * 14, x: px * 18, duration: 0.8, ease: 'power2.out', overwrite: 'auto' })
      cards.forEach((c, i) => gsap.to(c, { xPercent: px * (i + 1) * 1.6, yPercent: py * (i + 1) * 1.2, duration: 0.8, ease: 'power2.out' }))
    }
    const onLeave = () => {
      gsap.to(el, { rotateY: 0, x: 0, duration: 1, ease: 'power2.out' })
      cards.forEach(c => gsap.to(c, { xPercent: 0, yPercent: 0, duration: 1, ease: 'power2.out' }))
    }
    st.addEventListener('pointermove', onMove)
    st.addEventListener('pointerleave', onLeave)
    return () => { ctx.revert(); st.removeEventListener('pointermove', onMove); st.removeEventListener('pointerleave', onLeave) }
  }, [pages])

  return (
    <div className="stack-stage" ref={stage} aria-hidden="true">
      <div className="stack" ref={stack}>
        {pages.map((p, i) => (
          <div className="page" key={p.num + i} style={{ zIndex: i + 1 }}>
            <div className="page-mast"><b>Daily<i>.</i>Brief</b><span>{p.date}</span></div>
            <p className="kick">{p.tag} · {p.num}</p>
            <h3>{p.title}</h3>
            <div className="lines"><i /><i /><i /><i /></div>
            <div className="fig">{p.bars.map((b, j) => <i key={j} style={{ height: `${Math.max(8, Math.min(100, b))}%` }} />)}</div>
            <div className="page-foot"><span>Richmond Hill, ON</span><span>Before school</span></div>
          </div>
        ))}
      </div>
      <div className="stack-cap"><span className="t-mono">Latest issues</span><span className="t-mono">Scroll to fan them out</span></div>
    </div>
  )
}
