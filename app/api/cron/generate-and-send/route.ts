import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { db } from '@/lib/db'
import { settings, subscribers, sentEmails } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { buildEmailHtml, sendBatch } from '@/lib/email'
import { markdownToHtml } from '@/lib/markdown'
import { slugify } from '@/lib/slug'

interface BraveNewsResult {
  title: string
  description: string
  url: string
  source: { name: string }
}

interface BraveNewsResponse {
  results?: BraveNewsResult[]
}

async function fetchNews(query: string): Promise<BraveNewsResult[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY
  if (!apiKey) return []

  const url = new URL('https://api.search.brave.com/res/v1/news/search')
  url.searchParams.set('q', query)
  url.searchParams.set('count', '6')
  url.searchParams.set('freshness', 'pd') // past 24 hours

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': apiKey,
    },
  })

  if (!res.ok) return []
  const data: BraveNewsResponse = await res.json()
  return data.results ?? []
}

async function generateNewsletter(
  aiNews: BraveNewsResult[],
  financeNews: BraveNewsResult[],
  newsletterName: string
): Promise<{ subject: string; previewText: string; bodyMarkdown: string }> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formatStories = (stories: BraveNewsResult[]) =>
    stories.length > 0
      ? stories
          .map(s => `- **${s.title}** (${s.source.name})\n  ${s.description || ''}`)
          .join('\n')
      : '(No stories retrieved — use your knowledge of the most recent developments)'

  const prompt = `Today is ${today}. You are writing the daily edition of "${newsletterName}", a premium newsletter covering AI & technology and financial markets.

Here are today's top AI/technology stories from the past 24 hours:
${formatStories(aiNews)}

Here are today's top financial/markets stories from the past 24 hours:
${formatStories(financeNews)}

Write a polished, insightful daily newsletter in markdown. Structure it exactly as follows:

1. A single opening line — warm but authoritative (e.g. "Good morning. Here's what moved in AI and markets today.")
2. A horizontal rule: ---
3. ## AI & Technology
   3–4 stories. Each story: **Bold headline** — *Source Name*. Then 2–3 sentences explaining what happened and why it matters.
4. A horizontal rule: ---
5. ## Markets & Economy
   3–4 stories. Same format as above.
6. A horizontal rule: ---
7. ## The Big Picture
   2–3 sentences connecting the AI and economic themes of the day. Offer a genuine insight, not a generic summary.

Writing guidelines:
- Authoritative and clear, like a top-tier financial journalist
- Be specific: names, numbers, companies
- Each summary should be genuinely informative — not just a headline restatement
- "The Big Picture" must offer a distinct perspective worth reading
- Do NOT include unsubscribe links, headers, or footers (handled by the template)
- Target length: 450–600 words

After the newsletter body, on two new lines write exactly:
SUBJECT: [compelling subject line, max 60 chars — e.g. "GPT-5 ships + Fed signals cuts: what it means"]
PREVIEW: [one-sentence teaser, max 100 chars]`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const fullText = message.content[0].type === 'text' ? message.content[0].text : ''

  const subjectMatch = fullText.match(/^SUBJECT:\s*(.+)$/m)
  const previewMatch = fullText.match(/^PREVIEW:\s*(.+)$/m)

  const subject = subjectMatch?.[1]?.trim() ?? `${newsletterName} — ${today}`
  const previewText = previewMatch?.[1]?.trim() ?? 'Your daily AI and markets briefing.'

  const bodyMarkdown = fullText
    .replace(/^SUBJECT:.*$/m, '')
    .replace(/^PREVIEW:.*$/m, '')
    .trim()

  return { subject, previewText, bodyMarkdown }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [settingRows, allActive] = await Promise.all([
      db.select().from(settings),
      db.select().from(subscribers).where(eq(subscribers.status, 'active')),
    ])

    const s: Record<string, string> = {}
    for (const row of settingRows) {
      if (row.value) s[row.key] = row.value
    }

    if (allActive.length === 0) {
      return NextResponse.json({ skipped: true, reason: 'No active subscribers' })
    }

    // Fetch AI and finance news in parallel
    const [aiNews, financeNews] = await Promise.all([
      fetchNews('artificial intelligence AI machine learning LLM model launch'),
      fetchNews('stock market economy Federal Reserve interest rates earnings'),
    ])

    const newsletterName = s.newsletter_name || 'Newsletter'
    const { subject, previewText, bodyMarkdown } = await generateNewsletter(
      aiNews,
      financeNews,
      newsletterName
    )

    const fromName = s.from_name || 'Newsletter'
    const fromEmail = s.from_email || process.env.FROM_EMAIL || ''
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const bodyHtml = markdownToHtml(bodyMarkdown)

    const recipients = allActive.map(sub => ({
      email: sub.email,
      html: buildEmailHtml({ newsletterName, bodyHtml, recipientEmail: sub.email, baseUrl }),
    }))

    const batchResults = await sendBatch({ recipients, subject, fromName, fromEmail })
    const errorCount = batchResults.reduce((n, r) => n + (r.error ? 1 : 0), 0)

    await db.insert(sentEmails).values({
      subject,
      previewText,
      bodyHtml,
      bodyMarkdown,
      slug: slugify(subject),
      recipientCount: allActive.length,
      status: errorCount === 0 ? 'sent' : 'partial',
    })

    return NextResponse.json({
      success: true,
      sent: allActive.length - errorCount,
      errors: errorCount,
      subject,
    })
  } catch (err) {
    console.error('[cron/generate-and-send]', err)
    return NextResponse.json({ error: 'Generate-and-send failed' }, { status: 500 })
  }
}
