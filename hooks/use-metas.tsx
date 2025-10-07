'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Meta {
  id: string
  nome: string
  valor_objetivo: number
  valor_atual: number
  usuario_id: string
  categoria?: string
  prazo?: string | null
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
export interface InsertMeta {
  nome: string
  valor_objetivo: number
  valor_atual?: number
  categoria?: string
  prazo?: string | null
  status?: string
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useMetas() {
  const queryClient = useQueryClient()
  const { data: metas = [], isLoading, error } = useQuery({
    queryKey: ['metas'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_metas')

      if (error) throw error
      return data || []
    },
  })
  const createMeta = useMutation({
    mutationFn: async (meta: InsertMeta) => {
      const { data, error } = await supabase.rpc('criar_meta', {
        p_nome: meta.nome,
        p_valor_objetivo: meta.valor_objetivo,
        p_valor_atual: meta.valor_atual || 0,
        p_categoria: meta.categoria || null,
        p_prazo: meta.prazo || null,
        p_status: meta.status || 'em_andamento',
        p_observacoes: meta.observacoes || null,
        p_familia_id: meta.familia_id || null,
        p_visivel_familia: meta.visivel_familia || true,
        p_privado: meta.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] })
    },
  })
  const updateMeta = useMutation({
    mutationFn: async ({ id, ...meta }: Partial<Meta> & { id: string }) => {
      const { data, error } = await supabase.rpc('atualizar_meta', {
        p_id: id,
        p_nome: meta.nome || '',
        p_valor_objetivo: meta.valor_objetivo || 0,
        p_valor_atual: meta.valor_atual || 0,
        p_categoria: meta.categoria || null,
        p_prazo: meta.prazo || null,
        p_status: meta.status || 'em_andamento',
        p_observacoes: meta.observacoes || null,
        p_visivel_familia: meta.visivel_familia || true,
        p_privado: meta.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] })
    },
  })
  const deleteMeta = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('deletar_meta', {
        p_id: id
      })

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


