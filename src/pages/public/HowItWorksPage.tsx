import React, { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Mic, ArrowLeft } from 'lucide-react'
import { updatePageMeta } from '@/utils/seo'

interface HowItWorksPageProps {
  onStartPracticing: () => void
  onNavigate: (path: string) => void
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onStartPracticing,
  onNavigate,
}) => {
  useEffect(() => {
    updatePageMeta({
      title: 'How Speakly AI Works — AI English Speaking Practice',
      description:
        'Discover how Speakly AI listens, responds in real-time, and provides polite grammar and vocabulary corrections to help you speak with confidence.',
      path: '/how-it-works',
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
          How Speakly AI Works
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Speakly AI uses voice recognition, modern language models, and text-to-speech to provide an authentic conversational speaking partner.
        </p>
      </header>

      {/* Step by Step Breakdown */}
      <section className="space-y-3">
        {/* Step 1 */}
        <Card className="p-4 border-zinc-800/80 bg-zinc-900/60 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-semibold text-zinc-100">Select a Practice Scenario</h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed pl-8">
            Choose what you want to practice: casual daily small talk, a realistic job interview, college campus life, or open free talk.
          </p>
        </Card>

        {/* Step 2 */}
        <Card className="p-4 border-zinc-800/80 bg-zinc-900/60 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-semibold text-zinc-100">Speak Naturally Into Your Mic</h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed pl-8">
            Tap the microphone button and reply out loud in English. Speak at your own speed—there is no countdown clock or pressure.
          </p>
        </Card>

        {/* Step 3 */}
        <Card className="p-4 border-zinc-800/80 bg-zinc-900/60 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-semibold text-zinc-100">Hear the AI Partner Reply</h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed pl-8">
            The AI partner understands your spoken message and speaks back in natural conversational English, keeping the dialogue going.
          </p>
        </Card>

        {/* Step 4 */}
        <Card className="p-4 border-zinc-800/80 bg-zinc-900/60 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h2 className="text-sm font-semibold text-zinc-100">Review Instant Corrections</h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed pl-8">
            If you make a grammar mistake or use awkward phrasing, Speakly AI shows you what you said, a better way to say it, and a simple 1-line reason.
          </p>
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
          Start Practicing
        </Button>
      </div>
    </article>
  )
}
