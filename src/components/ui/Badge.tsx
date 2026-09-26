import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'indigo' | 'warning'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-200 border-zinc-700/60',
    secondary: 'bg-zinc-900/80 text-zinc-400 border-zinc-800',
    outline: 'border-zinc-700/80 text-zinc-300 bg-transparent',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors select-none',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
