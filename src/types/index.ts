export type Speaker = 'ai' | 'user'

export type SpeakingState = 'idle' | 'listening' | 'processing' | 'speaking'

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface User {
  id: string
  name: string
  email: string
  targetLevel: DifficultyLevel
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  targetLevel: DifficultyLevel
  createdAt: string
  isGuest?: boolean
}

export interface Correction {
  id: string
  original: string
  suggested: string
  explanation: string
  rule?: string
  betterSentence?: string
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'naturalness'
}

export interface ConversationMessage {
  id: string
  sender: Speaker
  speaker?: Speaker // backwards compatibility
  text: string
  timestamp: string
  audioUrl?: string
  corrections?: Correction[]
}

export type Message = ConversationMessage

export interface PracticeMode {
  id: string
  title: string
  description: string
  difficulty: DifficultyLevel
  icon: string
  promptStarter: string
  contextPrompt?: string
  suggestedPhrases: string[]
  colorTheme?: string
}

export interface PracticeTopic extends PracticeMode {
  category: 'Casual' | 'Professional' | 'Travel' | 'Academic'
  durationMinutes: number
}

export interface SessionFeedback {
  overallScore: number
  fluencyScore: number
  grammarScore: number
  vocabularyScore: number
  corrections: Correction[]
  positiveNotes: string[]
  summaryReview: string
}

export interface PracticeFeedback extends SessionFeedback {
  id: string
  sessionId: string
  createdAt: string
}

export interface ConversationSession {
  id: string
  mode: PracticeMode
  startTime: number | string
  endTime?: number
  durationSeconds: number
  messages: ConversationMessage[]
  feedback?: SessionFeedback
  status: 'active' | 'completed'
  topicId?: string
  topicTitle?: string
}

export type PracticeSession = ConversationSession
export type VoiceState = SpeakingState

export interface SessionHistoryItem {
  id: string
  date: string
  modeTitle: string
  durationSeconds: number
  score: number
  correctionsCount: number
}

export interface UserProgressStats {
  totalSessions: number
  totalSpeakingTimeSeconds: number
  currentStreak: number
  averageScore: number
  recentSessions: SessionHistoryItem[]
}

// Entitlement / Feature Access Abstraction
export interface FeatureAccessPolicy {
  canUsePractice: boolean
  usedMinutes: number
  totalMinutes: number
  isUnlimited: boolean
  accessibleModes: string[]
}

export interface UserStats {
  currentStreak: number
  totalMinutesSpoken: number
  sessionsCompleted: number
  wordsPracticed: number
  fluencyScore: number
}

// Future Subscription & Monetization Contracts
export type PlanTier = 'free' | 'pro' | 'unlimited'
export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'past_due'

export interface Plan {
  id: string
  name: string
  tier: PlanTier
  monthlyMinutes: number
  isUnlimited: boolean
  features: string[]
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: SubscriptionStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export interface UsageRecord {
  id: string
  userId: string
  sessionId: string
  durationSeconds: number
  recordedAt: string
}

export interface Entitlement {
  canAccessPractice: boolean
  planTier: PlanTier
  isUnlimited: boolean
  remainingSeconds: number
}
