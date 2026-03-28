import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Joseph — Economics & AI Newsletter'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f5f0e8',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          position: 'relative',
        }}
      >
        {/* Red accent bar */}
        <div style={{ width: 40, height: 4, background: '#c8402a', marginBottom: 28, display: 'flex' }} />

        {/* Eyebrow */}
        <div style={{
          color: '#c8402a', fontSize: 14, fontWeight: 500,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 20, display: 'flex',
        }}>
          Economics · AI · Weekly
        </div>

        {/* Headline */}
        <div style={{
          color: '#1a1a1a', fontSize: 80, fontWeight: 900,
          lineHeight: 1.0, letterSpacing: '-0.02em',
          marginBottom: 28, display: 'flex', flexDirection: 'column',
        }}>
          Joseph
        </div>

        {/* Subtitle */}
        <div style={{
          color: '#6b6459', fontSize: 26, fontWeight: 300,
          lineHeight: 1.5, maxWidth: 640, display: 'flex',
        }}>
          A weekly newsletter breaking down economic forces and AI breakthroughs shaping our world.
        </div>

        {/* URL stamp */}
        <div style={{
          position: 'absolute', bottom: 72, right: 96,
          color: '#c8402a', fontSize: 14, letterSpacing: '0.08em',
          display: 'flex',
        }}>
          newsletter-joseph.vercel.app
        </div>

        {/* Border accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: 8, background: '#c8402a', display: 'flex',
        }} />
      </div>
    ),
    { ...size }
  )
}
