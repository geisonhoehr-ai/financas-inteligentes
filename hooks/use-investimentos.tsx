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
      const { data, error } = await supabase
        .order('data_aplicacao', { ascending: false })
    },
  })
  const createInvestimento = useMutation({
    mutationFn: async (investimento: InsertInvestimento) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
    },
  })
  const updateInvestimento = useMutation({
    mutationFn: async ({ id, ...investimento }: Partial<Investimento> & { id: number }) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
    },
  })
  const deleteInvestimento = useMutation({
    mutationFn: async (id: number) => {
      console.log('RPC desabilitado temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
        p_tabela: 'investimentos',
        p_id: id,
      })
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
