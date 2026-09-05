import { ImageResponse } from 'next/og'
import { getArticle } from '@/lib/articles'

export const runtime = 'edge'
export const alt = 'Daily Brief issue'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug)
  const title = a?.title ?? 'Daily Brief'
  const kicker = a ? `${a.tag} · ${a.num} · ${a.date}` : 'Economics and AI, before school'
  return new ImageResponse(
    (
      <div style={{ background: '#F4F2ED', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 72px', color: '#121212', fontFamily: 'Georgia, serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '6px solid #121212', borderBottom: '2px solid #121212', padding: '14px 0 10px' }}>
            <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.02em' }}>Daily<span style={{ color: '#B3261E' }}>.</span>Brief</span>
            <span style={{ fontSize: 18, color: '#5F5E59', fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{kicker}</span>
          </div>
        </div>
        <div style={{ fontSize: title.length > 60 ? 62 : 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', display: 'flex', maxWidth: 1000 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#5F5E59' }}>
          <span>By Joseph · Grade 11, Richmond Hill, Ontario</span>
          <span>dailybriefhq.com</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
