'use client'
import { useContext } from 'react'
import { FamiliaAtivaContext } from '@/components/familia-ativa-provider'
export function useFamiliaAtiva() {
  const context = useContext(FamiliaAtivaContext)
  if (context === undefined) {
    throw new Error('useFamiliaAtiva deve ser usado dentro de um FamiliaAtivaProvider')
  }
  return context
}

