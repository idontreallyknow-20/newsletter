'use client'

import { useState } from 'react'

export default function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <div className="pub-share-row">
      <span className="pub-share-label" aria-hidden="true">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pub-share-btn"
        aria-label={`Share "${title}" on X / Twitter`}
      >
        X / Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pub-share-btn"
        aria-label={`Share "${title}" on LinkedIn`}
      >
        LinkedIn
      </a>
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
