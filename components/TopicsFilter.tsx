'use client'

import { useState, useRef, useEffect } from 'react'
import { ARTICLES } from '@/lib/articles'
import { ARTICLE_ILLUSTRATIONS } from '@/components/ArticleIllustrations'
import { IconMarkets, IconAI, IconGlobe, IconWork, IconAnalysis, IconDigest } from '@/components/TopicIcons'

const TOPICS = [
  { icon: <IconMarkets />, title: 'Macro & Markets', tags: ['Economics', 'Markets'], slug: 'macro-markets' },
  { icon: <IconAI />,      title: 'AI & Technology', tags: ['AI'], slug: 'ai-technology' },
  { icon: <IconGlobe />,   title: 'Global Economy',  tags: ['Global'], slug: 'global-economy' },
  { icon: <IconWork />,    title: 'Future of Work',  tags: ['Work'], slug: 'future-of-work' },
  { icon: <IconAnalysis />,title: 'Ideas & Analysis',tags: ['Analysis'], slug: 'ideas-analysis' },
  { icon: <IconDigest />,  title: 'Weekly Digest',   tags: ['Digest'], slug: 'weekly-digest' },
]

const TOPIC_DESCS: Record<string, string> = {
  'Macro & Markets':  'Interest rates, inflation, central bank policy, and what it all means for your wallet and the broader economy.',
  'AI & Technology':  'Model releases, capability jumps, and the business of artificial intelligence. No hype.',
  'Global Economy':   'Trade flows, geopolitical shifts, and the economic forces reshaping how nations compete and collaborate.',
  'Future of Work':   'How automation, remote culture, and AI are rewriting the rules of employment and productivity.',
  'Ideas & Analysis': 'Original takes on big questions: why economic predictions fail, what history tells us, and what to watch next.',
  'Weekly Digest':    'Five links worth your time, one chart that matters, and one thing everyone got wrong this week.',
}

export default function TopicsFilter() {
  const [activeTags, setActiveTags] = useState<string[]>([])
  const filteredRef = useRef<HTMLDivElement>(null)
  const topicsRef = useRef<HTMLDivElement>(null)
  const isFiltering = activeTags.length > 0

  useEffect(() => {
    const archiveEl = document.querySelector<HTMLElement>('.pub-issues')
    if (archiveEl) archiveEl.style.display = isFiltering ? 'none' : ''
  }, [isFiltering])

  function handleTopicClick(tags: string[]) {
    const key = tags[0]
    setActiveTags(prev => {
      const next = prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
      // Scroll to results only when activating the first filter
      if (next.length === 1 && prev.length === 0) {
        setTimeout(() => filteredRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
      }
      return next
    })
  }

  function clearAll() {
    setActiveTags([])
  }

  function scrollToTopics() {
    topicsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filtered = isFiltering
    ? ARTICLES.filter(a =>
        activeTags.some(key => {
          const topic = TOPICS.find(t => t.tags[0] === key)
          return topic?.tags.includes(a.tag) ?? false
        })
      )
    : ARTICLES

  const activeTopicNames = activeTags.map(key => TOPICS.find(t => t.tags[0] === key)?.title ?? key)

  return (
    <>
      {/* Topics grid */}
      <div ref={topicsRef} style={{ scrollMarginTop: '80px' }}>
        <p className="pub-filter-hint">Filter by topic.</p>
        <div className="pub-topics-grid">
          {TOPICS.map(t => {
            const isActive = activeTags.includes(t.tags[0])
            const hasArticles = ARTICLES.some(a => t.tags.includes(a.tag))
            return (
              <div key={t.title} className="pub-topic-cell" style={{ position: 'relative', display: 'flex' }}>
                <button
                  onClick={() => handleTopicClick(t.tags)}
                  className="pub-topic"
                  aria-pressed={isActive}
                  aria-label={`Filter by ${t.title}`}
                  style={{
                    textAlign: 'left',
                    background: isActive ? '#2c1810' : undefined,
                    borderColor: isActive ? '#2c1810' : undefined,
                    cursor: hasArticles ? 'pointer' : 'default',
                    transform: isActive ? 'translate(-2px, -2px)' : undefined,
                    boxShadow: isActive ? '5px 5px 0 var(--red)' : undefined,
                    width: '100%',
                    paddingBottom: '52px',
                  }}
                >
                  <div className="pub-topic-icon-wrap" role="img" aria-label={`${t.title} icon`} style={isActive ? { borderColor: 'var(--red)', color: '#f5f0e8', background: 'rgba(200,64,42,0.15)' } : {}}>
                    {t.icon}
                  </div>
                  <div className="pub-topic-title" style={isActive ? { color: '#f5f0e8' } : {}}>{t.title}</div>
                  <p className="pub-topic-desc" style={isActive ? { color: 'rgba(245,240,232,0.6)' } : {}}>{TOPIC_DESCS[t.title]}</p>
                  {isActive && (
                    <p style={{ marginTop: '12px', fontSize: '11px', fontWeight: 500, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      ✓ Selected
                    </p>
                  )}
                </button>
                <a
                  href={`/topics/${t.slug}`}
                  style={{
                    position: 'absolute',
                    left: 'var(--topic-pad, 24px)',
                    bottom: '20px',
                    fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: isActive ? '#f5f0e8' : 'var(--red)',
                    textDecoration: 'none',
                    borderBottom: `1px solid ${isActive ? 'rgba(245,240,232,0.4)' : 'var(--red)'}`,
                    paddingBottom: '1px',
                    zIndex: 2,
                  }}
                >
                  Open topic →
                </a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filtered results */}
      {isFiltering && (
        <div ref={filteredRef} style={{ marginTop: '64px', scrollMarginTop: '80px' }}>
          <div className="pub-wrap" style={{ paddingTop: 0 }}>
            <div className="pub-issues-head" style={{ marginBottom: '24px' }}>
              <div>
                <p className="pub-label">Filtered · {activeTopicNames.join(', ')}</p>
                <h2 className="pub-heading" style={{ marginBottom: 0 }}>
                  {filtered.length > 0
                    ? `${filtered.length} issue${filtered.length !== 1 ? 's' : ''} found`
                    : 'No issues yet'}
                </h2>
              </div>
              <button onClick={clearAll} style={{
                fontFamily: 'var(--font-dm)', fontSize: '13px', fontWeight: 500,
                color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: '1px solid transparent',
              }}>
                Clear all ×
              </button>
            </div>
            {filtered.length === 0 && (
              <div className="pub-empty-state">
                <p style={{ fontFamily: 'var(--font-dm)', fontSize: '16px', color: 'var(--tan)', marginBottom: '16px' }}>
                  No issues yet in {activeTags.length === 1 ? 'this category' : 'these categories'}.
                </p>
                <button onClick={clearAll} style={{ fontFamily: 'var(--font-dm)', fontSize: '13px', fontWeight: 500, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Browse all issues →
                </button>
              </div>
            )}
            <div className="pub-article-list">
              {filtered.map(article => {
                const illus = ARTICLE_ILLUSTRATIONS[article.slug]
                return (
                  <a key={article.slug} href={`/issues/${article.slug}`} className="pub-article-card" style={{ textDecoration: 'none' }}>
                    <div className={`pub-article-img${illus ? '' : ' pub-article-img-placeholder'}`}>
                      {illus ? illus.svg : null}
                    </div>
                    <div className="pub-article-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span className="pub-issue-tag">{article.tag}</span>
                        <span className="pub-issue-date" style={{ width: 'auto', textAlign: 'left' }}>
                          {article.date.replace('March', 'Mar').replace('February', 'Feb')} · {article.readTime}
                        </span>
                      </div>
                      <div className="pub-article-title">{article.title}</div>
                      <p className="pub-article-intro">{article.intro.slice(0, 140)}…</p>
                      <span className="pub-article-read">Read issue →</span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating filter pill — visible when any filter is active */}
      {isFiltering && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 50, display: 'flex', alignItems: 'center', gap: '8px',
          background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '100px', padding: '10px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          fontFamily: 'var(--font-dm)', fontSize: '13px', fontWeight: 500,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ color: 'rgba(245,240,232,0.5)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {activeTags.length} topic{activeTags.length !== 1 ? 's' : ''}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)', userSelect: 'none' }}>·</span>
          <button onClick={scrollToTopics} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: '#f5f0e8', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
          }}>
            ↑ Change topics
          </button>
          <span style={{ color: 'rgba(255,255,255,0.15)', userSelect: 'none' }}>·</span>
          <button onClick={clearAll} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: 'var(--red)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
          }}>
            Clear ×
          </button>
        </div>
      )}
    </>
  )
}
