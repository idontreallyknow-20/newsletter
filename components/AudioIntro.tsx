'use client'

import { useEffect, useRef, useState } from 'react'

export default function AudioIntro({ src = '/joseph-intro.mp3' }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch(src, { method: 'HEAD' })
      .then(r => { if (!cancelled) setAvailable(r.ok) })
      .catch(() => { if (!cancelled) setAvailable(false) })
    return () => { cancelled = true }
  }, [src])

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (a.paused) { a.play().catch(() => {}); setPlaying(true) }
    else { a.pause(); setPlaying(false) }
  }

  if (available === false) return null

  const percent = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0
  const remaining = duration > 0 ? Math.max(0, Math.ceil(duration - progress)) : null

  return (
    <div
      className="pub-audio-intro"
      style={{
        marginTop: '20px',
        display: 'inline-flex', alignItems: 'center', gap: '14px',
        padding: '10px 16px 10px 12px',
        background: 'var(--pub-cream-2)',
        border: '1px solid var(--pub-border)',
        maxWidth: '360px',
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause intro' : 'Play 30-second intro'}
        style={{
          width: '36px', height: '36px', flexShrink: 0,
          borderRadius: '50%',
          background: 'var(--red)', color: '#f5f0e8',
          border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {playing ? (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
            <rect x="0" y="0" width="4" height="14" /><rect x="8" y="0" width="4" height="14" />
          </svg>
        ) : (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
            <path d="M0 0 L12 7 L0 14 Z" />
          </svg>
        )}
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)',
        }}>
          {playing ? 'Now playing' : 'Hear the intro'}
        </span>
        <div style={{
          height: '3px', background: 'var(--pub-border)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, width: `${percent}%`,
            background: 'var(--red)', transition: 'width 0.1s linear',
          }} />
        </div>
        <span style={{ fontFamily: 'var(--font-dm)', fontSize: '11px', color: 'var(--tan)' }}>
          {remaining !== null ? `${remaining}s remaining` : '~30 seconds'}
        </span>
      </div>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={e => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); setProgress(0) }}
      />
    </div>
  )
}
