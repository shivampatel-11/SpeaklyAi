import {
  User,
  ConversationSession,
  ConversationMessage,
  PracticeFeedback,
  Plan,
  Subscription,
  UsageRecord,
} from '../types/index.js'
import {
  IUserRepository,
  IConversationRepository,
  IFeedbackRepository,
  ISubscriptionRepository,
  IUsageRepository,
} from './repository.interface.js'
import { hashPassword } from '../utils/security.js'

class MemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map()

  constructor() {
    this.seedDefaultUser()
  }

  private seedDefaultUser() {
    const { hash, salt } = hashPassword('password123')
    const defaultUser: User = {
      id: 'usr_alex_rivera',
      name: 'Alex Rivera',
      email: 'alex@speakly.ai',
      targetLevel: 'Intermediate',
      passwordHash: hash,
      salt: salt,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    }
    this.users.set(defaultUser.id, defaultUser)
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim()
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user
      }
    }
    return null
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user)
    return user
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const existing = this.users.get(id)
    if (!existing) return null
    const updated = { ...existing, ...updates }
    this.users.set(id, updated)
    return updated
  }
}

class MemoryConversationRepository implements IConversationRepository {
  private sessions: Map<string, ConversationSession> = new Map()

  constructor() {
    this.seedDefaultSessions()
  }

  private seedDefaultSessions() {
    const now = Date.now()
    const seeded: ConversationSession[] = [
      {
        id: 'sess_seed_1',
        userId: 'usr_alex_rivera',
        mode: {
          id: 'daily-conversation',
          title: 'Daily Conversation',
          description: 'Everyday small talk',
          difficulty: 'Beginner',
          promptStarter: 'Hey there! How has your day been treating you so far?',
        },
        startTime: now - 3600000 * 24 * 2, // 2 days ago
        endTime: now - 3600000 * 24 * 2 + 180000,
        durationSeconds: 180, // 3 mins
        status: 'completed',
        messages: [],
        feedback: {
          id: 'fb_seed_1',
          sessionId: 'sess_seed_1',
          overallScore: 88,
          fluencyScore: 90,
          grammarScore: 85,
          vocabularyScore: 89,
          summaryReview: 'Great pacing and confident responses!',
          positiveNotes: ['Quick reply cadence', 'Natural transitions'],
          corrections: [
            {
              id: 'corr_seed_1',
              original: 'I am agree with you.',
              suggested: 'I agree with you.',
              explanation: '"Agree" is a verb in English.',
              betterSentence: 'I agree with you completely.',
              type: 'grammar',
            },
          ],
          createdAt: new Date(now - 3600000 * 24 * 2).toISOString(),
        },
      },
      {
        id: 'sess_seed_2',
        userId: 'usr_alex_rivera',
        mode: {
          id: 'job-interview',
          title: 'Job Interview',
          description: 'Behavioral and technical questions',
          difficulty: 'Intermediate',
          promptStarter: 'Good morning! Thanks for joining us today.',
        },
        startTime: now - 3600000 * 24 * 1, // yesterday
        endTime: now - 3600000 * 24 * 1 + 240000,
        durationSeconds: 240, // 4 mins
        status: 'completed',
        messages: [],
        feedback: {
          id: 'fb_seed_2',
          sessionId: 'sess_seed_2',
          overallScore: 92,
          fluencyScore: 94,
          grammarScore: 90,
          vocabularyScore: 92,
          summaryReview: 'Strong structure and clear explanations.',
          positiveNotes: ['Articulate vocabulary', 'Excellent professional tone'],
          corrections: [],
          createdAt: new Date(now - 3600000 * 24 * 1).toISOString(),
        },
      },
    ]

    for (const s of seeded) {
      this.sessions.set(s.id, s)
    }
  }

  async findById(id: string): Promise<ConversationSession | null> {
    return this.sessions.get(id) || null
  }

  async create(session: ConversationSession): Promise<ConversationSession> {
    this.sessions.set(session.id, session)
    return session
  }

  async update(
    id: string,
    updates: Partial<ConversationSession>
  ): Promise<ConversationSession | null> {
    const existing = this.sessions.get(id)
    if (!existing) return null
    const updated = { ...existing, ...updates }
    this.sessions.set(id, updated)
    return updated
  }

  async addMessage(
    sessionId: string,
    message: ConversationMessage
  ): Promise<ConversationSession | null> {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    session.messages.push(message)
    this.sessions.set(sessionId, session)
    return session
  }

  async findByUserId(userId: string): Promise<ConversationSession[]> {
    return Array.from(this.sessions.values())
      .filter((s) => s.userId === userId || (!s.userId && userId === 'usr_alex_rivera'))
      .sort((a, b) => (b.startTime || 0) - (a.startTime || 0))
  }
}

class MemoryFeedbackRepository implements IFeedbackRepository {
  private feedbacks: Map<string, PracticeFeedback> = new Map()

  async findBySessionId(sessionId: string): Promise<PracticeFeedback | null> {
    for (const feedback of this.feedbacks.values()) {
      if (feedback.sessionId === sessionId) return feedback
    }
    return null
  }

  async create(feedback: PracticeFeedback): Promise<PracticeFeedback> {
    this.feedbacks.set(feedback.id, feedback)
    return feedback
  }

  async findByUserId(_userId: string): Promise<PracticeFeedback[]> {
    return Array.from(this.feedbacks.values())
  }
}

// Future Subscription & Monetization Repositories
const DEFAULT_FREE_PLAN: Plan = {
  id: 'plan_free',
  name: 'Free',
  tier: 'free',
  monthlyMinutes: 999999, // All users currently have full access
  isUnlimited: true,
  features: [
    'Unlimited conversation practice',
    'Real-time grammar corrections',
    'Pronunciation & fluency coaching',
  ],
}

class MemorySubscriptionRepository implements ISubscriptionRepository {
  private subscriptions: Map<string, Subscription> = new Map()

  async findByUserId(userId: string): Promise<Subscription | null> {
    const sub = this.subscriptions.get(userId)
    if (sub) return sub

    // Default to active Free plan for all users
    const defaultSub: Subscription = {
      id: `sub_${userId}_free`,
      userId,
      planId: DEFAULT_FREE_PLAN.id,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 365 * 86400000).toISOString(),
      cancelAtPeriodEnd: false,
    }
    this.subscriptions.set(userId, defaultSub)
    return defaultSub
  }

  async createOrUpdate(subscription: Subscription): Promise<Subscription> {
    this.subscriptions.set(subscription.userId, subscription)
    return subscription
  }

  getDefaultPlan(): Plan {
    return DEFAULT_FREE_PLAN
  }
}

class MemoryUsageRepository implements IUsageRepository {
  private records: UsageRecord[] = []

  async recordUsage(record: UsageRecord): Promise<UsageRecord> {
    this.records.push(record)
    return record
  }

  async getTotalSpokenSeconds(userId: string, sinceDate?: string): Promise<number> {
    const sinceTime = sinceDate ? new Date(sinceDate).getTime() : 0
    return this.records
      .filter((r) => r.userId === userId && new Date(r.recordedAt).getTime() >= sinceTime)
      .reduce((sum, r) => sum + r.durationSeconds, 0)
  }
}

export const userRepository: IUserRepository = new MemoryUserRepository()
export const conversationRepository: IConversationRepository = new MemoryConversationRepository()
export const feedbackRepository: IFeedbackRepository = new MemoryFeedbackRepository()
export const subscriptionRepository: ISubscriptionRepository = new MemorySubscriptionRepository()
export const usageRepository: IUsageRepository = new MemoryUsageRepository()

// In-memory active session tokens store (mapping token -> userId)
export const sessionTokenStore = new Map<string, string>([
  ['demo_token_alex', 'usr_alex_rivera'],
])
