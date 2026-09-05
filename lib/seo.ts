// Everything search engines need to know about Joseph and the newsletter, in one place.
export const SITE_URL = 'https://dailybriefhq.com'
export const SITE_NAME = 'Daily Brief'
export const SITE_HANDLE = 'dailybriefhq'
export const AUTHOR_NAME = 'Joseph'
export const AUTHOR_DESCRIPTION = 'Joseph is a Grade 11 student in Richmond Hill, Ontario, a three-time national team chess champion, and the writer of Daily Brief, a morning newsletter on economics and AI.'
export const SITE_DESCRIPTION = 'Daily Brief is a morning newsletter on economics and AI, written before school by Joseph, a Grade 11 student and three-time national team chess champion in Richmond Hill, Ontario. Free, in English and Chinese.'

// Profiles Joseph controls. Add LinkedIn, X, Lichess, Chess.com here as they exist;
// search engines use these to tie the name to one entity.
export const SAME_AS: string[] = [
  'https://github.com/idontreallyknow-20',
]

export const KNOWS_ABOUT = [
  'Economics', 'Artificial intelligence', 'Macroeconomics', 'Monetary policy', 'Canadian economy',
  'Semiconductors', 'Labour markets', 'Housing markets', 'Chess',
]

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#joseph`,
    name: AUTHOR_NAME,
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/joseph.jpg`,
    description: AUTHOR_DESCRIPTION,
    jobTitle: 'Writer, Daily Brief',
    homeLocation: { '@type': 'Place', name: 'Richmond Hill, Ontario, Canada' },
    nationality: { '@type': 'Country', name: 'Canada' },
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: ['en', 'zh'],
    award: ['Three-time Canadian national team chess champion'],
    sameAs: SAME_AS,
    worksFor: { '@id': `${SITE_URL}/#publication` },
  }
}

export function publicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'NewsMediaOrganization'],
    '@id': `${SITE_URL}/#publication`,
    name: SITE_NAME,
    alternateName: [SITE_HANDLE, 'Daily Brief HQ', 'dailybriefhq.com'],
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    founder: { '@id': `${SITE_URL}/#joseph` },
    description: SITE_DESCRIPTION,
    sameAs: SAME_AS,
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: `${SITE_NAME} by ${AUTHOR_NAME}`,
    alternateName: [SITE_HANDLE, 'Daily Brief HQ'],
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: ['en', 'zh'],
    publisher: { '@id': `${SITE_URL}/#publication` },
    author: { '@id': `${SITE_URL}/#joseph` },
  }
}

export function articleJsonLd(a: { slug: string; title: string; description: string; datePublished: string; section: string; wordCount?: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${SITE_URL}/issues/${a.slug}`,
    headline: a.title,
    description: a.description,
    datePublished: a.datePublished,
    dateModified: a.datePublished,
    articleSection: a.section,
    wordCount: a.wordCount,
    inLanguage: 'en',
    isAccessibleForFree: true,
    mainEntityOfPage: `${SITE_URL}/issues/${a.slug}`,
    image: [`${SITE_URL}/issues/${a.slug}/opengraph-image`],
    author: { '@id': `${SITE_URL}/#joseph`, '@type': 'Person', name: AUTHOR_NAME, url: `${SITE_URL}/about` },
    publisher: { '@id': `${SITE_URL}/#publication`, '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/opengraph-image` } },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  }
}

export function toIsoDate(dateStr: string): string {
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toISOString().slice(0, 10)
}
