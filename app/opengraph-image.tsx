import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Daily Brief by Joseph'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ background: '#F4F2ED', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 72px', color: '#121212', fontFamily: 'Georgia, serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '6px solid #121212', borderBottom: '2px solid #121212', padding: '18px 0 14px' }}>
          <span style={{ fontSize: 120, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>Daily<span style={{ color: '#B3261E' }}>.</span>Brief</span>
          <span style={{ fontSize: 18, color: '#5F5E59', fontFamily: 'monospace', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 12 }}>Richmond Hill, Ontario · Free · English and Chinese</span>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', display: 'flex', maxWidth: 1000 }}>The economy and AI, explained before school.</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#5F5E59' }}>
          <span>By Joseph · Grade 11 · Three-time national team chess champion</span>
          <span>dailybriefhq.com</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
