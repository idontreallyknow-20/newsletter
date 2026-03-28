import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
})

export function markdownToHtml(markdown: string): string {
  if (!markdown) return ''
  const result = marked(markdown)
  return typeof result === 'string' ? result : ''
}
