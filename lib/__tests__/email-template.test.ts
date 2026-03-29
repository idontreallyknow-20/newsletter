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
})
