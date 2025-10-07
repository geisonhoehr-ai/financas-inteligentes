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
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .from('compras_parceladas')
        .select(`
          id,
          descricao,
          valor_total,
          parcela_atual,
          total_parcelas,
          valor_parcela,
          data_compra,
          dia_vencimento,
          usuario_id,
          categoria,
          estabelecimento,
          cartao_id,
          cartao:cartoes(nome),
          deletado,
          deletado_em,
          deletado_por,
          created_at
        `)
        .eq('usuario_id', user.user.id)
        .eq('deletado', false)
        .order('data_compra', { ascending: false })

      if (error) throw error
      return data || []
    },
  })
  const createParcela = useMutation({
    mutationFn: async (parcela: InsertParcela) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('compras_parceladas')
        .insert({
          ...parcela,
          usuario_id: user.user.id,
          parcela_atual: parcela.parcela_atual || 1,
          deletado: false,
          created_at: new Date().toISOString()
        })
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
  const updateParcela = useMutation({
    mutationFn: async ({ id, ...parcela }: Partial<Parcela> & { id: number }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('compras_parceladas')
        .update({
          ...parcela,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
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
  const deleteParcela = useMutation({
    mutationFn: async (id: number) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('compras_parceladas')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .select()
        .single()

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


