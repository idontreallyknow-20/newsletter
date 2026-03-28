'use client'

import { useState } from 'react'
import { ARTICLE_ILLUSTRATIONS } from '@/components/ArticleIllustrations'

export type ArticleItem = {
  slug: string
  title: string
  displayDate: string
  tag?: string
  readTime?: string
  intro?: string
}

const PAGE_SIZE = 5

function shortMonth(date: string) {
  return date
    .replace('January', 'Jan').replace('February', 'Feb').replace('March', 'Mar')
    .replace('April', 'Apr').replace('May', 'May').replace('June', 'Jun')
    .replace('July', 'Jul').replace('August', 'Aug').replace('September', 'Sep')
    .replace('October', 'Oct').replace('November', 'Nov').replace('December', 'Dec')
}

export default function ArticleListClient({ items }: { items: ArticleItem[] }) {
  const [shown, setShown] = useState(PAGE_SIZE)
  const visible = items.slice(0, shown)
  const remaining = items.length - shown

  return (
    <>
      <div className="pub-article-list">
        {visible.map(item => {
          const illus = ARTICLE_ILLUSTRATIONS[item.slug]
          return (
            <a key={item.slug} href={`/issues/${item.slug}`} className="pub-article-card" style={{ textDecoration: 'none' }}>
              <div className="pub-article-img">
                {illus ? illus.svg : (
                  <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '36px', fontWeight: 900, color: 'var(--ink)', opacity: 0.1 }}>J.</span>
                )}
              </div>
              <div className="pub-article-body">
                {(item.tag || item.readTime) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {item.tag && <span className="pub-issue-tag">{item.tag}</span>}
                    {item.displayDate && (
                      <span className="pub-issue-date" style={{ width: 'auto', textAlign: 'left' }}>
                        {shortMonth(item.displayDate)}{item.readTime ? ` · ${item.readTime}` : ''}
                      </span>
                    )}
                  </div>
                )}
                {!item.tag && (
                  <span className="pub-issue-date" style={{ width: 'auto', marginBottom: '10px', display: 'block' }}>
                    {item.displayDate}
                  </span>
                )}
                <div className="pub-article-title">{item.title}</div>
                {item.intro && (
                  <p className="pub-article-intro">{item.intro.slice(0, 140)}…</p>
                )}
                <span className="pub-article-read">Read issue →</span>
              </div>
            </a>
          )
        })}
      </div>

      {remaining > 0 && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={() => setShown(s => s + PAGE_SIZE)}
            className="show-more-btn"
          >
            Load {remaining} more →
          </button>
        </div>
      )}
    </>
  )
}
