'use client'

import { ReactNode } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: ReactNode
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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative p-5 sm:p-6 w-full max-w-md shadow-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-dark)' }}>
        <h3 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--cream)' }}>{title}</h3>
        <div className="text-sm font-sans mb-6 leading-relaxed break-words" style={{ color: 'var(--muted)' }}>{message}</div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-sans transition-colors"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 text-sm font-sans font-medium transition-colors"
            style={dangerous
              ? { background: 'var(--red)', color: '#fff', border: '1px solid var(--red)' }
              : { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
