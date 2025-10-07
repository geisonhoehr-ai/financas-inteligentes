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
        .from('familias')
        .select(`
          id,
          nome,
          admin_id,
          codigo_convite,
          created_at,
          familia_membros (
            usuario_id,
            papel,
            aprovado
          )
        `)
        .or(`admin_id.eq.${user.user.id},familia_membros.usuario_id.eq.${user.user.id},and(familia_membros.aprovado.eq.true)`)

      if (error) throw error
      return data || []
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

      // Criar família
      const novaFamilia = {
        nome: familia.nome,
        admin_id: user.user.id,
        codigo_convite: codigoConvite,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('familias')
        .insert(novaFamilia)
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar família:', error)
        throw error
      }

      // Adicionar usuário como membro
      const novoMembro = {
        familia_id: data.id,
        usuario_id: user.user.id,
        papel: 'admin',
        aprovado: true,
        created_at: new Date().toISOString()
      }

      const { error: membroError } = await supabase
        .from('familia_membros')
        .insert(novoMembro)

      if (membroError) {
        console.error('Erro ao adicionar membro:', membroError)
        // Remover a família criada para manter consistência
        await supabase
          .from('familias')
          .delete()
          .eq('id', data.id)
        throw membroError
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
    mutationFn: async ({ id, ...familia }: Partial<Familia> & { id: string }) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
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
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
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
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
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
    isCreating: createFamilia.isPending,
    isUpdating: updateFamilia.isPending,
    isAddingMembro: addMembro.isPending,
    isRemovingMembro: removeMembro.isPending,
  }
}


