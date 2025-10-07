'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Gasolina {
  id: number
  descricao?: string
  valor: number
  litros: number
  preco_litro: number
  km_atual?: number
  usuario_id: number
  data: string
  posto?: string
  tipo_combustivel?: string
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}
export interface InsertGasolina {
  descricao?: string
  valor: number
  litros: number
  preco_litro: number
  km_atual?: number
  usuario_id: number
  data: string
  posto?: string
  tipo_combustivel?: string
}
export function useGasolina() {
  const queryClient = useQueryClient()
  const { data: abastecimentos = [], isLoading, error } = useQuery({
    queryKey: ['gasolina'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .from('gasolina')
        .select()
        .eq('usuario_id', user.user.id)
        .eq('deletado', false)
        .order('data', { ascending: false })

      if (error) throw error
      return data || []
    },
  })
  const createGasolina = useMutation({
    mutationFn: async (gasolina: InsertGasolina) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('gasolina')
        .insert({
          ...gasolina,
          usuario_id: user.user.id,
          deletado: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gasolina'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateGasolina = useMutation({
    mutationFn: async ({ id, ...gasolina }: Partial<Gasolina> & { id: number }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('gasolina')
        .update({
          ...gasolina,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gasolina'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteGasolina = useMutation({
    mutationFn: async (id: number) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('gasolina')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gasolina'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      refreshDashboard()
    },
  })
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }
  const stats = {
    gastoTotal: abastecimentos.reduce((sum, a) => sum + a.valor, 0),
    litrosTotais: abastecimentos.reduce((sum, a) => sum + a.litros, 0),
    precoMedio: abastecimentos.length > 0 
      ? abastecimentos.reduce((sum, a) => sum + a.preco_litro, 0) / abastecimentos.length 
      : 0,
    totalAbastecimentos: abastecimentos.length,
  }
  return {
    abastecimentos,
    stats,
    isLoading,
    error,
    createGasolina: createGasolina.mutate,
    updateGasolina: updateGasolina.mutate,
    deleteGasolina: deleteGasolina.mutate,
    isCreating: createGasolina.isPending,
    isUpdating: updateGasolina.isPending,
    isDeleting: deleteGasolina.isPending,
  }
}


