import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  AIConversationContext,
  AIResponseResult,
  AIFeedbackResult,
  ConversationSession,
} from '../../types/index.js'
import { AIService } from './aiService.interface.js'
import { FallbackAIProvider } from './fallbackProvider.js'

export class GeminiAIProvider implements AIService {
  private genAI: GoogleGenerativeAI
  private modelName: string
  private fallback: FallbackAIProvider

  constructor(apiKey: string, modelName: string = 'gemini-1.5-flash') {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.modelName = modelName
    this.fallback = new FallbackAIProvider()
  }

  async generateResponse(context: AIConversationContext): Promise<AIResponseResult> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      })

      const historyFormatted = context.history
        .slice(-6)
        .map((m) => `${m.sender === 'ai' ? 'Assistant' : 'Student'}: ${m.text}`)
        .join('\n')

      const prompt = `
You are Speakly AI, an encouraging and natural English conversation partner for language learners.
Current Practice Scenario: "${context.mode.title}" (${context.mode.difficulty} level).
Description: ${context.mode.description}

Recent conversation:
${historyFormatted}

Student just said:
"${context.userText}"

Instructions:
1. Generate an engaging, natural conversational response (1-2 sentences) suited for this scenario.
2. Carefully analyze the student's grammar, verb tenses, prepositions, and natural phrasing.
3. If there is a grammatical error or awkward phrasing, provide:
   - "correction": the fully corrected sentence
   - "explanation": a concise 1-sentence explanation of the mistake
   - "betterSentence": a more natural/fluent native expression
4. If the student spoke correctly without notable mistakes, set "correction", "explanation", and "betterSentence" to null.

You MUST respond strictly with this JSON schema:
{
  "reply": "Conversational reply to student",
  "correction": "Corrected sentence or null",
  "explanation": "Short 1-sentence grammar explanation or null",
  "betterSentence": "Natural native expression or null"
}
`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const parsed = JSON.parse(this.cleanJsonString(text))

      return {
        reply: parsed.reply || "That's very interesting! Could you tell me more about that?",
        correction: parsed.correction || null,
        explanation: parsed.explanation || null,
        betterSentence: parsed.betterSentence || null,
      }
    } catch (error) {
      console.warn('Gemini API call failed, using intelligent fallback provider:', error)
      return this.fallback.generateResponse(context)
    }
  }

  async analyzeSpeech(
    text: string,
    context?: AIConversationContext
  ): Promise<{
    correction: string | null
    explanation: string | null
    betterSentence: string | null
  }> {
    const res = await this.generateResponse({
      mode: context?.mode || {
        id: 'general',
        title: 'General English',
        description: 'Casual conversation',
        difficulty: 'Intermediate',
        promptStarter: 'Hello',
      },
      history: context?.history || [],
      userText: text,
    })

    return {
      correction: res.correction,
      explanation: res.explanation,
      betterSentence: res.betterSentence,
    }
  }

  async generateFeedback(session: ConversationSession): Promise<AIFeedbackResult> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      })

      const exchanges = session.messages
        .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
        .join('\n')

      const prompt = `
Analyze this English speaking practice session:
Mode: ${session.mode.title} (${session.mode.difficulty})
Exchanges:
${exchanges}

Provide a comprehensive assessment for the student in JSON:
{
  "overallScore": number (0-100),
  "fluencyScore": number (0-100),
  "grammarScore": number (0-100),
  "vocabularyScore": number (0-100),
  "summaryReview": "2-3 sentences evaluating the student's fluency and conversation flow",
  "positiveNotes": ["point 1", "point 2", "point 3"]
}
`
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const parsed = JSON.parse(this.cleanJsonString(text))

      // Gather any existing message corrections
      const corrections = session.messages
        .filter((m) => m.correction)
        .map((m) => m.correction!)

      return {
        overallScore: parsed.overallScore || 85,
        fluencyScore: parsed.fluencyScore || 84,
        grammarScore: parsed.grammarScore || 86,
        vocabularyScore: parsed.vocabularyScore || 85,
        summaryReview:
          parsed.summaryReview ||
          `Great practice session in ${session.mode.title}! You communicated your thoughts clearly and maintained conversational pace.`,
        positiveNotes: parsed.positiveNotes || [
          'Good conversational momentum without hesitation.',
          'Understood and answered the context accurately.',
        ],
        corrections,
      }
    } catch {
      return this.fallback.generateFeedback(session)
    }
  }

  private cleanJsonString(str: string): string {
    return str.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  }
}
