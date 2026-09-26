import React, { useState, useEffect } from 'react'
import { UserProgressStats } from '@/types'
import { progressService } from '@/services/progressService'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/common/LoadingState'
import {
  Flame,
  Clock,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressPageProps {
  userId?: string
  onStartSpeaking?: () => void
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ userId, onStartSpeaking }) => {
  const [stats, setStats] = useState<UserProgressStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    progressService.getUserProgress(userId).then((data) => {
      setStats(data)
      setLoading(false)
    })
  }, [userId])

  if (loading || !stats) {
    return <LoadingState message="Loading..." />
  }

  const formatSpokenMinutes = (totalSeconds: number) => {
    const mins = Math.round(totalSeconds / 60)
    return `${mins} min spoken`
  }

  const formatDurationOnly = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    if (mins === 0) return `${secs}s`
    return `${mins}m ${secs}s`
  }

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const activeDays = [true, true, false, true, true, true, false]

  return (
    <div className="space-y-5 pt-3 pb-8 max-w-sm mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Your Progress</h1>
      </div>

      {/* 4 Core Metrics - Clean & Concise */}
      <div className="grid grid-cols-2 gap-2.5">
        <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Sessions</span>
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-zinc-100">{stats.totalSessions} sessions</div>
        </Card>

        <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Spoken Time</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-zinc-100">
            {formatSpokenMinutes(stats.totalSpeakingTimeSeconds)}
          </div>
        </Card>

        <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Streak</span>
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-xl font-bold text-zinc-100">🔥 {stats.currentStreak} day streak</div>
        </Card>

        <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Average</span>
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="text-xl font-bold text-zinc-100">{stats.averageScore}%</div>
        </Card>
      </div>

      {/* Consistency Bar */}
      <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Weekly Activity</span>
          <span className="text-zinc-300 font-medium">5 active days</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {days.map((day, idx) => {
            const isActive = activeDays[idx]
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-full h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-800/60 text-zinc-500'
                  )}
                >
                  {isActive ? '✓' : ''}
                </div>
                <span className="text-[10px] text-zinc-500">{day}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent Sessions */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-1">
          Recent Sessions
        </h2>

        {stats.recentSessions.length > 0 ? (
          <div className="space-y-2">
            {stats.recentSessions.map((session) => (
              <Card
                key={session.id}
                className="p-3.5 border-zinc-800/80 bg-zinc-900/60"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-zinc-400 font-medium">
                      {session.date}
                    </div>
                    <div className="text-sm font-semibold text-zinc-100">
                      {session.modeTitle}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {formatDurationOnly(session.durationSeconds)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-indigo-400">
                      {session.score}%
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center border-zinc-800/80 bg-zinc-900/40">
            <p className="text-xs text-zinc-400 mb-3">No sessions yet.</p>
            {onStartSpeaking && (
              <button
                onClick={onStartSpeaking}
                className="text-xs text-indigo-400 font-medium hover:underline"
              >
                Start Speaking
              </button>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
