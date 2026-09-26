import { FeatureAccessPolicy } from '../../types/index.js'

export interface IFeatureAccessService {
  canUsePractice(userId?: string): Promise<boolean>
  getDailyLimit(userId?: string): Promise<{ usedMinutes: number; totalMinutes: number; isUnlimited: boolean }>
  canAccessMode(modeId: string, userId?: string): Promise<boolean>
  getPolicy(userId?: string): Promise<FeatureAccessPolicy>
}

class FreeTierFeatureAccessService implements IFeatureAccessService {
  async canUsePractice(_userId?: string): Promise<boolean> {
    // Current policy: everything is free and accessible
    return true
  }

  async getDailyLimit(_userId?: string): Promise<{ usedMinutes: number; totalMinutes: number; isUnlimited: boolean }> {
    return {
      usedMinutes: 0,
      totalMinutes: 9999,
      isUnlimited: true,
    }
  }

  async canAccessMode(_modeId: string, _userId?: string): Promise<boolean> {
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

export const featureAccessService: IFeatureAccessService = new FreeTierFeatureAccessService()
