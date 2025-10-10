'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'
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
  const { familiaAtivaId } = useFamiliaAtiva()
  
  const { data: ferramentas = [], isLoading, error } = useQuery<Ferramenta[]>({
    queryKey: ['ferramentas', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      let query = supabase
        .from('ferramentas')
        .select('*')
        .eq('deletado', false)
      
      if (familiaAtivaId) {
        query = query.eq('familia_id', familiaAtivaId)
      } else {
        query = query.is('familia_id', null)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return (data as unknown as Ferramenta[]) || []
    },
  })
  const createFerramenta = useMutation({
    mutationFn: async (ferramenta: InsertFerramenta) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('ferramentas')
        .insert([{
          nome: ferramenta.nome,
          valor: ferramenta.valor,
          categoria: ferramenta.categoria,
          periodicidade: ferramenta.periodicidade || 'mensal',
          status: ferramenta.status || 'ativa',
          data_inicio: ferramenta.data_inicio,
          data_fim: ferramenta.data_fim || null,
          observacoes: ferramenta.observacoes || '',
          usuario_id: user.user.id,
          familia_id: ferramenta.familia_id || null,
          visivel_familia: ferramenta.visivel_familia !== false,
          privado: ferramenta.privado || false,
          deletado: false
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar ferramenta:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
  const updateFerramenta = useMutation({
    mutationFn: async ({ id, ...ferramenta }: Partial<Ferramenta> & { id: string }) => {
      const { data, error } = await supabase
        .from('ferramentas')
        .update({
          nome: ferramenta.nome,
          valor: ferramenta.valor,
          categoria: ferramenta.categoria,
          periodicidade: ferramenta.periodicidade,
          status: ferramenta.status,
          data_inicio: ferramenta.data_inicio,
          data_fim: ferramenta.data_fim,
          observacoes: ferramenta.observacoes,
          visivel_familia: ferramenta.visivel_familia,
          privado: ferramenta.privado
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar ferramenta:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
  const deleteFerramenta = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('ferramentas')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao deletar ferramenta:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferramentas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
    },
  })
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


