import React, { useState } from 'react'
import { SessionFeedback, PracticeMode, ConversationSession } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CorrectionCard } from './CorrectionCard'
import {
  RotateCcw,
  Compass,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionFeedbackViewProps {
  feedback: SessionFeedback
  session: ConversationSession
  mode: PracticeMode
  onPracticeAgain: () => void
  onChooseAnotherMode: () => void
  onHome: () => void
  className?: string
}

export const SessionFeedbackView: React.FC<SessionFeedbackViewProps> = ({
  feedback,
  session,
  mode,
  onPracticeAgain,
  onChooseAnotherMode,
  onHome,
  className,
}) => {
  const [showDetails, setShowDetails] = useState(false)

  const focusArea =
    feedback.corrections.length > 0
      ? feedback.corrections[0].rule || 'Verb tense & phrasing'
      : 'Conversational pacing'

  return (
    <div className={cn('space-y-4 pt-2 pb-8 max-w-sm mx-auto', className)}>
      {/* Visual Header */}
      <div className="text-center space-y-1 pt-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Nice work.</h2>
        <p className="text-xs text-zinc-400">
          {mode.title} • {Math.max(1, Math.round(session.durationSeconds / 60))} min
        </p>
      </div>

      {/* 3 Metrics: Grammar, Fluency, Vocabulary */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <Card className="p-3 text-center border-zinc-800/80 bg-zinc-900/60">
          <div className="text-2xl font-bold text-zinc-100">
            {feedback.grammarScore}
          </div>
          <div className="text-[11px] text-zinc-400 font-medium mt-0.5">
            Grammar
          </div>
        </Card>

        <Card className="p-3 text-center border-zinc-800/80 bg-zinc-900/60">
          <div className="text-2xl font-bold text-indigo-400">
            {feedback.fluencyScore}
          </div>
          <div className="text-[11px] text-zinc-400 font-medium mt-0.5">
            Fluency
          </div>
        </Card>

        <Card className="p-3 text-center border-zinc-800/80 bg-zinc-900/60">
          <div className="text-2xl font-bold text-zinc-100">
            {feedback.vocabularyScore}
          </div>
          <div className="text-[11px] text-zinc-400 font-medium mt-0.5">
            Vocabulary
          </div>
        </Card>
      </div>

      {/* Focus Next Card */}
      <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
              Focus next
            </div>
            <div className="text-xs font-semibold text-zinc-200 mt-0.5">
              {focusArea}
            </div>
          </div>
        </div>
      </Card>

      {/* Collapsible Details */}
      <div className="border border-zinc-800/80 rounded-2xl bg-zinc-900/30 overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          aria-expanded={showDetails}
        >
          <span>Detailed feedback ({feedback.corrections.length} points)</span>
          {showDetails ? (
            <ChevronUp className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {showDetails && (
          <div className="px-3.5 pb-3.5 pt-1 space-y-3 border-t border-zinc-800/60 text-left">
            {feedback.summaryReview && (
              <p className="text-xs text-zinc-300 leading-relaxed">
                {feedback.summaryReview}
              </p>
            )}

            {feedback.positiveNotes.length > 0 && (
              <div className="space-y-1">
                {feedback.positiveNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}

            {feedback.corrections.length > 0 && (
              <div className="space-y-2 pt-1">
                {feedback.corrections.map((corr) => (
                  <CorrectionCard key={corr.id} correction={corr} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary & Secondary Actions */}
      <div className="space-y-2 pt-2">
        <Button
          size="lg"
          variant="primary"
          onClick={onPracticeAgain}
          className="w-full shadow-lg shadow-indigo-500/20"
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Try Again
        </Button>

        <Button
          size="md"
          variant="secondary"
          onClick={onChooseAnotherMode}
          className="w-full text-xs"
          leftIcon={<Compass className="w-4 h-4" />}
        >
          Choose Mode
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onHome}
          className="w-full text-xs text-zinc-500 hover:text-zinc-300"
        >
          Home
        </Button>
      </div>
    </div>
  )
}
