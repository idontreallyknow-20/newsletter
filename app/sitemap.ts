import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'
import { isNotNull } from 'drizzle-orm'
import { ARTICLES } from '@/lib/articles'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dbIssues: { slug: string | null; sentAt: Date }[] = []
  try {
    dbIssues = await db.select({ slug: sentEmails.slug, sentAt: sentEmails.sentAt }).from(sentEmails).where(isNotNull(sentEmails.slug))
  } catch { /* DB unavailable during build */ }

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/subscribe`, changeFrequency: 'monthly', priority: 0.6 },
    ...ARTICLES.map(a => ({ url: `${SITE_URL}/issues/${a.slug}`, lastModified: new Date(a.date), changeFrequency: 'yearly' as const, priority: 0.8 })),
    ...dbIssues.filter(i => i.slug).map(i => ({ url: `${SITE_URL}/issues/${i.slug}`, lastModified: i.sentAt, changeFrequency: 'yearly' as const, priority: 0.7 })),
  ]
}
