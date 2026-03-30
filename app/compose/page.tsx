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
  return buildEmailHtml({
    newsletterName: 'Joseph',
    bodyHtml,
    unsubscribeUrl: '#',
  })
}

export default function ComposePage() {
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
  const [langEn, setLangEn] = useState(true)
  const [langZh, setLangZh] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const previewHtml = buildPreviewHtml(body)

  async function saveDraft() {
    setSaving(true)
    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: draftId, subject, previewText, bodyMarkdown: body }),
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
  const languages = [...(langEn ? ['en'] : []), ...(langZh ? ['zh'] : [])]

  async function sendAll() {
    setSending(true)
    setConfirmSend(false)
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, previewText, bodyMarkdown: body, frequencies, languages }),
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
          {draftId && (
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>
              Draft #{draftId}
            </span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {/* Audience checkboxes */}
          <div
            className="flex items-center gap-3 px-3 py-1.5 text-[11px] font-mono tracking-wide"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            <span style={{ opacity: 0.5 }}>To:</span>
            {([
              ['daily', 'Daily', freqDaily, setFreqDaily],
              ['weekly', 'Weekly', freqWeekly, setFreqWeekly],
              ['en', 'EN', langEn, setLangEn],
              ['zh', '中文', langZh, setLangZh],
            ] as [string, string, boolean, (v: boolean) => void][]).map(([key, label, checked, setter]) => (
              <label key={key} className="flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => setter(e.target.checked)}
                  className="cursor-pointer"
                  style={{ accentColor: 'var(--accent)' }}
                />
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
        <div
          className="lg:w-1/2 flex flex-col overflow-y-auto"
          style={{ borderRight: '1px solid var(--border)', background: '#fff' }}
        >
          {/* Subject + preview text */}
          <div className="px-10 pt-10 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Subject line…"
              className="w-full bg-transparent outline-none"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '26px',
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                marginBottom: '10px',
              }}
            />
            <input
              type="text"
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              placeholder="Preview text (shown in inbox)…"
              className="w-full bg-transparent outline-none"
              style={{
                fontFamily: 'var(--font-dm)',
                fontSize: '13px',
                color: '#9a9488',
                letterSpacing: '0.01em',
              }}
            />
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col px-10 py-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className="font-mono text-[9px] tracking-[0.2em] uppercase"
                style={{ color: '#b8b0a6' }}
              >
                Markdown
              </span>
              <MarkdownToolbar textareaRef={textareaRef} onChange={setBody} />
            </div>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={'Write your newsletter here…\n\n## Section heading\n\nYour analysis goes here. Use **bold** for key terms.\n\n## The Takeaway\n\nWhat readers should do with this.'}
              className="flex-1 w-full bg-transparent outline-none resize-none"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '17px',
                lineHeight: 1.85,
                color: '#1a1a1a',
                minHeight: '480px',
                caretColor: '#c8402a',
              }}
            />
          </div>
        </div>

        {/* Right: preview */}
        <div
          className="lg:w-1/2 overflow-y-auto p-6 lg:p-8"
          style={{ background: 'var(--surface-2)' }}
        >
          <div className="mb-4">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--muted)' }}>
              Email Preview
            </span>
          </div>
          <EmailPreview html={previewHtml} />
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmSend}
        title="Send to subscribers?"
        message={`This will immediately send to ${frequencies.length === 2 && languages.length === 2 ? 'all active' : [frequencies.join('+'), languages.join('+')].filter(Boolean).join(', ')} subscribers. You cannot undo this.`}
        confirmLabel="Yes, Send Now"
        onConfirm={sendAll}
        onCancel={() => setConfirmSend(false)}
        dangerous
      />
    </div>
  )
}
