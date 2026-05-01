import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ARTICLES } from '@/lib/articles'
import { ARTICLE_ILLUSTRATIONS } from '@/components/ArticleIllustrations'
import PublicNav from '@/components/PublicNav'
import PublicSubscribeForm from '@/components/PublicSubscribeForm'

type Topic = {
  slug: string
  title: string
  tags: string[]
  intro: string
  longIntro: string
}

const TOPICS: Topic[] = [
  {
    slug: 'macro-markets',
    title: 'Macro & Markets',
    tags: ['Economics', 'Markets'],
    intro: 'Interest rates, inflation, central bank policy, and what it all means for your wallet.',
    longIntro: 'Central banks. Inflation prints. Yield curves. The macro story is usually told in jargon that smuggles in assumptions most readers never get to question. These issues unpack what the numbers actually say — and where the consensus is wrong.',
  },
  {
    slug: 'ai-technology',
    title: 'AI & Technology',
    tags: ['AI'],
    intro: 'Model releases, capability jumps, and the business of artificial intelligence. No hype.',
    longIntro: 'Each model release is sold as a paradigm shift. Most aren\'t. These issues separate genuine capability gains from marketing, and trace how the economics of training, inference, and labor displacement are actually playing out.',
  },
  {
    slug: 'global-economy',
    title: 'Global Economy',
    tags: ['Global'],
    intro: 'Trade flows, geopolitics, and the forces reshaping how nations compete and collaborate.',
    longIntro: 'Trade is no longer separable from security policy. Industrial strategy is back. These issues track the slow rewiring of global economic arrangements — and what it means for prices, jobs, and capital flows.',
  },
  {
    slug: 'future-of-work',
    title: 'Future of Work',
    tags: ['Work'],
    intro: 'How automation, remote culture, and AI are rewriting the rules of employment and productivity.',
    longIntro: 'The question isn\'t whether AI replaces jobs — it\'s which tasks within which jobs, and how the surplus gets distributed. These issues report on what\'s already happening inside firms, not what tech CEOs are predicting.',
  },
  {
    slug: 'ideas-analysis',
    title: 'Ideas & Analysis',
    tags: ['Analysis'],
    intro: 'Original takes on big questions: why economic predictions fail, what history tells us, what to watch.',
    longIntro: 'Long-form pieces that step back from the news cycle to ask why we keep getting things wrong, what historical analogies actually fit, and which mental models hold up under pressure.',
  },
  {
    slug: 'weekly-digest',
    title: 'Weekly Digest',
    tags: ['Digest'],
    intro: 'Five links worth your time, one chart that matters, and one thing everyone got wrong this week.',
    longIntro: 'A curated weekend read. Five stories worth your attention, one chart worth understanding, and one piece of conventional wisdom worth questioning.',
  },
]

function getTopic(slug: string) {
  return TOPICS.find(t => t.slug === slug)
}

export function generateStaticParams() {
  return TOPICS.map(t => ({ slug: t.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const topic = getTopic(params.slug)
  if (!topic) return {}
  return {
    title: `${topic.title} | Joseph`,
    description: topic.intro,
    alternates: { canonical: `/topics/${topic.slug}` },
    openGraph: {
      title: `${topic.title} | Joseph`,
      description: topic.intro,
      type: 'website',
      url: `/topics/${topic.slug}`,
    },
  }
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug)
  if (!topic) notFound()

  const articles = ARTICLES.filter(a => topic.tags.includes(a.tag))

  return (
    <>
      <PublicNav />

      <main id="main-content" style={{ background: 'var(--pub-cream)', minHeight: '60vh' }}>
        <header style={{ padding: '120px 48px 56px', maxWidth: '900px', margin: '0 auto' }}>
          <p className="pub-label" style={{ marginBottom: '16px' }}>Topic</p>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em',
            color: 'var(--ink)', marginBottom: '20px',
          }}>{topic.title}</h1>
          <p style={{
            fontFamily: 'var(--font-dm)', fontSize: '18px', fontWeight: 300,
            color: 'var(--tan)', lineHeight: 1.65, maxWidth: '620px',
          }}>{topic.longIntro}</p>
          <p style={{
            fontFamily: 'var(--font-dm)', fontSize: '12px', color: 'var(--tan)',
            marginTop: '24px', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {articles.length} issue{articles.length !== 1 ? 's' : ''} in this topic
          </p>
        </header>

        <hr className="pub-rule" />

        <section style={{ padding: '48px 48px 96px', maxWidth: '1100px', margin: '0 auto' }}>
          {articles.length === 0 ? (
            <div className="pub-empty-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ fontFamily: 'var(--font-dm)', fontSize: '16px', color: 'var(--tan)', marginBottom: '16px' }}>
                No issues yet in this topic.
              </p>
              <a href="/#issues" style={{ fontFamily: 'var(--font-dm)', fontSize: '13px', fontWeight: 500, color: 'var(--red)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Browse all issues →
              </a>
            </div>
          ) : (
            <div className="pub-article-list">
              {articles.map(article => {
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
                      <p className="pub-article-intro">{article.intro.slice(0, 160)}…</p>
                      <span className="pub-article-read">Read issue →</span>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </section>

        <section style={{ background: 'var(--ink)', padding: '64px 48px' }}>
          <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--font-dm)', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--red)', marginBottom: '14px',
            }}>
              Stay on this topic
            </p>
            <h2 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900,
              color: '#f5f0e8', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '24px',
            }}>
              Get new {topic.title.toLowerCase()} issues in your inbox.
            </h2>
            <PublicSubscribeForm minimal />
          </div>
        </section>
      </main>
    </>
  )
}
