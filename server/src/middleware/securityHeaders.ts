import { Request, Response, NextFunction } from 'express'
import { ENV } from '../config/env.js'

export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // Prevent clickjacking by disallowing framing
  res.setHeader('X-Frame-Options', 'DENY')

  // Modern browsers: disable buggy legacy XSS filter
  res.setHeader('X-XSS-Protection', '0')

  // Control referrer information sent in HTTP requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Restrict browser features (mic permitted for conversation practice on origin)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()')

  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' http://localhost:* http://127.0.0.1:* ws: wss:",
    "media-src 'self' data: blob:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
  res.setHeader('Content-Security-Policy', cspDirectives.join('; '))

  // HSTS in production
  if (ENV.isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  next()
}
