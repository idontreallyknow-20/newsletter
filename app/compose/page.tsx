'use client'

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import MarkdownToolbar from '@/components/MarkdownToolbar'
import EmailPreview from '@/components/EmailPreview'
import ConfirmModal from '@/components/ConfirmModal'
import { markdownToHtml } from '@/lib/markdown'

function buildPreviewHtml(subject: string, bodyMarkdown: string): string {
  if (!bodyMarkdown) return ''
  const bodyHtml = markdownToHtml(bodyMarkdown)
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body{margin:0;padding:0;background:#f4f4f0;font-family:Georgia,serif;}
  .wrap{max-width:600px;margin:24px auto;background:#fff;border-radius:4px;overflow:hidden;}
  .header{background:#0A0A0A;padding:28px 36px;}
  .header h1{margin:0;color:#F5F0E8;font-size:22px;font-family:Georgia,serif;}
  .divider{height:3px;background:linear-gradient(90deg,#c9a84c,#e8d5a3);}
  .body{padding:36px;color:#1a1a1a;font-size:16px;line-height:1.75;}
  .footer{padding:20px 36px;background:#f9f9f7;border-top:1px solid #eee;text-align:center;font-size:12px;color:#999;}
  h2{font-size:20px;margin-top:1.5em;}
  hr{border:none;border-top:1px solid #ddd;margin:2em 0;}
  a{color:#c9a84c;}
</style></head>
<body><div class="wrap">
  <div class="header"><h1>Newsletter Preview</h1></div>
  <div class="divider"></div>
  <div class="body">${bodyHtml}</div>
  <div class="footer">This is a preview — unsubscribe link will appear in real sends.</div>
</div></body></html>`
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const previewHtml = buildPreviewHtml(subject, body)

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

  async function sendAll() {
    setSending(true)
    setConfirmSend(false)
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, previewText, bodyMarkdown: body }),
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
      <div className="px-8 lg:px-10 py-5 flex items-center justify-between gap-4 flex-wrap" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: 'var(--muted)', opacity: 0.5 }}>New Issue</p>
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--cream)' }}>Compose</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={saveDraft}
            disabled={saving}
            className="px-4 py-2 text-xs font-sans tracking-wide transition-colors disabled:opacity-40"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            onClick={sendTest}
            disabled={testing}
            className="px-4 py-2 text-xs font-sans tracking-wide transition-colors disabled:opacity-40"
            style={{ color: 'var(--cream)', border: '1px solid var(--border)' }}
          >
            {testing ? 'Sending…' : 'Send Test'}
          </button>
          <button
            onClick={() => setConfirmSend(true)}
            disabled={sending || !subject || !body}
            className="px-4 py-2 text-xs font-sans tracking-wide transition-all duration-150 disabled:opacity-40"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
          >
            {sending ? 'Sending…' : 'Send Now'}
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left: editor */}
        <div className="lg:w-1/2 flex flex-col p-6 lg:p-8 gap-4" style={{ borderRight: '1px solid var(--border)' }}>
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase block mb-2" style={{ color: 'var(--muted)' }}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Your email subject line…"
              className="w-full px-4 py-2.5 text-sm font-sans"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', outline: 'none' }}
            />
          </div>
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase block mb-2" style={{ color: 'var(--muted)' }}>Preview Text</label>
            <input
              type="text"
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              placeholder="Short preview shown in inbox…"
              className="w-full px-4 py-2.5 text-sm font-sans"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', outline: 'none' }}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--muted)' }}>Body (Markdown)</label>
              <MarkdownToolbar textareaRef={textareaRef} onChange={setBody} />
            </div>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your newsletter in markdown…&#10;&#10;## AI Updates&#10;&#10;Your AI content here.&#10;&#10;---&#10;&#10;## Economy&#10;&#10;Your economy content here."
              className="flex-1 min-h-[400px] w-full px-4 py-3 text-sm font-sans resize-none leading-relaxed"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', outline: 'none' }}
            />
          </div>
        </div>

        {/* Right: preview */}
        <div className="lg:w-1/2 p-6 lg:p-8">
          <EmailPreview html={previewHtml} />
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmSend}
        title="Send to all subscribers?"
        message="This will immediately send this email to all active subscribers. You cannot undo this."
        confirmLabel="Yes, Send Now"
        onConfirm={sendAll}
        onCancel={() => setConfirmSend(false)}
        dangerous
      />
    </div>
  )
}
