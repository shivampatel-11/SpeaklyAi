import { FeatureAccessPolicy } from '@/types'

export interface IFeatureAccessService {
  canUsePractice(userId?: string): Promise<boolean>
  getDailyLimit(userId?: string): Promise<{ usedMinutes: number; totalMinutes: number; isUnlimited: boolean }>
  canAccessMode(modeId: string, userId?: string): Promise<boolean>
  getPolicy(userId?: string): Promise<FeatureAccessPolicy>
}

class FreeTierFeatureAccessService implements IFeatureAccessService {
  async canUsePractice(_userId?: string): Promise<boolean> {
    // Current MVP policy: 100% Free
    return true
  }

  async getDailyLimit(_userId?: string): Promise<{
    usedMinutes: number
    totalMinutes: number
    isUnlimited: boolean
  }> {
    return {
      usedMinutes: 0,
      totalMinutes: 9999,
      isUnlimited: true,
    }
  }

  async canAccessMode(_modeId: string, _userId?: string): Promise<boolean> {
    // All 4 modes are free
    return true
  }

  async getPolicy(_userId?: string): Promise<FeatureAccessPolicy> {
    return {
      canUsePractice: true,
      usedMinutes: 0,
      totalMinutes: 9999,
      isUnlimited: true,
      accessibleModes: ['daily-conversation', 'job-interview', 'college-conversation', 'free-talk'],
    }
  }
}

export const featureAccess: IFeatureAccessService = new FreeTierFeatureAccessService()
