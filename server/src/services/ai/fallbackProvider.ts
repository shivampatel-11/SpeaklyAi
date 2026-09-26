import {
  AIConversationContext,
  AIResponseResult,
  AIFeedbackResult,
  ConversationSession,
} from '../../types/index.js'
import { AIService } from './aiService.interface.js'

export class FallbackAIProvider implements AIService {
  async generateResponse(context: AIConversationContext): Promise<AIResponseResult> {
    const text = context.userText.trim()
    const lower = text.toLowerCase()

    let correction: string | null = null
    let explanation: string | null = null
    let betterSentence: string | null = null

    // 1. Example from prompt specification: "I am go to college yesterday"
    if (
      lower.includes('i am go to') ||
      lower.includes('i am go ') ||
      (lower.includes('go to') && lower.includes('yesterday'))
    ) {
      correction = text.replace(/i am go to/i, 'I went to').replace(/i go to/i, 'I went to')
      if (lower.includes('college')) {
        correction = 'I went to college yesterday.'
      }
      explanation = "Use 'went' because this is past tense."
      betterSentence = 'I went to college yesterday.'
    } else if (lower.includes('i am agree') || lower.includes("i'm agree")) {
      correction = text.replace(/i am agree/i, 'I agree').replace(/i'm agree/i, 'I agree')
      explanation = "\"Agree\" is already a verb in English, so we say \"I agree\" without the verb \"to be\"."
      betterSentence = 'I completely agree with your point.'
    } else if (lower.includes('depend of') || lower.includes('depends of')) {
      correction = text.replace(/depend(s)? of/i, 'depend$1 on')
      explanation = "In English, the verb \"depend\" requires the preposition \"on\" instead of \"of\"."
      betterSentence = 'It really depends on the specific situation.'
    } else if (lower.includes('since 2 years') || lower.includes('since two years')) {
      correction = text.replace(/since (2|two) years/i, 'for two years')
      explanation = "Use \"for\" with a duration of time, and \"since\" for a specific point in time."
      betterSentence = 'I have been doing this for two years.'
    } else if (lower.includes('explain me')) {
      correction = text.replace(/explain me/i, 'explain to me')
      explanation = "In English syntax, we say \"explain something to someone\" or \"explain to me\"."
      betterSentence = 'Could you explain how that works to me?'
    } else if (lower.includes('i have 20 years old') || lower.includes('i have 25 years old')) {
      correction = text.replace(/i have (\d+) years old/i, 'I am $1 years old')
      explanation = "In English, age is described using the verb \"to be\" (am/is/are), not \"have\"."
      betterSentence = correction
    }

    // Contextual responses based on mode
    const modeId = context.mode.id
    let reply = ''

    if (modeId === 'job-interview') {
      const answers = [
        "That's a very clear overview. Could you tell me about a time when you faced a difficult technical challenge and how you resolved it?",
        "Impressive background! How do you typically handle conflicting priorities when working under tight deadlines?",
        "Thank you for walking me through that. In hindsight, what key lesson did you take away from that project?",
      ]
      reply = answers[Math.floor(Math.random() * answers.length)]
    } else if (modeId === 'college-conversation') {
      const answers = [
        "That makes total sense. Have you started gathering the reference materials for the final presentation, or should we divide that up?",
        "Sounds like a good study plan! Are you free to meet up at the library tomorrow after morning lectures?",
        "Definitely! Did you get a chance to review the professor's notes on the third assignment?",
      ]
      reply = answers[Math.floor(Math.random() * answers.length)]
    } else if (modeId === 'daily-conversation') {
      const answers = [
        "That sounds wonderful! Did you get any time to relax, or has your day been pretty busy?",
        "I love that! What are your plans for dinner tonight, or are you keeping it simple?",
        "That's so interesting! What kind of coffee or drink do you usually prefer in the afternoon?",
      ]
      reply = answers[Math.floor(Math.random() * answers.length)]
    } else {
      const answers = [
        "That's a fascinating perspective! What made you interested in that subject initially?",
        "I really like how you expressed that idea. How do you envision that evolving over the next few years?",
        "That makes a lot of sense! If you had to pick one main takeaway from that experience, what would it be?",
      ]
      reply = answers[Math.floor(Math.random() * answers.length)]
    }

    return { reply, correction, explanation, betterSentence }
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
        description: 'Casual talk',
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
    const userExchanges = session.messages.filter((m) => m.sender === 'user')
    const corrections = session.messages
      .filter((m) => m.correction)
      .map((m) => m.correction!)

    const fluencyBase = Math.min(96, Math.max(76, 82 + userExchanges.length * 2))
    const grammarDeduction = Math.min(20, corrections.length * 5)
    const grammarScore = Math.max(72, 95 - grammarDeduction)
    const vocabularyScore = 88
    const overallScore = Math.round((fluencyBase + grammarScore + vocabularyScore) / 3)

    return {
      overallScore,
      fluencyScore: fluencyBase,
      grammarScore,
      vocabularyScore,
      summaryReview:
        userExchanges.length > 1
          ? `Impressive session in ${session.mode.title}! You engaged in ${userExchanges.length} conversational turns with good structure and maintained steady speech cadence.`
          : `Good initial practice! With daily practice, your speaking speed and natural vocabulary recall will rapidly strengthen.`,
      positiveNotes: [
        'Confident articulation and natural dialogue rhythm.',
        'Responded accurately to contextual conversational prompts.',
        'Actively applied English communication without hesitation.',
      ],
      corrections,
    }
  }
}
