'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Gasto, InsertGasto } from '@/types'
import { showToast } from '@/lib/toast'

export function useGastos() {
  const queryClient = useQueryClient()

  // Fetch gastos
  const { data: gastos = [], isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .eq('deletado', false)
        .order('data', { ascending: false })

      if (error) throw error
      return data as Gasto[]
    },
  })

  // Create gasto
  const createGasto = useMutation({
    mutationFn: async (gasto: InsertGasto) => {
      const { data, error } = await supabase
        .from('gastos')
        // @ts-expect-error - Type conflict between InsertGasto and generated schema
        .insert(gasto)
        .select()
        .single()

      if (error) throw error
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

  // Update gasto
  const updateGasto = useMutation({
    mutationFn: async ({ id, ...gasto }: Partial<Gasto> & { id: string }) => {
      const { data, error } = await supabase
        .from('gastos')
        // @ts-expect-error - Type conflict with generated schema
        .update({
          ...gasto,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
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

  // Soft delete gasto
  const deleteGasto = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Implementar quando tipos do Supabase estiverem corretos
      console.log('Soft delete de gasto desabilitado temporariamente:', id)
      throw new Error('Funcionalidade de soft delete temporariamente desabilitada')
      
      // const { error } = await supabase
      //   .from('gastos')
      //   .update({
      //     deletado: true,
      //     deletado_em: new Date().toISOString()
      //   })
      //   .eq('id', id)

      // if (error) throw error
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

  // Helper to refresh dashboard
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }

  return {
    gastos,
    isLoading,
    error,
    createGasto: createGasto.mutate,
    updateGasto: updateGasto.mutate,
    deleteGasto: deleteGasto.mutate,
    isCreating: createGasto.isPending,
    isUpdating: updateGasto.isPending,
    isDeleting: deleteGasto.isPending,
  }
}
