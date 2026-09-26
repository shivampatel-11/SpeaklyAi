import { Router } from 'express'
import { ConversationController } from '../controllers/conversationController.js'
import { aiRateLimiter } from '../middleware/rateLimiter.js'
import { optionalAuth } from '../middleware/authMiddleware.js'
import {
  validateStartConversationInput,
  validateConversationMessageInput,
  validateEndConversationInput,
} from '../middleware/validateInput.js'

export const conversationRouter = Router()

// All conversation endpoints extract authenticated context if present
conversationRouter.use(optionalAuth)

// POST /api/conversations/start
conversationRouter.post(
  '/start',
  aiRateLimiter,
  validateStartConversationInput,
  ConversationController.start
)

// POST /api/conversations/message
conversationRouter.post(
  '/message',
  aiRateLimiter,
  validateConversationMessageInput,
  ConversationController.message
)

// POST /api/conversations/end
conversationRouter.post(
  '/end',
  aiRateLimiter,
  validateEndConversationInput,
  ConversationController.end
)
