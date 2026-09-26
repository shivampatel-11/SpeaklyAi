import { Request, Response } from 'express'
import { userRepository, sessionTokenStore } from '../database/store.js'
import { hashPassword, verifyPassword, generateSessionToken } from '../utils/security.js'
import { User, UserProfile } from '../types/index.js'
import { ENV } from '../config/env.js'

function setAuthCookie(res: Response, token: string): void {
  const isSecure = ENV.isProduction
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days

  // Construct secure cookie header natively
  const cookieFlags = [
    `speakly_session=${encodeURIComponent(token)}`,
    `Max-Age=${Math.floor(maxAge / 1000)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    ...(isSecure ? ['Secure'] : []),
  ]

  res.setHeader('Set-Cookie', cookieFlags.join('; '))
}

function clearAuthCookie(res: Response): void {
  const isSecure = ENV.isProduction
  const cookieFlags = [
    'speakly_session=',
    'Max-Age=0',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    ...(isSecure ? ['Secure'] : []),
  ]

  res.setHeader('Set-Cookie', cookieFlags.join('; '))
}

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body

      const existing = await userRepository.findByEmail(email)
      if (existing) {
        // Return 409 Conflict with generic safe message
        res.status(409).json({ error: 'An account with this email address already exists.' })
        return
      }

      const { hash, salt } = hashPassword(password)
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`

      const newUser: User = {
        id: userId,
        name,
        email,
        targetLevel: 'Intermediate',
        passwordHash: hash,
        salt,
        createdAt: new Date().toISOString(),
      }

      await userRepository.create(newUser)

      const token = generateSessionToken()
      sessionTokenStore.set(token, newUser.id)
      setAuthCookie(res, token)

      const userProfile: UserProfile = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        targetLevel: newUser.targetLevel,
        createdAt: newUser.createdAt,
      }

      res.status(201).json({ user: userProfile, token })
    } catch (err) {
      console.error('[Auth Signup Failure]:', err)
      res.status(500).json({ error: 'Failed to create account. Please try again.' })
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      const user = await userRepository.findByEmail(email)
      if (!user) {
        // Generic response prevents account enumeration
        res.status(401).json({ error: 'Invalid email or password.' })
        return
      }

      const isValid = verifyPassword(password, user.passwordHash, user.salt)
      if (!isValid) {
        res.status(401).json({ error: 'Invalid email or password.' })
        return
      }

      const token = generateSessionToken()
      sessionTokenStore.set(token, user.id)
      setAuthCookie(res, token)

      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        targetLevel: user.targetLevel,
        createdAt: user.createdAt,
      }

      res.status(200).json({ user: userProfile, token })
    } catch (err) {
      console.error('[Auth Login Failure]:', err)
      res.status(500).json({ error: 'Failed to login. Please try again.' })
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' })
        return
      }

      res.status(200).json({ user: req.user })
    } catch (err) {
      console.error('[Auth Me Failure]:', err)
      res.status(500).json({ error: 'Failed to retrieve user profile.' })
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      if (req.token) {
        sessionTokenStore.delete(req.token)
      }
      clearAuthCookie(res)
      res.status(200).json({ success: true, message: 'Successfully signed out.' })
    } catch (err) {
      console.error('[Auth Logout Failure]:', err)
      res.status(500).json({ error: 'Failed to complete logout.' })
    }
  }
}
