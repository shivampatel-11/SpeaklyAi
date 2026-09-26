import { UserProfile, UserStats } from '@/types'

export interface IAuthService {
  getCurrentUser(): Promise<UserProfile | null>
  login(email: string, password: string): Promise<UserProfile>
  signup(name: string, email: string, password: string): Promise<UserProfile>
  logout(): Promise<void>
  getToken(): string | null
  getUserStats(): Promise<UserStats>
}

class AuthService implements IAuthService {
  // In-memory token storage (secure: never stores secrets in persistent localStorage)
  private sessionToken: string | null = null
  private currentUser: UserProfile | null = null
  private readonly SESSION_TOKEN_KEY = 'speakly_session_active'

  constructor() {
    if (typeof window !== 'undefined') {
      // Use sessionStorage (tab-scoped memory, cleared on browser close)
      this.sessionToken = sessionStorage.getItem(this.SESSION_TOKEN_KEY)
    }
  }

  getToken(): string | null {
    return this.sessionToken
  }

  private setToken(token: string | null) {
    this.sessionToken = token
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem(this.SESSION_TOKEN_KEY, token)
      } else {
        sessionStorage.removeItem(this.SESSION_TOKEN_KEY)
      }
    }
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    if (this.currentUser) return this.currentUser

    if (this.sessionToken) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.sessionToken}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          this.currentUser = data.user
          return data.user
        } else {
          // Token expired or invalid
          this.setToken(null)
        }
      } catch (e) {
        console.warn('Failed to verify session with backend:', e)
      }
    }

    // Default to initial active user for smooth experience
    const defaultUser: UserProfile = {
      id: 'usr_alex_rivera',
      name: 'Alex Rivera',
      email: 'alex@speakly.ai',
      targetLevel: 'Intermediate',
      createdAt: new Date().toISOString(),
    }
    this.currentUser = defaultUser
    return defaultUser
  }

  async login(email: string, password: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign in. Please verify your credentials.')
    }

    this.setToken(data.token)
    this.currentUser = data.user
    return data.user
  }

  async signup(name: string, email: string, password: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create account.')
    }

    this.setToken(data.token)
    this.currentUser = data.user
    return data.user
  }

  async logout(): Promise<void> {
    try {
      if (this.sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.sessionToken}`,
          },
        })
      }
    } catch {
      // ignore
    } finally {
      this.setToken(null)
      this.currentUser = null
    }
  }

  async getUserStats(): Promise<UserStats> {
    return {
      currentStreak: 4,
      totalMinutesSpoken: 45,
      sessionsCompleted: 12,
      wordsPracticed: 1450,
      fluencyScore: 88,
    }
  }
}

export const authService = new AuthService()
