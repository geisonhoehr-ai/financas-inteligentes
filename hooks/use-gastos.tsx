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
      console.log('Busca de gastos desabilitada temporariamente')
      return []
    },
  })
  const createGasto = useMutation({
    mutationFn: async (gasto: InsertGasto) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
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
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
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
      console.log('Soft delete de gasto desabilitado temporariamente:', id)
      throw new Error('Funcionalidade de soft delete temporariamente desabilitada')
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


