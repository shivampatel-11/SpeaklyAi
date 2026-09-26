import React from 'react'
import { PracticeTopic } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Coffee, Briefcase, Plane, Sparkles, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopicCardProps {
  topic: PracticeTopic
  onSelect: (topic: PracticeTopic) => void
  isActive?: boolean
  className?: string
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Coffee,
  Briefcase,
  Plane,
  Sparkles,
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onSelect,
  isActive = false,
  className,
}) => {
  const IconComponent = ICON_MAP[topic.icon] || Sparkles

  return (
    <Card
      onClick={() => onSelect(topic)}
      className={cn(
        'group cursor-pointer transition-all duration-200 border-zinc-800/80 hover:border-indigo-500/40 hover:bg-zinc-900/90 active:scale-[0.98]',
        isActive && 'border-indigo-500/60 bg-indigo-950/20 ring-1 ring-indigo-500/30',
        className
      )}
    >
      <div className="p-4 flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center shrink-0 text-indigo-400 group-hover:scale-105 transition-transform shadow-inner">
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
              {topic.category}
            </span>
            <Badge
              variant={
                topic.difficulty === 'Beginner'
                  ? 'success'
                  : topic.difficulty === 'Intermediate'
                  ? 'indigo'
                  : 'warning'
              }
              className="text-[10px] px-1.5 py-0"
            >
              {topic.difficulty}
            </Badge>
          </div>

          <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-200 transition-colors line-clamp-1">
            {topic.title}
          </h4>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
            {topic.description}
          </p>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-800/60 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              <span>~{topic.durationMinutes} min conversation</span>
            </div>
            <div className="flex items-center gap-0.5 text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
              <span>Start</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
