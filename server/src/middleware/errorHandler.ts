import { Request, Response, NextFunction } from 'express'
import { ENV } from '../config/env.js'

export interface AppError extends Error {
  status?: number
  clientMessage?: string
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = typeof err.status === 'number' && err.status >= 400 && err.status < 600 ? err.status : 500

  // Log server error securely without leaking auth tokens or sensitive data
  const safeLogContext = {
    method: req.method,
    path: req.path,
    status,
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString(),
  }

  if (status >= 500) {
    console.error('[Internal Error]', safeLogContext, err.stack || err.message)
  } else {
    console.warn('[Client Error]', safeLogContext, err.message)
  }

  // In production, never leak internal stack traces or internal messages for 5xx errors
  if (ENV.isProduction) {
    if (status >= 500) {
      res.status(status).json({
        error: 'Something went wrong. Please try again.',
      })
      return
    }

    res.status(status).json({
      error: err.clientMessage || err.message || 'Bad Request',
    })
    return
  }

  // In development, provide useful debugging message
  res.status(status).json({
    error: err.clientMessage || err.message || 'Internal Server Error',
    ...(status >= 500 && { details: err.message }),
  })
}
