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
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .from('cartoes')
        .select()
        .eq('usuario_id', user.user.id)
        .eq('deletado', false)
        .order('nome', { ascending: true })

      if (error) throw error
      return data || []
    },
  })
  const createCartao = useMutation({
    mutationFn: async (cartao: InsertCartao) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('cartoes')
        .insert({
          ...cartao,
          usuario_id: user.user.id,
          status: 'ativo',
          deletado: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes'] })
    },
  })
  const updateCartao = useMutation({
    mutationFn: async ({ id, ...cartao }: Partial<Cartao> & { id: number }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('cartoes')
        .update({
          ...cartao,
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
      queryClient.invalidateQueries({ queryKey: ['cartoes'] })
    },
  })
  const deleteCartao = useMutation({
    mutationFn: async (id: number) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('cartoes')
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


