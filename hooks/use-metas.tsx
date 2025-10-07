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
      const { data, error } = await supabase
        .order('created_at', { ascending: false })
    },
  })
  const createMeta = useMutation({
    mutationFn: async (meta: InsertMeta) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] })
    },
  })
  const updateMeta = useMutation({
    mutationFn: async ({ id, ...meta }: Partial<Meta> & { id: number }) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] })
    },
  })
  const deleteMeta = useMutation({
    mutationFn: async (id: number) => {
      console.log('RPC desabilitado temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
        p_tabela: 'metas',
        p_id: id,
      })
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

