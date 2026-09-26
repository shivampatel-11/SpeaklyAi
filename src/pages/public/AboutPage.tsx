import React, { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Mic, Target, Users, Shield, ArrowLeft } from 'lucide-react'
import { updatePageMeta } from '@/utils/seo'

interface AboutPageProps {
  onStartPracticing: () => void
  onNavigate: (path: string) => void
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartPracticing, onNavigate }) => {
  useEffect(() => {
    updatePageMeta({
      title: 'About Speakly AI — English Speaking Practice',
      description:
        'Learn about Speakly AI and our mission to help learners build spoken English fluency and confidence through AI conversation practice.',
      path: '/about',
    })
  }, [])

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
          About Speakly AI
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Speakly AI is an AI-powered English speaking practice platform created to help learners transition from passive English understanding to confident, active speaking.
        </p>
      </header>

      {/* Mission */}
      <section className="space-y-2">
        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <span>Our Approach</span>
        </h2>
        <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60 text-xs text-zinc-300 leading-relaxed">
          Most learners study grammar rules and vocabulary lists for years but still hesitate when speaking in real life. Speakly AI solves this by simulating natural conversation with a patient, non-judgmental AI partner that listens, responds, and provides immediate grammatical corrections.
        </Card>
      </section>

      {/* Who it's for */}
      <section className="space-y-2">
        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Who It's For</span>
        </h2>
        <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60 space-y-2 text-xs text-zinc-300">
          <p>• <strong>Students & Campus Learners:</strong> Practice everyday conversational English and class presentations.</p>
          <p>• <strong>Job Seekers:</strong> Rehearse behavioral interview questions and articulate your background professionally.</p>
          <p>• <strong>Intermediate English Learners:</strong> Overcome hesitation and build vocal muscle memory without feeling self-conscious.</p>
        </Card>
      </section>

      {/* Honest Commitment */}
      <section className="space-y-2">
        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-violet-400" />
          <span>Realistic Expectations</span>
        </h2>
        <Card className="p-3.5 border-zinc-800/80 bg-zinc-900/60 text-xs text-zinc-400 leading-relaxed">
          We do not promise "instant native fluency in 7 days." Real spoken fluency comes from consistent, daily speaking habit. Even 5 to 10 minutes a day with Speakly AI builds lasting vocal confidence and syntactic accuracy over time.
        </Card>
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
          Start Practicing Now
        </Button>
      </div>
    </article>
  )
}
