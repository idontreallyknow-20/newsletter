// Thematic SVG illustrations for each static article.
// viewBox 200×130 (landscape). Strokes use currentColor.

const base = {
  viewBox: '0 0 200 130',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  width: '100%',
  height: '100%',
}

// The Fed's Impossible Dilemma — balance scales
function FedScales() {
  return (
    <svg {...base} role="img" aria-label="Illustration: a tilted balance scale weighing growth against inflation">
      {/* Base */}
      <line x1="100" y1="115" x2="100" y2="65" strokeWidth="1.5" />
      <line x1="78" y1="115" x2="122" y2="115" strokeWidth="1.5" />
      <circle cx="100" cy="63" r="2.5" fill="currentColor" strokeWidth="0" />
      {/* Beam — tilted left heavy (growth weighing down) */}
      <line x1="38" y1="74" x2="162" y2="58" strokeWidth="1.5" />
      {/* Left chain + pan (growth side, lower) */}
      <line x1="38" y1="74" x2="38" y2="84" strokeWidth="1" strokeOpacity="0.6" />
      <path d="M24 84 Q38 88 52 84" strokeWidth="1.2" />
      {/* Growth arrow up */}
      <line x1="38" y1="100" x2="38" y2="92" strokeWidth="1.2" />
      <polyline points="34,95 38,90 42,95" strokeWidth="1.2" />
      {/* Right chain + pan (inflation, higher) */}
      <line x1="162" y1="58" x2="162" y2="68" strokeWidth="1" strokeOpacity="0.6" />
      <path d="M148 68 Q162 72 176 68" strokeWidth="1.2" />
      {/* Flame (inflation) */}
      <path d="M157 82 C157 76 162 73 162 68 C165 72 167 70 166 65 C170 70 168 78 162 82 C160 84 157 83 157 82Z"
        strokeWidth="1" strokeOpacity="0.7" />
      {/* Labels */}
      <text x="28" y="112" fontFamily="monospace" fontSize="7" fill="currentColor" fillOpacity="0.45" stroke="none">GROWTH</text>
      <text x="148" y="96" fontFamily="monospace" fontSize="7" fill="currentColor" fillOpacity="0.45" stroke="none">INFLATION</text>
      {/* Tension dashes */}
      <line x1="68" y1="50" x2="75" y2="50" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="2 2" />
      <line x1="125" y1="44" x2="132" y2="44" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="2 2" />
    </svg>
  )
}

// GPT-5 Arms Race — two rockets racing upward
function ArmsRace() {
  return (
    <svg {...base} role="img" aria-label="Illustration: two rockets racing upward through a grid, marking the AI capability arms race">
      {/* Grid lines */}
      <line x1="30" y1="20" x2="30" y2="110" strokeWidth="0.6" strokeOpacity="0.15" />
      <line x1="80" y1="20" x2="80" y2="110" strokeWidth="0.6" strokeOpacity="0.15" />
      <line x1="130" y1="20" x2="130" y2="110" strokeWidth="0.6" strokeOpacity="0.15" />
      <line x1="180" y1="20" x2="180" y2="110" strokeWidth="0.6" strokeOpacity="0.15" />
      <line x1="20" y1="35" x2="185" y2="35" strokeWidth="0.6" strokeOpacity="0.15" />
      <line x1="20" y1="65" x2="185" y2="65" strokeWidth="0.6" strokeOpacity="0.15" />
      <line x1="20" y1="95" x2="185" y2="95" strokeWidth="0.6" strokeOpacity="0.15" />
      {/* Rocket 1 trail (slightly ahead) */}
      <path d="M25 100 C60 90 90 60 140 25" strokeWidth="1.5" strokeOpacity="0.9" />
      {/* Rocket 1 body */}
      <ellipse cx="143" cy="23" rx="6" ry="9" transform="rotate(-50 143 23)" strokeWidth="1.2" />
      <path d="M149 17 L153 11 L155 20Z" strokeWidth="1" strokeOpacity="0.7" />
      {/* Trail sparks 1 */}
      <line x1="137" y1="29" x2="133" y2="34" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="134" y1="31" x2="129" y2="33" strokeWidth="0.8" strokeOpacity="0.3" />
      {/* Rocket 2 trail (just behind) */}
      <path d="M25 110 C55 100 85 75 130 45" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 2" />
      {/* Rocket 2 body */}
      <ellipse cx="133" cy="43" rx="5" ry="8" transform="rotate(-50 133 43)" strokeWidth="1.2" strokeOpacity="0.6" />
      {/* Speed lines */}
      <line x1="90" y1="56" x2="82" y2="58" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="88" y1="62" x2="79" y2="63" strokeWidth="0.8" strokeOpacity="0.2" />
      <line x1="55" y1="82" x2="47" y2="83" strokeWidth="0.8" strokeOpacity="0.25" />
    </svg>
  )
}

// Recession Predictions Wrong — forecast vs reality
function RecessionChart() {
  return (
    <svg {...base} role="img" aria-label="Illustration: a forecast line diverging from the actual outcome on a chart">
      {/* Axes */}
      <line x1="28" y1="20" x2="28" y2="105" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="28" y1="105" x2="180" y2="105" strokeWidth="1.2" strokeOpacity="0.5" />
      {/* Grid */}
      <line x1="28" y1="50" x2="180" y2="50" strokeWidth="0.6" strokeOpacity="0.12" />
      <line x1="28" y1="75" x2="180" y2="75" strokeWidth="0.6" strokeOpacity="0.12" />
      {/* Actual line — stays mostly flat, mild slope */}
      <polyline points="28,75 60,73 90,70 120,69 150,67 180,65" strokeWidth="2" strokeOpacity="0.85" />
      {/* Prediction lines — various dashed arrows all pointing down sharply */}
      <path d="M60 73 L80 95" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />
      <path d="M90 70 L110 98" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />
      <path d="M120 69 L138 97" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />
      {/* X marks at prediction endpoints */}
      <line x1="77" y1="92" x2="83" y2="98" strokeWidth="0.9" strokeOpacity="0.45" />
      <line x1="83" y1="92" x2="77" y2="98" strokeWidth="0.9" strokeOpacity="0.45" />
      <line x1="107" y1="95" x2="113" y2="101" strokeWidth="0.9" strokeOpacity="0.45" />
      <line x1="113" y1="95" x2="107" y2="101" strokeWidth="0.9" strokeOpacity="0.45" />
      <line x1="135" y1="94" x2="141" y2="100" strokeWidth="0.9" strokeOpacity="0.45" />
      <line x1="141" y1="94" x2="135" y2="100" strokeWidth="0.9" strokeOpacity="0.45" />
      {/* "?" labels */}
      <text x="157" y="90" fontFamily="monospace" fontSize="10" fill="currentColor" fillOpacity="0.35" stroke="none">?</text>
      <text x="167" y="75" fontFamily="monospace" fontSize="10" fill="currentColor" fillOpacity="0.25" stroke="none">?</text>
      {/* Legend */}
      <line x1="35" y1="20" x2="50" y2="20" strokeWidth="1.8" strokeOpacity="0.8" />
      <text x="53" y="23" fontFamily="monospace" fontSize="6.5" fill="currentColor" fillOpacity="0.5" stroke="none">ACTUAL</text>
      <line x1="35" y1="29" x2="50" y2="29" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />
      <text x="53" y="32" fontFamily="monospace" fontSize="6.5" fill="currentColor" fillOpacity="0.5" stroke="none">PREDICTED</text>
    </svg>
  )
}

// AI Takeover of White-Collar Work — desk + neural network overlay
function AITakeover() {
  return (
    <svg {...base} role="img" aria-label="Illustration: an AI overlay sitting on top of office desk work">
      {/* Desk */}
      <line x1="30" y1="90" x2="170" y2="90" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="50" y1="90" x2="50" y2="110" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="150" y1="90" x2="150" y2="110" strokeWidth="1.2" strokeOpacity="0.4" />
      {/* Monitor */}
      <rect x="75" y="55" width="50" height="34" rx="1" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="100" y1="89" x2="100" y2="95" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="90" y1="95" x2="110" y2="95" strokeWidth="1.2" strokeOpacity="0.5" />
      {/* Person (simple seated silhouette) */}
      <circle cx="100" cy="43" r="7" strokeOpacity="0.5" strokeWidth="1.2" />
      <path d="M88 58 Q100 54 112 58" strokeWidth="1.2" strokeOpacity="0.4" />
      {/* Neural network nodes overlaid on person */}
      <circle cx="100" cy="43" r="2.5" fill="currentColor" strokeWidth="0" fillOpacity="0.6" />
      <circle cx="84" cy="38" r="2" fill="currentColor" strokeWidth="0" fillOpacity="0.5" />
      <circle cx="116" cy="38" r="2" fill="currentColor" strokeWidth="0" fillOpacity="0.5" />
      <circle cx="78" cy="52" r="2" fill="currentColor" strokeWidth="0" fillOpacity="0.4" />
      <circle cx="122" cy="52" r="2" fill="currentColor" strokeWidth="0" fillOpacity="0.4" />
      <circle cx="62" cy="32" r="1.5" fill="currentColor" strokeWidth="0" fillOpacity="0.3" />
      <circle cx="138" cy="32" r="1.5" fill="currentColor" strokeWidth="0" fillOpacity="0.3" />
      {/* Connections */}
      <line x1="100" y1="43" x2="84" y2="38" strokeWidth="0.8" strokeOpacity="0.35" />
      <line x1="100" y1="43" x2="116" y2="38" strokeWidth="0.8" strokeOpacity="0.35" />
      <line x1="84" y1="38" x2="78" y2="52" strokeWidth="0.7" strokeOpacity="0.25" />
      <line x1="116" y1="38" x2="122" y2="52" strokeWidth="0.7" strokeOpacity="0.25" />
      <line x1="84" y1="38" x2="62" y2="32" strokeWidth="0.7" strokeOpacity="0.2" />
      <line x1="116" y1="38" x2="138" y2="32" strokeWidth="0.7" strokeOpacity="0.2" />
      {/* Data lines emanating out */}
      <line x1="62" y1="32" x2="40" y2="22" strokeWidth="0.6" strokeOpacity="0.15" strokeDasharray="2 2" />
      <line x1="138" y1="32" x2="162" y2="22" strokeWidth="0.6" strokeOpacity="0.15" strokeDasharray="2 2" />
    </svg>
  )
}

// Deglobalization — globe with shifting trade flows
function Deglobalization() {
  return (
    <svg {...base} role="img" aria-label="Illustration: a globe with trade flows rerouting between continents">
      {/* Globe */}
      <circle cx="75" cy="65" r="40" strokeWidth="1.3" strokeOpacity="0.8" />
      <ellipse cx="75" cy="65" rx="18" ry="40" strokeWidth="0.9" strokeOpacity="0.4" />
      <path d="M35.5 52 Q75 46 114.5 52" strokeWidth="0.9" strokeOpacity="0.3" />
      <line x1="35" y1="65" x2="115" y2="65" strokeWidth="0.9" strokeOpacity="0.35" />
      <path d="M35.5 78 Q75 84 114.5 78" strokeWidth="0.9" strokeOpacity="0.3" />
      {/* Point A on globe (China-like position) */}
      <circle cx="98" cy="55" r="2.5" fill="currentColor" strokeWidth="0" fillOpacity="0.7" />
      {/* Point B (USA) */}
      <circle cx="52" cy="60" r="2.5" fill="currentColor" strokeWidth="0" fillOpacity="0.7" />
      {/* Point C (new friend-shoring hub) */}
      <circle cx="90" cy="75" r="2" fill="currentColor" strokeWidth="0" fillOpacity="0.5" />
      {/* Old direct route A→B (faded, struck through) */}
      <line x1="98" y1="55" x2="52" y2="60" strokeWidth="0.9" strokeOpacity="0.2" strokeDasharray="2 3" />
      {/* New rerouted flow A→C→B */}
      <path d="M98 55 Q92 68 90 75" strokeWidth="1.2" strokeOpacity="0.55" />
      <path d="M90 75 Q75 80 52 60" strokeWidth="1.2" strokeOpacity="0.55" />
      {/* Arrows on new route */}
      <polyline points="91,69 90,75 84,74" strokeWidth="1" strokeOpacity="0.5" />
      <polyline points="58,64 52,60 56,55" strokeWidth="1" strokeOpacity="0.5" />
      {/* Right side: legend / annotation */}
      <line x1="140" y1="45" x2="170" y2="45" strokeWidth="1" strokeOpacity="0.5" />
      <text x="140" y="42" fontFamily="monospace" fontSize="6.5" fill="currentColor" fillOpacity="0.5" stroke="none">DIRECT</text>
      <line x1="140" y1="58" x2="155" y2="58" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="158" y1="58" x2="170" y2="58" strokeWidth="1.2" strokeOpacity="0.5" />
      <text x="140" y="55" fontFamily="monospace" fontSize="6.5" fill="currentColor" fillOpacity="0.5" stroke="none">REROUTED</text>
      <line x1="140" y1="48" x2="170" y2="48" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.25" />
      {/* Small dots for other trade nodes */}
      <circle cx="60" cy="80" r="1.5" fill="currentColor" strokeWidth="0" fillOpacity="0.3" />
      <circle cx="85" cy="45" r="1.5" fill="currentColor" strokeWidth="0" fillOpacity="0.3" />
    </svg>
  )
}

export type IllustrationPos = 'left' | 'right' | 'center'

export interface ArticleIllustration {
  svg: React.ReactNode
  pos: IllustrationPos
}

export const ARTICLE_ILLUSTRATIONS: Record<string, ArticleIllustration> = {
  'fed-impossible-dilemma':       { svg: <FedScales />,      pos: 'right' },
  'gpt5-arms-race':               { svg: <ArmsRace />,       pos: 'left' },
  'recession-predictions-wrong':  { svg: <RecessionChart />, pos: 'center' },
  'ai-takeover-white-collar':     { svg: <AITakeover />,     pos: 'right' },
  'deglobalization-myth-megatrend': { svg: <Deglobalization />, pos: 'left' },
}
