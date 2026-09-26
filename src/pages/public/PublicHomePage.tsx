import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  Mic,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'
import { updatePageMeta } from '@/utils/seo'

interface PublicHomePageProps {
  onStartPracticing: () => void
  onNavigate: (path: string) => void
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  onStartPracticing,
  onNavigate,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index))
  }
  useEffect(() => {
    updatePageMeta({
      title: 'Speakly AI — Practice English Speaking with AI',
      description:
        'Practice English speaking with an AI conversation partner. Improve fluency, grammar, vocabulary, and confidence through real conversations.',
      path: '/',
    })
  }, [])

  const faqs = [
    {
      q: 'What is Speakly AI?',
      a: 'Speakly AI is an AI-powered English speaking practice app that lets learners practice conversations, receive corrections, and improve their speaking skills.',
    },
    {
      q: 'How does AI English speaking practice work?',
      a: 'You speak into your microphone in English, the AI partner understands and replies in real time, and provides gentle instant feedback on grammar and vocabulary.',
    },
    {
      q: 'Can I practice English speaking with AI?',
      a: 'Yes. Speakly AI allows you to speak freely without judgment, pause when you need to think, and practice everyday conversations and job interviews.',
    },
    {
      q: 'Is Speakly AI useful for beginners?',
      a: 'Yes. Speakly AI includes beginner-friendly modes like Daily Conversation with slow pacing and supportive prompts.',
    },
    {
      q: 'Can I practice English for job interviews?',
      a: 'Yes. The Job Interview practice mode asks behavioral questions and helps you structure professional answers.',
    },
    {
      q: 'Can I practice English conversations?',
      a: 'Yes. You can practice everyday small talk, campus life scenarios, or freely discuss any topic.',
    },
    {
      q: 'Do I need a speaking partner?',
      a: 'No. Speakly AI acts as your dedicated speaking partner available on demand anytime.',
    },
    {
      q: 'Can I use Speakly AI on my phone?',
      a: 'Yes. Speakly AI is built mobile-first and works in mobile browsers on iOS and Android.',
    },
    {
      q: 'Is Speakly AI free?',
      a: 'Yes. Speakly AI is currently free to use with all practice modes accessible.',
    },
  ]

  return (
    <article className="space-y-8 pt-2 pb-6 max-w-sm mx-auto">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-3 pt-2" aria-labelledby="hero-heading">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI English Speaking Partner</span>
          </div>
        </div>

        <h1 id="hero-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Practice English by Speaking
        </h1>

        <p className="text-sm text-zinc-300 max-w-xs mx-auto leading-relaxed">
          Build speaking confidence through real conversations with your AI practice partner.
        </p>

        <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
          <Button
            size="lg"
            variant="primary"
            onClick={onStartPracticing}
            className="w-full shadow-lg shadow-indigo-500/25"
            leftIcon={<Mic className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Practicing
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onNavigate('/how-it-works')}
            className="text-xs text-zinc-400 hover:text-zinc-200"
          >
            How It Works
          </Button>
        </div>
      </section>

      {/* Simulated Live Audio Preview Card */}
      <section className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-xl space-y-2" aria-label="Conversation Preview">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Real-time Feedback Example
          </span>
          <span className="text-[10px] text-zinc-500">Live Voice</span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-zinc-300">
            "How was your day yesterday?"
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
            <div className="text-zinc-400">
              <span className="text-red-400 mr-1.5" aria-hidden="true">❌</span>
              <span className="line-through">I go to college yesterday.</span>
            </div>
            <div className="text-emerald-300 font-medium">
              <span className="text-emerald-400 mr-1.5" aria-hidden="true">✓</span>
              I went to college yesterday.
            </div>
            <div className="pt-1 border-t border-zinc-800/80 text-[11px] text-zinc-400">
              Why? <span className="text-zinc-300">Past tense → went</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS SPEAKLY AI? */}
      <section className="space-y-2 pt-2" aria-labelledby="what-is-speakly">
        <h2 id="what-is-speakly" className="text-lg font-bold text-zinc-100 tracking-tight">
          What is Speakly AI?
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Speakly AI is an AI-powered English speaking practice platform designed for language learners, students, and job seekers. Unlike flashcards or grammar tests, Speakly AI focuses exclusively on spoken communication. You speak out loud, hear real-time AI replies, and receive immediate gentle feedback to improve fluency and accuracy.
        </p>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="space-y-3 pt-2" aria-labelledby="how-it-works-heading">
        <div className="flex items-center justify-between">
          <h2 id="how-it-works-heading" className="text-lg font-bold text-zinc-100 tracking-tight">
            How It Works
          </h2>
          <button
            onClick={() => onNavigate('/how-it-works')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Learn more →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Card className="p-3 border-zinc-800/80 bg-zinc-900/60">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 text-xs font-bold">
                1
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100">Choose a Scenario</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Select daily small talk, job interviews, campus life, or open discussion.</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 border-zinc-800/80 bg-zinc-900/60">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 text-xs font-bold">
                2
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100">Speak Naturally</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Tap the microphone and talk without stress. Your AI partner listens and responds.</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 border-zinc-800/80 bg-zinc-900/60">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 text-violet-400 text-xs font-bold">
                3
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100">Get Instant Corrections</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">See clear, polite corrections on awkward phrasing, verb tenses, and vocabulary.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. PRACTICE MODES */}
      <section className="space-y-3 pt-2" aria-labelledby="practice-modes-heading">
        <div className="flex items-center justify-between">
          <h2 id="practice-modes-heading" className="text-lg font-bold text-zinc-100 tracking-tight">
            Practice Modes
          </h2>
          <button
            onClick={() => onNavigate('/practice-modes')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            All modes →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Card className="p-3 border-zinc-800/80 bg-zinc-900/60">
            <MessageCircle className="w-4 h-4 text-indigo-400 mb-1" />
            <h3 className="text-xs font-bold text-zinc-100">Daily Conversation</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Talk naturally. Improve daily.</p>
          </Card>

          <Card className="p-3 border-zinc-800/80 bg-zinc-900/60">
            <Briefcase className="w-4 h-4 text-amber-400 mb-1" />
            <h3 className="text-xs font-bold text-zinc-100">Job Interview</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Practice. Answer. Improve.</p>
          </Card>

          <Card className="p-3 border-zinc-800/80 bg-zinc-900/60">
            <GraduationCap className="w-4 h-4 text-emerald-400 mb-1" />
            <h3 className="text-xs font-bold text-zinc-100">College Life</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Speak confidently on campus.</p>
          </Card>

          <Card className="p-3 border-zinc-800/80 bg-zinc-900/60">
            <Sparkles className="w-4 h-4 text-violet-400 mb-1" />
            <h3 className="text-xs font-bold text-zinc-100">Free Talk</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Talk about anything.</p>
          </Card>
        </div>
      </section>

      {/* 5. WHY PRACTICE SPEAKING? */}
      <section className="space-y-3 pt-2" aria-labelledby="why-practice-heading">
        <h2 id="why-practice-heading" className="text-lg font-bold text-zinc-100 tracking-tight">
          Why Practice Speaking?
        </h2>

        <div className="space-y-2">
          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>No Fear of Judgment:</strong> Practice at your own pace without feeling embarrassed or anxious about making mistakes.</span>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Builds Muscle Memory:</strong> Speaking out loud activates vocal habits and fluency that passive reading cannot match.</span>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Available Anytime:</strong> Practice 5 to 10 minutes a day on your phone whenever you have a quiet moment.</span>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (AEO & HUMAN SEARCH) */}
      <section className="space-y-3 pt-2" aria-labelledby="faq-heading">
        <div className="flex items-center justify-between">
          <h2 id="faq-heading" className="text-lg font-bold text-zinc-100 tracking-tight">
            Frequently Asked Questions
          </h2>
          <button
            onClick={() => onNavigate('/faq')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Full FAQ →
          </button>
        </div>

        <div className="space-y-2" aria-label="Featured FAQ questions">
          {faqs.slice(0, 5).map((faq, i) => {
            const isOpen = openFaqIndex === i
            return (
              <Card
                key={i}
                className={`border-zinc-800/80 bg-zinc-900/60 text-left transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-indigo-500/40 bg-zinc-900/90 shadow-md shadow-indigo-500/5' : 'hover:border-zinc-700/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={isOpen}
                  className="w-full p-3 flex items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <h3 className="text-xs font-semibold text-zinc-100 flex-1 pr-1">
                    {faq.q}
                  </h3>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : 'text-zinc-500'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 pt-0 border-t border-zinc-800/50">
                    <p className="text-[11px] text-zinc-300 leading-relaxed pt-2">
                      {faq.a}
                    </p>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center pt-4 pb-2" aria-labelledby="cta-heading">
        <Card className="p-4 border-zinc-800/80 bg-zinc-900/90 shadow-xl space-y-3">
          <h2 id="cta-heading" className="text-base font-bold text-zinc-100">
            Ready to speak?
          </h2>
          <p className="text-xs text-zinc-400">
            Start a speaking session now with your AI partner.
          </p>
          <Button
            size="lg"
            variant="primary"
            onClick={onStartPracticing}
            className="w-full shadow-lg shadow-indigo-500/25"
            leftIcon={<Mic className="w-4 h-4" />}
          >
            Start Practicing
          </Button>
        </Card>
      </section>
    </article>
  )
}
