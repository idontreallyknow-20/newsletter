import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Daily Brief by Joseph'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(135deg, #0C0E14 0%, #141721 100%)', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 80px', position: 'relative', color: '#E7E9E6',
      }}>
        <div style={{ position: 'absolute', top: -120, right: -80, width: 520, height: 520, borderRadius: 999, background: 'radial-gradient(circle, rgba(255,90,31,0.45) 0%, rgba(255,90,31,0) 70%)', display: 'flex' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span style={{ fontWeight: 800 }}>DAILY<span style={{ color: '#FF5A1F' }}>.</span>BRIEF</span>
          <span style={{ color: '#9AA0AB', fontSize: 18 }}>dailybriefhq.com</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em', display: 'flex', flexDirection: 'column' }}>
            <span>The economy and AI,</span>
            <span>read <span style={{ color: '#FF5A1F' }}>before school.</span></span>
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: '#9AA0AB', display: 'flex' }}>
            By Joseph. Grade 11, Richmond Hill. Free, in English and Chinese.
          </div>
        </div>
        <div style={{ height: 6, background: '#FF5A1F', width: 160, display: 'flex' }} />
      </div>
    ),
    { ...size }
  )
}
