import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PublicHeaderProps {
  currentPath: string
  onNavigate: (path: string) => void
  onStartPracticing: () => void
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentPath,
  onNavigate,
  onStartPracticing,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand logo */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-left group focus:outline-none"
          aria-label="Speakly AI Home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Speakly <span className="text-indigo-400">AI</span>
          </span>
        </button>

        {/* Right Nav Links & CTA */}
        <nav className="flex items-center gap-2" aria-label="Public navigation">
          <button
            onClick={() => onNavigate('/how-it-works')}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${
              currentPath === '/how-it-works' ? 'text-indigo-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            How It Works
          </button>

          <Button
            size="sm"
            variant="primary"
            onClick={onStartPracticing}
            className="text-xs font-semibold px-3 py-1.5 h-8"
            rightIcon={<ArrowRight className="w-3 h-3" />}
          >
            Practice
          </Button>
        </nav>
      </div>
    </header>
  )
}
