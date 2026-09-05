import { ARTICLES } from '@/lib/articles'
import { SITE_URL, SITE_DESCRIPTION, AUTHOR_NAME } from '@/lib/seo'

export const dynamic = 'force-dynamic'

function esc(s: string) { return s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string)) }

export async function GET() {
  const items = ARTICLES
    .map(a => ({ title: a.title, link: `${SITE_URL}/issues/${a.slug}`, desc: a.summary || a.intro, date: new Date(a.date) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Daily Brief by ${AUTHOR_NAME}</title>
  <link>${SITE_URL}</link>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
  <description>${esc(SITE_DESCRIPTION)}</description>
  <language>en-ca</language>
  <managingEditor>${AUTHOR_NAME}</managingEditor>
${items.map(i => `  <item>
    <title>${esc(i.title)}</title>
    <link>${i.link}</link>
    <guid>${i.link}</guid>
    <pubDate>${i.date.toUTCString()}</pubDate>
    <description>${esc(i.desc)}</description>
  </item>`).join('\n')}
</channel>
</rss>`
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } })
}
