export type Rating = 'Buy' | 'Hold' | 'Sell'

export interface ResearchEntry {
  slug: string
  company: string
  ticker: string
  rating: Rating
  date: string
  thesis: string
  body?: string
}

export const RESEARCH: ResearchEntry[] = [
  {
    slug: 'meta-platforms',
    company: 'Meta Platforms',
    ticker: 'META',
    rating: 'Buy',
    date: 'Coming soon',
    thesis: 'Placeholder — full thesis, valuation, and risks coming soon.',
  },
]
