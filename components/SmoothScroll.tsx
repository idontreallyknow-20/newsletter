'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/** Lenis smooth scroll for the public site. No-op under reduced motion or on touch devices. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    // Anchor links go through Lenis so the hash jump is smooth too.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"], a[href^="/#"]') as HTMLAnchorElement | null
      if (!a) return
      const hash = a.getAttribute('href')!.replace(/^\//, '')
      if (window.location.pathname !== '/' && a.getAttribute('href')!.startsWith('/#')) return
      const el = document.querySelector(hash)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -60 })
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(raf); document.removeEventListener('click', onClick); lenis.destroy() }
  }, [])
  return null
}
