import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Dialog Content */}
      <div
        className={cn(
          'relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 z-10 max-h-[85vh] overflow-y-auto',
          className
        )}
      >
        {/* Mobile drag handle */}
        <div className="flex sm:hidden justify-center pb-3">
          <div className="w-12 h-1.5 rounded-full bg-zinc-700/80" />
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h2 className="text-lg font-bold text-zinc-100">{title}</h2>}
            {description && <p className="text-xs text-zinc-400 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  )
}
