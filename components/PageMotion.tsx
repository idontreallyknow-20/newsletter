'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Page-wide motion: masthead entrance, parallax on the outlined section
 * numerals, staggered rows in ledgers and lists, charts that draw in.
 * Everything is skipped under prefers-reduced-motion.
 */
export default function PageMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // Entrance: masthead word rises, rules draw, then the front page fills in.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.masthead-word', { y: 40, opacity: 0, duration: 0.9 })
        .from('.masthead', { '--rule-scale': 0, duration: 0.7 }, 0.1)
        .from('.masthead-line > *', { y: 10, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.35)
        .from('.front-kicker, .front h1, .front .lede, .front .field, .front .prefs, .front .field-note, .front .byline', { y: 24, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.45)
        .from('.stack-stage', { y: 60, opacity: 0, duration: 1, ease: 'power2.out' }, 0.6)

      // Outlined numerals drift slower than the page.
      document.querySelectorAll<HTMLElement>('.sec-num').forEach(el => {
        gsap.fromTo(el, { y: 80 }, { y: -80, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })

      // Rows arrive one after another.
      document.querySelectorAll<HTMLElement>('.ledger, .arch-list, .beats').forEach(list => {
        const rows = list.querySelectorAll<HTMLElement>(':scope > .ledger-row, :scope > .arch-row, :scope > .beat-wrap')
        if (!rows.length) return
        gsap.from(rows, { y: 18, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: list, start: 'top 85%' } })
      })

      // Charts draw in: bars grow from the baseline, lines sweep left to right.
      document.querySelectorAll<SVGSVGElement>('.figure:not(.figure--mini) svg').forEach(svg => {
        const bars = svg.querySelectorAll('rect')
        const path = svg.querySelector('path[stroke]')
        if (bars.length) gsap.from(bars, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.8, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: svg, start: 'top 85%' } })
        if (path) {
          const len = (path as SVGPathElement).getTotalLength()
          gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', scrollTrigger: { trigger: svg, start: 'top 85%' } })
        }
      })

      // Section headings slide their underline in.
      document.querySelectorAll<HTMLElement>('.sec-head').forEach(el => {
        gsap.from(el, { '--head-scale': 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
      })
    })
    return () => ctx.revert()
  }, [])
  return null
}
