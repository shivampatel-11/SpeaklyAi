import { subscriptionRepository, usageRepository } from '../database/store.js'
import { Entitlement, UsageRecord } from '../types/index.js'

/**
 * Subscription & Entitlement Service
 * Provides clean abstractions for future billing/monetization.
 * Currently defaults to 100% active free access for all students.
 */
export class SubscriptionService {
  async getEntitlement(userId: string): Promise<Entitlement> {
    const subscription = await subscriptionRepository.findByUserId(userId)
    const plan = subscriptionRepository.getDefaultPlan()

    return {
      canAccessPractice: subscription?.status === 'active',
      planTier: plan.tier,
      isUnlimited: plan.isUnlimited,
      remainingSeconds: 999999, // Full free access
    }
  }

  async recordSessionUsage(
    userId: string,
    sessionId: string,
    durationSeconds: number
  ): Promise<UsageRecord> {
    const record: UsageRecord = {
      id: `usage_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      sessionId,
      durationSeconds,
      recordedAt: new Date().toISOString(),
    }

    return usageRepository.recordUsage(record)
  }
}

export const subscriptionService = new SubscriptionService()
