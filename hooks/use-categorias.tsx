'use client'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Categoria {
  id: string
  nome: string
  icone: string
  cor: string
  tipo: 'gasto' | 'receita'
  ativa: boolean
  sistema: boolean
  usuario_id: string | null
  familia_id: string | null
  deletado: boolean
  deletado_em: string | null
  created_at: string
}

export function useCategorias() {
  const { data: categorias = [], isLoading, error } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('ativa', true)
        .eq('deletado', false)
        .order('nome')

      if (error) throw error
      return data as Categoria[]
    },
  })

  return {
    categorias,
    isLoading,
    error,
  }
}
