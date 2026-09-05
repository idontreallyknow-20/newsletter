'use client'

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

/** Fade-and-rise once when the element enters the viewport. One pattern, reused everywhere. */
export default function Reveal({ children, delay = 0, className = '', style, as: Tag = 'div' }: {
  children: ReactNode; delay?: number; className?: string; style?: CSSProperties; as?: 'div' | 'section' | 'li' | 'article'
}) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('is-in'); return }
    const io = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (en.isIntersecting) { el.classList.add('is-in'); io.disconnect() }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const T = Tag as unknown as 'div'
  return <T ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</T>
}
