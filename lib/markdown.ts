import { marked, Renderer } from 'marked'

// Strip raw HTML from markdown to prevent XSS. Newsletter authors use markdown
// syntax, so raw HTML passthrough is not needed and is a security risk.
const renderer = new Renderer()
renderer.html = () => ''

marked.use({
  renderer,
  breaks: true,
  gfm: true,
})

export function markdownToHtml(markdown: string): string {
  if (!markdown) return ''
  const result = marked(markdown)
  return typeof result === 'string' ? result : ''
}
