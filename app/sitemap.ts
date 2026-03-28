import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { sentEmails } from '@/lib/schema'
import { isNotNull } from 'drizzle-orm'
import { ARTICLES } from '@/lib/articles'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  let dbIssues: { slug: string | null; sentAt: Date }[] = []
  try {
    dbIssues = await db
      .select({ slug: sentEmails.slug, sentAt: sentEmails.sentAt })
      .from(sentEmails)
      .where(isNotNull(sentEmails.slug))
  } catch {
    // DB unavailable during build — skip
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...ARTICLES.map(a => ({
      url: `${baseUrl}/issues/${a.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ]

  const dbRoutes: MetadataRoute.Sitemap = dbIssues
    .filter(i => i.slug)
    .map(i => ({
      url: `${baseUrl}/issues/${i.slug}`,
      lastModified: i.sentAt,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }))

  return [...staticRoutes, ...dbRoutes]
}
