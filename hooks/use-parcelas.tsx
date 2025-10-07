'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Parcela {
  id: string
  descricao: string
  valor_total: number
  parcela_atual: number
  total_parcelas: number
  valor_parcela: number
  data_compra: string
  dia_vencimento: number
  usuario_id: string
  categoria?: string
  estabelecimento?: string
  cartao_id?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null
  created_at: string
}
export interface InsertParcela {
  descricao: string
  valor_total: number
  total_parcelas: number
  valor_parcela: number
  data_compra: string
  dia_vencimento: number
  categoria?: string
  estabelecimento?: string
  cartao_id?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useParcelas() {
  const queryClient = useQueryClient()
  const { data: parcelas = [], isLoading, error } = useQuery({
    queryKey: ['parcelas'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_parcelas')

      if (error) throw error
      return data || []
    },
  })
  const createParcela = useMutation({
    mutationFn: async (parcela: InsertParcela) => {
      const { data, error } = await supabase.rpc('criar_parcela', {
        p_descricao: parcela.descricao,
        p_valor_total: parcela.valor_total,
        p_total_parcelas: parcela.total_parcelas,
        p_valor_parcela: parcela.valor_parcela,
        p_data_compra: parcela.data_compra,
        p_dia_vencimento: parcela.dia_vencimento,
        p_categoria: parcela.categoria,
        p_estabelecimento: parcela.estabelecimento,
        p_cartao_id: parcela.cartao_id,
        p_familia_id: parcela.familia_id,
        p_visivel_familia: parcela.visivel_familia,
        p_privado: parcela.privado
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateParcela = useMutation({
    mutationFn: async ({ id, ...parcela }: Partial<Parcela> & { id: string }) => {
      const { data, error } = await supabase.rpc('atualizar_parcela', {
        p_id: id,
        p_descricao: parcela.descricao,
        p_valor_total: parcela.valor_total,
        p_parcela_atual: parcela.parcela_atual,
        p_total_parcelas: parcela.total_parcelas,
        p_valor_parcela: parcela.valor_parcela,
        p_data_compra: parcela.data_compra,
        p_dia_vencimento: parcela.dia_vencimento,
        p_categoria: parcela.categoria,
        p_estabelecimento: parcela.estabelecimento,
        p_cartao_id: parcela.cartao_id,
        p_visivel_familia: parcela.visivel_familia,
        p_privado: parcela.privado
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteParcela = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('deletar_parcela', {
        p_id: id
      })

      if (error) throw error
      return data
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


