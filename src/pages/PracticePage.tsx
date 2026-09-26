import React, { useState } from 'react'
import {
  PracticeMode,
  ConversationSession,
  SessionFeedback,
} from '@/types'
import { PRACTICE_MODES } from '@/config/modes'
import { ModeSelector } from '@/features/practice/ModeSelector'
import { ActiveConversationView } from '@/features/practice/ActiveConversationView'
import { SessionFeedbackView } from '@/features/practice/SessionFeedbackView'

type PracticeStage = 'select-mode' | 'conversation' | 'feedback'

interface PracticePageProps {
  initialMode?: PracticeMode
  onNavigateHome?: () => void
}

export const PracticePage: React.FC<PracticePageProps> = ({
  initialMode,
  onNavigateHome,
}) => {
  const [stage, setStage] = useState<PracticeStage>(initialMode ? 'conversation' : 'select-mode')
  const [selectedMode, setSelectedMode] = useState<PracticeMode>(initialMode || PRACTICE_MODES[0])
  const [sessionKey, setSessionKey] = useState(1)
  const [feedback, setFeedback] = useState<SessionFeedback | null>(null)
  const [lastSession, setLastSession] = useState<ConversationSession | null>(null)

  // 1. Choose Mode -> Start Conversation
  const handleSelectMode = (mode: PracticeMode) => {
    setSelectedMode(mode)
    setSessionKey((k) => k + 1)
    setStage('conversation')
  }

  // 2. Conversation -> End Session -> Feedback
  const handleEndSession = (sessionFeedback: SessionFeedback, session: ConversationSession) => {
    setFeedback(sessionFeedback)
    setLastSession(session)
    setStage('feedback')
  }

  // 3. Feedback -> Practice Again
  const handlePracticeAgain = () => {
    setSessionKey((k) => k + 1)
    setStage('conversation')
  }

  // 4. Feedback -> Choose Another Mode
  const handleChooseAnotherMode = () => {
    setStage('select-mode')
  }

  return (
    <div className="h-full">
      {stage === 'select-mode' && (
        <ModeSelector onSelectMode={handleSelectMode} />
      )}

      {stage === 'conversation' && (
        <ActiveConversationView
          key={`${selectedMode.id}-${sessionKey}`}
          mode={selectedMode}
          onBack={() => setStage('select-mode')}
          onEndSession={handleEndSession}
        />
      )}

      {stage === 'feedback' && feedback && lastSession && (
        <SessionFeedbackView
          feedback={feedback}
          session={lastSession}
          mode={selectedMode}
          onPracticeAgain={handlePracticeAgain}
          onChooseAnotherMode={handleChooseAnotherMode}
          onHome={onNavigateHome || handleChooseAnotherMode}
        />
      )}
    </div>
  )
}
