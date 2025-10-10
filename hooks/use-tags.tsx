'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'
import { showToast } from '@/lib/toast'

export interface Tag {
  id: string
  nome: string
  cor: string
  icone: string
  descricao?: string
  usuario_id: string
  familia_id?: string | null
  created_at: string
  updated_at: string
  // Estatísticas (da view)
  total_gastos?: number
  valor_total?: number
  meses_com_gastos?: number
}

export interface TagStats {
  total_gastos: number
  quantidade: number
  media: number
  maior_gasto: number
  menor_gasto: number
}

export function useTags() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()

  // Buscar todas as tags do usuário
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['tags', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const query = (supabase as any)
        .from('tags')
        .select('*')
        .eq('usuario_id', user.user.id)
        .order('nome')

      if (familiaAtivaId) {
        query.eq('familia_id', familiaAtivaId)
      } else {
        query.is('familia_id', null)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar tags:', error)
        throw error
      }

      return data as unknown as Tag[]
    },
  })

  // Buscar tags com estatísticas
  const { data: tagsComStats = [] } = useQuery({
    queryKey: ['tags-with-stats', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const query = (supabase as any)
        .from('vw_tags_com_stats')
        .select('*')
        .eq('usuario_id', user.user.id)
        .order('valor_total', { ascending: false })

      if (familiaAtivaId) {
        query.eq('familia_id', familiaAtivaId)
      } else {
        query.is('familia_id', null)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar tags com stats:', error)
        return []
      }

      return data as unknown as Tag[]
    },
  })

  // Criar tag
  const createTag = useMutation({
    mutationFn: async (tag: Omit<Tag, 'id' | 'usuario_id' | 'created_at' | 'updated_at'>) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await (supabase as any)
        .from('tags')
        .insert([{
          nome: tag.nome,
          cor: tag.cor || '#3B82F6',
          icone: tag.icone || '🏷️',
          descricao: tag.descricao || '',
          usuario_id: user.user.id,
          familia_id: familiaAtivaId || null
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar tag:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['tags-with-stats'] })
      showToast.success('Tag criada com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao criar tag: ' + error.message)
    },
  })

  // Atualizar tag
  const updateTag = useMutation({
    mutationFn: async ({ id, ...tag }: Partial<Tag> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from('tags')
        .update({
          nome: tag.nome,
          cor: tag.cor,
          icone: tag.icone,
          descricao: tag.descricao
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar tag:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['tags-with-stats'] })
      showToast.success('Tag atualizada com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao atualizar tag: ' + error.message)
    },
  })

  // Deletar tag
  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('tags')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar tag:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['tags-with-stats'] })
      showToast.success('Tag deletada com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao deletar tag: ' + error.message)
    },
  })

  // Adicionar tag a um gasto
  const addTagToGasto = useMutation({
    mutationFn: async ({ gastoId, tagId }: { gastoId: string; tagId: string }) => {
      const { data, error } = await (supabase as any)
        .from('gastos_tags')
        .insert([{
          gasto_id: gastoId,
          tag_id: tagId
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao adicionar tag ao gasto:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      queryClient.invalidateQueries({ queryKey: ['tags-with-stats'] })
    },
  })

  // Remover tag de um gasto
  const removeTagFromGasto = useMutation({
    mutationFn: async ({ gastoId, tagId }: { gastoId: string; tagId: string }) => {
      const { error } = await (supabase as any)
        .from('gastos_tags')
        .delete()
        .eq('gasto_id', gastoId)
        .eq('tag_id', tagId)

      if (error) {
        console.error('Erro ao remover tag do gasto:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      queryClient.invalidateQueries({ queryKey: ['tags-with-stats'] })
    },
  })

  // Buscar gastos por tag
  const buscarGastosPorTag = async (tagId: string, dataInicio?: string, dataFim?: string) => {
    try {
      const { data, error } = await (supabase as any).rpc('buscar_gastos_por_tag', {
        p_tag_id: tagId,
        p_data_inicio: dataInicio || null,
        p_data_fim: dataFim || null
      })

      if (error) {
        console.error('Erro ao buscar gastos por tag:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar gastos por tag:', error)
      return []
    }
  }

  // Buscar estatísticas por tag
  const buscarEstatisticasPorTag = async (tagId: string, dataInicio?: string, dataFim?: string): Promise<TagStats | null> => {
    try {
      const { data, error } = await (supabase as any).rpc('estatisticas_por_tag', {
        p_tag_id: tagId,
        p_data_inicio: dataInicio || null,
        p_data_fim: dataFim || null
      })

      if (error) {
        console.error('Erro ao buscar estatísticas por tag:', error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error('Erro:', error)
      return null
    }
  }

  // Tags mais usadas
  const tagsMaisUsadas = tagsComStats
    .filter(tag => (tag.total_gastos || 0) > 0)
    .slice(0, 5)

  return {
    tags,
    tagsComStats,
    tagsMaisUsadas,
    isLoading,
    createTag: createTag.mutate,
    updateTag: updateTag.mutate,
    deleteTag: deleteTag.mutate,
    addTagToGasto: addTagToGasto.mutate,
    removeTagFromGasto: removeTagFromGasto.mutate,
    buscarGastosPorTag,
    buscarEstatisticasPorTag,
    isCreating: createTag.isPending,
    isUpdating: updateTag.isPending,
    isDeleting: deleteTag.isPending,
  }
}

