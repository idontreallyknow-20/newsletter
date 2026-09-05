import { ImageResponse } from 'next/og'
import { SITE_URL } from '@/lib/seo'

export const runtime = 'edge'
export const alt = 'Daily Brief by Joseph Leung'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function portrait(): Promise<string | null> {
  try {
    const res = await fetch(`${SITE_URL}/joseph.jpg`)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    let bin = ''
    const bytes = new Uint8Array(buf)
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
    return `data:image/jpeg;base64,${btoa(bin)}`
  } catch { return null }
}

async function fraunces(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch('https://fonts.googleapis.com/css2?family=Fraunces:wght@900&display=swap', { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.text())
    const url = css.match(/src: url\(([^)]+)\) format\('(?:woff2|truetype|opentype)'\)/)?.[1]
    if (!url) return null
    return await fetch(url).then(r => r.arrayBuffer())
  } catch { return null }
}

export default async function Image() {
  const [font, photo] = await Promise.all([fraunces(), portrait()])
  return new ImageResponse(
    (
      <div style={{ background: '#F4F2ED', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '48px 64px', color: '#121212', fontFamily: font ? 'Fraunces' : 'Georgia, serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '8px solid #121212', paddingTop: 18 }}>
          <div style={{ fontSize: 132, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, display: 'flex' }}>Daily<span style={{ color: '#B3261E' }}>.</span>Brief</div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #121212', borderBottom: '2px solid #121212', marginTop: 10, padding: '10px 0', fontSize: 18, fontFamily: 'monospace', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5F5E59' }}>
            <span>Economics and AI</span><span>dailybriefhq.com</span><span>Richmond Hill, Ontario</span>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 48, marginTop: 36 }}>
          {photo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={photo} alt="" width={200} height={200} style={{ width: 200, height: 200, borderRadius: 999, objectFit: 'cover', border: '6px solid #121212', flexShrink: 0 }} />
            : <div style={{ width: 200, height: 200, borderRadius: 999, background: '#121212', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96, fontWeight: 900, flexShrink: 0 }}>J</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: 800 }}>
            <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.03em', display: 'block', width: 800 }}>The economy and AI, explained before school.</div>
            <div style={{ fontSize: 23, color: '#5F5E59', fontFamily: 'Georgia, serif', fontStyle: 'italic', display: 'block', width: 800, lineHeight: 1.35 }}>By Joseph Leung, Grade 11, three-time national team chess champion. Free, in English and Chinese.</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: 'Fraunces', data: font, weight: 900, style: 'normal' }] : [] }
  )
}
