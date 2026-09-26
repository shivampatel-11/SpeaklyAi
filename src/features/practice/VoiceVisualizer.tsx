import React from 'react'
import { VoiceState } from '@/types'
import { cn } from '@/lib/utils'

interface VoiceVisualizerProps {
  voiceState: VoiceState
  audioLevel: number
  className?: string
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  voiceState,
  audioLevel,
  className,
}) => {
  const isLive = voiceState === 'listening' || voiceState === 'speaking'

  // Generate 7 sound wave bars with responsive heights
  const bars = [0.4, 0.7, 1.0, 0.85, 0.6, 0.9, 0.45]

  return (
    <div className={cn('flex items-center justify-center gap-1 h-8 px-4', className)}>
      {bars.map((weight, index) => {
        const heightMultiplier = isLive
          ? Math.max(0.2, Math.min(1.0, audioLevel * weight + 0.15))
          : 0.15

        return (
          <div
            key={index}
            className={cn(
              'w-1 rounded-full transition-all duration-100',
              voiceState === 'listening'
                ? 'bg-gradient-to-t from-indigo-500 to-violet-400'
                : voiceState === 'speaking'
                ? 'bg-gradient-to-t from-violet-400 to-fuchsia-400'
                : voiceState === 'processing'
                ? 'bg-indigo-400 animate-pulse'
                : 'bg-zinc-700/60'
            )}
            style={{
              height: `${Math.round(heightMultiplier * 28)}px`,
              transitionDelay: `${index * 25}ms`,
            }}
          />
        )
      })}
    </div>
  )
}
