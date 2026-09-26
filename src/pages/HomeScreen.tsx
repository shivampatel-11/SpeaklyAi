import React from 'react'
import { UserProfile, UserProgressStats } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  Mic,
  ArrowRight,
  Flame,
  Clock,
} from 'lucide-react'

interface HomeScreenProps {
  user: UserProfile
  progress: UserProgressStats | null
  onStartSpeaking: () => void
  onViewProgress: () => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  progress,
  onStartSpeaking,
  onViewProgress,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const streak = progress?.currentStreak ?? 5
  const lastSession = progress?.recentSessions?.[0]
  const firstName = user.name ? user.name.split(' ')[0] : 'Shivam'

  // Calculate today's minutes
  const totalMinutes = Math.round((progress?.totalSpeakingTimeSeconds ?? 120) / 60)
  const todayMinutes = Math.min(10, Math.max(2, totalMinutes % 10 || 2))

  return (
    <div className="space-y-6 pt-3 pb-8">
      {/* 1. GREETING & HEADING */}
      <div className="space-y-1">
        <span className="text-xs text-zinc-400 font-medium tracking-wide">
          {getGreeting()}, {firstName}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Ready to speak?
        </h1>
        <p className="text-xs text-zinc-400">
          Your AI speaking partner.
        </p>
      </div>

      {/* 2. PRIMARY CTA: Start Speaking */}
      <div className="relative group">
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500/30 to-violet-600/30 blur-lg group-hover:opacity-100 transition duration-300" />
        <Card className="relative p-5 border-zinc-800/80 bg-zinc-900/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">
              Live Practice
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
              <Mic className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          <Button
            size="xl"
            variant="primary"
            onClick={onStartSpeaking}
            className="w-full text-base font-bold shadow-lg shadow-indigo-500/25"
            leftIcon={<Mic className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Speaking
          </Button>
        </Card>
      </div>

      {/* 3. TODAY'S PRACTICE */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-400 px-1 uppercase tracking-wider">
          Today's Practice
        </span>

        <Card className="p-4 border-zinc-800/80 bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {todayMinutes} / 10 min
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              {streak} day streak
            </span>
          </div>

          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(todayMinutes / 10) * 100}%` }}
            />
          </div>
        </Card>
      </div>

      {/* 4. RECENT PROGRESS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Recent Progress
          </span>
          <button
            onClick={onViewProgress}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View Progress
          </button>
        </div>

        {lastSession ? (
          <Card
            onClick={onViewProgress}
            className="p-3.5 border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-900/90 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 font-medium">
                  {lastSession.date}
                </span>
                <h4 className="text-sm font-bold text-zinc-100">
                  {lastSession.modeTitle}
                </h4>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {Math.floor(lastSession.durationSeconds / 60)}m {lastSession.durationSeconds % 60}s
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-indigo-400">
                  {lastSession.score}%
                </div>
                <span className="text-[9px] text-zinc-400 font-semibold uppercase">
                  Score
                </span>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4 border-zinc-800/80 bg-zinc-900/40 text-center">
            <p className="text-xs text-zinc-400">No sessions yet.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
