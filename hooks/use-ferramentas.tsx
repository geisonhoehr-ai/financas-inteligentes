'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Ferramenta {
  id: string
  nome: string
  valor: number
  usuario_id: string
  categoria: string
  periodicidade: string
  status: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null
  created_at: string
}
export interface InsertFerramenta {
  nome: string
  valor: number
  categoria: string
  periodicidade?: string
  status?: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useFerramentas() {
  const queryClient = useQueryClient()
  const { data: ferramentas = [], isLoading, error } = useQuery({
    queryKey: ['ferramentas'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_ferramentas')

      if (error) throw error
      return data || []
    },
  })
  const createFerramenta = useMutation({
    mutationFn: async (ferramenta: InsertFerramenta) => {
      const { data, error } = await supabase.rpc('criar_ferramenta', {
        p_nome: ferramenta.nome,
        p_valor: ferramenta.valor,
        p_categoria: ferramenta.categoria,
        p_periodicidade: ferramenta.periodicidade || null,
        p_status: ferramenta.status || 'ativa',
        p_data_inicio: ferramenta.data_inicio,
        p_data_fim: ferramenta.data_fim || null,
        p_observacoes: ferramenta.observacoes || null,
        p_familia_id: ferramenta.familia_id || null,
        p_visivel_familia: ferramenta.visivel_familia || true,
        p_privado: ferramenta.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateFerramenta = useMutation({
    mutationFn: async ({ id, ...ferramenta }: Partial<Ferramenta> & { id: string }) => {
      const { data, error } = await supabase.rpc('atualizar_ferramenta', {
        p_id: id,
        p_nome: ferramenta.nome || '',
        p_valor: ferramenta.valor || 0,
        p_categoria: ferramenta.categoria || '',
        p_periodicidade: ferramenta.periodicidade || null,
        p_status: ferramenta.status || 'ativa',
        p_data_inicio: ferramenta.data_inicio || new Date().toISOString(),
        p_data_fim: ferramenta.data_fim || null,
        p_observacoes: ferramenta.observacoes || null,
        p_visivel_familia: ferramenta.visivel_familia || true,
        p_privado: ferramenta.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteFerramenta = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('deletar_ferramenta', {
        p_id: id
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      refreshDashboard()
    },
  })
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }
  const ferramentasAtivas = ferramentas.filter(f => f.status === 'ativa')
  const stats = {
    gastoMensal: ferramentasAtivas
      .filter(f => f.periodicidade === 'mensal')
      .reduce((sum, f) => sum + f.valor, 0),
    ferramentasAtivas: ferramentasAtivas.length,
    softwaresLicenciados: ferramentas.filter(f => f.categoria === 'software').length,
    gastoAnual: ferramentasAtivas.reduce((sum, f) => {
      if (f.periodicidade === 'mensal') return sum + (f.valor * 12)
      if (f.periodicidade === 'anual') return sum + f.valor
      return sum
    }, 0),
  }
  return {
    ferramentas,
    stats,
    isLoading,
    error,
    createFerramenta: createFerramenta.mutate,
    updateFerramenta: updateFerramenta.mutate,
    deleteFerramenta: deleteFerramenta.mutate,
    isCreating: createFerramenta.isPending,
    isUpdating: updateFerramenta.isPending,
    isDeleting: deleteFerramenta.isPending,
  }
}


