'use client'

import { useState, useEffect, useRef } from 'react'

export default function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [url, setUrl] = useState('')
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setUrl(window.location.href) }, [])
  useEffect(() => {
    if (!showQr) return
    const handler = (e: MouseEvent) => { if (qrRef.current && !qrRef.current.contains(e.target as Node)) setShowQr(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showQr])

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500) })
  }
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=0C0E14&margin=12`

  return (
    <div className="share-row">
      <span className="t-mono">Share</span>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="share-btn" aria-label="Share on X">X</a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="share-btn" aria-label="Share on LinkedIn">LinkedIn</a>
      <div ref={qrRef} style={{ position: 'relative' }}>
        <button onClick={() => setShowQr(v => !v)} className="share-btn" aria-label="Share on WeChat" aria-expanded={showQr}>WeChat</button>
        {showQr && (
          <div className="share-qr-popup">
            <p className="share-qr-label">Scan with WeChat</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="QR code" width={160} height={160} style={{ display: 'block', margin: '0 auto' }} />
            <p className="share-qr-url">{url.replace(/^https?:\/\//, '').slice(0, 40)}</p>
          </div>
        )}
      </div>
      <button onClick={copyLink} className="share-btn" aria-live="polite">{copied ? 'Copied' : 'Copy link'}</button>
    </div>
  )
}
