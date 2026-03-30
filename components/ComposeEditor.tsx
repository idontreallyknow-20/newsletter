'use client'

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import MarkdownToolbar from '@/components/MarkdownToolbar'
import EmailPreview from '@/components/EmailPreview'
import ConfirmModal from '@/components/ConfirmModal'
import { markdownToHtml } from '@/lib/markdown'
import { buildEmailHtml } from '@/lib/email-template'

function buildPreviewHtml(bodyMarkdown: string): string {
  if (!bodyMarkdown) return ''
  const bodyHtml = markdownToHtml(bodyMarkdown)
  return buildEmailHtml({ newsletterName: 'Joseph', bodyHtml, unsubscribeUrl: '#' })
}

export default function ComposeEditor({ language }: { language: 'en' | 'zh' }) {
  const [subject, setSubject] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [body, setBody] = useState('')
  const [draftId, setDraftId] = useState<number | null>(null)
  const [sending, setSending] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmSend, setConfirmSend] = useState(false)
  const [freqDaily, setFreqDaily] = useState(true)
  const [freqWeekly, setFreqWeekly] = useState(false)
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const previewHtml = buildPreviewHtml(body)
  const langLabel = language === 'zh' ? '中文' : 'English'

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0
  const charCount = body.length
  const readTime = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0

  const fontSizeMap = { sm: '15px', md: '17px', lg: '20px' }

  async function copyMarkdown() {
    if (!body) { toast.error('Nothing to copy'); return }
    await navigator.clipboard.writeText(body)
    toast.success('Markdown copied')
  }

  async function saveDraft() {
    setSaving(true)
    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: draftId, subject, previewText, bodyMarkdown: body, language }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDraftId(data.id)
      toast.success('Draft saved')
    } catch (err) {
      toast.error((err instanceof Error && err.message) || 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  async function sendTest() {
    if (!subject || !body) { toast.error('Add a subject and body first'); return }
    setTesting(true)
    try {
      const res = await fetch('/api/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, previewText, bodyMarkdown: body }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Test sent to ${data.sentTo}`)
    } catch (err) {
      toast.error((err instanceof Error && err.message) || 'Test send failed')
    } finally {
      setTesting(false)
    }
  }

  const frequencies = [...(freqDaily ? ['daily'] : []), ...(freqWeekly ? ['weekly'] : [])]

  async function sendAll() {
    setSending(true)
    setConfirmSend(false)
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, previewText, bodyMarkdown: body, frequencies, languages: [language] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Sent to ${data.sent} subscribers!`)
    } catch (err) {
      toast.error((err instanceof Error && err.message) || 'Send failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-8 lg:px-10 py-4 flex items-center justify-between gap-4 flex-wrap"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--muted)' }}>
            New Issue
          </span>
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>
            {langLabel}
          </span>
          {draftId && (
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5" style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              Draft #{draftId}
            </span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {/* Font size */}
          <div className="flex items-center gap-0 font-mono text-[10px]" style={{ border: '1px solid var(--border)' }}>
            {(['sm', 'md', 'lg'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className="px-2 py-1.5 tracking-widest uppercase transition-all"
                style={{
                  color: fontSize === s ? 'var(--accent)' : 'var(--muted)',
                  background: fontSize === s ? 'var(--accent-dim)' : 'transparent',
                  borderRight: s !== 'lg' ? '1px solid var(--border)' : 'none',
                }}
                title={`Font size: ${s}`}
              >
                {s === 'sm' ? 'A' : s === 'md' ? 'A' : 'A'}
                <span className="ml-0.5 opacity-50 text-[8px]">{s}</span>
              </button>
            ))}
          </div>

          {/* Copy markdown */}
          <button
            onClick={copyMarkdown}
            className="px-3 py-1.5 text-[11px] font-mono tracking-wide transition-colors"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
            title="Copy raw markdown"
          >
            Copy MD
          </button>

          {/* Frequency checkboxes */}
          <div
            className="flex items-center gap-3 px-3 py-1.5 text-[11px] font-mono tracking-wide"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            <span style={{ opacity: 0.5 }}>Freq:</span>
            {([
              ['daily', 'Daily', freqDaily, setFreqDaily],
              ['weekly', 'Weekly', freqWeekly, setFreqWeekly],
            ] as [string, string, boolean, (v: boolean) => void][]).map(([key, label, checked, setter]) => (
              <label key={key} className="flex items-center gap-1 cursor-pointer select-none">
                <input type="checkbox" checked={checked} onChange={e => setter(e.target.checked)} className="cursor-pointer" style={{ accentColor: 'var(--accent)' }} />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={saveDraft}
            disabled={saving}
            className="px-4 py-1.5 text-[11px] font-mono tracking-wide transition-colors disabled:opacity-40"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            onClick={sendTest}
            disabled={testing}
            className="px-4 py-1.5 text-[11px] font-mono tracking-wide transition-colors disabled:opacity-40"
            style={{ color: 'var(--cream)', border: '1px solid var(--border)' }}
          >
            {testing ? 'Sending…' : 'Send Test'}
          </button>
          <button
            onClick={() => setConfirmSend(true)}
            disabled={sending || !subject || !body}
            className="px-4 py-1.5 text-[11px] font-mono tracking-wide transition-all duration-150 disabled:opacity-40"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
          >
            {sending ? 'Sending…' : 'Send Now →'}
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: editor */}
        <div className="lg:w-1/2 flex flex-col overflow-y-auto" style={{ borderRight: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div className="px-10 pt-10 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder={language === 'zh' ? '邮件主题…' : 'Subject line…'}
              className="compose-subject w-full bg-transparent outline-none"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '26px', fontWeight: 700, color: 'var(--cream)', lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: '10px' }}
            />
            <input
              type="text"
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              placeholder={language === 'zh' ? '收件箱预览文字…' : 'Preview text (shown in inbox)…'}
              className="compose-preview w-full bg-transparent outline-none"
              style={{ fontFamily: 'var(--font-dm)', fontSize: '13px', color: 'var(--muted)', letterSpacing: '0.01em' }}
            />
          </div>
          <div className="flex-1 flex flex-col px-10 py-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)', opacity: 0.6 }}>Markdown</span>
              <MarkdownToolbar textareaRef={textareaRef} onChange={setBody} />
            </div>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={language === 'zh' ? '在此用 Markdown 写中文稿…\n\n## 章节标题\n\n正文内容。' : 'Write your newsletter here…\n\n## Section heading\n\nYour analysis goes here.'}
              className="compose-body flex-1 w-full bg-transparent outline-none resize-none"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: fontSizeMap[fontSize], lineHeight: 1.85, color: 'var(--cream)', minHeight: '480px', caretColor: 'var(--accent)' }}
            />
          </div>
          {/* Stats bar */}
          <div className="flex items-center gap-5 px-10 py-2.5 flex-wrap" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            <span className="font-mono text-[10px] tracking-wide" style={{ color: 'var(--muted)' }}>
              {wordCount.toLocaleString()} <span style={{ opacity: 0.5 }}>words</span>
            </span>
            <span className="font-mono text-[10px] tracking-wide" style={{ color: 'var(--muted)' }}>
              {charCount.toLocaleString()} <span style={{ opacity: 0.5 }}>chars</span>
            </span>
            {readTime > 0 ? (
              <span className="font-mono text-[10px] tracking-wide" style={{ color: 'var(--accent)' }}>
                ~{readTime} min read
              </span>
            ) : (
              <span className="font-mono text-[10px] tracking-wide" style={{ color: 'var(--muted)', opacity: 0.35 }}>
                start writing…
              </span>
            )}
          </div>
        </div>

        {/* Right: preview */}
        <div className="lg:w-1/2 overflow-y-auto p-6 lg:p-8" style={{ background: 'var(--surface-2)' }}>
          <div className="mb-4">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--muted)' }}>Email Preview</span>
          </div>
          <EmailPreview html={previewHtml} />
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmSend}
        title={`Send ${langLabel} issue?`}
        message={
          <div className="space-y-4">
            {subject && (
              <div className="px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--muted)', opacity: 0.6 }}>Subject</p>
                <p className="font-sans text-sm font-medium" style={{ color: 'var(--cream)' }}>{subject}</p>
              </div>
            )}
            <div className="flex gap-4 flex-wrap">
              {[
                { label: 'Words', value: wordCount.toLocaleString() },
                { label: 'Read time', value: readTime > 0 ? `~${readTime} min` : '—' },
                { label: 'Audience', value: `${langLabel} · ${frequencies.join('+')}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-mono text-[9px] tracking-[0.15em] uppercase mb-0.5" style={{ color: 'var(--muted)', opacity: 0.5 }}>{label}</p>
                  <p className="font-mono text-xs" style={{ color: 'var(--cream)' }}>{value}</p>
                </div>
              ))}
            </div>
            <p className="font-sans text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              This will immediately send to all matching subscribers. You cannot undo this.
            </p>
          </div>
        }
        confirmLabel="Yes, Send Now →"
        onConfirm={sendAll}
        onCancel={() => setConfirmSend(false)}
        dangerous
      />
    </div>
  )
}
