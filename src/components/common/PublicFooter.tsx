import React from 'react'
import { Sparkles, ShieldCheck } from 'lucide-react'

interface PublicFooterProps {
  onNavigate: (path: string) => void
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/80 pt-6 pb-12 mt-8 text-center">
      <div className="max-w-md mx-auto px-4 space-y-4">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-zinc-100">Speakly AI</span>
        </div>

        <p className="text-xs text-zinc-400 max-w-xs mx-auto">
          Practice English by speaking. Build confidence through real conversations.
        </p>

        {/* Semantic Internal Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-zinc-400" aria-label="Footer navigation">
          <button onClick={() => onNavigate('/')} className="hover:text-zinc-200 transition-colors">
            Home
          </button>
          <button onClick={() => onNavigate('/how-it-works')} className="hover:text-zinc-200 transition-colors">
            How It Works
          </button>
          <button onClick={() => onNavigate('/practice-modes')} className="hover:text-zinc-200 transition-colors">
            Practice Modes
          </button>
          <button onClick={() => onNavigate('/about')} className="hover:text-zinc-200 transition-colors">
            About
          </button>
          <button onClick={() => onNavigate('/faq')} className="hover:text-zinc-200 transition-colors">
            FAQ
          </button>
        </nav>

        {/* Privacy Note & Copyright */}
        <div className="pt-2 border-t border-zinc-900 flex flex-col items-center gap-1.5 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Private audio sessions. No advertising trackers.</span>
          </div>
          <p>© {new Date().getFullYear()} Speakly AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
