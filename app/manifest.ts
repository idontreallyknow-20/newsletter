import type { MetadataRoute } from 'next'
import { SITE_DESCRIPTION } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Brief by Joseph Leung',
    short_name: 'Daily Brief',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'browser',
    background_color: '#F4F2ED',
    theme_color: '#121212',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  }
}
