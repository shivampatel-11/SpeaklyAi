import React from 'react'
import { PracticeMode } from '@/types'
import { PRACTICE_MODES } from '@/config/modes'
import { ModeCard } from './ModeCard'

interface ModeSelectorProps {
  onSelectMode: (mode: PracticeMode) => void
  onBack?: () => void
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="space-y-4 pt-2 pb-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Practice Modes</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Choose a scenario to begin.</p>
      </div>

      {/* 4 Practice Mode Cards */}
      <div className="space-y-2.5">
        {PRACTICE_MODES.map((mode) => (
          <ModeCard
            key={mode.id}
            mode={mode}
            onSelect={onSelectMode}
          />
        ))}
      </div>
    </div>
  )
}
