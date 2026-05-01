'use client'

import { useDeferredValue, useMemo, useState } from 'react'
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
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    if (!q) return items
    return items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      (i.intro?.toLowerCase().includes(q) ?? false) ||
      (i.tag?.toLowerCase().includes(q) ?? false)
    )
  }, [items, deferredQuery])

  const visible = filtered.slice(0, shown)
  const remaining = filtered.length - shown
  const isSearching = query.trim().length > 0

  return (
    <>
      <div className="pub-archive-search">
        <label htmlFor="archive-search" className="pub-visually-hidden">Search issues</label>
        <span aria-hidden="true" className="pub-archive-search-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          id="archive-search"
          type="search"
          placeholder="Search issues by title, topic, or keyword…"
          value={query}
          onChange={e => { setQuery(e.target.value); setShown(PAGE_SIZE) }}
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="pub-archive-search-clear">
            ×
          </button>
        )}
      </div>
      {isSearching && (
        <p className="pub-archive-search-meta" role="status" aria-live="polite">
          {filtered.length === 0
            ? `No issues match "${query.trim()}".`
            : `${filtered.length} issue${filtered.length !== 1 ? 's' : ''} for "${query.trim()}"`}
        </p>
      )}

      <div className="pub-article-list">
        {visible.map(item => {
          const illus = ARTICLE_ILLUSTRATIONS[item.slug]
          return (
            <a key={item.slug} href={`/issues/${item.slug}`} className="pub-article-card" style={{ textDecoration: 'none' }}>
              <div className={`pub-article-img${illus ? '' : ' pub-article-img-placeholder'}`}>
                {illus ? illus.svg : null}
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
