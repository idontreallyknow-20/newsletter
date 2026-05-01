import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/issues/', '/topics/', '/feed.xml'],
        disallow: ['/api/', '/compose', '/subscribers', '/schedule', '/settings', '/history', '/login', '/dashboard', '/preferences'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
