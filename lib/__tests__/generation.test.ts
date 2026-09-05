import { describe, it, expect } from 'vitest'
import { extractText, parseIssue, usedWebSearch, topicFor, TOPICS, issueUserPrompt } from '../generation'

describe('extractText', () => {
  it('joins text blocks and ignores tool blocks', () => {
    const content = [
      { type: 'server_tool_use', id: 'x', name: 'web_search' },
      { type: 'web_search_tool_result', tool_use_id: 'x' },
      { type: 'text', text: 'SUBJECT: Hello\n\nBody ' },
      { type: 'text', text: 'continues.' },
    ]
    expect(extractText(content)).toBe('SUBJECT: Hello\n\nBody continues.')
    expect(usedWebSearch(content)).toBe(true)
    expect(usedWebSearch([{ type: 'text' }])).toBe(false)
  })
})

describe('parseIssue', () => {
  it('splits subject, body, and preview', () => {
    const r = parseIssue('SUBJECT: **Rates hold**\n\nThe Fed did nothing.\n\n## Why\nBecause.', 'fallback')
    expect(r.subject).toBe('Rates hold')
    expect(r.bodyMarkdown.startsWith('The Fed did nothing.')).toBe(true)
    expect(r.previewText).toBe('The Fed did nothing.')
  })
  it('falls back when no subject line is present', () => {
    const r = parseIssue('## Heading\nText', 'Daily Brief')
    expect(r.subject).toBe('Daily Brief')
    expect(r.previewText).toBe('Text')
  })
})

describe('topics', () => {
  it('rotates deterministically by date and stays in range', () => {
    expect(TOPICS).toContain(topicFor('2026-09-07'))
    expect(topicFor('2026-09-07')).toBe(topicFor('2026-09-07'))
    expect(topicFor('2026-09-07')).not.toBe(topicFor('2026-09-08'))
  })
  it('prompt forbids invented citations without search', () => {
    expect(issueUserPrompt({ dateLabel: 'Monday', topic: 'x', withSearch: false })).toMatch(/Do not cite specific articles/)
    expect(issueUserPrompt({ dateLabel: 'Monday', topic: 'x', withSearch: true })).toMatch(/Cite only what you actually found/)
  })
})
