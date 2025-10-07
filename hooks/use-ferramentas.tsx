'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Ferramenta {
  id: number
  nome: string
  valor: number
  usuario_id: number
  categoria: string
  periodicidade: string
  status: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}
export interface InsertFerramenta {
  nome: string
  valor: number
  usuario_id: number
  categoria: string
  periodicidade?: string
  status?: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
}
export function useFerramentas() {
  const queryClient = useQueryClient()
  const { data: ferramentas = [], isLoading, error } = useQuery({
    queryKey: ['ferramentas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .order('created_at', { ascending: false })
    },
  })
  const createFerramenta = useMutation({
    mutationFn: async (ferramenta: InsertFerramenta) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const updateFerramenta = useMutation({
    mutationFn: async ({ id, ...ferramenta }: Partial<Ferramenta> & { id: number }) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
    },
  })
  const deleteFerramenta = useMutation({
    mutationFn: async (id: number) => {
      console.log('RPC desabilitado temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
        p_tabela: 'ferramentas_ia_dev',
        p_id: id,
      })
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

