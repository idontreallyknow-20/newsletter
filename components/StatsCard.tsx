'use client'

interface StatsCardProps {
  label: string
  value: string | number
  subtitle?: string
  index?: number
}

export default function StatsCard({ label, value, subtitle, index = 0 }: StatsCardProps) {
  return (
    <div
      className="animate-fade-up relative"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--border-accent)' }} />
      <div className="pt-4 pb-5 px-1">
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
          {label}
        </p>
        <p className="font-display text-4xl font-bold leading-none mb-2" style={{ color: 'var(--cream)' }}>
          {value}
        </p>
        {subtitle && (
          <p className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--muted)', opacity: 0.6 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
