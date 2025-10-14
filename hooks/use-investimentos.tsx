'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'

export interface Investimento {
  id: string
  nome: string
  tipo: string | null
  valor: number
  ativo: boolean | null
  usuario_id: string | null
  data_aplicacao: string | null
  observacoes?: string | null
  familia_id?: string | null
  visivel_familia?: boolean
  privado?: boolean
  deletado: boolean | null
  deletado_em: string | null
  deletado_por: string | null
  created_at: string | null
}
export interface InsertInvestimento {
  nome: string
  tipo: string
  valor: number
  valor_atual?: number
  ativo?: boolean
  data_aplicacao: string
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useInvestimentos() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()
  
  const { data: investimentos = [], isLoading, error } = useQuery<Investimento[]>({
    queryKey: ['investimentos', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      let query = supabase
        .from('investimentos')
        .select('*')
        .eq('deletado', false)
      
      if (familiaAtivaId) {
        query = query.eq('familia_id', familiaAtivaId)
      } else {
        query = query.is('familia_id', null)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return (data as unknown as Investimento[]) || []
    },
  })
  const createInvestimento = useMutation({
    mutationFn: async (investimento: InsertInvestimento) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('investimentos')
        .insert([{
          nome: investimento.nome,
          tipo: investimento.tipo,
          valor: investimento.valor,
          ativo: investimento.ativo !== false,
          data_aplicacao: investimento.data_aplicacao,
          observacoes: investimento.observacoes || '',
          usuario_id: user.user.id,
          familia_id: investimento.familia_id || null,
          deletado: false
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar investimento:', error)
        console.error('Dados enviados:', investimento)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
    },
  })
  const updateInvestimento = useMutation({
    mutationFn: async ({ id, ...investimento }: Partial<Investimento> & { id: string }) => {
      const { data, error } = await supabase
        .from('investimentos')
        .update({
          nome: investimento.nome,
          tipo: investimento.tipo,
          valor: investimento.valor,
          ativo: investimento.ativo,
          data_aplicacao: investimento.data_aplicacao,
          observacoes: investimento.observacoes
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar investimento:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
    },
  })
  const deleteInvestimento = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('investimentos')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao deletar investimento:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investimentos'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
    },
  })
  const totalInvestido = investimentos.reduce((sum, i) => sum + i.valor, 0)
  const totalAtual = investimentos.reduce((sum, i) => sum + ((i as any).valor_atual || i.valor), 0)
  const totalRendimento = totalAtual - totalInvestido
  const rentabilidade = totalInvestido > 0 ? ((totalRendimento / totalInvestido) * 100) : 0

  // Adicionar rentabilidade para cada investimento
  const investimentosComRentabilidade = investimentos.map(investimento => {
    const valorAtual = (investimento as any).valor_atual || investimento.valor
    const rendimento = valorAtual - investimento.valor
    const rentabilidadeIndividual = investimento.valor > 0 ? ((rendimento / investimento.valor) * 100) : 0
    return {
      ...investimento,
      valor_atual: valorAtual,
      rentabilidade: rentabilidadeIndividual,
      rendimento: rendimento
    }
  })

  const stats = {
    totalInvestido,
    rentabilidade: rentabilidade.toFixed(2),
    investimentosAtivos: investimentos.filter(i => i.ativo).length,
    rendimentoTotal: totalRendimento,
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


