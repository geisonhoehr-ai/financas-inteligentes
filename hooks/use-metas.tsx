'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'

export interface Meta {
  id: string
  nome: string
  valor_objetivo: number
  valor_atual: number | null
  usuario_id: string | null
  prazo?: string | null
  observacoes?: string | null
  familia_id?: string | null
  concluida: boolean | null
  deletado: boolean | null
  deletado_em: string | null
  deletado_por: string | null
  created_at: string | null
}
export interface InsertMeta {
  nome: string
  valor_objetivo: number
  valor_atual?: number
  prazo?: string | null
  observacoes?: string | null
  familia_id?: string
}
export function useMetas() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()
  
  const { data: metas = [], isLoading, error } = useQuery<Meta[]>({
    queryKey: ['metas', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      let query = supabase
        .from('metas')
        .select('*')
        .eq('deletado', false)
      
      if (familiaAtivaId) {
        query = query.eq('familia_id', familiaAtivaId)
      } else {
        query = query.is('familia_id', null)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return (data as unknown as Meta[]) || []
    },
  })
  const createMeta = useMutation({
    mutationFn: async (meta: InsertMeta) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('metas')
        .insert({
          nome: meta.nome,
          valor_objetivo: meta.valor_objetivo,
          valor_atual: meta.valor_atual || 0,
          prazo: meta.prazo || null,
          observacoes: meta.observacoes || "",
          familia_id: meta.familia_id || null,
          usuario_id: user.user.id,
          concluida: false,
          deletado: false
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar meta:', error)
        console.error('Dados enviados:', meta)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] })
    },
  })
  const updateMeta = useMutation({
    mutationFn: async ({ id, ...meta }: Partial<Meta> & { id: string }) => {
      const { data, error } = await supabase
        .from('metas')
        .update({
          nome: meta.nome,
          valor_objetivo: meta.valor_objetivo,
          valor_atual: meta.valor_atual,
          prazo: meta.prazo,
          observacoes: meta.observacoes,
          concluida: meta.concluida
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar meta:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] })
    },
  })
  const deleteMeta = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('metas')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao deletar meta:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
    },
  })
  const metasAtivas = metas.filter(m => !m.concluida)
  const metasConcluidas = metas.filter(m => m.concluida)
  const stats = {
    totalEmMetas: metas.reduce((sum, m) => sum + m.valor_objetivo, 0),
    economizado: metas.reduce((sum, m) => sum + (m.valor_atual || 0), 0),
    metasAtivas: metasAtivas.length,
    metasConcluidas: metasConcluidas.length,
    progresso: metas.reduce((sum, m) => sum + (((m.valor_atual || 0) / m.valor_objetivo) * 100), 0) / (metas.length || 1),
  }
  return {
    metas,
    stats,
    isLoading,
    error,
    createMeta: createMeta.mutateAsync,
    updateMeta: updateMeta.mutateAsync,
    deleteMeta: deleteMeta.mutateAsync,
    isCreating: createMeta.isPending,
    isUpdating: updateMeta.isPending,
    isDeleting: deleteMeta.isPending,
  }
}


