'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'
export interface Gasolina {
  id: string
  descricao?: string
  valor: number
  litros: number
  preco_litro: number
  km_atual?: number
  usuario_id: string
  data: string
  posto?: string
  tipo_combustivel?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null
  created_at: string
}
export interface InsertGasolina {
  descricao?: string
  valor: number
  litros: number
  preco_litro: number
  km_atual?: number
  data: string
  posto?: string
  tipo_combustivel?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useGasolina() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()
  
  const { data: abastecimentos = [], isLoading, error } = useQuery({
    queryKey: ['gasolina', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      let query = supabase
        .from('gasolina')
        .select('*')
        .eq('deletado', false)
      
      if (familiaAtivaId) {
        query = query.eq('familia_id', familiaAtivaId)
      } else {
        query = query.is('familia_id', null)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
  })
  const createGasolina = useMutation({
    mutationFn: async (gasolina: InsertGasolina) => {
      const { data, error } = await supabase.rpc('criar_gasolina', {
        p_descricao: gasolina.descricao || "",
        p_valor: gasolina.valor,
        p_litros: gasolina.litros,
        p_preco_litro: gasolina.preco_litro,
        p_km_atual: gasolina.km_atual || 0,
        p_data: gasolina.data,
        p_posto: gasolina.posto || "",
        p_tipo_combustivel: gasolina.tipo_combustivel || "",
        p_familia_id: gasolina.familia_id || "",
        p_visivel_familia: gasolina.visivel_familia || true,
        p_privado: gasolina.privado || false
      })

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
    mutationFn: async ({ id, ...gasolina }: Partial<Gasolina> & { id: string }) => {
      const { data, error } = await supabase.rpc('atualizar_gasolina', {
        p_id: id,
        p_descricao: gasolina.descricao || "",
        p_valor: gasolina.valor || 0,
        p_litros: gasolina.litros || 0,
        p_preco_litro: gasolina.preco_litro || 0,
        p_km_atual: gasolina.km_atual || 0,
        p_data: gasolina.data || new Date().toISOString(),
        p_posto: gasolina.posto || "",
        p_tipo_combustivel: gasolina.tipo_combustivel || "",
        p_visivel_familia: gasolina.visivel_familia || true,
        p_privado: gasolina.privado || false
      })

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
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('deletar_gasolina', {
        p_id: id
      })

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
    gastoTotal: abastecimentos.reduce((sum, a) => sum + (a.valor || 0), 0),
    litrosTotais: abastecimentos.reduce((sum, a) => sum + (a.litros || 0), 0),
    precoMedio: abastecimentos.length > 0
      ? abastecimentos.reduce((sum, a) => sum + (a.preco_litro || 0), 0) / abastecimentos.length
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


