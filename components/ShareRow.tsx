'use client'

import { useState, useEffect, useRef } from 'react'

export default function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  // Close QR popup on outside click
  useEffect(() => {
    if (!showQr) return
    function handler(e: MouseEvent) {
      if (qrRef.current && !qrRef.current.contains(e.target as Node)) {
        setShowQr(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showQr])

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}&bgcolor=f5f0e8&color=1a1a1a&margin=12`

  return (
    <div className="pub-share-row">
      <span className="pub-share-label" aria-hidden="true">Share</span>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank" rel="noopener noreferrer"
        className="pub-share-btn"
        aria-label={`Share on X / Twitter`}
      >
        X
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="pub-share-btn"
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </a>

      {/* WeChat — shows QR code to scan */}
      <div ref={qrRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setShowQr(v => !v)}
          className="pub-share-btn"
          aria-label="Share on WeChat"
          aria-expanded={showQr}
        >
          WeChat
        </button>
        {showQr && (
          <div className="share-qr-popup">
            <p className="share-qr-label">Scan with WeChat</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="QR code" width={160} height={160} style={{ display: 'block', margin: '0 auto' }} />
            <p className="share-qr-url">{url.replace(/^https?:\/\//, '').slice(0, 40)}</p>
          </div>
        )}
      </div>

      <button
        onClick={copyLink}
        className="pub-share-btn"
        aria-label={copied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
        aria-live="polite"
        style={copied ? { color: '#2d7a3a', borderColor: '#a3d4a8', background: '#f0faf1' } : {}}
      >
        {copied ? '✓ Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
