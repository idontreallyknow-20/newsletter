'use client'

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onChange: (value: string) => void
}

type ToolAction =
  | { type: 'wrap'; before: string; after: string; placeholder: string }
  | { type: 'line'; prefix: string; placeholder: string }

const tools: { label: string; title: string; action: ToolAction }[] = [
  { label: 'B', title: 'Bold', action: { type: 'wrap', before: '**', after: '**', placeholder: 'bold text' } },
  { label: 'I', title: 'Italic', action: { type: 'wrap', before: '*', after: '*', placeholder: 'italic text' } },
  { label: 'H2', title: 'Heading', action: { type: 'line', prefix: '## ', placeholder: 'Heading' } },
  { label: '—', title: 'Divider', action: { type: 'line', prefix: '\n---\n', placeholder: '' } },
  { label: '•', title: 'Bullet', action: { type: 'line', prefix: '- ', placeholder: 'list item' } },
  { label: '🔗', title: 'Link', action: { type: 'wrap', before: '[', after: '](https://)', placeholder: 'link text' } },
]

export default function MarkdownToolbar({ textareaRef, onChange }: MarkdownToolbarProps) {
  function applyAction(action: ToolAction) {
    const el = textareaRef.current
    if (!el) return

    const start = el.selectionStart
    const end = el.selectionEnd
    const value = el.value
    const selected = value.slice(start, end)

    let newValue: string
    let cursorStart: number
    let cursorEnd: number

    if (action.type === 'wrap') {
      const text = selected || action.placeholder
      newValue = value.slice(0, start) + action.before + text + action.after + value.slice(end)
      cursorStart = start + action.before.length
      cursorEnd = cursorStart + text.length
    } else {
      const text = selected || action.placeholder
      const prefix = action.prefix
      newValue = value.slice(0, start) + prefix + text + value.slice(end)
      cursorStart = start + prefix.length
      cursorEnd = cursorStart + text.length
    }

    onChange(newValue)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(cursorStart, cursorEnd)
    })
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {tools.map(tool => (
        <button
          key={tool.label}
          type="button"
          title={tool.title}
          onClick={() => applyAction(tool.action)}
          className="px-2.5 py-1 text-xs font-sans text-muted hover:text-cream bg-surface-2 hover:bg-white/10 border border-white/10 rounded transition-colors"
        >
          {tool.label}
        </button>
      ))}
    </div>
  )
}
