import { Request, Response, NextFunction } from 'express'
import { sessionTokenStore, userRepository } from '../database/store.js'
import { UserProfile } from '../types/index.js'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: UserProfile
      token?: string
    }
  }
}

/**
 * Extracts session token from Authorization header or Cookie
 */
function extractToken(req: Request): string | null {
  // 1. Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim()
  }

  // 2. Cookie header: "speakly_session=<token>"
  const cookieHeader = req.headers.cookie
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim())
    for (const cookie of cookies) {
      if (cookie.startsWith('speakly_session=')) {
        return decodeURIComponent(cookie.substring('speakly_session='.length))
      }
    }
  }

  return null
}

/**
 * Optional authentication middleware: populates req.user if valid token present,
 * allows guest flow without failing.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req)
  if (!token) {
    return next()
  }

  const userId = sessionTokenStore.get(token)
  if (!userId) {
    return next()
  }

  const user = await userRepository.findById(userId)
  if (user) {
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      targetLevel: user.targetLevel,
      createdAt: user.createdAt,
    }
    req.token = token
  }

  next()
}

/**
 * Strict authentication middleware: requires valid token / session.
 * Rejects unauthorized requests with 401.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req)

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' })
    return
  }

  const userId = sessionTokenStore.get(token)
  if (!userId) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' })
    return
  }

  const user = await userRepository.findById(userId)
  if (!user) {
    res.status(401).json({ error: 'User account not found.' })
    return
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    targetLevel: user.targetLevel,
    createdAt: user.createdAt,
  }
  req.token = token

  next()
}
