'use client'

interface EmailPreviewProps {
  html: string
}

export default function EmailPreview({ html }: EmailPreviewProps) {
  return (
    <div className="flex flex-col h-full">
      <p className="text-muted text-xs font-sans uppercase tracking-widest mb-3">Preview</p>
      <div className="flex-1 rounded-lg overflow-hidden border border-white/10 bg-[#f4f4f0]">
        {html ? (
          <iframe
            srcDoc={html}
            title="Email preview"
            className="w-full h-full min-h-[500px]"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[500px]">
            <p className="text-[#999] text-sm font-sans">Start writing to see the preview</p>
          </div>
        )}
      </div>
    </div>
  )
}
