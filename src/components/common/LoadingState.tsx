import React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  subMessage?: string
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  subMessage,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[220px] p-6 text-center',
        className
      )}
    >
      <div className="relative flex items-center justify-center mb-4">
        <div className="absolute w-14 h-14 rounded-full bg-indigo-500/20 animate-ping" />
        <div className="relative w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-zinc-100">{message}</h3>
      {subMessage && <p className="text-xs text-zinc-400 max-w-xs mt-1">{subMessage}</p>}

      <div className="w-32 mt-4 space-y-2">
        <div className="h-1.5 w-full bg-zinc-800/80 rounded-full animate-pulse" />
        <div className="h-1.5 w-2/3 mx-auto bg-zinc-800/50 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
