import React from 'react'
import { PracticeMode } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MessageCircle, Briefcase, GraduationCap, Sparkles, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModeCardProps {
  mode: PracticeMode
  onSelect: (mode: PracticeMode) => void
  className?: string
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  MessageCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
}

export const ModeCard: React.FC<ModeCardProps> = ({ mode, onSelect, className }) => {
  const IconComponent = ICON_MAP[mode.icon] || Sparkles

  return (
    <Card
      onClick={() => onSelect(mode)}
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-300 p-4 border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-900/90 hover:border-indigo-500/40 active:scale-[0.98] shadow-lg',
        className
      )}
    >
      {/* Subtle corner glow highlight */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all" />

      <div className="flex items-center gap-3.5 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center shrink-0 text-indigo-400 group-hover:text-indigo-300 group-hover:scale-105 transition-transform shadow-inner">
          <IconComponent className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-200 transition-colors truncate">
              {mode.title}
            </h3>
            <Badge
              variant={
                mode.difficulty === 'Beginner'
                  ? 'success'
                  : mode.difficulty === 'Intermediate'
                  ? 'indigo'
                  : 'warning'
              }
              className="text-[10px] shrink-0 px-2 py-0.5"
            >
              {mode.difficulty}
            </Badge>
          </div>

          <p className="text-xs text-zinc-400 line-clamp-1 leading-relaxed">
            {mode.description}
          </p>
        </div>

        <div className="text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </Card>
  )
}
