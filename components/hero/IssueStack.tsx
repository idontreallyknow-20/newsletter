'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export interface StackPage { num: string; title: string; tag: string; date: string; bars: number[] }

type IconName = 'rates' | 'chip' | 'globe' | 'house' | 'work' | 'trade'

/* Small line icons drawn inline so the mini pages need no image files. */
function Icon({ name }: { name: IconName }) {
  const common = { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'rates': return <svg {...common}><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg>
    case 'chip': return <svg {...common}><rect x="7" y="7" width="10" height="10" /><path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3" /></svg>
    case 'globe': return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></svg>
    case 'house': return <svg {...common}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>
    case 'work': return <svg {...common}><rect x="3" y="7" width="18" height="13" /><path d="M8 7V4h8v3M3 13h18" /></svg>
    case 'trade': return <svg {...common}><path d="M3 8h14l-3-3M21 16H7l3 3" /></svg>
  }
}

/* Decorative front-page stories. Plausible, unsourced, and never shown as real reporting. */
const STORIES: { lead: string; deck: string; items: { icon: IconName; text: string }[] }[] = [
  { lead: 'Bank of Canada holds at 2.5% and says tariffs cut both ways', deck: 'Cuts on hold while the trade dispute pushes prices up and exports down.',
    items: [{ icon: 'house', text: 'GTA rents fall for a fourth straight quarter' }, { icon: 'chip', text: 'TSMC Arizona yields close in on Taiwan' }, { icon: 'work', text: 'Youth unemployment stays above 14%' }] },
  { lead: 'Frontier model prices fall another 40% as labs chase volume', deck: 'The cheapest usable model now costs cents per million tokens.',
    items: [{ icon: 'rates', text: 'Ten-year yields drift higher on deficit math' }, { icon: 'globe', text: 'Mexico overtakes China as top US supplier' }, { icon: 'trade', text: 'Steel tariffs land on Hamilton mills' }] },
  { lead: 'Ontario factories wait on the CUSMA review', deck: 'Investment announcements, not speeches, will say who wins the consolidation fight.',
    items: [{ icon: 'work', text: 'Entry-level postings still a third below 2022' }, { icon: 'chip', text: 'Export controls extend to third-country data centres' }, { icon: 'house', text: 'Fourplex zoning clears Toronto council' }] },
  { lead: 'Canada\'s productivity gap widens for a sixth year', deck: 'Output per hour trails the US by close to 30%. AI raises the ceiling; habits keep firms under it.',
    items: [{ icon: 'rates', text: 'Fixed mortgage rates stall near 4%' }, { icon: 'globe', text: 'Reserve managers keep trimming dollar share' }, { icon: 'trade', text: 'Auto parts cross the border seven times' }] },
  { lead: 'Open-weight models close to within six months of the frontier', deck: 'The money is in running them well, not in the weights.',
    items: [{ icon: 'chip', text: 'Nvidia margins hold above 70%' }, { icon: 'work', text: 'Firms pair juniors with seniors from day one' }, { icon: 'house', text: 'CMHC: 3.5 million homes short by 2030' }] },
]

export default function IssueStack({ pages }: { pages: StackPage[] }) {
  const stage = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLDivElement>(null)
  const breathe = useRef<HTMLDivElement>(null)

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
        tl.to(c, { x: spread * 120, y: -depth * 18 + Math.abs(spread) * 22, z: -depth * 8, rotateZ: spread * 9, ease: 'none' }, 0)
      })
      if (breathe.current) gsap.to(breathe.current, { y: 10, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }, st)

    const onMove = (e: PointerEvent) => {
      const r = st.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      gsap.to(el, { rotateY: px * 14, x: px * 18, duration: 0.8, ease: 'power2.out' })
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
      <div className="stack-breathe" ref={breathe}>
      <div className="stack" ref={stack}>
        {pages.map((p, i) => {
          const story = STORIES[i % STORIES.length]
          return (
            <div className="page" key={p.num + i} style={{ zIndex: i + 1 }}>
              <div className="page-mast"><b>Daily<i>.</i>Brief</b><span>{p.date}</span></div>
              <div className="page-strip"><span>{p.tag}</span><span>{p.num}</span><span>Richmond Hill</span></div>
              <h3>{story.lead}</h3>
              <p className="deck">{story.deck}</p>
              <div className="page-cols">
                <ul className="page-items">
                  {story.items.map((it, j) => <li key={j}><span className="ic"><Icon name={it.icon} /></span>{it.text}</li>)}
                </ul>
                <div className="fig">{p.bars.map((b, j) => <i key={j} style={{ height: `${Math.max(8, Math.min(100, b))}%` }} />)}</div>
              </div>
              <div className="page-foot"><span>Economics and AI</span><span>Before school</span></div>
            </div>
          )
        })}
      </div>
      </div>
      <div className="stack-cap"><span className="t-mono">Recent front pages</span><span className="t-mono">Scroll to fan them out</span></div>
    </div>
  )
}
