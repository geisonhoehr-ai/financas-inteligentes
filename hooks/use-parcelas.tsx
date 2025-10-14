'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'

export interface Parcela {
  id: string
  produto: string
  valor_total: number
  parcelas_pagas: number | null
  total_parcelas: number
  valor_parcela: number
  data_compra: string
  dia_vencimento: number | null
  primeira_parcela: string | null
  usuario_id: string | null
  categoria_id?: string | null
  observacoes?: string | null
  tipo_pagamento?: string | null
  finalizada?: boolean | null
  familia_id?: string | null
  visivel_familia?: boolean | null
  privado?: boolean | null
  deletado: boolean | null
  deletado_em: string | null
  deletado_por: string | null
  created_at: string | null
  updated_at: string | null
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
  const { familiaAtivaId } = useFamiliaAtiva()
  
  const { data: parcelas = [], isLoading, error } = useQuery<Parcela[]>({
    queryKey: ['parcelas', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      let query = supabase
        .from('compras_parceladas')
        .select('*')
        .eq('deletado', false)
      
      if (familiaAtivaId) {
        query = query.eq('familia_id', familiaAtivaId)
      } else {
        query = query.is('familia_id', null)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return (data as unknown as Parcela[]) || []
    },
  })
  const createParcela = useMutation({
    mutationFn: async (parcela: any) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('compras_parceladas')
        .insert([{
          produto: parcela.descricao || parcela.produto,
          valor_total: parcela.valor_total,
          total_parcelas: parcela.total_parcelas,
          valor_parcela: parcela.valor_parcela,
          parcelas_pagas: 0,
          data_compra: parcela.data_compra,
          dia_vencimento: parcela.dia_vencimento,
          primeira_parcela: parcela.data_compra,
          categoria_id: parcela.categoria_id || null,
          observacoes: parcela.estabelecimento || '',
          tipo_pagamento: 'cartao_credito',
          finalizada: false,
          usuario_id: user.user.id,
          familia_id: parcela.familia_id || null,
          visivel_familia: parcela.visivel_familia !== false,
          privado: parcela.privado || false,
          deletado: false
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar parcela:', error)
        console.error('Dados enviados:', parcela)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
  const updateParcela = useMutation({
    mutationFn: async ({ id, ...parcela }: Partial<Parcela> & { id: string }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      // Calcular se está finalizada
      const finalizada = (parcela.parcelas_pagas || 0) >= (parcela.total_parcelas || 0)

      const { data, error } = await supabase
        .from('compras_parceladas')
        .update({
          produto: parcela.produto,
          valor_total: parcela.valor_total,
          parcelas_pagas: parcela.parcelas_pagas,
          total_parcelas: parcela.total_parcelas,
          valor_parcela: parcela.valor_parcela,
          data_compra: parcela.data_compra,
          dia_vencimento: parcela.dia_vencimento,
          categoria_id: parcela.categoria_id,
          observacoes: parcela.observacoes,
          tipo_pagamento: parcela.tipo_pagamento,
          finalizada: finalizada,
          visivel_familia: parcela.visivel_familia,
          privado: parcela.privado,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .eq('deletado', false)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar parcela:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
  const deleteParcela = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('compras_parceladas')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao deletar parcela:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
    },
  })
  const stats = {
    totalParcelado: parcelas.reduce((sum, p) => sum + p.valor_total, 0),
    parcelaAtual: parcelas.reduce((sum, p) => sum + p.valor_parcela, 0),
    parcelasAtivas: parcelas.filter(p => (p.parcelas_pagas || 0) < p.total_parcelas).length,
    proximasParcelas: parcelas.filter(p => (p.parcelas_pagas || 0) < p.total_parcelas).reduce((sum, p) =>
      sum + (p.valor_parcela * (p.total_parcelas - (p.parcelas_pagas || 0))), 0
    ),
  }
  return {
    parcelas,
    stats,
    isLoading,
    error,
    createParcela: createParcela.mutateAsync,
    updateParcela: updateParcela.mutateAsync,
    deleteParcela: deleteParcela.mutateAsync,
    isCreating: createParcela.isPending,
    isUpdating: updateParcela.isPending,
    isDeleting: deleteParcela.isPending,
  }
}


