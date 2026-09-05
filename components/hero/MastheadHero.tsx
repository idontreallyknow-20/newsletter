'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'

const TickerRibbon = dynamic(() => import('./TickerRibbon'), { ssr: false, loading: () => null })

export default function MastheadHero({ headlines, issueCount, dateline }: { headlines: string[]; issueCount: number; dateline: string }) {
  const [loading, setLoading] = useState(true)
  const [webgl, setWebgl] = useState<'unknown' | 'yes' | 'no'>('unknown')

  useEffect(() => {
    const t = requestAnimationFrame(() => setLoading(false))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ok = false
    try {
      const c = document.createElement('canvas')
      ok = !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch { ok = false }
    setWebgl(!reduced && ok ? 'yes' : 'no')
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <section className={`hero${loading ? ' is-loading' : ''}`} id="top" aria-label="Daily Brief">
      <div className="hero-bg" aria-hidden="true" />

      <div className="hero-edge" aria-hidden="true">
        <span className="t-mono">Issue {String(issueCount).padStart(3, '0')} · {dateline}</span>
        <span className="t-serif-i">Economics and AI, before school.</span>
      </div>

      <div className="hero-canvas" aria-hidden="true">
        {webgl === 'yes' && <TickerRibbon lines={headlines} />}
        {webgl === 'no' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero-poster" src="/img/ribbon-poster.png" alt="" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
        )}
      </div>

      <div className="wrap hero-inner">
        <h1 className="hero-type t-display">
          <span className="hero-line hero-line--back">The economy and AI,</span>
          <span className="hero-line hero-line--front">read <em>before school.</em></span>
        </h1>

        <div className="hero-foot">
          <div>
            <p className="hero-sub">
              A short morning brief on what moved markets and what the AI labs actually shipped, written by <b>Joseph</b>, a Grade 11 student and three-time national team chess champion in Richmond Hill, Ontario. Free, in English and Chinese.
            </p>
            <div className="hero-meta">
              <span>{issueCount} issues</span>
              <span>Daily or weekly</span>
              <span>~7:00 AM ET</span>
              <span>EN / 中文</span>
            </div>
          </div>
          <div>
            <PublicSubscribeForm compact />
          </div>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true"><span className="t-mono">Scroll</span></div>
    </section>
  )
}
