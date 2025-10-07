'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Investimento {
  id: string
  nome: string
  tipo: string
  valor_investido: number
  valor_atual: number
  usuario_id: string
  data_aplicacao: string
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null
  created_at: string
}
export interface InsertInvestimento {
  nome: string
  tipo: string
  valor_investido: number
  valor_atual: number
  data_aplicacao: string
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useInvestimentos() {
  const queryClient = useQueryClient()
  const { data: investimentos = [], isLoading, error } = useQuery({
    queryKey: ['investimentos'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_investimentos')

      if (error) throw error
      return data || []
    },
  })
  const createInvestimento = useMutation({
    mutationFn: async (investimento: InsertInvestimento) => {
      const { data, error } = await supabase.rpc('criar_investimento', {
        p_nome: investimento.nome,
        p_tipo: investimento.tipo,
        p_valor_investido: investimento.valor_investido,
        p_valor_atual: investimento.valor_atual,
        p_data_aplicacao: investimento.data_aplicacao,
        p_observacoes: investimento.observacoes || null,
        p_familia_id: investimento.familia_id || null,
        p_visivel_familia: investimento.visivel_familia || true,
        p_privado: investimento.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
    },
  })
  const updateInvestimento = useMutation({
    mutationFn: async ({ id, ...investimento }: Partial<Investimento> & { id: string }) => {
      const { data, error } = await supabase.rpc('atualizar_investimento', {
        p_id: id,
        p_nome: investimento.nome || '',
        p_tipo: investimento.tipo || '',
        p_valor_investido: investimento.valor_investido || 0,
        p_valor_atual: investimento.valor_atual || 0,
        p_data_aplicacao: investimento.data_aplicacao || new Date().toISOString(),
        p_observacoes: investimento.observacoes || null,
        p_visivel_familia: investimento.visivel_familia || true,
        p_privado: investimento.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
    },
  })
  const deleteInvestimento = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('deletar_investimento', {
        p_id: id
      })

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
  
  // Adicionar rentabilidade para cada investimento
  const investimentosComRentabilidade = investimentos.map(investimento => {
    const rendimentoIndividual = investimento.valor_atual - investimento.valor_investido
    const rentabilidadeIndividual = investimento.valor_investido > 0 ? ((rendimentoIndividual / investimento.valor_investido) * 100) : 0
    return {
      ...investimento,
      rendimento: rendimentoIndividual,
      rentabilidade: rentabilidadeIndividual
    }
  })
  
  const stats = {
    totalInvestido,
    rentabilidade: rentabilidade.toFixed(2),
    investimentosAtivos: investimentos.length,
    rendimentoTotal: rendimento,
  }
  return {
    investimentos: investimentosComRentabilidade,
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


