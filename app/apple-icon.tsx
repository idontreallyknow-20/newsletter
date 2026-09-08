import { ImageResponse } from 'next/og'

// 180x180 PNG for iOS home screens and Safari tabs. Same mark as icon.svg.
export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="180" height="180" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect x="17" y="6" width="4" height="16" fill="#F4F2ED" />
          <path d="M10 18 Q10 26 17 26 Q22 26 22 20" stroke="#F4F2ED" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="8" cy="26" r="2.5" fill="#E3453A" />
        </svg>
      </div>
    ),
    size,
  )
}
