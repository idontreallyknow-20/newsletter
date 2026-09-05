import { describe, it, expect } from 'vitest'
import { buildEmailHtml } from '../email-template'

describe('buildEmailHtml', () => {
  const base = {
    newsletterName: 'Test Letter',
    bodyHtml: '<p>Hello world</p>',
    unsubscribeUrl: 'https://example.com/api/unsubscribe?email=reader%40example.com&token=abc123',
  }

  it('includes the newsletter name', () => {
    expect(buildEmailHtml(base)).toContain('Test Letter')
  })

  it('includes the body html', () => {
    expect(buildEmailHtml(base)).toContain('<p>Hello world</p>')
  })

  it('includes the unsubscribe link', () => {
    const html = buildEmailHtml(base)
    expect(html).toContain('https://example.com/api/unsubscribe')
  })

  it('is valid enough HTML (has doctype and body)', () => {
    const html = buildEmailHtml(base)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('</body>')
  })

  it('escapes HTML in the newsletter name', () => {
    const html = buildEmailHtml({ ...base, newsletterName: '<script>alert(1)</script>' })
    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('renders a hidden preheader when previewText is given', () => {
    const html = buildEmailHtml({ ...base, previewText: 'This week: rates, chips, and jobs' })
    expect(html).toContain('This week: rates, chips, and jobs')
    expect(html).toContain('display:none')
  })

  it('omits the preferences link when no preferencesUrl is given', () => {
    expect(buildEmailHtml(base)).not.toContain('>Preferences</a>')
  })

  it('includes the preferences link when preferencesUrl is given', () => {
    const html = buildEmailHtml({ ...base, preferencesUrl: 'https://example.com/preferences?email=a&token=b' })
    expect(html).toContain('>Preferences</a>')
  })
})

import { formatIssueDate } from '../email-template'

describe('formatIssueDate', () => {
  it('formats a Toronto issue date without depending on the host timezone', () => {
    expect(formatIssueDate('2026-09-05')).toBe('Saturday, September 5, 2026')
  })
  it('passes unknown strings through', () => {
    expect(formatIssueDate('tomorrow')).toBe('tomorrow')
  })
})

describe('buildEmailHtml issue chrome', () => {
  it('renders the headline, dateline and read-online link', () => {
    const html = buildEmailHtml({
      newsletterName: 'Daily Brief', bodyHtml: '<p>Body</p>', unsubscribeUrl: 'https://x/u',
      subject: 'Wages up 2%, prices up 3%', issueDate: '2026-09-05', readOnlineUrl: 'https://dailybriefhq.com/issues/wages',
    })
    expect(html).toContain('Wages up 2%, prices up 3%')
    expect(html).toContain('Saturday, September 5, 2026')
    expect(html).toContain('https://dailybriefhq.com/issues/wages')
    expect(html).toContain('Daily<span')
  })
  it('switches the footer strings for the Chinese edition', () => {
    const html = buildEmailHtml({ newsletterName: 'Daily Brief', bodyHtml: '<p>正文</p>', unsubscribeUrl: 'https://x/u', language: 'zh', preferencesUrl: 'https://x/p' })
    expect(html).toContain('退订')
    expect(html).toContain('订阅设置')
    expect(html).toContain('lang="zh-CN"')
  })
})
