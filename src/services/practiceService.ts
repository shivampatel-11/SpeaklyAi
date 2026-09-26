import { PracticeSession, PracticeTopic, Message, Correction } from '@/types'
import { MOCK_TOPICS } from '@/config/site'

export interface IPracticeService {
  getTopics(): Promise<PracticeTopic[]>
  getTopicById(id: string): Promise<PracticeTopic | undefined>
  startSession(topic: PracticeTopic): PracticeSession
  generatePartnerReply(
    topic: PracticeTopic,
    history: Message[],
    userMessageText: string
  ): Promise<{ replyText: string; corrections: Correction[] }>
}

class MockPracticeService implements IPracticeService {
  async getTopics(): Promise<PracticeTopic[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_TOPICS]), 150)
    })
  }

  async getTopicById(id: string): Promise<PracticeTopic | undefined> {
    return MOCK_TOPICS.find((t) => t.id === id)
  }

  startSession(topic: PracticeTopic): PracticeSession {
    const initialAiMessage: Message = {
      id: `msg-${Date.now()}-ai-start`,
      sender: 'ai',
      speaker: 'ai',
      text: topic.promptStarter,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    return {
      id: `session-${Date.now()}`,
      mode: topic,
      topicId: topic.id,
      topicTitle: topic.title,
      startTime: Date.now(),
      durationSeconds: 0,
      messages: [initialAiMessage],
      status: 'active',
    }
  }

  async generatePartnerReply(
    topic: PracticeTopic,
    _history: Message[],
    userMessageText: string
  ): Promise<{ replyText: string; corrections: Correction[] }> {
    // Artificial latency to simulate real-time AI thinking
    await new Promise((res) => setTimeout(res, 900))

    const corrections: Correction[] = []
    const lower = userMessageText.toLowerCase()

    // Smart realistic instant linguistic corrections simulation
    if (lower.includes('i am agree') || lower.includes("i'm agree")) {
      corrections.push({
        id: `corr-${Date.now()}-1`,
        original: 'I am agree',
        suggested: 'I agree',
        explanation: '"Agree" is already a verb in English, so we say "I agree" rather than "I am agree".',
        type: 'grammar',
      })
    } else if (lower.includes('depend of') || lower.includes('depends of')) {
      corrections.push({
        id: `corr-${Date.now()}-2`,
        original: 'depends of',
        suggested: 'depends on',
        explanation: 'The verb "depend" typically takes the preposition "on" (e.g. "It depends on the context").',
        type: 'grammar',
      })
    } else if (lower.includes('since two years') || lower.includes('since 2 years')) {
      corrections.push({
        id: `corr-${Date.now()}-3`,
        original: 'since 2 years',
        suggested: 'for two years',
        explanation: 'Use "for" with a duration/period of time, and "since" with a specific starting point.',
        type: 'grammar',
      })
    } else if (lower.includes('explain me')) {
      corrections.push({
        id: `corr-${Date.now()}-4`,
        original: 'explain me',
        suggested: 'explain to me',
        explanation: 'In English, we say "explain something to someone" or "explain to me".',
        type: 'naturalness',
      })
    }

    // Dynamic topic contextual answers
    let replyText = ''
    if (topic.id === 'coffee-chat') {
      const answers = [
        "Great choice! Our oat milk latte is made with locally roasted beans. Would you like that hot or iced today?",
        "Certainly! That will come right up. Any pastry or croissant to accompany your drink?",
        "Sounds delicious. For sweetness, do you prefer standard syrup, vanilla, or unsweetened?",
      ]
      replyText = answers[Math.floor(Math.random() * answers.length)]
    } else if (topic.id === 'job-interview') {
      const answers = [
        "That's impressive! Could you describe how you handled disagreements or technical trade-offs with your team?",
        "Clear and structured explanation. What metrics or feedback showed you that the solution was a success?",
        "Thank you for sharing. In hindsight, is there anything you would approach differently on that architecture?",
      ]
      replyText = answers[Math.floor(Math.random() * answers.length)]
    } else {
      const answers = [
        `That sounds very interesting! Could you elaborate a bit more on why you feel that way?`,
        `I appreciate your perspective. How do you see that developing over the next few months?`,
        `That's a very natural way to put it! Let's build on that thought—what would be the next step?`,
      ]
      replyText = answers[Math.floor(Math.random() * answers.length)]
    }

    return { replyText, corrections }
  }
}

export const practiceService = new MockPracticeService()
