import { ARTICLES } from '@/lib/articles'

export const dynamic = 'force-static'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(dateStr: string): string {
  try { return new Date(dateStr).toUTCString() } catch { return new Date().toUTCString() }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dailybriefhq.com'
  const items = ARTICLES.map(a => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${baseUrl}/issues/${a.slug}</link>
      <guid isPermaLink="true">${baseUrl}/issues/${a.slug}</guid>
      <pubDate>${toRfc822(a.date)}</pubDate>
      <category>${escapeXml(a.tag)}</category>
      <description>${escapeXml(a.intro)}</description>
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Joseph — Economics &amp; AI</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>The economy and AI, explained without the jargon.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
