'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/lib/toast'
import type { Familia, FamiliaMembro, InsertFamilia, InsertMembro } from '@/types/app.types'
export function useFamilias() {
  const queryClient = useQueryClient()
  const { data: familias = [], isLoading, error } = useQuery({
    queryKey: ['familias'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_familias_usuario', {
          p_usuario_id: user.user.id
        })

      if (error) {
        console.error('Erro ao buscar famílias:', error)
        throw error
      }

      // Buscar membros para cada família
      const familias = await Promise.all((data || []).map(async (familia: any) => {
        const { data: membros } = await supabase
          .from('familia_membros')
          .select(`
            usuario_id,
            papel,
            aprovado
          `)
          .eq('familia_id', familia.id)

        return {
          ...familia,
          familia_membros: membros || []
        }
      }))

      return familias
    },
  })
  const useMembros = (familiaId: string | null) => {
    return useQuery({
      queryKey: ['familia-membros', familiaId],
      queryFn: async () => {
        if (!familiaId) return []

        const { data, error } = await supabase
          .from('familia_membros')
          .select(`
            usuario_id,
            papel,
            aprovado,
            created_at,
            users (
              id,
              nome,
              email
            )
          `)
          .eq('familia_id', familiaId)
          .eq('aprovado', true)

        if (error) throw error
        return data || []
      },
      enabled: !!familiaId,
    })
  }
  const createFamilia = useMutation({
    mutationFn: async (familia: InsertFamilia) => {
      const codigoConvite = Math.random().toString(36).substring(2, 10).toUpperCase()
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const timestamp = new Date().toISOString()
      
      // Usar uma transação para garantir consistência
      const { data, error } = await supabase.rpc('criar_familia_com_membro', {
        p_nome: familia.nome,
        p_admin_id: user.user.id,
        p_codigo_convite: codigoConvite,
        p_created_at: timestamp
      })

      if (error) {
        console.error('Erro ao criar família:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familias'] })
      showToast.success('Família criada com sucesso!')
    },
    onError: (error) => {
      showToast.error('Erro ao criar família: ' + error.message)
    },
  })
  const updateFamilia = useMutation({
    mutationFn: async ({ id, nome, modo_calculo }: { id: string; nome: string; modo_calculo?: 'familiar' | 'individual' }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase.rpc('atualizar_familia', {
        p_familia_id: id,
        p_nome: nome,
        p_modo_calculo: modo_calculo || 'familiar'
      })

      if (error) {
        console.error('Erro ao atualizar família:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familias'] })
      showToast.success('Família atualizada!')
    },
    onError: (error) => {
      showToast.error('Erro ao atualizar família: ' + error.message)
    },
  })
  const addMembro = useMutation({
    mutationFn: async (membro: InsertMembro) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('familia_membros')
        .insert({
          ...membro,
          aprovado: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao adicionar membro:', error)
        throw error
      }

      return data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['familia-membros', variables.familia_id] })
      showToast.success('Membro adicionado à família!')
    },
    onError: (error) => {
      showToast.error('Erro ao adicionar membro: ' + error.message)
    },
  })
  const removeMembro = useMutation({
    mutationFn: async ({ familiaId, usuarioId }: { familiaId: string; usuarioId: string }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      // Verificar se é admin
      const { data: familia } = await supabase
        .from('familias')
        .select('admin_id')
        .eq('id', familiaId)
        .single()

      if (!familia || (familia as any).admin_id !== user.user.id) {
        throw new Error('Apenas o admin pode remover membros')
      }

      const { data, error } = await supabase
        .from('familia_membros')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id
        })
        .eq('familia_id', familiaId)
        .eq('usuario_id', usuarioId)
        .select()
        .single()

      if (error) {
        console.error('Erro ao remover membro:', error)
        throw error
      }

      return data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['familia-membros', variables.familiaId] })
      showToast.success('Membro removido da família!')
    },
    onError: (error) => {
      showToast.error('Erro ao remover membro: ' + error.message)
    },
  })
  const generateInviteCode = useMutation({
    mutationFn: async (familiaId: string) => {
      const novoCodigo = Math.random().toString(36).substring(2, 10).toUpperCase()
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familias'] })
      showToast.success('Novo código de convite gerado!')
    },
  })
  const deleteFamilia = useMutation({
    mutationFn: async (familiaId: string) => {
      console.log('Tentando deletar família:', familiaId)
      
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      console.log('Usuário autenticado:', user.user.id)

      const { data, error } = await supabase.rpc('deletar_familia', {
        p_familia_id: familiaId
      })

      console.log('Resultado da RPC:', { data, error })

      if (error) {
        console.error('Erro ao deletar família:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familias'] })
      showToast.success('Família deletada com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao deletar família: ' + error.message)
    },
  })

  return {
    familias,
    isLoading,
    error,
    useMembros,
    createFamilia: createFamilia.mutate,
    updateFamilia: updateFamilia.mutate,
    addMembro: addMembro.mutate,
    removeMembro: removeMembro.mutate,
    generateInviteCode: generateInviteCode.mutate,
    deleteFamilia: deleteFamilia.mutate,
    isCreating: createFamilia.isPending,
    isUpdating: updateFamilia.isPending,
    isAddingMembro: addMembro.isPending,
    isRemovingMembro: removeMembro.isPending,
    isDeleting: deleteFamilia.isPending,
  }
}


