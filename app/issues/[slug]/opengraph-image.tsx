import { ImageResponse } from 'next/og'
import { getArticle } from '@/lib/articles'
import { SITE_URL } from '@/lib/seo'

export const runtime = 'edge'
export const alt = 'Daily Brief issue'
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

export default async function Image({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug)
  const [font, photo] = await Promise.all([fraunces(), portrait()])
  const title = a?.title ?? 'Daily Brief'
  const kicker = a ? `${a.tag}  ·  ${a.num}  ·  ${a.date}` : 'Economics and AI, before school'
  const big = title.length > 70 ? 54 : title.length > 45 ? 64 : 76
  return new ImageResponse(
    (
      <div style={{ background: '#F4F2ED', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 64px', color: '#121212', fontFamily: font ? 'Fraunces' : 'Georgia, serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '8px solid #121212', borderBottom: '2px solid #121212', padding: '14px 0 10px' }}>
          <span style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', display: 'flex' }}>Daily<span style={{ color: '#B3261E' }}>.</span>Brief</span>
          <span style={{ fontSize: 18, color: '#5F5E59', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{kicker}</span>
        </div>
        <div style={{ fontSize: big, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.03em', display: 'flex', maxWidth: 1040 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {photo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={photo} alt="" width={64} height={64} style={{ width: 64, height: 64, borderRadius: 999, objectFit: 'cover', border: '3px solid #121212' }} />
              : <div style={{ width: 64, height: 64, borderRadius: 999, background: '#121212', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900 }}>J</div>}
            <span style={{ fontSize: 22, color: '#5F5E59', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>By Joseph, Grade 11, Richmond Hill, Ontario</span>
          </div>
          <span style={{ fontSize: 20, color: '#5F5E59', fontFamily: 'monospace', letterSpacing: '0.12em' }}>dailybriefhq.com</span>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: 'Fraunces', data: font, weight: 900, style: 'normal' }] : [] }
  )
}
