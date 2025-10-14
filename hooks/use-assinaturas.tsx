'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { showToast } from '@/lib/toast'
import { useFamiliaAtiva } from './use-familia-ativa'
export interface Assinatura {
  id: string
  nome: string
  valor: number
  dia_cobranca: number
  dia_vencimento?: number // Alias para compatibilidade
  usuario_id: string
  categoria?: string
  status?: string
  ativa?: boolean | null
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
export interface InsertAssinatura {
  nome: string
  valor: number
  dia_vencimento: number
  categoria?: string
  status?: string
  data_inicio: string
  data_fim?: string | null
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useAssinaturas() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()
  
  const { data: assinaturas = [], isLoading, error } = useQuery<Assinatura[]>({
    queryKey: ['assinaturas', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      // Buscar assinaturas filtradas por família
      let query = supabase
        .from('assinaturas')
        .select('*')
        .eq('deletado', false)
      
      if (familiaAtivaId) {
        query = query.eq('familia_id', familiaAtivaId)
      } else {
        query = query.is('familia_id', null)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar assinaturas:', error)
        throw error
      }
      
      return (data as unknown as Assinatura[]) || []
    },
  })
  const createAssinatura = useMutation({
    mutationFn: async (assinatura: InsertAssinatura) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('assinaturas')
        .insert([{
          nome: assinatura.nome,
          valor: assinatura.valor,
          dia_vencimento: assinatura.dia_vencimento,
          categoria: assinatura.categoria || '',
          ativa: assinatura.status === 'ativa',
          data_inicio: assinatura.data_inicio,
          data_cancelamento: assinatura.data_fim || null,
          observacoes: assinatura.observacoes || '',
          usuario_id: user.user.id,
          familia_id: assinatura.familia_id || null,
          visivel_familia: assinatura.visivel_familia !== false,
          privado: assinatura.privado || false,
          deletado: false
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar assinatura:', error)
        throw error
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast.success('Assinatura criada com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao criar assinatura: ' + error.message)
    },
  })
  const updateAssinatura = useMutation({
    mutationFn: async ({ id, ...assinatura }: Partial<Assinatura> & { id: string }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('assinaturas')
        .update({
          nome: assinatura.nome,
          valor: assinatura.valor,
          dia_vencimento: assinatura.dia_vencimento,
          categoria: assinatura.categoria,
          ativa: assinatura.status === 'ativa' || assinatura.ativa,
          data_inicio: assinatura.data_inicio,
          data_cancelamento: assinatura.data_fim || null,
          observacoes: assinatura.observacoes,
          visivel_familia: assinatura.visivel_familia,
          privado: assinatura.privado
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar assinatura:', error)
        throw error
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast.success('Assinatura atualizada com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao atualizar assinatura: ' + error.message)
    },
  })
  const deleteAssinatura = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('assinaturas')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao deletar assinatura:', error)
        throw error
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      showToast.success('Assinatura excluída com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao excluir assinatura: ' + error.message)
    },
  })

  const assinaturasAtivas = assinaturas.filter(a => (a as any).ativa === true || (a as any).status === 'ativa')
  const stats = {
    gastoMensal: assinaturasAtivas.reduce((sum, a) => sum + a.valor, 0),
    assinaturasAtivas: assinaturasAtivas.length,
    proximoVencimento: getProximoVencimento(assinaturasAtivas),
    gastoAnual: assinaturasAtivas.reduce((sum, a) => sum + a.valor, 0) * 12,
  }
  function getProximoVencimento(assinaturas: any[]) {
    if (assinaturas.length === 0) return null
    const hoje = new Date()
    const diaHoje = hoje.getDate()
    const proximas = assinaturas
      .map(a => {
        const diaVenc = a.dia_cobranca || a.dia_vencimento || 1
        return {
          ...a,
          diasRestantes: diaVenc >= diaHoje
            ? diaVenc - diaHoje
            : (30 - diaHoje) + diaVenc
        }
      })
      .sort((a, b) => a.diasRestantes - b.diasRestantes)
    return proximas[0]
  }
  return {
    assinaturas,
    stats,
    isLoading,
    error,
    createAssinatura: createAssinatura.mutateAsync,
    updateAssinatura: updateAssinatura.mutateAsync,
    deleteAssinatura: deleteAssinatura.mutateAsync,
    isCreating: createAssinatura.isPending,
    isUpdating: updateAssinatura.isPending,
    isDeleting: deleteAssinatura.isPending,
  }
}


