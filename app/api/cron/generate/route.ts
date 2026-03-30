import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings, drafts } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import Anthropic from '@anthropic-ai/sdk'

// Rotates through topics by day of year so each issue covers different ground
const TOPICS = [
  'how AI is reshaping labor markets and what it means for wages',
  'central bank policy in an era of AI-driven productivity gains',
  'the geopolitics of AI chips and semiconductor supply chains',
  'AI in finance: what algorithmic trading and robo-advisors actually do',
  'the real economics of the clean energy transition',
  'how AI is changing healthcare costs and who benefits',
  'inflation, interest rates, and what the data actually shows right now',
  'the economics of attention: why big tech keeps getting bigger',
  'trade policy and tariffs: what the numbers say vs. what politicians claim',
  'AI and intellectual property: who owns the output of a machine',
  'the global housing crisis and what economics says about fixing it',
  'deglobalisation: is the world actually fracturing into blocs',
  'venture capital, startup funding cycles, and what they signal',
  'the economics of open-source AI vs. closed models',
]

function getTopic(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  )
  return TOPICS[dayOfYear % TOPICS.length]
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Skip if a draft was already generated in the last 20 hours
  const [latest] = await db.select().from(drafts).orderBy(desc(drafts.updatedAt)).limit(1)
  if (latest) {
    const age = Date.now() - new Date(latest.updatedAt).getTime()
    if (age < 20 * 60 * 60 * 1000) {
      return NextResponse.json({ skipped: true, reason: 'Recent draft already exists' })
    }
  }

  const settingRows = await db.select().from(settings)
  const s: Record<string, string> = {}
  for (const row of settingRows) { if (row.value) s[row.key] = row.value }
  const newsletterName = s.newsletter_name || 'Daily Brief HQ'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    timeZone: 'America/New_York',
  })
  const topic = getTopic()

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1800,
    system: `You are Joseph, the author of ${newsletterName}, a newsletter that breaks down economics and AI for curious non-experts. You write in first person with a clear, analytical, slightly wry voice. You explain complex things simply and always tell readers why something matters to their real lives. You never use buzzwords, jargon, or make breathless predictions. You never use em dashes.`,
    messages: [{
      role: 'user',
      content: `Write today's newsletter issue for ${today}. The topic is: ${topic}.

Structure:
1. First line: SUBJECT: [a short, specific, non-clickbait subject line]
2. Blank line
3. A one-sentence hook (no heading) that immediately tells the reader why this topic matters today
4. Two or three ## sections that build the analysis, each 100-150 words
5. A final ## The Takeaway section (3-4 sentences summarising what to do with this information)

Style rules:
- First person throughout ("I've been watching...", "What strikes me is...", "Here's my read on this...")
- Cite at least 2 real publications by name inline: "The FT reported...", "According to a recent IMF working paper...", "Bloomberg noted last week..."
- Use **bold** for the first use of any technical term, then explain it in plain English immediately after
- No em dashes. Use commas or restructure the sentence.
- Aim for 500-650 words in the body

Write only the SUBJECT line and the body. Nothing else.`,
    }],
  })

  const raw = (message.content[0] as { type: 'text'; text: string }).text.trim()
  const subjectMatch = raw.match(/^SUBJECT:\s*(.+)/m)
  const subject = subjectMatch ? subjectMatch[1].trim() : `${newsletterName} — ${today}`
  const bodyMarkdown = raw.replace(/^SUBJECT:[^\n]+\n+/, '').trim()
  const previewText = bodyMarkdown.split('\n').find(l => l.trim() && !l.startsWith('#'))?.slice(0, 140) ?? ''

  await db.insert(drafts).values({ subject, previewText, bodyMarkdown })

  return NextResponse.json({ success: true, subject })
}
