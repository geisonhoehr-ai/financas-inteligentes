'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Checar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name,
            }
          : null
      )
      setIsLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 Auth state change:', _event, session?.user?.email)

      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name,
            }
          : null
      )
      setIsLoading(false)

      // Nota: Não redirecionar aqui pois a página de login já faz isso
      // O redirecionamento automático pode causar loops com o middleware
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
