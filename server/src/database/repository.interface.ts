import {
  User,
  ConversationSession,
  ConversationMessage,
  PracticeFeedback,
  Plan,
  Subscription,
  UsageRecord,
} from '../types/index.js'

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<User>
  update(id: string, updates: Partial<User>): Promise<User | null>
}

export interface IConversationRepository {
  findById(id: string): Promise<ConversationSession | null>
  create(session: ConversationSession): Promise<ConversationSession>
  update(id: string, updates: Partial<ConversationSession>): Promise<ConversationSession | null>
  addMessage(sessionId: string, message: ConversationMessage): Promise<ConversationSession | null>
  findByUserId(userId: string): Promise<ConversationSession[]>
}

export interface IFeedbackRepository {
  findBySessionId(sessionId: string): Promise<PracticeFeedback | null>
  create(feedback: PracticeFeedback): Promise<PracticeFeedback>
  findByUserId(userId: string): Promise<PracticeFeedback[]>
}

export interface ISubscriptionRepository {
  findByUserId(userId: string): Promise<Subscription | null>
  createOrUpdate(subscription: Subscription): Promise<Subscription>
  getDefaultPlan(): Plan
}

export interface IUsageRepository {
  recordUsage(record: UsageRecord): Promise<UsageRecord>
  getTotalSpokenSeconds(userId: string, sinceDate?: string): Promise<number>
}
