import type { MetadataRoute } from 'next'
import { ARTICLES } from '@/lib/articles'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/subscribe`, changeFrequency: 'monthly', priority: 0.6 },
    ...ARTICLES.map(a => ({ url: `${SITE_URL}/issues/${a.slug}`, lastModified: new Date(a.date), changeFrequency: 'yearly' as const, priority: 0.8 })),
  ]
}
