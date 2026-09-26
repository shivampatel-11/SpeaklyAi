import React, { useState, useEffect, useRef } from 'react'
import {
  PracticeMode,
  ConversationSession,
  SpeakingState,
  SessionFeedback,
} from '@/types'
import { conversationService } from '@/services/conversationService'
import { speechService } from '@/services/speechService'
import { VoiceVisualizer } from './VoiceVisualizer'
import { CorrectionCard } from './CorrectionCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import {
  ChevronLeft,
  Mic,
  MicOff,
  PhoneOff,
  Keyboard,
  Send,
  Sparkles,
  Volume2,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActiveConversationViewProps {
  mode: PracticeMode
  onBack: () => void
  onEndSession: (feedback: SessionFeedback, session: ConversationSession) => void
  className?: string
}

export const ActiveConversationView: React.FC<ActiveConversationViewProps> = ({
  mode,
  onBack,
  onEndSession,
  className,
}) => {
  const [session, setSession] = useState<ConversationSession | null>(null)
  const [speakingState, setSpeakingState] = useState<SpeakingState>('idle')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [audioLevel, setAudioLevel] = useState<number>(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isEnding, setIsEnding] = useState(false)
  const [isTextModalOpen, setIsTextModalOpen] = useState(false)
  const [manualText, setManualText] = useState('')
  const [initError, setInitError] = useState(false)
  const [micDeniedModalOpen, setMicDeniedModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const timerRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Start session on mount
  useEffect(() => {
    let isCancelled = false

    conversationService
      .startSession(mode)
      .then((newSession) => {
        if (!isCancelled) {
          setSession(newSession)
          // Speak initial prompt
          setSpeakingState('speaking')
          speechService.speakText(mode.promptStarter, () => {
            if (!isCancelled) setSpeakingState('idle')
          })
        }
      })
      .catch((err) => {
        console.error('Session startup failure:', err)
        if (!isCancelled) setInitError(true)
      })

    // Start session timer
    timerRef.current = window.setInterval(() => {
      setElapsedSeconds((sec) => sec + 1)
    }, 1000)

    return () => {
      isCancelled = true
      speechService.cancelSpeech()
      speechService.stopListening()
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [mode])

  // Audio wave visualizer animation
  useEffect(() => {
    let phase = 0

    if (speakingState === 'listening' || speakingState === 'speaking') {
      const animateWave = () => {
        phase += 0.16
        const baseLevel = speakingState === 'speaking' ? 0.75 : 0.5
        const wave = baseLevel + Math.sin(phase) * 0.3 + (Math.random() * 0.2 - 0.1)
        setAudioLevel(Math.max(0.1, Math.min(1, wave)))
        animationFrameRef.current = requestAnimationFrame(animateWave)
      }
      animationFrameRef.current = requestAnimationFrame(animateWave)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [speakingState])

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle User Input Submission
  const handleUserSpeechSubmit = async (userText: string) => {
    if (!session || !userText.trim()) return

    setErrorMessage(null)
    setLiveTranscript('')
    setSpeakingState('processing')

    try {
      const { replyMessage } = await conversationService.sendMessage(session.id, userText)

      // Refresh local session reference
      const updated = conversationService.getSession(session.id)
      if (updated) {
        setSession({ ...updated })
      }

      // Speak AI response
      setSpeakingState('speaking')
      speechService.speakText(replyMessage.text, () => {
        setSpeakingState('idle')
      })
    } catch {
      setSpeakingState('idle')
      setErrorMessage('Something went wrong.')
    }
  }

  // Microphone toggle button
  const toggleListening = () => {
    setErrorMessage(null)
    if (speakingState === 'listening') {
      speechService.stopListening()
      setSpeakingState('idle')
      if (liveTranscript && liveTranscript.trim()) {
        handleUserSpeechSubmit(liveTranscript.trim())
      }
    } else {
      speechService.cancelSpeech()
      setSpeakingState('listening')
      setLiveTranscript('')

      speechService.startListening(
        (transcript, isFinal) => {
          setLiveTranscript(transcript)
          if (isFinal && transcript.trim()) {
            speechService.stopListening()
            handleUserSpeechSubmit(transcript.trim())
          }
        },
        (err) => {
          console.warn('Speech capture note:', err)
          setSpeakingState('idle')
          if (err && (err.includes('denied') || err.includes('permission') || err.includes('not-allowed'))) {
            setMicDeniedModalOpen(true)
          } else {
            setErrorMessage('Microphone unavailable.')
          }
        }
      )
    }
  }

  // End Session flow
  const handleEndSessionClick = async () => {
    if (!session || isEnding) return
    setIsEnding(true)
    speechService.cancelSpeech()
    speechService.stopListening()

    const feedback = await conversationService.endSession(session.id)
    onEndSession(feedback, session)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualText.trim()) {
      handleUserSpeechSubmit(manualText)
      setManualText('')
      setIsTextModalOpen(false)
    }
  }

  // Find latest messages
  const lastAiMessage = session?.messages.filter((m) => m.sender === 'ai').slice(-1)[0]
  const lastUserMessage = session?.messages.filter((m) => m.sender === 'user').slice(-1)[0]

  const getAssistantStatusText = () => {
    switch (speakingState) {
      case 'listening':
        return 'Listening...'
      case 'speaking':
        return 'Speaking...'
      case 'processing':
        return 'Thinking...'
      default:
        return 'Tap to speak'
    }
  }

  if (initError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <ErrorState
          title="Something went wrong."
          message="Unable to initialize voice session."
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <LoadingState message="Preparing..." />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-[calc(100vh-5.5rem)] justify-between pb-2', className)}>
      {/* 1. TOP BAR */}
      <div className="flex items-center justify-between px-1 py-2 border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md rounded-2xl mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          aria-label="Back to modes"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs font-medium">Exit</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-zinc-100 tracking-tight">{mode.title}</span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-400">
            <Clock className="w-3 h-3 text-indigo-400/80" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        <Button
          size="sm"
          variant="danger"
          onClick={handleEndSessionClick}
          isLoading={isEnding}
          className="h-8 px-2.5 text-xs rounded-xl"
          leftIcon={<PhoneOff className="w-3.5 h-3.5" />}
        >
          End
        </Button>
      </div>

      {/* Inline Error Banner */}
      {errorMessage && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 mx-1 mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-red-400 hover:text-red-200 px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. MIDDLE AREA: Modern Voice Assistant Orb + Current AI Message */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-3 py-2 space-y-5 my-auto">
        {/* Siri / ChatGPT Voice Style Ambient Orb */}
        <div className="relative flex items-center justify-center">
          {/* Animated Ambient Rings */}
          <div
            className={cn(
              'absolute rounded-full transition-all duration-700 pointer-events-none',
              speakingState === 'speaking'
                ? 'w-44 h-44 bg-violet-600/20 blur-xl animate-pulse'
                : speakingState === 'listening'
                ? 'w-48 h-48 bg-indigo-500/25 blur-2xl animate-ping'
                : speakingState === 'processing'
                ? 'w-36 h-36 bg-cyan-500/20 blur-lg animate-pulse'
                : 'w-32 h-32 bg-indigo-500/10 blur-xl'
            )}
          />

          <div
            className={cn(
              'absolute rounded-full border transition-all duration-500 pointer-events-none',
              speakingState === 'speaking'
                ? 'w-36 h-36 border-violet-500/40 animate-spin'
                : speakingState === 'listening'
                ? 'w-40 h-40 border-indigo-400/50 scale-105'
                : 'w-28 h-28 border-zinc-800/80'
            )}
            style={{ animationDuration: '8s' }}
          />

          {/* Central Fluid Glowing Orb */}
          <div
            className={cn(
              'relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl z-10',
              speakingState === 'speaking'
                ? 'bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-indigo-500 shadow-violet-500/50 scale-105'
                : speakingState === 'listening'
                ? 'bg-gradient-to-tr from-indigo-500 via-cyan-400 to-blue-600 shadow-indigo-500/50 ring-4 ring-indigo-500/30'
                : speakingState === 'processing'
                ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-cyan-500/30 animate-pulse'
                : 'bg-gradient-to-tr from-zinc-800 via-zinc-900 to-zinc-800 border border-zinc-700 shadow-black'
            )}
          >
            {speakingState === 'speaking' ? (
              <Volume2 className="w-9 h-9 text-white animate-pulse" />
            ) : speakingState === 'listening' ? (
              <Mic className="w-9 h-9 text-white animate-pulse" />
            ) : (
              <Sparkles className="w-8 h-8 text-indigo-300" />
            )}
          </div>
        </div>

        {/* Subtle Waveform Animation when AI is speaking */}
        <VoiceVisualizer voiceState={speakingState} audioLevel={audioLevel} />

        {/* Current AI Message Card */}
        <div className="max-w-sm mx-auto space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400/90 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Speakly Partner</span>
          </div>

          <p className="text-base sm:text-lg font-medium text-zinc-100 leading-relaxed px-2">
            "{lastAiMessage?.text || mode.promptStarter}"
          </p>

          {/* Spoken user transcription preview if just spoken or actively listening */}
          {liveTranscript && (
            <div className="pt-1">
              <span className="text-[10px] text-zinc-500">Transcribing...</span>
              <p className="text-xs text-indigo-300 font-medium italic animate-pulse">
                "{liveTranscript}"
              </p>
            </div>
          )}

          {/* If the last user message had a correction, display it right here */}
          {!liveTranscript && lastUserMessage?.corrections && lastUserMessage.corrections.length > 0 && (
            <div className="pt-1 max-w-xs mx-auto">
              <CorrectionCard correction={lastUserMessage.corrections[0]} />
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM AREA: Large Voice Assistant Mic, Status & Controls */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-2">
        {/* Suggested tap prompt chips */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar justify-center px-2">
          {mode.suggestedPhrases.slice(0, 2).map((phrase, i) => (
            <button
              key={i}
              onClick={() => handleUserSpeechSubmit(phrase)}
              className="text-[11px] text-zinc-400 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/80 px-2.5 py-1.5 rounded-xl truncate max-w-[190px] transition-colors active:scale-95"
            >
              "{phrase}"
            </button>
          ))}
        </div>

        {/* Real Voice Assistant Large Microphone Button */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing Ripple Rings */}
          {speakingState === 'listening' && (
            <>
              <span className="absolute w-24 h-24 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />
              <span className="absolute w-28 h-28 rounded-full border border-indigo-500/40 animate-pulse pointer-events-none" />
            </>
          )}

          <button
            onClick={toggleListening}
            className={cn(
              'relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 focus:outline-none shadow-2xl z-20 cursor-pointer',
              speakingState === 'listening'
                ? 'bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-indigo-500/60 ring-4 ring-indigo-500/30 scale-105'
                : 'bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105'
            )}
            aria-label={speakingState === 'listening' ? 'Stop listening' : 'Tap to speak'}
          >
            {speakingState === 'listening' ? (
              <MicOff className="w-9 h-9" />
            ) : (
              <Mic className="w-9 h-9" />
            )}
          </button>
        </div>

        {/* Assistant status text */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-zinc-300">
            {getAssistantStatusText()}
          </span>
        </div>

        {/* Secondary controls: Fallback text button + End session */}
        <div className="flex items-center justify-center gap-4 pt-1">
          <button
            onClick={() => setIsTextModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 p-2 rounded-xl transition-colors"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Type instead</span>
          </button>

          <span className="text-zinc-700">•</span>

          <button
            onClick={handleEndSessionClick}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 p-2 rounded-xl transition-colors"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* Text fallback input modal */}
      <Modal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        title="Type reply"
      >
        <form onSubmit={handleManualSubmit} className="space-y-3 mt-2">
          <textarea
            rows={3}
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsTextModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!manualText.trim()}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send
            </Button>
          </div>
        </form>
      </Modal>

      {/* Microphone Permission Modal */}
      <Modal
        isOpen={micDeniedModalOpen}
        onClose={() => setMicDeniedModalOpen(false)}
        title="Microphone unavailable."
      >
        <div className="space-y-4 pt-1 text-center">
          <p className="text-xs text-zinc-400">
            Check your browser permissions to allow audio.
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setMicDeniedModalOpen(false)
                toggleListening()
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Try Again
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setMicDeniedModalOpen(false)
                setIsTextModalOpen(true)
              }}
              leftIcon={<Keyboard className="w-3.5 h-3.5" />}
            >
              Type reply
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
