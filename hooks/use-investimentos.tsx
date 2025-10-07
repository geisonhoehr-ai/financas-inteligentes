'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Investimento {
  id: number
  nome: string
  tipo: string
  valor_investido: number
  valor_atual: number
  usuario_id: number
  data_aplicacao: string
  observacoes?: string
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}
export interface InsertInvestimento {
  nome: string
  tipo: string
  valor_investido: number
  valor_atual: number
  usuario_id: number
  data_aplicacao: string
  observacoes?: string
}
export function useInvestimentos() {
  const queryClient = useQueryClient()
  const { data: investimentos = [], isLoading, error } = useQuery({
    queryKey: ['investimentos'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .from('investimentos')
        .select()
        .eq('usuario_id', user.user.id)
        .eq('deletado', false)
        .order('data_aplicacao', { ascending: false })

      if (error) throw error
      return data || []
    },
  })
  const createInvestimento = useMutation({
    mutationFn: async (investimento: InsertInvestimento) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('investimentos')
        .insert({
          ...investimento,
          usuario_id: user.user.id,
          deletado: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
    },
  })
  const updateInvestimento = useMutation({
    mutationFn: async ({ id, ...investimento }: Partial<Investimento> & { id: number }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('investimentos')
        .update({
          ...investimento,
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
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
    },
  })
  const deleteInvestimento = useMutation({
    mutationFn: async (id: number) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('investimentos')
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
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
    },
  })
  const totalInvestido = investimentos.reduce((sum, i) => sum + i.valor_investido, 0)
  const totalAtual = investimentos.reduce((sum, i) => sum + i.valor_atual, 0)
  const rendimento = totalAtual - totalInvestido
  const rentabilidade = totalInvestido > 0 ? ((rendimento / totalInvestido) * 100) : 0
  const stats = {
    totalInvestido,
    rentabilidade: rentabilidade.toFixed(2),
    investimentosAtivos: investimentos.length,
    rendimentoTotal: rendimento,
  }
  return {
    investimentos,
    stats,
    isLoading,
    error,
    createInvestimento: createInvestimento.mutate,
    updateInvestimento: updateInvestimento.mutate,
    deleteInvestimento: deleteInvestimento.mutate,
    isCreating: createInvestimento.isPending,
    isUpdating: updateInvestimento.isPending,
    isDeleting: deleteInvestimento.isPending,
  }
}


