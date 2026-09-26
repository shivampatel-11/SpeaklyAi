import React from 'react'
import { Home, Mic, BarChart3, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavTab = 'home' | 'practice' | 'progress' | 'profile'

interface MobileNavProps {
  currentTab: NavTab
  onSelectTab: (tab: NavTab) => void
  className?: string
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  className,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'practice' as NavTab, label: 'Practice', icon: Mic, isFeatured: true },
    { id: 'progress' as NavTab, label: 'Progress', icon: BarChart3 },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ]

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/85 backdrop-blur-xl border-t border-zinc-800/80 safe-bottom',
        className
      )}
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id

          if (tab.isFeatured) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
                aria-label="Start Voice Practice"
              >
                <div
                  className={cn(
                    'w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl',
                    isActive
                      ? 'bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-indigo-500/40 ring-4 ring-zinc-950 scale-105'
                      : 'bg-zinc-800/95 text-indigo-400 border border-zinc-700 hover:bg-zinc-700'
                  )}
                >
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-semibold text-zinc-300 mt-1">
                  {tab.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-4 min-w-[60px] min-h-[48px] rounded-xl transition-colors focus:outline-none',
                isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500 shadow-sm shadow-indigo-400" />
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
