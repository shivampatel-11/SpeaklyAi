import { Request, Response } from 'express'
import {
  ConversationSession,
  ConversationMessage,
  Correction,
  PracticeFeedback,
} from '../types/index.js'
import {
  conversationRepository,
  feedbackRepository,
} from '../database/store.js'
import { getAIService } from '../services/ai/index.js'
import { subscriptionService } from '../services/subscriptionService.js'

export class ConversationController {
  /**
   * POST /api/conversations/start
   */
  static async start(req: Request, res: Response): Promise<void> {
    try {
      const { mode } = req.body

      // Always derive user from verified auth context to prevent identity spoofing
      const userId = req.user?.id || `usr_guest_${Date.now()}`

      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      const now = Date.now()

      const initialMessage: ConversationMessage = {
        id: `msg_ai_${now}`,
        sender: 'ai',
        text: mode.promptStarter || "Hello! Let's practice speaking English together.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      const session: ConversationSession = {
        id: sessionId,
        userId,
        mode,
        startTime: now,
        durationSeconds: 0,
        messages: [initialMessage],
        status: 'active',
      }

      await conversationRepository.create(session)

      res.status(201).json({
        session,
        initialMessage,
      })
    } catch (error) {
      console.error('[Conversation Start Error]:', error)
      res.status(500).json({ error: 'Failed to start conversation. Please try again.' })
    }
  }

  /**
   * POST /api/conversations/message
   */
  static async message(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, userText } = req.body

      const session = await conversationRepository.findById(sessionId)
      if (!session) {
        res.status(404).json({ error: 'Conversation session not found.' })
        return
      }

      // Authorization & BOLA/IDOR prevention:
      // If the session belongs to a registered user, ensure only that authenticated user can submit to it
      if (session.userId && !session.userId.startsWith('usr_guest_')) {
        if (!req.user || req.user.id !== session.userId) {
          res.status(403).json({ error: 'Unauthorized: You do not have access to this conversation.' })
          return
        }
      }

      // Prevent sending messages to already completed sessions
      if (session.status === 'completed') {
        res.status(400).json({ error: 'This conversation session has already ended.' })
        return
      }

      const cleanUserText = userText.trim()
      const now = Date.now()

      // 1. Get AI response and linguistic analysis
      const aiService = getAIService()
      const aiResult = await aiService.generateResponse({
        mode: session.mode,
        history: session.messages.slice(-8), // Keep prompt window constrained
        userText: cleanUserText,
      })

      // 2. Prepare corrections if found
      const corrections: Correction[] = []
      let userCorrection: Correction | undefined = undefined

      if (aiResult.correction) {
        userCorrection = {
          id: `corr_${now}`,
          original: cleanUserText,
          suggested: aiResult.correction,
          explanation: aiResult.explanation || 'Grammar correction',
          betterSentence: aiResult.betterSentence || aiResult.correction,
          type: 'grammar',
        }
        corrections.push(userCorrection)
      }

      // 3. Save User Message
      const userMessage: ConversationMessage = {
        id: `msg_user_${now}`,
        sender: 'user',
        text: cleanUserText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        correction: userCorrection,
      }
      await conversationRepository.addMessage(sessionId, userMessage)

      // 4. Save AI Reply Message
      const aiMessage: ConversationMessage = {
        id: `msg_ai_${now + 1}`,
        sender: 'ai',
        text: aiResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      await conversationRepository.addMessage(sessionId, aiMessage)

      // 5. Respond with sanitized safe contract
      res.status(200).json({
        reply: aiMessage.text,
        correction: aiResult.correction,
        explanation: aiResult.explanation,
        betterSentence: aiResult.betterSentence,
        replyMessage: aiMessage,
        corrections,
      })
    } catch (error) {
      console.error('[Conversation Message Error]:', error)
      res.status(500).json({ error: 'Failed to process voice response. Please try again.' })
    }
  }

  /**
   * POST /api/conversations/end
   */
  static async end(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.body

      const session = await conversationRepository.findById(sessionId)
      if (!session) {
        res.status(404).json({ error: 'Conversation session not found.' })
        return
      }

      // Authorization & BOLA/IDOR prevention
      if (session.userId && !session.userId.startsWith('usr_guest_')) {
        if (!req.user || req.user.id !== session.userId) {
          res.status(403).json({ error: 'Unauthorized: You do not have access to this conversation.' })
          return
        }
      }

      const now = Date.now()
      const durationSeconds = Math.max(15, Math.floor((now - session.startTime) / 1000))

      // Generate comprehensive feedback via AI service
      const aiService = getAIService()
      const feedbackResult = await aiService.generateFeedback(session)

      const feedback: PracticeFeedback = {
        id: `fb_${now}`,
        sessionId,
        overallScore: feedbackResult.overallScore,
        fluencyScore: feedbackResult.fluencyScore,
        grammarScore: feedbackResult.grammarScore,
        vocabularyScore: feedbackResult.vocabularyScore,
        summaryReview: feedbackResult.summaryReview,
        positiveNotes: feedbackResult.positiveNotes,
        corrections: feedbackResult.corrections,
        createdAt: new Date().toISOString(),
      }

      await feedbackRepository.create(feedback)

      const updatedSession = await conversationRepository.update(sessionId, {
        endTime: now,
        durationSeconds,
        status: 'completed',
        feedback,
      })

      // Record usage for monetization/entitlement tracking
      if (session.userId) {
        await subscriptionService.recordSessionUsage(session.userId, sessionId, durationSeconds)
      }

      res.status(200).json({
        feedback,
        session: updatedSession || session,
      })
    } catch (error) {
      console.error('[Conversation End Error]:', error)
      res.status(500).json({ error: 'Failed to end conversation. Please try again.' })
    }
  }
}
