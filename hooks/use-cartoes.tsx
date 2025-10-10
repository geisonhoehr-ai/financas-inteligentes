'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'

export interface Cartao {
  id: string
  nome: string
  bandeira: string
  ultimos_digitos: string
  limite: number
  dia_vencimento: number
  dia_fechamento: number
  usuario_id: string
  status: string
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null
  created_at: string
}
export interface InsertCartao {
  nome: string
  bandeira: string
  ultimos_digitos: string
  limite: number
  dia_vencimento: number
  dia_fechamento: number
  status?: string
  observacoes?: string
  familia_id?: string
  visivel_familia?: boolean
  privado?: boolean
}
export function useCartoes() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()
  
  const { data: cartoes = [], isLoading, error } = useQuery<Cartao[]>({
    queryKey: ['cartoes', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      let query = supabase
        .from('cartoes')
        .select('*')
        .eq('deletado', false)
      
      if (familiaAtivaId) {
        query = query.eq('familia_id', familiaAtivaId)
      } else {
        query = query.is('familia_id', null)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return (data as unknown as Cartao[]) || []
    },
  })
  const createCartao = useMutation({
    mutationFn: async (cartao: InsertCartao) => {
      const { data, error } = await supabase.rpc('criar_cartao', {
        p_nome: cartao.nome,
        p_bandeira: cartao.bandeira,
        p_ultimos_digitos: cartao.ultimos_digitos,
        p_limite: cartao.limite,
        p_dia_vencimento: cartao.dia_vencimento,
        p_dia_fechamento: cartao.dia_fechamento,
        p_status: cartao.status || 'ativo',
        p_observacoes: cartao.observacoes || '',
        p_familia_id: cartao.familia_id || '',
        p_visivel_familia: cartao.visivel_familia || true,
        p_privado: cartao.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes'] })
    },
  })
  const updateCartao = useMutation({
    mutationFn: async ({ id, ...cartao }: Partial<Cartao> & { id: string }) => {
      const { data, error } = await supabase.rpc('atualizar_cartao', {
        p_id: id,
        p_nome: cartao.nome || '',
        p_bandeira: cartao.bandeira || '',
        p_ultimos_digitos: cartao.ultimos_digitos || '',
        p_limite: cartao.limite || 0,
        p_dia_vencimento: cartao.dia_vencimento || 1,
        p_dia_fechamento: cartao.dia_fechamento || 1,
        p_status: cartao.status || 'ativo',
        p_observacoes: cartao.observacoes || '',
        p_visivel_familia: cartao.visivel_familia || true,
        p_privado: cartao.privado || false
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes'] })
    },
  })
  const deleteCartao = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('deletar_cartao', {
        p_id: id
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
    },
  })
  const cartoesAtivos = cartoes.filter(c => (c as any).ativo === true || (c as any).status === 'ativo')
  const stats = {
    faturaAtual: 0,
    limiteDisponivel: cartoesAtivos.reduce((sum, c) => sum + (c.limite || 0), 0),
    cartoesAtivos: cartoesAtivos.length,
    proximoVencimento: getProximoVencimento(cartoesAtivos),
  }
  function getProximoVencimento(cartoes: any[]) {
    if (cartoes.length === 0) return null
    const hoje = new Date()
    const diaHoje = hoje.getDate()
    const proximos = cartoes
      .map(c => ({
        ...c,
        diasRestantes: c.dia_vencimento >= diaHoje 
          ? c.dia_vencimento - diaHoje 
          : (30 - diaHoje) + c.dia_vencimento
      }))
      .sort((a, b) => a.diasRestantes - b.diasRestantes)
    return proximos[0]?.dia_vencimento
  }
  return {
    cartoes,
    stats,
    isLoading,
    error,
    createCartao: createCartao.mutate,
    updateCartao: updateCartao.mutate,
    deleteCartao: deleteCartao.mutate,
    isCreating: createCartao.isPending,
    isUpdating: updateCartao.isPending,
    isDeleting: deleteCartao.isPending,
  }
}


