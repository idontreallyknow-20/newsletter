'use client'

import { useState, useRef, useEffect } from 'react'
import { ARTICLES } from '@/lib/articles'
import { ARTICLE_ILLUSTRATIONS } from '@/components/ArticleIllustrations'
import { IconMarkets, IconAI, IconGlobe, IconWork, IconAnalysis, IconDigest } from '@/components/TopicIcons'

const TOPICS = [
  { icon: <IconMarkets />, title: 'Macro & Markets', tags: ['Economics', 'Markets'] },
  { icon: <IconAI />,      title: 'AI & Technology', tags: ['AI'] },
  { icon: <IconGlobe />,   title: 'Global Economy',  tags: ['Global'] },
  { icon: <IconWork />,    title: 'Future of Work',  tags: ['Work'] },
  { icon: <IconAnalysis />,title: 'Ideas & Analysis',tags: ['Analysis'] },
  { icon: <IconDigest />,  title: 'Weekly Digest',   tags: ['Digest'] },
]

const TOPIC_DESCS: Record<string, string> = {
  'Macro & Markets':  'Interest rates, inflation, central bank policy, and what it all means for your wallet and the broader economy.',
  'AI & Technology':  'Model releases, capability jumps, and the business of artificial intelligence — stripped of the hype.',
  'Global Economy':   'Trade flows, geopolitical shifts, and the economic forces reshaping how nations compete and collaborate.',
  'Future of Work':   'How automation, remote culture, and AI are rewriting the rules of employment and productivity.',
  'Ideas & Analysis': 'Original takes on big questions — why economic predictions fail, what history tells us, and what to watch next.',
  'Weekly Digest':    'Five links worth your time, one chart that matters, and one thing everyone got wrong this week.',
}

export default function TopicsFilter() {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const filteredRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeTag && filteredRef.current) {
      filteredRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeTag])

  function handleTopicClick(tags: string[]) {
    const key = tags[0]
    setActiveTag(prev => prev === key ? null : key)
  }

  const filtered = activeTag
    ? ARTICLES.filter(a => {
        const topic = TOPICS.find(t => t.tags[0] === activeTag)
        return topic ? topic.tags.includes(a.tag) : true
      })
    : ARTICLES

  return (
    <>
      {/* Topics grid */}
      <p className="pub-filter-hint">Filter by topic ↓</p>
      <div className="pub-topics-grid">
        {TOPICS.map(t => {
          const isActive = activeTag === t.tags[0]
          const hasArticles = ARTICLES.some(a => t.tags.includes(a.tag))
          return (
            <button
              key={t.title}
              onClick={() => handleTopicClick(t.tags)}
              className="pub-topic"
              style={{
                textAlign: 'left',
                background: isActive ? '#2c1810' : undefined,
                borderColor: isActive ? '#2c1810' : undefined,
                cursor: hasArticles ? 'pointer' : 'default',
                transform: isActive ? 'translate(-2px, -2px)' : undefined,
                boxShadow: isActive ? '5px 5px 0 var(--red)' : undefined,
              }}
            >
              <div className="pub-topic-icon-wrap" style={isActive ? { borderColor: 'var(--red)', color: '#f5f0e8', background: 'rgba(200,64,42,0.15)' } : {}}>
                {t.icon}
              </div>
              <div className="pub-topic-title" style={isActive ? { color: '#f5f0e8' } : {}}>{t.title}</div>
              <p className="pub-topic-desc" style={isActive ? { color: 'rgba(245,240,232,0.6)' } : {}}>{TOPIC_DESCS[t.title]}</p>
              {isActive && (
                <p style={{ marginTop: '12px', fontSize: '11px', fontWeight: 500, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Filtering ↓
                </p>
              )}
            </button>
          )
        })}
      </div>

      {/* Filtered issues list */}
      {activeTag && (
        <div ref={filteredRef} style={{ marginTop: '64px', scrollMarginTop: '80px' }}>
          <div className="pub-wrap" style={{ paddingTop: 0 }}>
            <div className="pub-issues-head" style={{ marginBottom: '24px' }}>
              <div>
                <p className="pub-label">Filtered</p>
                <h2 className="pub-heading" style={{ marginBottom: 0 }}>
                  {filtered.length > 0 ? `${filtered.length} issue${filtered.length !== 1 ? 's' : ''} found` : 'No issues yet'}
                </h2>
              </div>
              <button onClick={() => setActiveTag(null)} style={{
                fontFamily: 'var(--font-dm)', fontSize: '13px', fontWeight: 500,
                color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: '1px solid transparent',
              }}>
                Clear filter ×
              </button>
            </div>
            <div className="pub-article-list">
              {filtered.map(article => {
                const illus = ARTICLE_ILLUSTRATIONS[article.slug]
                return (
                  <a key={article.slug} href={`/issues/${article.slug}`} className="pub-article-card" style={{ textDecoration: 'none' }}>
                    <div className="pub-article-img">
                      {illus ? illus.svg : (
                        <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '36px', fontWeight: 900, color: 'var(--ink)', opacity: 0.1 }}>J.</span>
                      )}
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
    </>
  )
}
