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

  // Buscar todas as dívidas da família
  const { data: dividas = [], isLoading } = useQuery({
    queryKey: ['dividas', familiaId],
    queryFn: async () => {
      const query = supabase
        .from('dividas_internas')
        .select(`
          *,
          credor:users!credor_id(nome),
          devedor:users!devedor_id(nome),
          familia:familias!familia_id(nome)
        `)
        .is('deleted_at', null)
        .order('data_criacao', { ascending: false })

      if (familiaId) {
        query.eq('familia_id', familiaId)
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []).map((d: any) => ({
        ...d,
        credor_nome: d.credor?.nome,
        devedor_nome: d.devedor?.nome,
      }))
    },
    enabled: !!familiaId,
  })

  // Buscar resumo de dívidas
  const { data: resumo } = useQuery<ResumoDividas[]>({
    queryKey: ['resumo-dividas', familiaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('obter_meu_resumo_dividas', { p_familia_id: familiaId || null })

      if (error) throw error
      return data || []
    },
  })

  // Buscar dívidas que eu devo
  const { data: dividasQueDevo = [] } = useQuery({
    queryKey: ['dividas-devo', familiaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const query = supabase
        .from('dividas_internas')
        .select(`
          *,
          credor:users!credor_id(nome),
          familia:familias!familia_id(nome)
        `)
        .eq('devedor_id', user.user.id)
        .eq('status', 'pendente')
        .is('deleted_at', null)
        .order('data_vencimento', { ascending: true })

      if (familiaId) {
        query.eq('familia_id', familiaId)
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []).map((d: any) => ({
        ...d,
        credor_nome: d.credor?.nome,
      }))
    },
    enabled: !!familiaId,
  })

  // Buscar dívidas que me devem
  const { data: dividasQueRecebo = [] } = useQuery({
    queryKey: ['dividas-recebo', familiaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const query = supabase
        .from('dividas_internas')
        .select(`
          *,
          devedor:users!devedor_id(nome),
          familia:familias!familia_id(nome)
        `)
        .eq('credor_id', user.user.id)
        .eq('status', 'pendente')
        .is('deleted_at', null)
        .order('data_vencimento', { ascending: true })

      if (familiaId) {
        query.eq('familia_id', familiaId)
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []).map((d: any) => ({
        ...d,
        devedor_nome: d.devedor?.nome,
      }))
    },
    enabled: !!familiaId,
  })

  // Criar dívida manualmente
  const createDivida = useMutation({
    mutationFn: async (divida: Partial<DividaInterna>) => {
      // @ts-expect-error - Supabase types
      const { data, error } = await supabase
        .from('dividas_internas')
        .insert([divida])
        .select()
        .single()

      if (error) throw error
      return data
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

  // Marcar dívida como paga
  const marcarComoPaga = useMutation({
    mutationFn: async ({ id, comprovanteUrl }: { id: string; comprovanteUrl?: string }) => {
      const { data, error } = await supabase
        .rpc('marcar_divida_paga', {
          p_divida_id: id,
          p_comprovante_url: comprovanteUrl || null,
        })

      if (error) throw error
      return data
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

  // Cancelar dívida
  const cancelarDivida = useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo?: string }) => {
      const { data, error } = await supabase
        .rpc('cancelar_divida', {
          p_divida_id: id,
          p_motivo: motivo || null,
        })

      if (error) throw error
      return data
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

  // Dividir gasto entre membros
  const dividirGasto = useMutation({
    mutationFn: async ({ gastoId, divisao }: { gastoId: string; divisao: Record<string, number> }) => {
      // Converter para formato JSONB esperado
      const divisaoFormatada = Object.entries(divisao).reduce((acc, [userId, percentual]) => {
        acc[userId] = { percentual }
        return acc
      }, {} as Record<string, { percentual: number }>)

      const { data, error } = await supabase
        .rpc('dividir_gasto_entre_membros', {
          p_gasto_id: gastoId,
          p_divisao: divisaoFormatada,
        })

      if (error) throw error
      return data
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

