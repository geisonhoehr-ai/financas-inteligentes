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
  const { data: parcelas = [], isLoading, error } = useQuery({
    queryKey: ['parcelas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .order('data_compra', { ascending: false })
    },
  })
  const createParcela = useMutation({
    mutationFn: async (parcela: InsertParcela) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateParcela = useMutation({
    mutationFn: async ({ id, ...parcela }: Partial<Parcela> & { id: number }) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteParcela = useMutation({
    mutationFn: async (id: number) => {
      console.log('RPC desabilitado temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      refreshDashboard()
    },
  })
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }
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

