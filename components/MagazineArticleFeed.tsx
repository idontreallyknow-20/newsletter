'use client'

import { useState } from 'react'

export type FeedItem = {
  slug: string
  title: string
  displayDate: string
  tag?: string
  readTime?: string
  intro?: string
}

const PAGE_SIZE = 9

export default function MagazineArticleFeed({ items }: { items: FeedItem[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const shown = items.slice(0, visible)

  // Group into rows of [lg, sm, sm]
  const rows: FeedItem[][] = []
  for (let i = 0; i < shown.length; i += 3) {
    rows.push(shown.slice(i, i + 3))
  }

  return (
    <div className="mag-feed">
      {rows.map((row, ri) => (
        <div key={ri} className="mag-row">
          {row.map((item, ci) => (
            <a
              key={item.slug}
              href={`/issues/${item.slug}`}
              className={`mag-card${ci === 0 ? ' mag-card-lg' : ' mag-card-sm'}`}
            >
              {item.tag && <span className="mag-card-tag">{item.tag}</span>}
              <h3 className="mag-card-title">{item.title}</h3>
              {ci === 0 && item.intro && (
                <p className="mag-card-intro">
                  {item.intro.length > 160 ? item.intro.slice(0, 160) + '\u2026' : item.intro}
                </p>
              )}
              <span className="mag-card-meta">
                {item.displayDate}{item.readTime ? ` \u00b7 ${item.readTime}` : ''}
              </span>
            </a>
          ))}
        </div>
      ))}

      {visible < items.length && (
        <div className="mag-feed-more">
          <button
            className="show-more-btn"
            onClick={() => setVisible(v => v + PAGE_SIZE)}
          >
            Load more issues &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
