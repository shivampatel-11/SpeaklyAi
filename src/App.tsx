import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { AppLayout } from '@/layouts/AppLayout'
import { NavTab } from '@/components/common/MobileNav'
import { PublicHeader } from '@/components/common/PublicHeader'
import { PublicFooter } from '@/components/common/PublicFooter'
import { HomeScreen } from '@/pages/HomeScreen'
import { LoadingState } from '@/components/common/LoadingState'
import { authService } from '@/services/authService'
import { progressService } from '@/services/progressService'
import { UserProfile, UserProgressStats } from '@/types'
import { updatePageMeta } from '@/utils/seo'

// Lazy-loaded app views
const PracticePage = lazy(() =>
  import('@/pages/PracticePage').then((m) => ({ default: m.PracticePage }))
)
const ProgressPage = lazy(() =>
  import('@/pages/ProgressPage').then((m) => ({ default: m.ProgressPage }))
)
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
)
const AuthModal = lazy(() =>
  import('@/features/auth/AuthModal').then((m) => ({ default: m.AuthModal }))
)

// Lazy-loaded public SEO pages
const PublicHomePage = lazy(() =>
  import('@/pages/public/PublicHomePage').then((m) => ({ default: m.PublicHomePage }))
)
const AboutPage = lazy(() =>
  import('@/pages/public/AboutPage').then((m) => ({ default: m.AboutPage }))
)
const HowItWorksPage = lazy(() =>
  import('@/pages/public/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage }))
)
const PracticeModesPage = lazy(() =>
  import('@/pages/public/PracticeModesPage').then((m) => ({ default: m.PracticeModesPage }))
)
const FaqPage = lazy(() =>
  import('@/pages/public/FaqPage').then((m) => ({ default: m.FaqPage }))
)

export type PublicRoute = '/' | '/about' | '/how-it-works' | '/practice-modes' | '/faq'

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname
      return p === '' ? '/' : p
    }
    return '/'
  })
  const [currentTab, setCurrentTab] = useState<NavTab>('home')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<UserProgressStats | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAppMode, setIsAppMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.pathname.startsWith('/app') ||
        window.location.pathname.startsWith('/practice') ||
        window.location.pathname.startsWith('/progress') ||
        window.location.pathname.startsWith('/profile')
      )
    }
    return false
  })

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/'
      setCurrentPath(path)
      if (
        path.startsWith('/app') ||
        path.startsWith('/practice') ||
        path.startsWith('/progress') ||
        path.startsWith('/profile')
      ) {
        setIsAppMode(true)
      } else {
        setIsAppMode(false)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateTo = useCallback((path: string) => {
    setCurrentPath(path)
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
    }
    if (
      path.startsWith('/app') ||
      path.startsWith('/practice') ||
      path.startsWith('/progress') ||
      path.startsWith('/profile')
    ) {
      setIsAppMode(true)
    } else {
      setIsAppMode(false)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const stats = await progressService.getUserProgress(currentUser.id)
        setProgress(stats)
      }
    } catch (err) {
      console.warn('User session check notice:', err)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    authService.getCurrentUser().then((currentUser) => {
      if (!isMounted) return
      setUser(currentUser)
      if (currentUser) {
        progressService.getUserProgress(currentUser.id).then((stats) => {
          if (isMounted) setProgress(stats)
        })
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  // Enforce noindex,nofollow when user is interacting with private app features
  useEffect(() => {
    if (isAppMode) {
      updatePageMeta({
        title: 'Speakly AI — English Practice Session',
        description: 'Private student speaking session.',
        path: '/app',
        isPrivate: true,
      })
    }
  }, [isAppMode, currentTab])

  const handleStartSpeaking = () => {
    setIsAppMode(true)
    setCurrentTab('practice')
    navigateTo('/app')
  }

  const handleLogout = async () => {
    await authService.logout()
    setUser(null)
    setIsAuthModalOpen(true)
  }

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser)
    progressService.getUserProgress(authenticatedUser.id).then(setProgress)
    setIsAppMode(true)
    navigateTo('/app')
  }

  // 1. PUBLIC MARKETING & SEO ROUTES
  if (!isAppMode) {
    return (
      <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto relative shadow-2xl border-x border-zinc-900/60 bg-zinc-950/40">
        <PublicHeader
          currentPath={currentPath}
          onNavigate={navigateTo}
          onStartPracticing={handleStartSpeaking}
        />

        <main className="flex-1 w-full px-4 pt-3 pb-8">
          <Suspense fallback={<LoadingState message="Loading..." />}>
            {currentPath === '/about' && (
              <AboutPage
                onStartPracticing={handleStartSpeaking}
                onNavigate={navigateTo}
              />
            )}

            {currentPath === '/how-it-works' && (
              <HowItWorksPage
                onStartPracticing={handleStartSpeaking}
                onNavigate={navigateTo}
              />
            )}

            {currentPath === '/practice-modes' && (
              <PracticeModesPage
                onStartPracticing={handleStartSpeaking}
                onNavigate={navigateTo}
              />
            )}

            {currentPath === '/faq' && (
              <FaqPage
                onStartPracticing={handleStartSpeaking}
                onNavigate={navigateTo}
              />
            )}

            {(currentPath === '/' ||
              currentPath === '' ||
              (!['/about', '/how-it-works', '/practice-modes', '/faq'].includes(currentPath))) && (
              <PublicHomePage
                onStartPracticing={handleStartSpeaking}
                onNavigate={navigateTo}
              />
            )}
          </Suspense>
        </main>

        <PublicFooter onNavigate={navigateTo} />

        {/* Auth modal accessible from public header / CTA */}
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    )
  }

  // 2. PRIVATE AUTHENTICATED APP / PRACTICE VIEWS (noindex, nofollow)
  return (
    <AppLayout
      currentTab={currentTab}
      onSelectTab={(tab) => {
        setCurrentTab(tab)
        if (tab === 'home' && !user) {
          setIsAppMode(false)
          navigateTo('/')
        }
      }}
      streak={progress?.currentStreak ?? 4}
      level={user?.targetLevel ?? 'Intermediate'}
      onProfileClick={() => setIsAuthModalOpen(true)}
    >
      <Suspense fallback={<LoadingState message="Loading..." />}>
        {/* 1. STUDENT DASHBOARD */}
        {currentTab === 'home' && user && (
          <HomeScreen
            user={user}
            progress={progress}
            onStartSpeaking={() => setCurrentTab('practice')}
            onViewProgress={() => setCurrentTab('progress')}
          />
        )}

        {/* 2. PRACTICE FLOW */}
        {currentTab === 'practice' && (
          <PracticePage
            onNavigateHome={() => {
              if (user) {
                setCurrentTab('home')
                loadUserData()
              } else {
                setIsAppMode(false)
                navigateTo('/')
              }
            }}
          />
        )}

        {/* 3. PROGRESS PAGE */}
        {currentTab === 'progress' && (
          <ProgressPage
            userId={user?.id}
            onStartSpeaking={() => setCurrentTab('practice')}
          />
        )}

        {/* 4. PROFILE PAGE */}
        {currentTab === 'profile' && user && (
          <ProfilePage
            user={user}
            onLogout={handleLogout}
          />
        )}

        {/* SECURE AUTH MODAL */}
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </Suspense>
    </AppLayout>
  )
}

export default App
