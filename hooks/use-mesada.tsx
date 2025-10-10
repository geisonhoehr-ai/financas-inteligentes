'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'
import { showToast } from '@/lib/toast'

export interface PerfilFilho {
  id: string
  nome: string
  data_nascimento?: string
  idade?: number
  avatar: string
  usuario_id?: string
  familia_id: string
  responsavel_id: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Mesada {
  id: string
  filho_id: string
  valor_base: number
  periodicidade: string
  dia_pagamento: number
  proximo_pagamento?: string
  saldo_atual: number
  pontos_acumulados: number
  nivel: number
  experiencia: number
  meta_economia?: number
  familia_id: string
  ativo: boolean
}

export interface Tarefa {
  id: string
  nome: string
  descricao?: string
  categoria: string
  icone: string
  valor_recompensa: number
  pontos: number
  filho_id: string
  familia_id: string
  criado_por: string
  recorrente: boolean
  frequencia?: string
  ativo: boolean
}

export interface AjusteMesada {
  mesada_id: string
  filho_id: string
  tipo: 'bonus' | 'penalidade' | 'tarefa' | 'presente'
  motivo: string
  valor: number
  pontos?: number
}

export function useMesada() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()

  // Buscar filhos
  const { data: filhos = [], isLoading: isLoadingFilhos } = useQuery({
    queryKey: ['filhos', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user || !familiaAtivaId) return []

      const { data, error } = await (supabase as any)
        .from('perfis_filhos')
        .select('*')
        .eq('familia_id', familiaAtivaId)
        .eq('ativo', true)
        .order('nome')

      if (error) {
        console.error('Erro ao buscar filhos:', error)
        return []
      }

      return data as unknown as PerfilFilho[]
    },
    enabled: !!familiaAtivaId,
  })

  // Buscar mesadas
  const { data: mesadas = [], isLoading: isLoadingMesadas } = useQuery({
    queryKey: ['mesadas', familiaAtivaId],
    queryFn: async () => {
      if (!familiaAtivaId || filhos.length === 0) return []

      const { data, error } = await (supabase as any)
        .from('mesadas')
        .select('*')
        .in('filho_id', filhos.map(f => f.id))

      if (error) {
        console.error('Erro ao buscar mesadas:', error)
        return []
      }

      return data as unknown as Mesada[]
    },
    enabled: filhos.length > 0,
  })

  // Buscar tarefas
  const { data: tarefas = [] } = useQuery({
    queryKey: ['tarefas', familiaAtivaId],
    queryFn: async () => {
      if (!familiaAtivaId) return []

      const { data, error } = await (supabase as any)
        .from('tarefas')
        .select('*')
        .eq('familia_id', familiaAtivaId)
        .eq('ativo', true)
        .order('valor_recompensa', { ascending: false })

      if (error) {
        console.error('Erro ao buscar tarefas:', error)
        return []
      }

      return data as unknown as Tarefa[]
    },
    enabled: !!familiaAtivaId,
  })

  // Criar filho
  const createFilho = useMutation({
    mutationFn: async (filho: Omit<PerfilFilho, 'id' | 'responsavel_id' | 'created_at' | 'updated_at'>) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await (supabase as any)
        .from('perfis_filhos')
        .insert([{
          nome: filho.nome,
          data_nascimento: filho.data_nascimento,
          idade: filho.idade,
          avatar: filho.avatar,
          familia_id: filho.familia_id,
          responsavel_id: user.user.id,
          ativo: true
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filhos'] })
      showToast.success('Perfil criado com sucesso!')
    },
  })

  // Criar mesada
  const createMesada = useMutation({
    mutationFn: async (mesada: Omit<Mesada, 'id' | 'saldo_atual' | 'pontos_acumulados' | 'nivel' | 'experiencia'>) => {
      const { data, error } = await (supabase as any)
        .from('mesadas')
        .insert([{
          filho_id: mesada.filho_id,
          valor_base: mesada.valor_base,
          periodicidade: mesada.periodicidade,
          dia_pagamento: mesada.dia_pagamento,
          familia_id: mesada.familia_id,
          saldo_atual: 0,
          pontos_acumulados: 0,
          nivel: 1,
          experiencia: 0,
          ativo: true
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mesadas'] })
      showToast.success('Mesada configurada!')
    },
  })

  // Aplicar ajuste (bônus ou penalidade)
  const aplicarAjuste = useMutation({
    mutationFn: async (ajuste: AjusteMesada) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await (supabase as any)
        .from('mesada_ajustes')
        .insert([{
          mesada_id: ajuste.mesada_id,
          filho_id: ajuste.filho_id,
          tipo: ajuste.tipo,
          motivo: ajuste.motivo,
          valor: ajuste.valor,
          pontos: ajuste.pontos || 0,
          aplicado_por: user.user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mesadas'] })
      const tipo = variables.tipo
      if (tipo === 'bonus') {
        showToast.success('Bônus aplicado! 🎉')
      } else if (tipo === 'penalidade') {
        showToast.success('Penalidade aplicada')
      }
    },
  })

  // Criar tarefa
  const createTarefa = useMutation({
    mutationFn: async (tarefa: Omit<Tarefa, 'id' | 'criado_por' | 'created_at'>) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await (supabase as any)
        .from('tarefas')
        .insert([{
          ...tarefa,
          criado_por: user.user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas'] })
      showToast.success('Tarefa criada!')
    },
  })

  // Atualizar mesada
  const updateMesada = useMutation({
    mutationFn: async ({ id, ...mesada }: Partial<Mesada> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from('mesadas')
        .update({
          valor_base: mesada.valor_base,
          dia_pagamento: mesada.dia_pagamento,
          meta_economia: mesada.meta_economia,
          ativo: mesada.ativo,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mesadas'] })
      showToast.success('Mesada atualizada com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao atualizar mesada: ' + error.message)
    },
  })

  // Pagar mesada
  const pagarMesada = useMutation({
    mutationFn: async (filhoId: string) => {
      const mesada = mesadas.find(m => m.filho_id === filhoId)
      if (!mesada) throw new Error('Mesada não encontrada')

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      // Adicionar valor da mesada como ajuste
      const { data, error } = await (supabase as any)
        .from('mesada_ajustes')
        .insert([{
          mesada_id: mesada.id,
          filho_id: filhoId,
          tipo: 'bonus',
          motivo: 'Pagamento de mesada mensal',
          valor: mesada.valor_base,
          pontos: 10,
          aplicado_por: user.user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mesadas'] })
      showToast.success('Mesada paga! 💰')
    },
  })

  return {
    filhos,
    mesadas,
    tarefas,
    isLoading: isLoadingFilhos || isLoadingMesadas,
    createFilho: createFilho.mutate,
    createMesada: createMesada.mutate,
    updateMesada: updateMesada.mutate,
    aplicarAjuste: aplicarAjuste.mutate,
    createTarefa: createTarefa.mutate,
    pagarMesada: pagarMesada.mutate,
    isCreating: createFilho.isPending || createMesada.isPending,
    isUpdating: updateMesada.isPending,
  }
}

