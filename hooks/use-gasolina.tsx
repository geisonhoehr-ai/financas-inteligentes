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
      const { data, error } = await supabase
        .order('data', { ascending: false })
    },
  })
  const createGasolina = useMutation({
    mutationFn: async (gasolina: InsertGasolina) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gasolina'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateGasolina = useMutation({
    mutationFn: async ({ id, ...gasolina }: Partial<Gasolina> & { id: number }) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gasolina'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteGasolina = useMutation({
    mutationFn: async (id: number) => {
      console.log('RPC desabilitado temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
        p_tabela: 'gasolina',
        p_id: id,
      })
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

