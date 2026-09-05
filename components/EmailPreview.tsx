'use client'

interface EmailPreviewProps {
  html: string
}

export default function EmailPreview({ html }: EmailPreviewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden bg-[#f4f4f0]" style={{ border: '1px solid var(--border)' }}>
        {html ? (
          <iframe
            srcDoc={html}
            title="Email preview"
            className="w-full h-full min-h-[60vh] lg:min-h-[500px]"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[240px] lg:min-h-[500px]">
            <p className="text-[#999] text-sm font-sans">Start writing to see the preview</p>
          </div>
        )}
      </div>
    </div>
  )
}
