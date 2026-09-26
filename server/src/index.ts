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

// 1. Disable fingerprinting headers
app.disable('x-powered-by')

// 2. Apply security headers (CSP, HSTS, frame protection, referrer policy)
app.use(securityHeaders)

// 3. Strict CORS configuration (never '*' on authenticated services)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true)

      if (ENV.ALLOWED_ORIGINS.includes(origin) || !ENV.isProduction) {
        callback(null, true)
      } else {
        callback(new Error('Blocked by CORS policy'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
)

// 4. Body parser with strict size limit to prevent payload bombs
app.use(express.json({ limit: '100kb' }))

// 5. Global API rate limiting
app.use('/api', apiRateLimiter)

// 6. Safe Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Speakly AI Backend',
    timestamp: new Date().toISOString(),
  })
})

// 7. Entitlements Check (derives identity safely)
app.get('/api/entitlements', optionalAuth, async (req, res) => {
  const userId = req.user?.id || 'usr_guest_default'
  const policy = await featureAccessService.getPolicy(userId)
  res.json(policy)
})

// 8. API Routers
app.use('/api/auth', authRouter)
app.use('/api/conversations', conversationRouter)
app.use('/api/progress', progressRouter)

// 9. Centralized Error Handler (masks internal details in production)
app.use(errorHandler)

app.listen(ENV.PORT, () => {
  console.log(`[Speakly AI Server] Running on port ${ENV.PORT} (${ENV.NODE_ENV})`)
})

export default app
