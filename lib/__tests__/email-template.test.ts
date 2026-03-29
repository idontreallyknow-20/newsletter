import { describe, it, expect } from 'vitest'
import { buildEmailHtml } from '../email-template'

describe('buildEmailHtml', () => {
  const base = {
    newsletterName: 'Test Letter',
    bodyHtml: '<p>Hello world</p>',
    recipientEmail: 'reader@example.com',
    baseUrl: 'https://example.com',
  }

  it('includes the newsletter name', () => {
    expect(buildEmailHtml(base)).toContain('Test Letter')
  })

  it('includes the body html', () => {
    expect(buildEmailHtml(base)).toContain('<p>Hello world</p>')
  })

  it('includes a working unsubscribe link with encoded email', () => {
    const html = buildEmailHtml(base)
    expect(html).toContain('https://example.com/api/unsubscribe')
    expect(html).toContain(encodeURIComponent('reader@example.com'))
  })

  it('is valid enough HTML (has doctype and body)', () => {
    const html = buildEmailHtml(base)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('</body>')
  })
})
