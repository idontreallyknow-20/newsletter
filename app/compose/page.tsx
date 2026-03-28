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
      <div className="px-6 lg:px-10 py-6 border-b border-white/10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-cream">Compose</h2>
          <p className="text-muted text-xs font-sans mt-0.5">Write your email, preview it, send it.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={saveDraft}
            disabled={saving}
            className="px-4 py-2 text-sm font-sans text-muted hover:text-cream border border-white/10 rounded-md transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            onClick={sendTest}
            disabled={testing}
            className="px-4 py-2 text-sm font-sans text-cream/80 hover:text-cream border border-white/15 rounded-md transition-colors disabled:opacity-50"
          >
            {testing ? 'Sending…' : 'Send Test'}
          </button>
          <button
            onClick={() => setConfirmSend(true)}
            disabled={sending || !subject || !body}
            className="px-4 py-2 text-sm font-sans bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 rounded-md transition-colors disabled:opacity-50"
          >
            {sending ? 'Sending…' : 'Send Now'}
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left: editor */}
        <div className="lg:w-1/2 flex flex-col p-6 lg:p-8 border-r border-white/10 gap-4">
          <div>
            <label className="text-muted text-xs font-sans uppercase tracking-widest block mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Your email subject line…"
              className="w-full bg-surface-2 border border-white/10 rounded-md px-4 py-2.5 text-cream text-sm font-sans placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-muted text-xs font-sans uppercase tracking-widest block mb-1.5">Preview Text</label>
            <input
              type="text"
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              placeholder="Short preview shown in inbox…"
              className="w-full bg-surface-2 border border-white/10 rounded-md px-4 py-2.5 text-cream text-sm font-sans placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-muted text-xs font-sans uppercase tracking-widest">Body</label>
              <MarkdownToolbar textareaRef={textareaRef} onChange={setBody} />
            </div>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your newsletter in markdown…&#10;&#10;## AI Updates&#10;&#10;Your AI content here.&#10;&#10;---&#10;&#10;## Economy&#10;&#10;Your economy content here."
              className="flex-1 min-h-[400px] w-full bg-surface-2 border border-white/10 rounded-md px-4 py-3 text-cream text-sm font-sans placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors resize-none leading-relaxed"
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
