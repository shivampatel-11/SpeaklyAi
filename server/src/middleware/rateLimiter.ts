import { Request, Response, NextFunction } from 'express'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
}

interface ClientRecord {
  count: number
  resetTime: number
}

function createRateLimiter(config: RateLimitConfig) {
  const records = new Map<string, ClientRecord>()

  // Periodic garbage collection of expired IP windows
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of records.entries()) {
      if (now > record.resetTime) {
        records.delete(key)
      }
    }
  }, Math.max(30000, config.windowMs)).unref()

  return (req: Request, res: Response, next: NextFunction): void => {
    // Determine client identifier: authenticated user id if present, or IP address
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'anonymous'
    const identifier = token ? `token_${token}` : `ip_${clientIp}`

    const now = Date.now()
    const clientRecord = records.get(identifier)

    if (!clientRecord || now > clientRecord.resetTime) {
      records.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      })
      res.setHeader('RateLimit-Limit', config.maxRequests)
      res.setHeader('RateLimit-Remaining', config.maxRequests - 1)
      return next()
    }

    if (clientRecord.count >= config.maxRequests) {
      const retryAfterSeconds = Math.max(1, Math.ceil((clientRecord.resetTime - now) / 1000))
      res.setHeader('Retry-After', retryAfterSeconds)
      res.setHeader('RateLimit-Limit', config.maxRequests)
      res.setHeader('RateLimit-Remaining', 0)

      console.warn(`[RateLimit Warning] Exceeded limit for ${identifier} on ${req.method} ${req.path}`)
      res.status(429).json({
        error: config.message || 'Too many requests. Please wait a moment and try again.',
      })
      return
    }

    clientRecord.count += 1
    res.setHeader('RateLimit-Limit', config.maxRequests)
    res.setHeader('RateLimit-Remaining', config.maxRequests - clientRecord.count)
    next()
  }
}

// Strict rate limit for authentication (prevent brute force / account enumeration)
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 15,
  message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
})

// Rate limit for AI conversation endpoints (prevent token exhaustion / abuse)
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 40,
  message: 'AI request limit reached. Please pause for a moment before speaking again.',
})

// General API rate limit
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 180,
  message: 'Request limit reached. Please wait a moment.',
})
