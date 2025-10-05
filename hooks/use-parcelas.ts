'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Parcela {
  id: number
  descricao: string
  valor_total: number
  parcela_atual: number
  total_parcelas: number
  valor_parcela: number
  data_compra: string
  dia_vencimento: number
  usuario_id: number
  categoria?: string
  estabelecimento?: string
  cartao_id?: number
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}

export interface InsertParcela {
  descricao: string
  valor_total: number
  parcela_atual?: number
  total_parcelas: number
  valor_parcela: number
  data_compra: string
  dia_vencimento: number
  usuario_id: number
  categoria?: string
  estabelecimento?: string
  cartao_id?: number
}

export function useParcelas() {
  const queryClient = useQueryClient()

  // Fetch parcelas
  const { data: parcelas = [], isLoading, error } = useQuery({
    queryKey: ['parcelas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compras_parceladas')
        .select('*')
        .eq('deletado', false)
        .order('data_compra', { ascending: false })

      if (error) throw error
      return data as Parcela[]
    },
  })

  // Create parcela
  const createParcela = useMutation({
    mutationFn: async (parcela: InsertParcela) => {
      const { data, error } = await supabase
        .from('compras_parceladas')
        // @ts-expect-error - Table exists in DB but not in generated types
        .insert(parcela)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })

  // Update parcela
  const updateParcela = useMutation({
    mutationFn: async ({ id, ...parcela }: Partial<Parcela> & { id: number }) => {
      const { data, error } = await supabase
        .from('compras_parceladas')
        // @ts-expect-error - Table exists in DB but not in generated types
        .update(parcela)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })

  // Soft delete parcela
  const deleteParcela = useMutation({
    mutationFn: async (id: number) => {
      // @ts-expect-error - RPC function types not generated
      const { error } = await supabase.rpc('soft_delete', {
        p_tabela: 'compras_parceladas',
        p_id: id,
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
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
  const stats = {
    totalParcelado: parcelas.reduce((sum, p) => sum + p.valor_total, 0),
    parcelaAtual: parcelas.reduce((sum, p) => sum + p.valor_parcela, 0),
    parcelasAtivas: parcelas.filter(p => p.parcela_atual < p.total_parcelas).length,
    proximasParcelas: parcelas.filter(p => p.parcela_atual < p.total_parcelas).reduce((sum, p) => 
      sum + (p.valor_parcela * (p.total_parcelas - p.parcela_atual)), 0
    ),
  }

  return {
    parcelas,
    stats,
    isLoading,
    error,
    createParcela: createParcela.mutate,
    updateParcela: updateParcela.mutate,
    deleteParcela: deleteParcela.mutate,
    isCreating: createParcela.isPending,
    isUpdating: updateParcela.isPending,
    isDeleting: deleteParcela.isPending,
  }
}

