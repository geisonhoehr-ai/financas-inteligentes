'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Meta {
  id: number
  nome: string
  valor_objetivo: number
  valor_atual: number
  usuario_id: number
  categoria?: string
  prazo?: string | null
  status: string
  observacoes?: string
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}
export interface InsertMeta {
  nome: string
  valor_objetivo: number
  valor_atual?: number
  usuario_id: number
  categoria?: string
  prazo?: string | null
  status?: string
  observacoes?: string
}
export function useMetas() {
  const queryClient = useQueryClient()
  const { data: metas = [], isLoading, error } = useQuery({
    queryKey: ['metas'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .from('metas')
        .select()
        .eq('usuario_id', user.user.id)
        .eq('deletado', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
  })
  const createMeta = useMutation({
    mutationFn: async (meta: InsertMeta) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('metas')
        .insert({
          ...meta,
          usuario_id: user.user.id,
          valor_atual: meta.valor_atual || 0,
          status: meta.status || 'em_andamento',
          deletado: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] })
    },
  })
  const updateMeta = useMutation({
    mutationFn: async ({ id, ...meta }: Partial<Meta> & { id: number }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('metas')
        .update({
          ...meta,
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
      queryClient.invalidateQueries({ queryKey: ['metas'] })
    },
  })
  const deleteMeta = useMutation({
    mutationFn: async (id: number) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('metas')
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
      queryClient.invalidateQueries({ queryKey: ['metas'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
    },
  })
  const metasAtivas = metas.filter(m => m.status === 'em_andamento')
  const metasConcluidas = metas.filter(m => m.status === 'concluida')
  const stats = {
    totalEmMetas: metas.reduce((sum, m) => sum + m.valor_objetivo, 0),
    economizado: metas.reduce((sum, m) => sum + m.valor_atual, 0),
    metasAtivas: metasAtivas.length,
    metasConcluidas: metasConcluidas.length,
    progresso: metas.reduce((sum, m) => sum + ((m.valor_atual / m.valor_objetivo) * 100), 0) / (metas.length || 1),
  }
  return {
    metas,
    stats,
    isLoading,
    error,
    createMeta: createMeta.mutate,
    updateMeta: updateMeta.mutate,
    deleteMeta: deleteMeta.mutate,
    isCreating: createMeta.isPending,
    isUpdating: updateMeta.isPending,
    isDeleting: deleteMeta.isPending,
  }
}


