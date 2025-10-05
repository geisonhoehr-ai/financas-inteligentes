'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Ferramenta {
  id: number
  nome: string
  valor: number
  usuario_id: number
  categoria: string
  periodicidade: string
  status: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}

export interface InsertFerramenta {
  nome: string
  valor: number
  usuario_id: number
  categoria: string
  periodicidade?: string
  status?: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
}

export function useFerramentas() {
  const queryClient = useQueryClient()

  // Fetch ferramentas
  const { data: ferramentas = [], isLoading, error } = useQuery({
    queryKey: ['ferramentas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ferramentas_ia_dev')
        .select('*')
        .eq('deletado', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Ferramenta[]
    },
  })

  // Create ferramenta
  const createFerramenta = useMutation({
    mutationFn: async (ferramenta: InsertFerramenta) => {
      const { data, error } = await supabase
        .from('ferramentas_ia_dev')
        .insert(ferramenta)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })

  // Update ferramenta
  const updateFerramenta = useMutation({
    mutationFn: async ({ id, ...ferramenta }: Partial<Ferramenta> & { id: number }) => {
      const { data, error } = await supabase
        .from('ferramentas_ia_dev')
        .update(ferramenta)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })

  // Soft delete ferramenta
  const deleteFerramenta = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.rpc('soft_delete', {
        p_tabela: 'ferramentas_ia_dev',
        p_id: id,
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      refreshDashboard()
    },
  })

  // Helper to refresh dashboard
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }

  // Calculate stats
  const ferramentasAtivas = ferramentas.filter(f => f.status === 'ativa')
  const stats = {
    gastoMensal: ferramentasAtivas
      .filter(f => f.periodicidade === 'mensal')
      .reduce((sum, f) => sum + f.valor, 0),
    ferramentasAtivas: ferramentasAtivas.length,
    softwaresLicenciados: ferramentas.filter(f => f.categoria === 'software').length,
    gastoAnual: ferramentasAtivas.reduce((sum, f) => {
      if (f.periodicidade === 'mensal') return sum + (f.valor * 12)
      if (f.periodicidade === 'anual') return sum + f.valor
      return sum
    }, 0),
  }

  return {
    ferramentas,
    stats,
    isLoading,
    error,
    createFerramenta: createFerramenta.mutate,
    updateFerramenta: updateFerramenta.mutate,
    deleteFerramenta: deleteFerramenta.mutate,
    isCreating: createFerramenta.isPending,
    isUpdating: updateFerramenta.isPending,
    isDeleting: deleteFerramenta.isPending,
  }
}

