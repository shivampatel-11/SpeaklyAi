import React, { useState } from 'react'
import { Correction } from '@/types'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CorrectionCardProps {
  correction: Correction
  className?: string
}

export const CorrectionCard: React.FC<CorrectionCardProps> = ({ correction, className }) => {
  const [showDetail, setShowDetail] = useState(false)

  // Extract a brief why summary (e.g. "Past tense → went")
  const getShortWhy = () => {
    const text = correction.explanation.toLowerCase()
    if (text.includes('past tense') || text.includes('went')) return 'Past tense → went'
    if (text.includes('agree')) return '"Agree" is a verb'
    if (text.includes('depend')) return 'depend on'
    if (text.includes('duration') || text.includes('since') || text.includes('for')) return 'Duration → for'
    if (text.includes('age') || text.includes('years old')) return 'Age → am'
    return 'Grammar correction'
  }

  return (
    <div
      className={cn(
        'mt-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-left space-y-2 text-xs shadow-sm',
        className
      )}
    >
      {/* You said */}
      <div className="flex items-start gap-2">
        <span className="text-red-400 font-bold shrink-0">✕</span>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
            You said
          </span>
          <span className="text-zinc-300 line-through decoration-red-500/50">
            {correction.original}
          </span>
        </div>
      </div>

      {/* Better */}
      <div className="flex items-start gap-2">
        <span className="text-emerald-400 font-bold shrink-0">✓</span>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
            Better
          </span>
          <span className="text-emerald-300 font-semibold">
            {correction.suggested}
          </span>
        </div>
      </div>

      {/* Why summary & Learn more toggle */}
      <div className="pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
        <div className="text-zinc-400 font-medium">
          <span className="text-zinc-400">Why? </span>
          <span className="text-zinc-200">{getShortWhy()}</span>
        </div>

        <button
          type="button"
          onClick={() => setShowDetail(!showDetail)}
          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 text-[11px] font-medium"
        >
          <span>{showDetail ? 'Less' : 'Learn more'}</span>
          {showDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Collapsible detailed explanation */}
      {showDetail && (
        <div className="pt-1 text-[11px] text-zinc-300 leading-relaxed border-t border-zinc-800/60">
          <p>{correction.explanation}</p>
          {correction.betterSentence && correction.betterSentence !== correction.suggested && (
            <p className="mt-1 text-zinc-400">
              Natural native phrasing: <span className="italic text-zinc-200">"{correction.betterSentence}"</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
