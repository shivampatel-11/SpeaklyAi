export type Speaker = 'ai' | 'user'

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface User {
  id: string
  name: string
  email: string
  targetLevel: DifficultyLevel
  passwordHash: string
  salt: string
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  targetLevel: DifficultyLevel
  createdAt: string
}

export interface PracticeMode {
  id: string
  title: string
  description: string
  difficulty: DifficultyLevel
  promptStarter: string
  contextPrompt?: string
}

export interface Correction {
  id: string
  original: string
  suggested: string
  explanation: string
  betterSentence: string
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'naturalness'
}

export interface ConversationMessage {
  id: string
  sender: Speaker
  text: string
  timestamp: string
  correction?: Correction
}

export interface PracticeFeedback {
  id: string
  sessionId: string
  overallScore: number
  fluencyScore: number
  grammarScore: number
  vocabularyScore: number
  summaryReview: string
  positiveNotes: string[]
  corrections: Correction[]
  createdAt: string
}

export interface ConversationSession {
  id: string
  userId: string
  mode: PracticeMode
  startTime: number
  endTime?: number
  durationSeconds: number
  messages: ConversationMessage[]
  feedback?: PracticeFeedback
  status: 'active' | 'completed'
}

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

// Entitlement / Feature Access
export interface FeatureAccessPolicy {
  canUsePractice: boolean
  usedMinutes: number
  totalMinutes: number
  isUnlimited: boolean
  accessibleModes: string[]
}

// AI Service contracts
export interface AIConversationContext {
  mode: PracticeMode
  history: ConversationMessage[]
  userText: string
}

export interface AIResponseResult {
  reply: string
  correction: string | null
  explanation: string | null
  betterSentence: string | null
}

export interface AIFeedbackResult {
  overallScore: number
  fluencyScore: number
  grammarScore: number
  vocabularyScore: number
  summaryReview: string
  positiveNotes: string[]
  corrections: Correction[]
}

// HTTP API Request / Response schemas
export interface StartConversationRequest {
  userId?: string
  mode: PracticeMode
}

export interface StartConversationResponse {
  session: ConversationSession
  initialMessage: ConversationMessage
}

export interface SendMessageRequest {
  sessionId: string
  userText: string
}

export interface SendMessageResponse {
  reply: string
  correction: string | null
  explanation: string | null
  betterSentence: string | null
  replyMessage: ConversationMessage
  corrections: Correction[]
}

export interface EndConversationRequest {
  sessionId: string
}

export interface EndConversationResponse {
  feedback: PracticeFeedback
  session: ConversationSession
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: UserProfile
  token: string
}

// ==========================================
// Future Subscription & Monetization Contracts
// ==========================================
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

