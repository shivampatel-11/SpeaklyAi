import { Router } from 'express'
import { AuthController } from '../controllers/authController.js'
import { authRateLimiter } from '../middleware/rateLimiter.js'
import { validateSignupInput, validateLoginInput } from '../middleware/validateInput.js'
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js'

export const authRouter = Router()

// POST /api/auth/signup - rate limited, strictly validated
authRouter.post('/signup', authRateLimiter, validateSignupInput, AuthController.signup)

// POST /api/auth/login - rate limited, brute force protected
authRouter.post('/login', authRateLimiter, validateLoginInput, AuthController.login)

// GET /api/auth/me - protected profile check
authRouter.get('/me', requireAuth, AuthController.me)

// POST /api/auth/logout - optional session revocation
authRouter.post('/logout', optionalAuth, AuthController.logout)
