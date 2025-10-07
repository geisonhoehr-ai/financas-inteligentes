'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/lib/toast'
export interface DividaInterna {
  id: string
  familia_id: string
  credor_id: string
  credor_nome?: string
  devedor_id: string
  devedor_nome?: string
  valor: number
  descricao: string
  gasto_original_id?: string
  parcela_numero?: number
  parcela_total?: number
  status: 'pendente' | 'paga' | 'cancelada'
  data_criacao: string
  data_vencimento?: string
  data_pagamento?: string
  comprovante_url?: string
  observacoes?: string
}
export interface ResumoDividas {
  familia_id: string
  familia_nome: string
  total_devo: number
  total_recebo: number
  saldo_liquido: number
  qtd_dividas_pendentes: number
}
export interface DividaPorPessoa {
  pessoa_id: string
  pessoa_nome: string
  valor: number
  qtd_dividas: number
  tipo: 'devo' | 'recebo'
}
export function useDividas(familiaId?: string) {
  const queryClient = useQueryClient()
  const { data: dividas = [], isLoading } = useQuery({
    queryKey: ['dividas', familiaId],
    queryFn: async () => {
      console.log('Busca de dívidas desabilitada temporariamente')
      return []
    },
    enabled: !!familiaId,
  })
  const { data: resumo } = useQuery<ResumoDividas[]>({
    queryKey: ['resumo-dividas', familiaId],
    queryFn: async () => {
      console.log('Resumo de dívidas desabilitado temporariamente')
      return []
    },
  })
  const { data: dividasQueDevo = [] } = useQuery({
    queryKey: ['dividas-devo', familiaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')
      console.log('Busca de dívidas que devo desabilitada temporariamente')
      return []
    },
    enabled: !!familiaId,
  })
  const { data: dividasQueRecebo = [] } = useQuery({
    queryKey: ['dividas-recebo', familiaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')
      console.log('Busca de dívidas que recebo desabilitada temporariamente')
      return []
    },
    enabled: !!familiaId,
  })
  const createDivida = useMutation({
    mutationFn: async (divida: Partial<DividaInterna>) => {
      console.log('Criar dívida desabilitado temporariamente:', divida)
      throw new Error('Funcionalidade de criar dívida temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dividas'] })
      queryClient.invalidateQueries({ queryKey: ['resumo-dividas'] })
      queryClient.invalidateQueries({ queryKey: ['dividas-devo'] })
      queryClient.invalidateQueries({ queryKey: ['dividas-recebo'] })
      showToast.success('Dívida registrada com sucesso!')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao criar dívida: ${error.message}`)
    },
  })
  const marcarComoPaga = useMutation({
    mutationFn: async ({ id, comprovanteUrl }: { id: string; comprovanteUrl?: string }) => {
      console.log('Marcar dívida como paga desabilitado temporariamente:', id)
      throw new Error('Funcionalidade de marcar dívida como paga temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dividas'] })
      queryClient.invalidateQueries({ queryKey: ['resumo-dividas'] })
      queryClient.invalidateQueries({ queryKey: ['dividas-devo'] })
      queryClient.invalidateQueries({ queryKey: ['dividas-recebo'] })
      showToast.success('Dívida marcada como paga!')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao marcar dívida: ${error.message}`)
    },
  })
  const cancelarDivida = useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo?: string }) => {
      console.log('Cancelar dívida desabilitado temporariamente:', id)
      throw new Error('Funcionalidade de cancelar dívida temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dividas'] })
      queryClient.invalidateQueries({ queryKey: ['resumo-dividas'] })
      queryClient.invalidateQueries({ queryKey: ['dividas-devo'] })
      queryClient.invalidateQueries({ queryKey: ['dividas-recebo'] })
      showToast.success('Dívida cancelada!')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao cancelar dívida: ${error.message}`)
    },
  })
  const dividirGasto = useMutation({
    mutationFn: async ({ gastoId, divisao }: { gastoId: string; divisao: Record<string, number> }) => {
      const divisaoFormatada = Object.entries(divisao).reduce((acc, [userId, percentual]) => {
        acc[userId] = { percentual }
        return acc
      }, {} as Record<string, { percentual: number }>)
      console.log('Dividir gasto entre membros desabilitado temporariamente:', gastoId)
      throw new Error('Funcionalidade de dividir gasto entre membros temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dividas'] })
      queryClient.invalidateQueries({ queryKey: ['resumo-dividas'] })
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      showToast.success('Gasto dividido com sucesso!')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao dividir gasto: ${error.message}`)
    },
  })
  return {
    dividas,
    dividasQueDevo,
    dividasQueRecebo,
    resumo,
    isLoading,
    createDivida: createDivida.mutate,
    marcarComoPaga: marcarComoPaga.mutate,
    cancelarDivida: cancelarDivida.mutate,
    dividirGasto: dividirGasto.mutate,
    isCreating: createDivida.isPending,
    isMarking: marcarComoPaga.isPending,
    isCanceling: cancelarDivida.isPending,
    isDividing: dividirGasto.isPending,
  }
}


