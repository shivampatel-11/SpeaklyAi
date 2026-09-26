import React from 'react'
import { MessageSquareDashed } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No sessions yet.',
  description,
  actionLabel = 'Start Speaking',
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-zinc-800/80 bg-zinc-900/40',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 mb-3">
        {icon || <MessageSquareDashed className="w-6 h-6 text-indigo-400" />}
      </div>

      <h3 className="text-sm font-semibold text-zinc-100 mb-1">{title}</h3>
      {description && <p className="text-xs text-zinc-400 max-w-xs mb-4">{description}</p>}

      {onAction && (
        <Button size="sm" onClick={onAction} variant="primary" className={cn(!description && 'mt-3')}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
