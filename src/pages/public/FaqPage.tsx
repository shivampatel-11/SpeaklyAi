import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Mic, ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react'
import { updatePageMeta } from '@/utils/seo'

interface FaqPageProps {
  onStartPracticing: () => void
  onNavigate: (path: string) => void
}

export const FaqPage: React.FC<FaqPageProps> = ({ onStartPracticing, onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    updatePageMeta({
      title: 'Speakly AI FAQ — English Speaking Practice',
      description:
        'Frequently asked questions about Speakly AI, AI conversation practice, speech corrections, and mobile access.',
      path: '/faq',
    })
  }, [])

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

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
    <article className="space-y-6 pt-2 pb-8 max-w-sm mx-auto">
      <button
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <header className="space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Questions & Answers</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Tap any question below to reveal the answer.
        </p>
      </header>

      {/* FAQ Questions & Accordion Answers */}
      <section className="space-y-2.5" aria-label="FAQ questions list">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
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
                className="w-full p-3.5 flex items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <h2 className="text-xs font-semibold text-zinc-100 flex-1 pr-1">
                  {faq.q}
                </h2>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-400' : 'text-zinc-500'
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-3.5 pb-3.5 pt-0 border-t border-zinc-800/50">
                  <p className="text-xs text-zinc-300 leading-relaxed pt-2">
                    {faq.a}
                  </p>
                </div>
              )}
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
          Start Practicing
        </Button>
      </div>
    </article>
  )
}
