'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/components/auth-provider'
import { useFamilias } from '@/hooks/use-familias'

interface FamiliaAtivaContextType {
  familiaAtivaId: string | null
  setFamiliaAtivaId: (id: string | null) => void
  familiaAtiva: any | null
  isLoading: boolean
}

export const FamiliaAtivaContext = createContext<FamiliaAtivaContextType | undefined>(undefined)

interface FamiliaAtivaProviderProps {
  children: ReactNode
}

export function FamiliaAtivaProvider({ children }: FamiliaAtivaProviderProps) {
  const { user } = useAuth()
  const { familias, isLoading } = useFamilias()
  const [familiaAtivaId, setFamiliaAtivaIdState] = useState<string | null>(null)

  // Carregar família ativa do localStorage
  useEffect(() => {
    if (user && !isLoading && familias) {
      const saved = localStorage.getItem(`familia-ativa-${user.id}`)
      if (saved === 'null' || saved === null) {
        // Usuário selecionou "Perfil Pessoal"
        setFamiliaAtivaIdState(null)
      } else if (saved && familias.some(f => f.id === saved)) {
        // Usuário tem uma família salva válida
        setFamiliaAtivaIdState(saved)
      }
      // Não auto-seleciona mais a primeira família
      // O usuário deve escolher manualmente entre Perfil Pessoal ou Família
    }
  }, [user, familias, isLoading])

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (user) {
      if (familiaAtivaId === null) {
        localStorage.setItem(`familia-ativa-${user.id}`, 'null')
      } else if (familiaAtivaId) {
        localStorage.setItem(`familia-ativa-${user.id}`, familiaAtivaId)
      }
    }
  }, [user, familiaAtivaId])

  const setFamiliaAtivaId = (id: string | null) => {
    setFamiliaAtivaIdState(id)
  }

  const familiaAtiva = familias?.find(f => f.id === familiaAtivaId) || null

  const value: FamiliaAtivaContextType = {
    familiaAtivaId,
    setFamiliaAtivaId,
    familiaAtiva,
    isLoading,
  }

  return (
    <FamiliaAtivaContext.Provider value={value}>
      {children}
    </FamiliaAtivaContext.Provider>
  )
}

export function useFamiliaAtiva() {
  const context = useContext(FamiliaAtivaContext)
  if (context === undefined) {
    throw new Error('useFamiliaAtiva deve ser usado dentro de um FamiliaAtivaProvider')
  }
  return context
}
