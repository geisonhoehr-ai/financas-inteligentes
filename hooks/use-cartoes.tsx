'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
export interface Cartao {
  id: number
  nome: string
  bandeira: string
  ultimos_digitos: string
  limite: number
  dia_vencimento: number
  dia_fechamento: number
  usuario_id: number
  status: string
  observacoes?: string
  deletado: boolean
  deletado_em: string | null
  deletado_por: number | null
  created_at: string
}
export interface InsertCartao {
  nome: string
  bandeira: string
  ultimos_digitos: string
  limite: number
  dia_vencimento: number
  dia_fechamento: number
  usuario_id: number
  status?: string
  observacoes?: string
}
export function useCartoes() {
  const queryClient = useQueryClient()
  const { data: cartoes = [], isLoading, error } = useQuery({
    queryKey: ['cartoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .order('nome', { ascending: true })
    },
  })
  const createCartao = useMutation({
    mutationFn: async (cartao: InsertCartao) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes'] })
    },
  })
  const updateCartao = useMutation({
    mutationFn: async ({ id, ...cartao }: Partial<Cartao> & { id: number }) => {
      console.log('Operação desabilitada temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes'] })
    },
  })
  const deleteCartao = useMutation({
    mutationFn: async (id: number) => {
      console.log('RPC desabilitado temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
        p_tabela: 'cartoes',
        p_id: id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes'] })
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
    },
  })
  const cartoesAtivos = cartoes.filter(c => c.status === 'ativo')
  const stats = {
    faturaAtual: 0, 
    limiteDisponivel: cartoesAtivos.reduce((sum, c) => sum + c.limite, 0),
    cartoesAtivos: cartoesAtivos.length,
    proximoVencimento: getProximoVencimento(cartoesAtivos),
  }
  function getProximoVencimento(cartoes: Cartao[]) {
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

