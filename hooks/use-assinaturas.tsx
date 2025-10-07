'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
export interface Assinatura {
  id: string
  nome: string
  valor: number
  dia_vencimento: number
  usuario_id: string
  categoria?: string
  status: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null
  created_at: string
}
export interface InsertAssinatura {
  nome: string
  valor: number
  dia_vencimento: number
  categoria?: string
  status?: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useAssinaturas() {
  const queryClient = useQueryClient()
  const { data: assinaturas = [], isLoading, error } = useQuery({
    queryKey: ['assinaturas'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_assinaturas')

      if (error) throw error
      return data || []
    },
  })
  const createAssinatura = useMutation({
    mutationFn: async (assinatura: InsertAssinatura) => {
      const { data, error } = await supabase.rpc('criar_assinatura', {
        p_nome: assinatura.nome,
        p_valor: assinatura.valor,
        p_dia_vencimento: assinatura.dia_vencimento,
        p_categoria: assinatura.categoria || null,
        p_status: assinatura.status || 'ativa',
        p_data_inicio: assinatura.data_inicio,
        p_data_fim: assinatura.data_fim || null,
        p_observacoes: assinatura.observacoes || null,
        p_familia_id: assinatura.familia_id || null,
        p_visivel_familia: assinatura.visivel_familia || true,
        p_privado: assinatura.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateAssinatura = useMutation({
    mutationFn: async ({ id, ...assinatura }: Partial<Assinatura> & { id: string }) => {
      const { data, error } = await supabase.rpc('atualizar_assinatura', {
        p_id: id,
        p_nome: assinatura.nome || '',
        p_valor: assinatura.valor || 0,
        p_dia_vencimento: assinatura.dia_vencimento || 1,
        p_categoria: assinatura.categoria || null,
        p_status: assinatura.status || 'ativa',
        p_data_inicio: assinatura.data_inicio || new Date().toISOString(),
        p_data_fim: assinatura.data_fim || null,
        p_observacoes: assinatura.observacoes || null,
        p_visivel_familia: assinatura.visivel_familia || true,
        p_privado: assinatura.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteAssinatura = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('deletar_assinatura', {
        p_id: id
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      refreshDashboard()
    },
  })
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }
  const assinaturasAtivas = assinaturas.filter(a => a.status === 'ativa')
  const stats = {
    gastoMensal: assinaturasAtivas.reduce((sum, a) => sum + a.valor, 0),
    assinaturasAtivas: assinaturasAtivas.length,
    proximoVencimento: getProximoVencimento(assinaturasAtivas),
    gastoAnual: assinaturasAtivas.reduce((sum, a) => sum + a.valor, 0) * 12,
  }
  function getProximoVencimento(assinaturas: Assinatura[]) {
    if (assinaturas.length === 0) return null
    const hoje = new Date()
    const diaHoje = hoje.getDate()
    const proximas = assinaturas
      .map(a => ({
        ...a,
        diasRestantes: a.dia_vencimento >= diaHoje 
          ? a.dia_vencimento - diaHoje 
          : (30 - diaHoje) + a.dia_vencimento
      }))
      .sort((a, b) => a.diasRestantes - b.diasRestantes)
    return proximas[0]
  }
  return {
    assinaturas,
    stats,
    isLoading,
    error,
    createAssinatura: createAssinatura.mutate,
    updateAssinatura: updateAssinatura.mutate,
    deleteAssinatura: deleteAssinatura.mutate,
    isCreating: createAssinatura.isPending,
    isUpdating: updateAssinatura.isPending,
    isDeleting: deleteAssinatura.isPending,
  }
}


