import express from 'express'
import cors from 'cors'
import { ENV } from './config/env.js'
import { conversationRouter } from './routes/conversationRoutes.js'
import { authRouter } from './routes/authRoutes.js'
import { progressRouter } from './routes/progressRoutes.js'
import { featureAccessService } from './services/featureAccess/featureAccessService.js'
import { securityHeaders } from './middleware/securityHeaders.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiRateLimiter } from './middleware/rateLimiter.js'
import { optionalAuth } from './middleware/authMiddleware.js'

const app = express()

// ============================================================
// 1. Disable Express fingerprinting
// ============================================================

app.disable('x-powered-by')

// ============================================================
// 2. CORS
// ============================================================
// CORS must run BEFORE security headers and API middleware.
// This allows the browser's OPTIONS preflight request to
// receive the required Access-Control-Allow-* headers.

const allowedOrigins = [
  'https://speakly-ai-en.vercel.app',
]

// Allow additional origins from Render environment variable
if (ENV.ALLOWED_ORIGINS) {
  for (const origin of ENV.ALLOWED_ORIGINS) {
    if (!allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin)
    }
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin header:
      // curl, Postman, server-to-server, etc.
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS blocked origin: ${origin}`))
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
    ],

    optionsSuccessStatus: 204,
  })
)

// ============================================================
// 3. Security headers
// ============================================================

app.use(securityHeaders)

// ============================================================
// 4. JSON body parser
// ============================================================

app.use(
  express.json({
    limit: '100kb',
  })
)

// ============================================================
// 5. Global API rate limiter
// ============================================================

app.use('/api', apiRateLimiter)

// ============================================================
// 6. Health check
// ============================================================

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Speakly AI Backend',
    timestamp: new Date().toISOString(),
  })
})

// ============================================================
// 7. Entitlements
// ============================================================

app.get(
  '/api/entitlements',
  optionalAuth,
  async (req, res) => {
    const userId = req.user?.id || 'usr_guest_default'

    const policy =
      await featureAccessService.getPolicy(userId)

    res.json(policy)
  }
)

// ============================================================
// 8. API Routes
// ============================================================

app.use('/api/auth', authRouter)

app.use(
  '/api/conversations',
  conversationRouter
)

app.use(
  '/api/progress',
  progressRouter
)

// ============================================================
// 9. Centralized error handler
// ============================================================

app.use(errorHandler)

// ============================================================
// 10. Start server
// ============================================================

app.listen(ENV.PORT, () => {
  console.log(
    `[Speakly AI Server] Running on port ${ENV.PORT} (${ENV.NODE_ENV})`
  )

  console.log(
    `[Speakly AI Server] Allowed CORS origins: ${allowedOrigins.join(', ')}`
  )
})

export default app