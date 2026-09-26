import { useState, useEffect } from 'react'

export type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    // Default to dark theme as required by design specification
    const root = document.documentElement
    root.classList.add('dark')
    root.classList.remove('light')
  }, [theme])

  const toggleTheme = () => {
    // Currently forced dark-first for premium AI SaaS aesthetic
    setTheme('dark')
  }

  return { theme, toggleTheme }
}
