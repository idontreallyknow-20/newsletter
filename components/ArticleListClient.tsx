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
                  <div style={{ textAlign: 'center' }}>
                    {item.tag && (
                      <div style={{
                        fontFamily: 'var(--font-dm)', fontSize: '10px', fontWeight: 500,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'var(--red)', marginBottom: '8px',
                      }}>
                        {item.tag}
                      </div>
                    )}
                    <div style={{
                      fontFamily: 'var(--font-dm)', fontSize: '12px',
                      color: 'var(--tan)', opacity: 0.65,
                    }}>
                      {shortMonth(item.displayDate)}
                    </div>
                  </div>
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
            Show more{remaining > 0 ? ` — ${remaining} issue${remaining !== 1 ? 's' : ''} left` : ''}
          </button>
        </div>
      )}
    </>
  )
}
