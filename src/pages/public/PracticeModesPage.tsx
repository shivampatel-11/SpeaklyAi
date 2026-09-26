import React, { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Mic,
  ArrowLeft,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { updatePageMeta } from '@/utils/seo'

interface PracticeModesPageProps {
  onStartPracticing: () => void
  onNavigate: (path: string) => void
}

export const PracticeModesPage: React.FC<PracticeModesPageProps> = ({
  onStartPracticing,
  onNavigate,
}) => {
  useEffect(() => {
    updatePageMeta({
      title: 'English Speaking Practice Modes — Speakly AI',
      description:
        'Explore English speaking scenarios: Daily Conversation, Job Interview, College Life, and Free Talk with real-time AI partner.',
      path: '/practice-modes',
    })
  }, [])

  const modes = [
    {
      id: 'daily-conversation',
      title: 'Daily Conversation',
      subtitle: 'Talk naturally. Improve daily.',
      difficulty: 'Beginner',
      icon: MessageCircle,
      description: 'Practice casual small talk about weekends, weather, food, hobbies, and everyday routines. Ideal for building regular speaking cadence.',
      samplePrompt: '"How was your weekend? Did you do anything fun?"',
    },
    {
      id: 'job-interview',
      title: 'Job Interview',
      subtitle: 'Practice. Answer. Improve.',
      difficulty: 'Intermediate',
      icon: Briefcase,
      description: 'Rehearse classic behavioral and professional questions. Practice answering clearly about your background, strengths, and problem solving.',
      samplePrompt: '"Tell me about yourself and your background."',
    },
    {
      id: 'college-life',
      title: 'College Life',
      subtitle: 'Speak confidently on campus.',
      difficulty: 'Intermediate',
      icon: GraduationCap,
      description: 'Designed for university students: practice discussing class projects, speaking with professors, and collaborating with peers on campus.',
      samplePrompt: '"Have you started working on the group presentation yet?"',
    },
    {
      id: 'free-talk',
      title: 'Free Talk',
      subtitle: 'Talk about anything.',
      difficulty: 'Advanced',
      icon: Sparkles,
      description: 'No predefined topic constraints. Speak freely about technology, current events, philosophy, or personal stories with full conversational flexibility.',
      samplePrompt: '"What is something new you learned recently that fascinated you?"',
    },
  ]

  return (
    <article className="space-y-6 pt-2 pb-8 max-w-sm mx-auto">
      <button
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Speaking Practice Modes
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Choose scenario-based speaking modes tailored to your current level and communication goals.
        </p>
      </header>

      {/* Modes list */}
      <section className="space-y-3">
        {modes.map((mode) => {
          const Icon = mode.icon
          return (
            <Card key={mode.id} className="p-4 border-zinc-800/80 bg-zinc-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-zinc-100">{mode.title}</h2>
                    <p className="text-[11px] text-zinc-400">{mode.subtitle}</p>
                  </div>
                </div>
                <Badge variant={mode.difficulty === 'Beginner' ? 'success' : mode.difficulty === 'Intermediate' ? 'indigo' : 'warning'} className="text-[10px]">
                  {mode.difficulty}
                </Badge>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {mode.description}
              </p>

              <div className="pt-1 border-t border-zinc-800/60 text-[11px] text-zinc-400 italic">
                Starter prompt: {mode.samplePrompt}
              </div>
            </Card>
          )
        })}
      </section>

      {/* CTA */}
      <div className="pt-2">
        <Button
          size="lg"
          variant="primary"
          onClick={onStartPracticing}
          className="w-full shadow-lg shadow-indigo-500/25"
          leftIcon={<Mic className="w-4 h-4" />}
        >
          Choose a Mode & Speak
        </Button>
      </div>
    </article>
  )
}
