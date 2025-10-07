'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface ContaFixa {
  id: number
  nome: string
  valor: number
  dia_vencimento: number
  usuario_id: number
  categoria: string
  status: string
  observacoes?: string
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}
export interface InsertContaFixa {
  nome: string
  valor: number
  dia_vencimento: number
  usuario_id: number
  categoria: string
  status?: string
  observacoes?: string
}
export function useContasFixas() {
  const queryClient = useQueryClient()
  const { data: contas = [], isLoading, error } = useQuery({
    queryKey: ['contas-fixas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .order('dia_vencimento', { ascending: true })
    },
  })
  const createContaFixa = useMutation({
    mutationFn: async (conta: InsertContaFixa) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-fixas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateContaFixa = useMutation({
    mutationFn: async ({ id, ...conta }: Partial<ContaFixa> & { id: number }) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-fixas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteContaFixa = useMutation({
    mutationFn: async (id: number) => {
      console.log('RPC desabilitado temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
        p_tabela: 'contas_fixas',
        p_id: id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-fixas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      refreshDashboard()
    },
  })
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }
  const stats = {
    totalMensal: contas.reduce((sum, c) => sum + c.valor, 0),
    energia: contas.filter(c => c.categoria === 'energia').reduce((sum, c) => sum + c.valor, 0),
    agua: contas.filter(c => c.categoria === 'agua').reduce((sum, c) => sum + c.valor, 0),
    internet: contas.filter(c => c.categoria === 'internet').reduce((sum, c) => sum + c.valor, 0),
    telefone: contas.filter(c => c.categoria === 'telefone').reduce((sum, c) => sum + c.valor, 0),
  }
  return {
    contas,
    stats,
    isLoading,
    error,
    createContaFixa: createContaFixa.mutate,
    updateContaFixa: updateContaFixa.mutate,
    deleteContaFixa: deleteContaFixa.mutate,
    isCreating: createContaFixa.isPending,
    isUpdating: updateContaFixa.isPending,
    isDeleting: deleteContaFixa.isPending,
  }
}

