'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface ContaFixa {
  id: string
  nome: string
  valor: number
  dia_vencimento: number
  usuario_id: string
  categoria: string
  status: string
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null
  created_at: string
}
export interface InsertContaFixa {
  nome: string
  valor: number
  dia_vencimento: number
  categoria: string
  status?: string
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useContasFixas() {
  const queryClient = useQueryClient()
  const { data: contas = [], isLoading, error } = useQuery({
    queryKey: ['contas-fixas'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_contas_fixas')

      if (error) throw error
      return data || []
    },
  })
  const createContaFixa = useMutation({
    mutationFn: async (conta: InsertContaFixa) => {
      const { data, error } = await supabase.rpc('criar_conta_fixa', {
        p_nome: conta.nome,
        p_valor: conta.valor,
        p_dia_vencimento: conta.dia_vencimento,
        p_categoria: conta.categoria,
        p_status: conta.status || 'ativa',
        p_observacoes: conta.observacoes || '',
        p_familia_id: conta.familia_id || '',
        p_visivel_familia: conta.visivel_familia || true,
        p_privado: conta.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-fixas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateContaFixa = useMutation({
    mutationFn: async ({ id, ...conta }: Partial<ContaFixa> & { id: string }) => {
      const { data, error } = await supabase.rpc('atualizar_conta_fixa', {
        p_id: id,
        p_nome: conta.nome || '',
        p_valor: conta.valor || 0,
        p_dia_vencimento: conta.dia_vencimento || 1,
        p_categoria: conta.categoria || '',
        p_status: conta.status || 'ativa',
        p_observacoes: conta.observacoes || '',
        p_visivel_familia: conta.visivel_familia || true,
        p_privado: conta.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-fixas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteContaFixa = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('deletar_conta_fixa', {
        p_id: id
      })

      if (error) throw error
      return data
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
    energia: contas.filter(c => (c as any).categoria === 'energia').reduce((sum, c) => sum + c.valor, 0),
    agua: contas.filter(c => (c as any).categoria === 'agua').reduce((sum, c) => sum + c.valor, 0),
    internet: contas.filter(c => (c as any).categoria === 'internet').reduce((sum, c) => sum + c.valor, 0),
    telefone: contas.filter(c => (c as any).categoria === 'telefone').reduce((sum, c) => sum + c.valor, 0),
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


