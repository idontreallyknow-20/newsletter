'use client'

import { useEffect, useState } from 'react'

interface StatsCardProps {
  label: string
  value: string | number
  subtitle?: string
  delay?: number
}

export default function StatsCard({ label, value, subtitle, delay = 0 }: StatsCardProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={`bg-surface border border-white/10 rounded-lg p-6 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-muted text-xs font-sans uppercase tracking-widest mb-3">{label}</p>
      <p className="font-display text-3xl font-bold text-cream">{value}</p>
      {subtitle && <p className="text-muted text-xs font-sans mt-2">{subtitle}</p>}
    </div>
  )
}
