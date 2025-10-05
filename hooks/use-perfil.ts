'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/components/auth-provider'

export type PerfilTipo = 'pessoal' | 'familia' | 'empresa'

interface PerfilAtivo {
  tipo: PerfilTipo
  id?: string // ID da família ou empresa
  nome?: string // Nome da família ou empresa
}

interface PerfilContextType {
  perfilAtivo: PerfilAtivo
  setPerfilAtivo: (perfil: PerfilAtivo) => void
  isPessoal: boolean
  isFamilia: boolean
  isEmpresa: boolean
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined)

interface PerfilProviderProps {
  children: ReactNode
}

export function PerfilProvider({ children }: PerfilProviderProps) {
  const { user } = useAuth()
  const [perfilAtivo, setPerfilAtivo] = useState<PerfilAtivo>({ tipo: 'pessoal' })

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (perfilAtivo) {
      localStorage.setItem('perfil-ativo', JSON.stringify(perfilAtivo))
    }
  }, [perfilAtivo])

  // Carregar do localStorage na inicialização
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem('perfil-ativo')
      if (saved) {
        try {
          setPerfilAtivo(JSON.parse(saved))
        } catch {
          setPerfilAtivo({ tipo: 'pessoal' })
        }
      }
    }
  }, [user])

  const value: PerfilContextType = {
    perfilAtivo,
    setPerfilAtivo,
    isPessoal: perfilAtivo.tipo === 'pessoal',
    isFamilia: perfilAtivo.tipo === 'familia',
    isEmpresa: perfilAtivo.tipo === 'empresa',
  }

  return (
    <PerfilContext.Provider value={value}>
      {children}
    </PerfilContext.Provider>
  )
}

export function usePerfil() {
  const context = useContext(PerfilContext)
  if (context === undefined) {
    throw new Error('usePerfil deve ser usado dentro de um PerfilProvider')
  }
  return context
}
