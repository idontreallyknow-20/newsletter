// Pure helpers for the daily issue generator. No network here so it can be
// unit tested; the cron route does the API calls.

import type Anthropic from '@anthropic-ai/sdk'

/** Join every text block in a response, ignoring tool-use and search blocks. */
export function extractText(content: Array<{ type: string; text?: string }>): string {
  return content
    .filter((b): b is { type: 'text'; text: string } => b.type === 'text' && typeof b.text === 'string')
    .map(b => b.text)
    .join('')
    .trim()
}

/** Split "SUBJECT: ..." off the top of a generated issue. */
export function parseIssue(raw: string, fallbackSubject: string): { subject: string; bodyMarkdown: string; previewText: string } {
  const text = raw.trim()
  const subjectMatch = text.match(/^\s*SUBJECT:\s*(.+)$/m)
  const subject = (subjectMatch ? subjectMatch[1] : fallbackSubject).trim().replace(/[*_`]/g, '')
  const bodyMarkdown = text.replace(/^\s*SUBJECT:[^\n]*\n*/m, '').trim()
  const previewText = bodyMarkdown
    .split('\n')
    .map(l => l.trim())
    .find(l => l && !l.startsWith('#'))
    ?.replace(/[*_`]/g, '')
    .slice(0, 140) ?? ''
  return { subject, bodyMarkdown, previewText }
}

/** Did the model actually run a web search in this response? */
export function usedWebSearch(content: Array<{ type: string }>): boolean {
  return content.some(b => b.type === 'server_tool_use' || b.type === 'web_search_tool_result')
}

// Rotates by issue date so consecutive days cover different ground.
export const TOPICS = [
  'how AI is changing who gets hired, and what that does to wages',
  'central bank policy when productivity might be about to jump',
  'the chips: who makes them, who wants them, and what breaks if the supply stops',
  'what algorithmic trading and robo-advisors actually do with your money',
  'the real cost of the clean energy transition, in dollars per household',
  'AI in healthcare: where the savings are, and who keeps them',
  'inflation, interest rates, and what the newest data says this week',
  'why the biggest tech companies keep getting bigger',
  'tariffs and trade policy: what the numbers say versus what politicians claim',
  'AI and intellectual property: who owns what a model writes',
  'housing: why it costs what it costs, and what would actually change that',
  'is the world really splitting into trade blocs',
  'venture capital cycles and what startup funding is signalling right now',
  'open-source AI versus closed models, as an economics question',
]

export function topicFor(issueDate: string): string {
  const [y, m, d] = issueDate.split('-').map(Number)
  const dayOfYear = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86_400_000)
  return TOPICS[dayOfYear % TOPICS.length]
}

export function issueSystemPrompt(newsletterName: string): string {
  return `You are Joseph, who writes ${newsletterName}, a short morning newsletter that explains economics and AI to curious people who are not experts. You are 16, in Grade 11 in Richmond Hill, Ontario, and you write it before school.

Voice rules, all of them mandatory:
- First person, plain words, the word a person would say out loud. "Use" not "utilize". "Help" not "facilitate".
- Specific facts over categories. Numbers, names, dates, the actual company, the actual quote.
- Say what you think. Don't hedge every claim.
- Uneven rhythm. Some sentences short. Some long.
- Never tell the reader something is important, pivotal, crucial, a testament, a turning point, or a game changer. State the fact and let it land.
- Never end a sentence with a participle tail that explains what the fact means ("...highlighting the need for", "...underscoring"). Make it its own sentence or cut it.
- No "experts say", "analysts note", "observers argue". Name the source or own the claim.
- No "it's not X, it's Y". No "from X to Y" lists dressed as ranges. No lists of exactly three by reflex.
- No em dashes anywhere. Use commas, periods, or parentheses.
- No summary paragraph that restates the piece. End on the last real thing you have to say.
- Sentence case headings. No emoji. Bold nothing except the first use of a technical term, which you then explain in plain English in the same sentence.
- Never fabricate a source, a number, or a quote. Only cite something you actually found. If you found nothing, write without citations and say what you are reasoning from.`
}

export function issueUserPrompt(opts: { dateLabel: string; topic: string; withSearch: boolean }): string {
  const { dateLabel, topic, withSearch } = opts
  const searchLine = withSearch
    ? `Before writing, run at most three web searches for what happened in the last few days on this topic. Cite only what you actually found, inline, with the publication name and date ("the Globe and Mail reported on Tuesday that..."). If searches turn up nothing useful, write from what you know and do not invent a citation.`
    : `You have no web access for this issue. Do not cite specific articles or invent publication names. Reason from what you know and say so plainly where you are inferring.`

  return `Write this morning's issue for ${dateLabel}. Today's topic: ${topic}.

${searchLine}

Format, exactly:
1. First line: SUBJECT: followed by a short, specific subject line. No clickbait, no colon-gimmick, under 60 characters.
2. Blank line.
3. One or two sentences, no heading, that tell the reader why this matters to them today.
4. Two or three sections, each starting with a ## heading in sentence case, each 100 to 160 words.
5. A final ## The takeaway section of three or four sentences: what to do with this, or what to watch next.

Body length 500 to 650 words. Output only the SUBJECT line and the body, nothing else, no preamble.`
}

export function translationPrompt(subject: string, markdown: string): string {
  return `Translate the following newsletter from English to Simplified Chinese (简体中文).

Rules:
- Keep the first-person voice and the plain, direct tone
- Keep proper nouns and widely used terms in English where Chinese media would (AI, GDP, Fed, IMF, etc.)
- Preserve all markdown formatting (## headings, **bold**, bullet points)
- Sound natural to a native Chinese reader, not word for word
- First line must be: SUBJECT: [translated subject]
- Then a blank line, then the translated body

Subject to translate: ${subject}

Body to translate:
${markdown}`
}

export type MessageContent = Anthropic.Message['content']
