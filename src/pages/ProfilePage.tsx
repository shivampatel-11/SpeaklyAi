import React from 'react'
import { UserProfile } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LogOut, Settings as SettingsIcon } from 'lucide-react'

interface ProfilePageProps {
  user: UserProfile
  onLogout: () => void
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  return (
    <div className="space-y-4 pt-3 pb-8 max-w-sm mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Profile</h1>
      </div>

      {/* Profile Card */}
      <Card className="p-4 border-zinc-800/80 bg-zinc-900/60 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-zinc-100 truncate">{user.name}</h2>
            <p className="text-xs text-zinc-400 truncate mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800/80 space-y-1">
          <button className="w-full flex items-center justify-between py-2 text-xs text-zinc-300 hover:text-zinc-100 transition-colors">
            <span className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-zinc-500" />
              Settings
            </span>
            <span className="text-zinc-500">→</span>
          </button>
        </div>
      </Card>

      {/* Log out */}
      <div className="pt-2">
        <Button
          variant="secondary"
          size="md"
          onClick={onLogout}
          className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 border-zinc-800/80"
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
        >
          Log out
        </Button>
      </div>
    </div>
  )
}
