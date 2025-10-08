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
      if (!familiaId) return []

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_dividas', {
          p_familia_id: familiaId
        })

      if (error) throw error
      return data || []
    },
    enabled: !!familiaId,
  })
  const { data: resumo } = useQuery<ResumoDividas[]>({
    queryKey: ['resumo-dividas', familiaId],
    queryFn: async () => {
      if (!familiaId) return []

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('obter_meu_resumo_dividas', {
          p_familia_id: familiaId
        })

      if (error) throw error
      return data || []
    },
  })
  const { data: dividasQueDevo = [] } = useQuery({
    queryKey: ['dividas-devo', familiaId],
    queryFn: async () => {
      if (!familiaId) return []

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_dividas_que_devo', {
          p_familia_id: familiaId
        })

      if (error) throw error
      return data || []
    },
    enabled: !!familiaId,
  })
  const { data: dividasQueRecebo = [] } = useQuery({
    queryKey: ['dividas-recebo', familiaId],
    queryFn: async () => {
      if (!familiaId) return []

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .rpc('buscar_dividas_que_recebo', {
          p_familia_id: familiaId
        })

      if (error) throw error
      return data || []
    },
    enabled: !!familiaId,
  })
  const createDivida = useMutation({
    mutationFn: async (divida: Partial<DividaInterna>) => {
      const { data, error } = await supabase.rpc('criar_divida', {
        p_familia_id: divida.familia_id,
        p_credor_id: divida.credor_id,
        p_devedor_id: divida.devedor_id,
        p_valor: divida.valor,
        p_descricao: divida.descricao,
        p_gasto_original_id: divida.gasto_original_id || null,
        p_parcela_numero: divida.parcela_numero || null,
        p_parcela_total: divida.parcela_total || null,
        p_data_vencimento: divida.data_vencimento || null,
        p_observacoes: divida.observacoes || null
      })

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
  const marcarComoPaga = useMutation({
    mutationFn: async ({ id, comprovanteUrl }: { id: string; comprovanteUrl?: string }) => {
      const { data, error } = await supabase.rpc('marcar_divida_como_paga', {
        p_id: id,
        p_comprovante_url: comprovanteUrl || null
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
  const cancelarDivida = useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo?: string }) => {
      const { data, error } = await supabase.rpc('cancelar_divida', {
        p_id: id,
        p_motivo: motivo || null
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
  const dividirGasto = useMutation({
    mutationFn: async ({ gastoId, divisao }: { gastoId: string; divisao: Record<string, number> }) => {
      const divisaoFormatada = Object.entries(divisao).reduce((acc, [userId, percentual]) => {
        acc[userId] = { percentual }
        return acc
      }, {} as Record<string, { percentual: number }>)
      const { data, error } = await supabase
        .rpc('dividir_gasto_entre_membros', {
          p_gasto_id: gastoId,
          p_divisao: divisaoFormatada
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
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['dividas', familiaId] })
    queryClient.invalidateQueries({ queryKey: ['dividas-devo', familiaId] })
    queryClient.invalidateQueries({ queryKey: ['dividas-recebo', familiaId] })
    queryClient.invalidateQueries({ queryKey: ['resumo-dividas', familiaId] })
  }

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
    refreshData,
    isCreating: createDivida.isPending,
    isMarking: marcarComoPaga.isPending,
    isCanceling: cancelarDivida.isPending,
    isDividing: dividirGasto.isPending,
  }
}


