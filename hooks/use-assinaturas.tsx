'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
export interface Assinatura {
  id: number
  nome: string
  valor: number
  dia_vencimento: number
  usuario_id: number
  categoria?: string
  status: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}
export interface InsertAssinatura {
  nome: string
  valor: number
  dia_vencimento: number
  usuario_id: number
  categoria?: string
  status?: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
}
export function useAssinaturas() {
  const queryClient = useQueryClient()
  const { data: assinaturas = [], isLoading, error } = useQuery({
    queryKey: ['assinaturas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .order('dia_vencimento', { ascending: true })
    },
  })
  const createAssinatura = useMutation({
    mutationFn: async (assinatura: any) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateAssinatura = useMutation({
    mutationFn: async ({ id, ...assinatura }: any) => {
      console.log('Update assinatura desabilitado temporariamente:', id)
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteAssinatura = useMutation({
    mutationFn: async (id: number) => {
      console.log('Delete assinatura desabilitado temporariamente:', id)
      throw new Error('Funcionalidade temporariamente desabilitada')
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

