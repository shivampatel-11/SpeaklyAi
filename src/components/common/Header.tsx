import React from 'react'
import { Sparkles, Flame } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface HeaderProps {
  streak?: number
  level?: string
  onLogoClick?: () => void
  onProfileClick?: () => void
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  streak = 4,
  level = 'Intermediate',
  onLogoClick,
  onProfileClick,
  className,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl',
        className
      )}
    >
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Speakly <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">AI</span>
            </span>
          </div>
        </button>

        {/* Right Status / Level / Streak */}
        <div className="flex items-center gap-2">
          {/* Daily streak indicator */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold"
            title={`${streak} day streak`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{streak}d</span>
          </div>

          {/* Level badge */}
          <button onClick={onProfileClick} className="focus:outline-none">
            <Badge variant="indigo" className="cursor-pointer hover:bg-indigo-500/25 transition-colors">
              {level}
            </Badge>
          </button>
        </div>
      </div>
    </header>
  )
}
