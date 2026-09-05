import type { Figure as FigureSpec } from '@/lib/articles'

const INK = 'var(--ink)', RED = 'var(--red)', RULE = 'var(--rule)', MUTED = 'var(--muted)'

function fmt(v: number, unit?: string) {
  const s = Math.abs(v) >= 1000 ? v.toLocaleString('en-CA') : Number.isInteger(v) ? String(v) : v.toFixed(1)
  return unit === '%' ? `${s}%` : unit ? `${s} ${unit}` : s
}

/** Editorial charts drawn in SVG. Ink bars, one red highlight, no chart-library look. */
export default function Figure({ figure, mini = false, id }: { figure: FigureSpec; mini?: boolean; id: string }) {
  const { kind, data, unit } = figure
  const W = 640, H = mini ? 140 : 300, padL = mini ? 8 : 48, padR = 12, padT = 14, padB = mini ? 22 : 40
  const max = Math.max(...data.map(d => d.value), 0)
  const min = Math.min(...data.map(d => d.value), 0)
  const range = max - min || 1
  const y = (v: number) => padT + (1 - (v - min) / range) * (H - padT - padB)
  const zero = y(0)
  const lastIdx = data.length - 1

  let body: React.ReactNode
  if (kind === 'stat') {
    const d = data[0]
    body = (
      <div>
        <div className="big">{fmt(d.value, unit)}</div>
        <div className="big-label">{d.label}</div>
      </div>
    )
  } else if (kind === 'bars') {
    const gap = 10
    const bw = (W - padL - padR - gap * (data.length - 1)) / data.length
    body = (
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${id}-t`}>
        <title id={`${id}-t`}>{figure.title}</title>
        {!mini && [0.25, 0.5, 0.75, 1].map(f => { const v = min + range * f; return <g key={f}><line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke={RULE} strokeWidth="1" /><text x={padL - 8} y={y(v) + 4} fontSize="11" fill={MUTED} textAnchor="end" fontFamily="var(--font-geist-mono), monospace">{fmt(Math.round(v * 10) / 10, unit)}</text></g> })}
        <line x1={padL} x2={W - padR} y1={zero} y2={zero} stroke={INK} strokeWidth="1.5" />
        {data.map((d, i) => {
          const x = padL + i * (bw + gap)
          const top = Math.min(y(d.value), zero), h = Math.abs(y(d.value) - zero)
          return (
            <g key={d.label}>
              <rect x={x} y={top} width={bw} height={Math.max(1, h)} fill={i === lastIdx ? RED : INK} />
              {!mini && <text x={x + bw / 2} y={H - padB + 18} fontSize="11" fill={MUTED} textAnchor="middle" fontFamily="var(--font-geist-mono), monospace">{d.label}</text>}
              {!mini && <text x={x + bw / 2} y={top - 6} fontSize="11" fill={i === lastIdx ? RED : INK} textAnchor="middle" fontFamily="var(--font-geist), sans-serif">{fmt(d.value, unit)}</text>}
            </g>
          )
        })}
      </svg>
    )
  } else {
    const step = (W - padL - padR) / Math.max(1, data.length - 1)
    const pts = data.map((d, i) => [padL + i * step, y(d.value)] as const)
    const dPath = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
    const area = `${dPath} L${pts[pts.length - 1][0]},${H - padB} L${padL},${H - padB} Z`
    body = (
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${id}-t`}>
        <title id={`${id}-t`}>{figure.title}</title>
        {!mini && [0.25, 0.5, 0.75, 1].map(f => { const v = min + range * f; return <g key={f}><line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke={RULE} strokeWidth="1" /><text x={padL - 8} y={y(v) + 4} fontSize="11" fill={MUTED} textAnchor="end" fontFamily="var(--font-geist-mono), monospace">{fmt(Math.round(v * 10) / 10, unit)}</text></g> })}
        <path d={area} fill={INK} opacity="0.06" />
        <path d={dPath} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === lastIdx ? 5 : 3} fill={i === lastIdx ? RED : INK} />)}
        {!mini && data.map((d, i) => <text key={d.label} x={pts[i][0]} y={H - padB + 18} fontSize="11" fill={MUTED} textAnchor={i === 0 ? 'start' : i === lastIdx ? 'end' : 'middle'} fontFamily="var(--font-geist-mono), monospace">{d.label}</text>)}
        {!mini && <text x={pts[lastIdx][0]} y={pts[lastIdx][1] - 12} fontSize="12" fill={RED} textAnchor="end" fontFamily="var(--font-geist), sans-serif" fontWeight="600">{fmt(data[lastIdx].value, unit)}</text>}
      </svg>
    )
  }

  if (mini) return <div className="figure figure--mini" aria-hidden="true">{body}</div>
  return (
    <figure className={`figure${kind === 'stat' ? ' figure--stat' : ''}`}>
      <div className="figure-title">{figure.title}</div>
      {body}
      <figcaption className="figure-cap">{figure.caption}</figcaption>
    </figure>
  )
}
