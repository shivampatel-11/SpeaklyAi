import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/authService'
import { UserProfile } from '@/types'
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: UserProfile) => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (tab === 'login') {
        const user = await authService.login(email, password)
        onSuccess(user)
        onClose()
      } else {
        const user = await authService.signup(name, email, password)
        onSuccess(user)
        onClose()
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoAccount = () => {
    setEmail('alex@speakly.ai')
    setPassword('password123')
    setTab('login')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === 'login' ? 'Sign In' : 'Create Account'}
    >
      <div className="space-y-4 pt-1">
        {/* Tab switch */}
        <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setTab('login')
              setError(null)
            }}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all',
              tab === 'login'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup')
              setError(null)
            }}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all',
              tab === 'signup'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-400">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-400">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isLoading}
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Demo login helper */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="text-[11px] text-indigo-400 hover:text-indigo-300"
          >
            Use demo account
          </button>
        </div>
      </div>
    </Modal>
  )
}
