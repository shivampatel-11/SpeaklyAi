import React from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  Mic,
  Sparkles,
  Zap,
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

interface LandingPageProps {
  onStartPracticing: () => void
  onExploreTopics: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPracticing,
  onExploreTopics,
}) => {
  return (
    <div className="space-y-6 pt-2 pb-6 max-w-sm mx-auto">
      {/* Hero Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Your AI speaking partner</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Ready to speak?
        </h1>

        <p className="text-sm text-zinc-400 max-w-xs mx-auto">
          Talk naturally. Get instant corrections. Improve daily.
        </p>

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
          <Button
            size="lg"
            variant="primary"
            onClick={onStartPracticing}
            className="w-full shadow-lg shadow-indigo-500/25"
            leftIcon={<Mic className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Speaking
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onExploreTopics}
            className="text-xs text-zinc-400 hover:text-zinc-200"
          >
            Practice Modes
          </Button>
        </div>
      </div>

      {/* Simulated Live Audio Preview Card */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Preview
          </span>
          <span className="text-[10px] text-zinc-500">Daily Conversation</span>
        </div>

        {/* Structured Correction Preview */}
        <div className="space-y-1.5 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-zinc-300">
            "How was your weekend?"
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
            <div className="text-zinc-400">
              <span className="text-red-400 mr-1.5">❌</span>
              <span className="line-through">I go to college yesterday.</span>
            </div>
            <div className="text-emerald-300 font-medium">
              <span className="text-emerald-400 mr-1.5">✓</span>
              I went to college yesterday.
            </div>
            <div className="pt-1 border-t border-zinc-800/80 text-[11px] text-zinc-400">
              Why? <span className="text-zinc-300">Past tense → went</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars - Concise microcopy */}
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-1 gap-2">
          {/* Card 1 */}
          <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-100">Voice Practice</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Talk naturally without judgment.</p>
              </div>
            </div>
          </Card>

          {/* Card 2 */}
          <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-100">Instant Corrections</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Polite, real-time grammar feedback.</p>
              </div>
            </div>
          </Card>

          {/* Card 3 */}
          <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 text-violet-400">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-100">Daily Streaks</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Build confidence in 5 minutes a day.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Trust note */}
      <div className="pt-2 text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
        <span>Private audio session</span>
      </div>
    </div>
  )
}
