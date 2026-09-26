import React, { useState, useRef, useEffect } from 'react'
import { PracticeTopic } from '@/types'
import { useSpeechPractice } from '@/hooks/useSpeechPractice'
import { VoiceVisualizer } from './VoiceVisualizer'
import { CorrectionCard } from './CorrectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Mic, MicOff, Send, Sparkles, Volume2, RotateCcw, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PracticeSessionViewProps {
  initialTopic: PracticeTopic
  onOpenTopicsModal?: () => void
  className?: string
}

export const PracticeSessionView: React.FC<PracticeSessionViewProps> = ({
  initialTopic,
  onOpenTopicsModal,
  className,
}) => {
  const {
    activeTopic,
    session,
    voiceState,
    transcript,
    audioLevel,
    toggleListening,
    sendMessage,
    resetSession,
  } = useSpeechPractice(initialTopic)

  const [typedInput, setTypedInput] = useState('')
  const [showTextInput, setShowTextInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session.messages, voiceState])

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typedInput.trim()) {
      sendMessage(typedInput)
      setTypedInput('')
    }
  }

  const handleChipClick = (phrase: string) => {
    sendMessage(phrase)
  }

  const getStatusText = () => {
    switch (voiceState) {
      case 'listening':
        return 'Listening to you speak...'
      case 'speaking':
        return 'Speakly AI is speaking...'
      case 'processing':
        return 'Evaluating grammar & phrasing...'
      default:
        return 'Tap microphone to speak'
    }
  }

  return (
    <div className={cn('flex flex-col h-full space-y-3', className)}>
      {/* Session Header / Scenario Selector */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md">
        <button
          onClick={onOpenTopicsModal}
          className="flex items-center gap-2 text-left group focus:outline-none min-w-0"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <span>Scenario</span>
              <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="text-xs font-semibold text-zinc-100 truncate group-hover:text-indigo-300 transition-colors">
              {activeTopic.title}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="indigo" className="text-[10px]">
            {activeTopic.difficulty}
          </Badge>
          <button
            onClick={resetSession}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Partner Ambient State Bar */}
      <div className="flex flex-col items-center justify-center py-2 px-4 rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 border border-zinc-800/60">
        <div className="relative mb-2">
          {/* Ambient AI breathing orb */}
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
              voiceState === 'speaking'
                ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-violet-500/40 scale-105'
                : voiceState === 'listening'
                ? 'bg-gradient-to-tr from-indigo-500 to-cyan-500 shadow-indigo-500/40 ring-4 ring-indigo-500/20'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
            )}
          >
            {voiceState === 'speaking' ? (
              <Volume2 className="w-6 h-6 text-white animate-pulse" />
            ) : (
              <Sparkles className="w-5 h-5 text-indigo-300" />
            )}
          </div>
        </div>

        <div className="text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              voiceState === 'listening'
                ? 'bg-emerald-400 animate-ping'
                : voiceState === 'speaking'
                ? 'bg-violet-400 animate-pulse'
                : 'bg-indigo-400'
            )}
          />
          {getStatusText()}
        </div>

        <VoiceVisualizer voiceState={voiceState} audioLevel={audioLevel} />
      </div>

      {/* Messages Stream */}
      <div className="flex-1 min-h-[220px] max-h-[380px] overflow-y-auto space-y-3 pr-1">
        {session.messages.map((message) => {
          const isAi = (message.sender || message.speaker) === 'ai'

          return (
            <div
              key={message.id}
              className={cn(
                'flex flex-col max-w-[88%]',
                isAi ? 'mr-auto items-start' : 'ml-auto items-end'
              )}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-semibold text-zinc-500">
                  {isAi ? 'Speakly AI' : 'You'}
                </span>
                <span className="text-[9px] text-zinc-600">{message.timestamp}</span>
              </div>

              <div
                className={cn(
                  'rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm',
                  isAi
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm'
                    : 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-600/20'
                )}
              >
                {message.text}
              </div>

              {/* Instant corrections attached if any */}
              {message.corrections && message.corrections.length > 0 && (
                <div className="w-full">
                  {message.corrections.map((corr) => (
                    <CorrectionCard key={corr.id} correction={corr} />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Live spoken preview transcription while listening */}
        {voiceState === 'listening' && transcript && (
          <div className="ml-auto max-w-[85%] flex flex-col items-end">
            <span className="text-[10px] text-indigo-400 mb-0.5">Hearing you...</span>
            <div className="rounded-2xl px-3.5 py-2 text-xs bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 animate-pulse">
              "{transcript}"
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested speaking prompt chips (Learner friendly scaffold) */}
      <div className="pt-1">
        <div className="text-[11px] text-zinc-500 font-medium mb-1.5 px-1 flex items-center justify-between">
          <span>Need ideas? Tap to say:</span>
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className="text-indigo-400 hover:text-indigo-300 text-[11px] transition-colors"
          >
            {showTextInput ? 'Use voice' : 'Type instead'}
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          {activeTopic.suggestedPhrases.map((phrase: string, i: number) => (
            <button
              key={i}
              onClick={() => handleChipClick(phrase)}
              className="shrink-0 text-left text-[11px] text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 hover:text-white border border-zinc-800 px-2.5 py-1.5 rounded-xl transition-colors active:scale-95"
            >
              "{phrase}"
            </button>
          ))}
        </div>
      </div>

      {/* Text fallback input or Voice mic controls */}
      {showTextInput ? (
        <form onSubmit={handleTextSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="Type your response here..."
            className="flex-1 h-12 px-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
          />
          <Button
            type="submit"
            size="md"
            className="h-12 w-12 p-0 shrink-0"
            disabled={!typedInput.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      ) : (
        /* Giant thumb-friendly mobile speak button */
        <div className="flex flex-col items-center justify-center pt-2 pb-1">
          <button
            onClick={toggleListening}
            className={cn(
              'relative w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 focus:outline-none',
              voiceState === 'listening'
                ? 'bg-red-500 text-white shadow-xl shadow-red-500/40 ring-8 ring-red-500/20'
                : 'bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50'
            )}
            aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start speaking'}
          >
            {/* Ambient ripple circles when listening */}
            {voiceState === 'listening' && (
              <>
                <span className="absolute inset-0 rounded-full bg-red-400/40 animate-ping" />
                <span className="absolute -inset-2 rounded-full border border-red-400/30 animate-pulse" />
              </>
            )}

            {voiceState === 'listening' ? (
              <MicOff className="w-8 h-8 relative z-10" />
            ) : (
              <Mic className="w-8 h-8 relative z-10" />
            )}
          </button>
          <span className="text-[11px] font-medium text-zinc-400 mt-2">
            {voiceState === 'listening' ? 'Tap to finish speaking' : 'Tap & speak naturally'}
          </span>
        </div>
      )}
    </div>
  )
}
