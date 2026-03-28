'use client'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  dangerous?: boolean
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  dangerous = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-surface border border-white/10 rounded-lg p-6 w-full max-w-md shadow-2xl">
        <h3 className="font-display text-lg font-bold text-cream mb-2">{title}</h3>
        <p className="text-muted text-sm font-sans mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-sans text-muted hover:text-cream border border-white/10 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-sans rounded-md transition-colors ${
              dangerous
                ? 'bg-red-900/50 hover:bg-red-800/60 text-red-200 border border-red-800/40'
                : 'bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
