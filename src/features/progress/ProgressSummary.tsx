import React from 'react'
import { UserStats } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Flame, Clock, Award, MessageCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressSummaryProps {
  stats: UserStats
  className?: string
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({ stats, className }) => {
  const statItems = [
    {
      label: 'Daily Streak',
      value: `${stats.currentStreak} Days`,
      sub: 'Keep it going!',
      icon: Flame,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Time Spoken',
      value: `${stats.totalMinutesSpoken} min`,
      sub: 'Goal: 10 min/day',
      icon: Clock,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      label: 'Fluency Index',
      value: `${stats.fluencyScore}%`,
      sub: 'Pronunciation & speed',
      icon: TrendingUp,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Sessions Done',
      value: `${stats.sessionsCompleted}`,
      sub: 'Live conversations',
      icon: MessageCircle,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-100">Learning Progress</h2>
          <p className="text-xs text-zinc-400">Track your consistency and speaking fluency</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>Level B2</span>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-2.5">
        {statItems.map((item, i) => {
          const Icon = item.icon
          return (
            <Card key={i} className="p-3.5 border-zinc-800/80 bg-zinc-900/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-zinc-400">{item.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center border', item.color)}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-lg font-bold text-zinc-100 tracking-tight">{item.value}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{item.sub}</div>
            </Card>
          )
        })}
      </div>

      {/* Daily speaking goal bar */}
      <Card className="p-4 border-zinc-800/80 bg-zinc-900/60">
        <div className="flex justify-between items-center mb-2 text-xs">
          <span className="font-medium text-zinc-300">Today's Goal Progress</span>
          <span className="font-semibold text-indigo-400">7 / 10 min</span>
        </div>
        <div className="w-full bg-zinc-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-zinc-700/50">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
            style={{ width: '70%' }}
          />
        </div>
        <div className="text-[11px] text-zinc-500 mt-2">
          3 minutes more to lock in today's streak badge!
        </div>
      </Card>

      {/* Key Recent Corrections Learned */}
      <Card className="border-zinc-800/80 bg-zinc-900/60">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Recent Corrections Mastered
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-2.5">
          <div className="text-xs p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="line-through text-red-400 text-[11px]">I am agree</span>
              <span className="text-zinc-600">→</span>
              <span className="text-emerald-400 font-medium text-[11px]">I agree</span>
            </div>
            <span className="text-[10px] text-zinc-500">"Agree" is a verb, doesn't require "to be"</span>
          </div>

          <div className="text-xs p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="line-through text-red-400 text-[11px]">It depends of</span>
              <span className="text-zinc-600">→</span>
              <span className="text-emerald-400 font-medium text-[11px]">It depends on</span>
            </div>
            <span className="text-[10px] text-zinc-500">Fixed preposition collocation</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
