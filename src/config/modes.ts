import { PracticeMode } from '@/types'

export const PRACTICE_MODES: PracticeMode[] = [
  {
    id: 'daily-conversation',
    title: 'Daily Conversation',
    description: 'Talk naturally. Improve daily.',
    difficulty: 'Beginner',
    icon: 'MessageCircle',
    promptStarter: "How has your day been so far?",
    suggestedPhrases: [
      "Pretty busy, but good.",
      "Just grabbed a coffee.",
      "Relaxing after work.",
    ],
    colorTheme: 'indigo',
  },
  {
    id: 'job-interview',
    title: 'Job Interview',
    description: 'Practice. Answer. Improve.',
    difficulty: 'Intermediate',
    icon: 'Briefcase',
    promptStarter: "Tell me about yourself and your recent work.",
    suggestedPhrases: [
      "I led a product redesign.",
      "We solved scaling challenges.",
      "I focus on clear communication.",
    ],
    colorTheme: 'blue',
  },
  {
    id: 'college-conversation',
    title: 'College Life',
    description: 'Speak confidently on campus.',
    difficulty: 'Intermediate',
    icon: 'GraduationCap',
    promptStarter: "Are you ready for our presentation review?",
    suggestedPhrases: [
      "I finished the slides.",
      "Let's meet at the library.",
      "Did you check the rubric?",
    ],
    colorTheme: 'violet',
  },
  {
    id: 'free-talk',
    title: 'Free Talk',
    description: 'Talk about anything.',
    difficulty: 'Advanced',
    icon: 'Sparkles',
    promptStarter: "What is on your mind today?",
    suggestedPhrases: [
      "What do you think of AI?",
      "Favorite travel places?",
      "Productivity habits.",
    ],
    colorTheme: 'emerald',
  },
]
