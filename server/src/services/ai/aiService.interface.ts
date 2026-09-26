import {
  AIConversationContext,
  AIResponseResult,
  AIFeedbackResult,
  ConversationSession,
} from '../../types/index.js'

export interface AIService {
  /**
   * Generates conversational reply and linguistic corrections for learner input
   */
  generateResponse(context: AIConversationContext): Promise<AIResponseResult>

  /**
   * Analyzes an isolated speech transcript for grammar, preposition, or pronunciation issues
   */
  analyzeSpeech(text: string, context?: AIConversationContext): Promise<{
    correction: string | null
    explanation: string | null
    betterSentence: string | null
  }>

  /**
   * Generates comprehensive session feedback, scores, and coaching notes
   */
  generateFeedback(session: ConversationSession): Promise<AIFeedbackResult>
}
