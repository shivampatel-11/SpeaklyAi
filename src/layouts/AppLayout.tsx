import React from 'react'
import { Header } from '@/components/common/Header'
import { MobileNav, NavTab } from '@/components/common/MobileNav'
import { AceternityBackground } from '@/components/ui/AceternityBackground'

interface AppLayoutProps {
  children: React.ReactNode
  currentTab: NavTab
  onSelectTab: (tab: NavTab) => void
  streak?: number
  level?: string
  onProfileClick?: () => void
  hideNav?: boolean
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentTab,
  onSelectTab,
  streak = 4,
  level = 'Intermediate',
  onProfileClick,
  hideNav = false,
}) => {
  return (
    <AceternityBackground>
      <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto relative shadow-2xl border-x border-zinc-900/60 bg-zinc-950/40">
        {/* Sticky Header */}
        <Header
          streak={streak}
          level={level}
          onLogoClick={() => onSelectTab('home')}
          onProfileClick={onProfileClick}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 pt-3 pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Mobile-first bottom navigation bar */}
        {!hideNav && (
          <MobileNav currentTab={currentTab} onSelectTab={onSelectTab} />
        )}
      </div>
    </AceternityBackground>
  )
}
