'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Gasto, InsertGasto } from '@/types'
import { showToast } from '@/lib/toast'
import { useFamiliaAtiva } from './use-familia-ativa'

export function useGastos() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['gastos', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return { gastos: [], stats: { total_mes: 0, total_hoje: 0, total_gastos: 0 } }

      // Usar função RPC que agora funciona com mv_gastos_stats
      // Passar familiaAtivaId para filtrar por família
      const { data: result, error: rpcError } = await supabase.rpc('buscar_gastos_com_stats', {
        p_limit: 50,
        p_offset: 0,
        p_familia_id: familiaAtivaId || undefined
      })

      if (rpcError) {
        console.error('Erro ao buscar gastos:', rpcError)
        throw rpcError
      }

      return result || { gastos: [], stats: { total_mes: 0, total_hoje: 0, total_gastos: 0 } }
    },
  })
  const createGasto = useMutation({
    mutationFn: async (gasto: InsertGasto) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('gastos')
        .insert([{
          descricao: gasto.descricao,
          valor: gasto.valor,
          data: gasto.data,
          categoria_id: gasto.categoria_id,
          usuario_id: user.user.id,
          familia_id: gasto.familia_id || null,
          deletado: false
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar gasto:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
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

      const { data, error } = await supabase
        .from('gastos')
        .update({
          descricao: gasto.descricao,
          valor: gasto.valor,
          data: gasto.data,
          categoria_id: (gasto as any).categoria_id || (gasto as any).categoria,
          comprovante_url: (gasto as any).comprovante_url
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar gasto:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
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

      const { data, error } = await supabase
        .from('gastos')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .select()
        .single()

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
      showToast.success('Gasto movido para lixeira')
    },
    onError: (error) => {
      showToast.error('Erro ao deletar gasto: ' + error.message)
    },
  })

  const restoreGasto = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('gastos')
        .update({
          deletado: false,
          deletado_em: null,
          deletado_por: null
        })
        .eq('id', id)
        .select()
        .single()

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
      showToast.success('Gasto restaurado com sucesso!')
    },
    onError: (error) => {
      showToast.error('Erro ao restaurar gasto: ' + error.message)
    },
  })

  const defaultData = {
    gastos: [],
    stats: {
      total_mes: 0,
      total_hoje: 0,
      total_gastos: 0
    }
  }

  const { gastos = [], stats = defaultData.stats } = (data as any) || defaultData

  return {
    gastos,
    stats,
    isLoading,
    error,
    createGasto: createGasto.mutateAsync,
    updateGasto: updateGasto.mutateAsync,
    deleteGasto: deleteGasto.mutateAsync,
    restoreGasto: restoreGasto.mutateAsync,
    isCreating: createGasto.isPending,
    isUpdating: updateGasto.isPending,
    isDeleting: deleteGasto.isPending,
    isRestoring: restoreGasto.isPending,
  }
}


