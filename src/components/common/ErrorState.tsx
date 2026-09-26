import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong.',
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-red-500/20 bg-red-950/20',
        className
      )}
    >
      <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>

      <h3 className="text-sm font-semibold text-zinc-100 mb-1">{title}</h3>
      {message && <p className="text-xs text-zinc-400 max-w-xs mb-4">{message}</p>}

      {onRetry && (
        <Button
          size="sm"
          variant="secondary"
          onClick={onRetry}
          className={cn(!message && 'mt-3')}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
