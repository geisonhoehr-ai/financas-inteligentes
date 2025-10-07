'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Gasto, InsertGasto } from '@/types'
import { showToast } from '@/lib/toast'
export function useGastos() {
  const queryClient = useQueryClient()
  const { data: gastos = [], isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .from('gastos')
        .select(`
          id,
          descricao,
          valor,
          data,
          categoria_id,
          usuario_id,
          familia_id,
          created_at,
          updated_at,
          deletado,
          deletado_em
        `)
        .eq('usuario_id', user.user.id)
        .eq('deletado', false)
        .order('data', { ascending: false })

      if (error) throw error
      return data || []
    },
  })
  const createGasto = useMutation({
    mutationFn: async (gasto: InsertGasto) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase.rpc('criar_gasto', {
        p_descricao: gasto.descricao,
        p_valor: gasto.valor,
        p_data: gasto.data,
        p_categoria_id: gasto.categoria_id,
        p_familia_id: gasto.familia_id,
        p_comprovante_url: gasto.comprovante_url
      })

      if (error) {
        console.error('Erro ao criar gasto:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
      showToast.success('Gasto adicionado com sucesso!')
    },
    onError: (error) => {
      showToast.error('Erro ao adicionar gasto: ' + error.message)
    },
  })
  const updateGasto = useMutation({
    mutationFn: async ({ id, ...gasto }: Partial<Gasto> & { id: string }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase.rpc('atualizar_gasto', {
        p_gasto_id: id,
        p_descricao: gasto.descricao,
        p_valor: gasto.valor,
        p_data: gasto.data,
        p_categoria_id: gasto.categoria_id,
        p_comprovante_url: gasto.comprovante_url
      })

      if (error) {
        console.error('Erro ao atualizar gasto:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
      showToast.success('Gasto atualizado com sucesso!')
    },
    onError: (error) => {
      showToast.error('Erro ao atualizar gasto: ' + error.message)
    },
  })
  const deleteGasto = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase.rpc('deletar_gasto', {
        p_gasto_id: id
      })

      if (error) {
        console.error('Erro ao deletar gasto:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      refreshDashboard()
      showToast.success('Gasto movido para lixeira')
    },
    onError: (error) => {
      showToast.error('Erro ao deletar gasto: ' + error.message)
    },
  })
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }
  const restoreGasto = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase.rpc('restaurar_gasto', {
        p_gasto_id: id
      })

      if (error) {
        console.error('Erro ao restaurar gasto:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      refreshDashboard()
      showToast.success('Gasto restaurado com sucesso!')
    },
    onError: (error) => {
      showToast.error('Erro ao restaurar gasto: ' + error.message)
    },
  })

  return {
    gastos,
    isLoading,
    error,
    createGasto: createGasto.mutate,
    updateGasto: updateGasto.mutate,
    deleteGasto: deleteGasto.mutate,
    restoreGasto: restoreGasto.mutate,
    isCreating: createGasto.isPending,
    isUpdating: updateGasto.isPending,
    isDeleting: deleteGasto.isPending,
    isRestoring: restoreGasto.isPending,
  }
}


