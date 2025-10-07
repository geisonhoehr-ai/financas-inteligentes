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
      console.log('Busca de famílias desabilitada temporariamente')
      return []
    },
  })
  const useMembros = (familiaId: string | null) => {
    return useQuery({
      queryKey: ['familia-membros', familiaId],
      queryFn: async () => {
        if (!familiaId) return []
        console.log('Busca de membros desabilitada temporariamente')
        return []
      },
      enabled: !!familiaId,
    })
  }
  const createFamilia = useMutation({
    mutationFn: async (familia: InsertFamilia) => {
      const codigoConvite = Math.random().toString(36).substring(2, 10).toUpperCase()
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
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

