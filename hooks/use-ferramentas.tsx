'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Ferramenta {
  id: number
  nome: string
  valor: number
  usuario_id: number
  categoria: string
  periodicidade: string
  status: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}
export interface InsertFerramenta {
  nome: string
  valor: number
  usuario_id: number
  categoria: string
  periodicidade?: string
  status?: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
}
export function useFerramentas() {
  const queryClient = useQueryClient()
  const { data: ferramentas = [], isLoading, error } = useQuery({
    queryKey: ['ferramentas'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .from('ferramentas')
        .select()
        .eq('usuario_id', user.user.id)
        .eq('deletado', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
  })
  const createFerramenta = useMutation({
    mutationFn: async (ferramenta: InsertFerramenta) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('ferramentas')
        .insert({
          ...ferramenta,
          usuario_id: user.user.id,
          status: 'ativa',
          deletado: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateFerramenta = useMutation({
    mutationFn: async ({ id, ...ferramenta }: Partial<Ferramenta> & { id: number }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('ferramentas')
        .update({
          ...ferramenta,
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
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteFerramenta = useMutation({
    mutationFn: async (id: number) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('ferramentas')
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
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      refreshDashboard()
    },
  })
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }
  const ferramentasAtivas = ferramentas.filter(f => f.status === 'ativa')
  const stats = {
    gastoMensal: ferramentasAtivas
      .filter(f => f.periodicidade === 'mensal')
      .reduce((sum, f) => sum + f.valor, 0),
    ferramentasAtivas: ferramentasAtivas.length,
    softwaresLicenciados: ferramentas.filter(f => f.categoria === 'software').length,
    gastoAnual: ferramentasAtivas.reduce((sum, f) => {
      if (f.periodicidade === 'mensal') return sum + (f.valor * 12)
      if (f.periodicidade === 'anual') return sum + f.valor
      return sum
    }, 0),
  }
  return {
    ferramentas,
    stats,
    isLoading,
    error,
    createFerramenta: createFerramenta.mutate,
    updateFerramenta: updateFerramenta.mutate,
    deleteFerramenta: deleteFerramenta.mutate,
    isCreating: createFerramenta.isPending,
    isUpdating: updateFerramenta.isPending,
    isDeleting: deleteFerramenta.isPending,
  }
}


