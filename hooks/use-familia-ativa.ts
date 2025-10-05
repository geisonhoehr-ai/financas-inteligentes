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

const FamiliaAtivaContext = createContext<FamiliaAtivaContextType | undefined>(undefined)

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
      if (saved && familias.some(f => f.id === saved)) {
        setFamiliaAtivaIdState(saved)
      } else if (familias.length > 0) {
        // Auto-selecionar primeira família se não há seleção salva
        setFamiliaAtivaIdState(familias[0].id)
      }
    }
  }, [user, familias, isLoading])

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (user && familiaAtivaId) {
      localStorage.setItem(`familia-ativa-${user.id}`, familiaAtivaId)
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
