import { PracticeTopic } from '@/types'

export const SITE_CONFIG = {
  name: 'Speakly AI',
  tagline: 'Practice English by speaking, not memorizing.',
  description: 'Your real-time AI conversation partner for natural English fluency, instant phonetic & grammar corrections, and everyday real-world topics.',
  version: '0.1.0-mvp',
  links: {
    github: 'https://github.com',
  },
  defaultDailyGoalMinutes: 10,
  freeDailyLimitMinutes: 15,
}

export const MOCK_TOPICS: PracticeTopic[] = [
  {
    id: 'coffee-chat',
    title: 'Ordering at a Specialty Cafe',
    description: 'Practice ordering custom drinks, asking for recommendations, and casual counter talk.',
    category: 'Casual',
    difficulty: 'Beginner',
    promptStarter: "Hi there! Welcome to The Roastery. What can I get started for you today?",
    suggestedPhrases: ["I'd like an oat milk latte, please.", "What roast do you recommend?", "Can I get that iced?"],
    icon: 'Coffee',
    durationMinutes: 5,
  },
  {
    id: 'job-interview',
    title: 'Software Developer Job Interview',
    description: 'Answer behavioral and project questions with clear structure and natural confidence.',
    category: 'Professional',
    difficulty: 'Intermediate',
    promptStarter: "Good morning! Thanks for joining us today. Could you tell me a little about your recent engineering project?",
    suggestedPhrases: ["I led the frontend redesign...", "One key challenge we faced was...", "We collaborated closely across timezones."],
    icon: 'Briefcase',
    durationMinutes: 8,
  },
  {
    id: 'airport-travel',
    title: 'Airport Check-in & Customs',
    description: 'Navigate passport control, luggage questions, and boarding gate changes with ease.',
    category: 'Travel',
    difficulty: 'Beginner',
    promptStarter: "Next in line, please. Passport and boarding pass, and how many bags are you checking today?",
    suggestedPhrases: ["Just one carry-on bag.", "Is the flight on schedule?", "I'm traveling for leisure."],
    icon: 'Plane',
    durationMinutes: 6,
  },
  {
    id: 'tech-debate',
    title: 'Future of Artificial Intelligence',
    description: 'Express opinions, agree and disagree politely, and substantiate your viewpoint in debates.',
    category: 'Academic',
    difficulty: 'Advanced',
    promptStarter: "Some believe AI will replace most creative professions, while others see it as a copilot. What is your perspective on this?",
    suggestedPhrases: ["From my vantage point...", "I see your point, however...", "It significantly lowers barriers."],
    icon: 'Sparkles',
    durationMinutes: 10,
  },
]
