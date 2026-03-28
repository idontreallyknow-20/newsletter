// Minimal line-art SVG icons for the "What You'll Read" topic grid.
// Strokes use currentColor so the parent can set the color via CSS.

const props = {
  viewBox: '0 0 40 40',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.2',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  width: 36,
  height: 36,
}

export function IconMarkets() {
  return (
    <svg {...props}>
      {/* Faint grid */}
      <line x1="4" y1="32" x2="36" y2="32" strokeOpacity="0.25" />
      <line x1="4" y1="24" x2="36" y2="24" strokeOpacity="0.15" />
      <line x1="4" y1="16" x2="36" y2="16" strokeOpacity="0.15" />
      {/* Trend line */}
      <polyline points="4,30 12,22 20,25 28,14 36,8" strokeOpacity="0.5" />
      {/* Candles */}
      <line x1="12" y1="18" x2="12" y2="26" strokeOpacity="0.5" />
      <rect x="10" y="20" width="4" height="4" strokeOpacity="0.7" />
      <line x1="20" y1="21" x2="20" y2="29" strokeOpacity="0.5" />
      <rect x="18" y="22" width="4" height="5" strokeOpacity="0.7" />
      <line x1="28" y1="10" x2="28" y2="18" strokeOpacity="0.5" />
      <rect x="26" y="11" width="4" height="5" strokeOpacity="0.7" />
      {/* Highlight dot at peak */}
      <circle cx="36" cy="8" r="1.8" fill="currentColor" strokeWidth="0" />
    </svg>
  )
}

export function IconAI() {
  return (
    <svg {...props}>
      {/* Input layer */}
      <circle cx="6" cy="14" r="2.5" />
      <circle cx="6" cy="26" r="2.5" />
      {/* Hidden layer */}
      <circle cx="20" cy="9" r="2.5" />
      <circle cx="20" cy="20" r="2.5" />
      <circle cx="20" cy="31" r="2.5" />
      {/* Output layer */}
      <circle cx="34" cy="15" r="2.5" />
      <circle cx="34" cy="27" r="2.5" />
      {/* Connections layer 1→2 */}
      <line x1="8.5" y1="13" x2="17.5" y2="10" strokeOpacity="0.4" />
      <line x1="8.5" y1="14.5" x2="17.5" y2="20" strokeOpacity="0.4" />
      <line x1="8.5" y1="26" x2="17.5" y2="20" strokeOpacity="0.4" />
      <line x1="8.5" y1="27" x2="17.5" y2="31" strokeOpacity="0.4" />
      <line x1="8.5" y1="15" x2="17.5" y2="9.5" strokeOpacity="0.25" />
      {/* Connections layer 2→3 */}
      <line x1="22.5" y1="9.5" x2="31.5" y2="15" strokeOpacity="0.4" />
      <line x1="22.5" y1="20" x2="31.5" y2="15" strokeOpacity="0.4" />
      <line x1="22.5" y1="20" x2="31.5" y2="27" strokeOpacity="0.4" />
      <line x1="22.5" y1="31" x2="31.5" y2="27" strokeOpacity="0.4" />
    </svg>
  )
}

export function IconGlobe() {
  return (
    <svg {...props}>
      {/* Outer circle */}
      <circle cx="20" cy="20" r="16" strokeOpacity="0.9" />
      {/* Center vertical ellipse */}
      <ellipse cx="20" cy="20" rx="7" ry="16" strokeOpacity="0.5" />
      {/* Latitude lines */}
      <path d="M4.5 13 Q20 9 35.5 13" strokeOpacity="0.3" />
      <line x1="4" y1="20" x2="36" y2="20" strokeOpacity="0.35" />
      <path d="M4.5 27 Q20 31 35.5 27" strokeOpacity="0.3" />
      {/* Small highlight dot */}
      <circle cx="26" cy="15" r="1.5" fill="currentColor" strokeWidth="0" fillOpacity="0.6" />
    </svg>
  )
}

export function IconWork() {
  return (
    <svg {...props}>
      {/* Person */}
      <circle cx="15" cy="12" r="4.5" />
      <path d="M5 34 C5 24 25 24 25 34" strokeOpacity="0.8" />
      {/* Upward arrow on right */}
      <line x1="32" y1="34" x2="32" y2="10" />
      <polyline points="27,15 32,10 37,15" />
      {/* Subtle tick marks on axis */}
      <line x1="30" y1="22" x2="34" y2="22" strokeOpacity="0.35" />
      <line x1="30" y1="28" x2="34" y2="28" strokeOpacity="0.35" />
    </svg>
  )
}

export function IconAnalysis() {
  return (
    <svg {...props}>
      {/* Magnifying glass */}
      <circle cx="17" cy="17" r="11" />
      <line x1="25" y1="25" x2="35" y2="35" strokeWidth="2" strokeLinecap="round" />
      {/* Crosshair inside lens */}
      <line x1="11" y1="17" x2="23" y2="17" strokeOpacity="0.4" />
      <line x1="17" y1="11" x2="17" y2="23" strokeOpacity="0.4" />
      {/* Center dot */}
      <circle cx="17" cy="17" r="1.8" fill="currentColor" strokeWidth="0" fillOpacity="0.5" />
    </svg>
  )
}

export function IconDigest() {
  return (
    <svg {...props}>
      {/* Page outline */}
      <rect x="5" y="6" width="30" height="28" rx="1" strokeOpacity="0.9" />
      {/* Masthead bar */}
      <line x1="5" y1="14" x2="35" y2="14" />
      {/* Headline text block */}
      <line x1="8" y1="10" x2="28" y2="10" strokeOpacity="0.5" />
      {/* Column divider */}
      <line x1="20" y1="14" x2="20" y2="34" strokeOpacity="0.25" />
      {/* Left column text lines */}
      <line x1="8" y1="19" x2="17" y2="19" strokeOpacity="0.5" />
      <line x1="8" y1="23" x2="17" y2="23" strokeOpacity="0.5" />
      <line x1="8" y1="27" x2="17" y2="27" strokeOpacity="0.5" />
      <line x1="8" y1="31" x2="14" y2="31" strokeOpacity="0.3" />
      {/* Right column text lines */}
      <line x1="23" y1="19" x2="32" y2="19" strokeOpacity="0.5" />
      <line x1="23" y1="23" x2="32" y2="23" strokeOpacity="0.5" />
      <line x1="23" y1="27" x2="32" y2="27" strokeOpacity="0.5" />
      <line x1="23" y1="31" x2="30" y2="31" strokeOpacity="0.3" />
    </svg>
  )
}
