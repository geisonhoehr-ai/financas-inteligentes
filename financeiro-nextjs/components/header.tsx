'use client'

import { Moon, Sun, LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b glass">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Financeiro v3.0</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{user.name || user.email}</span>
            </div>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Alternar tema"
            className="rounded-full"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Logout */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              title="Sair"
              className="rounded-full hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
