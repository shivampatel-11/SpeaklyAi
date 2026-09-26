import { Router } from 'express'
import { ProgressController } from '../controllers/progressController.js'
import { apiRateLimiter } from '../middleware/rateLimiter.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

export const progressRouter = Router()

progressRouter.use(apiRateLimiter)
progressRouter.use(optionalAuth)

// GET /api/progress/:userId - strictly verifies authorization for target userId
progressRouter.get('/:userId', ProgressController.getProgress)

// GET /api/progress - derives progress from verified user context
progressRouter.get('/', ProgressController.getProgress)
