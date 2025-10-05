'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/lib/toast'

export interface Convite {
  id: string
  familia_id: string
  familia_nome?: string
  codigo: string
  criado_por: string
  criador_nome?: string
  max_usos: number | null
  usos_atual: number
  validade: string | null
  ativo: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null
  created_at: string
  updated_at: string
}

export interface ConviteValidacao {
  valido: boolean
  mensagem: string
  convite_id: string | null
  familia_id: string | null
  familia_nome: string | null
}

export interface ConviteAceite {
  sucesso: boolean
  mensagem: string
  familia_id: string | null
}

export interface NovoConvite {
  familia_id: string
  max_usos?: number | null
  validade?: string | null
}

export function useConvites(familiaId?: string) {
  const queryClient = useQueryClient()

  // Buscar convites de uma família
  const { data: convites = [], isLoading } = useQuery({
    queryKey: ['convites', familiaId],
    queryFn: async () => {
      const query = supabase
        .from('convites')
        .select(`
          *,
          familia:familias!familia_id(nome),
          criador:users!criado_por(nome)
        `)
        .eq('deletado', false)
        .order('created_at', { ascending: false })

      if (familiaId) {
        query.eq('familia_id', familiaId)
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []).map((c: any) => ({
        ...c,
        familia_nome: c.familia?.nome,
        criador_nome: c.criador?.nome,
      }))
    },
    enabled: !!familiaId,
  })

  // Criar novo convite
  const createConvite = useMutation({
    mutationFn: async (novoConvite: NovoConvite) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('convites')
        .insert({
          familia_id: novoConvite.familia_id,
          criado_por: user.user.id,
          max_usos: novoConvite.max_usos,
          validade: novoConvite.validade,
          ativo: true,
        })
        .select(`
          *,
          familia:familias!familia_id(nome),
          criador:users!criado_por(nome)
        `)
        .single()

      if (error) throw error

      return {
        ...data,
        familia_nome: data.familia?.nome,
        criador_nome: data.criador?.nome,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite criado com sucesso!')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao criar convite: ${error.message}`)
    },
  })

  // Validar convite por código
  const validarConvite = useMutation({
    mutationFn: async (codigo: string) => {
      const { data, error } = await supabase
        .rpc('validar_convite', { p_codigo: codigo })

      if (error) throw error

      // RPC retorna array, pegar primeiro item
      return data && data.length > 0 ? data[0] : null
    },
    onError: (error: any) => {
      showToast.error(`Erro ao validar convite: ${error.message}`)
    },
  })

  // Aceitar convite
  const aceitarConvite = useMutation({
    mutationFn: async (codigo: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .rpc('aceitar_convite', {
          p_codigo: codigo,
          p_usuario_id: user.user.id,
        })

      if (error) throw error

      // RPC retorna array, pegar primeiro item
      const resultado = data && data.length > 0 ? data[0] : null

      if (!resultado?.sucesso) {
        throw new Error(resultado?.mensagem || 'Erro ao aceitar convite')
      }

      return resultado
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['familias'] })
      queryClient.invalidateQueries({ queryKey: ['familia-membros'] })
      showToast.success(data.mensagem)
    },
    onError: (error: any) => {
      showToast.error(error.message)
    },
  })

  // Desativar convite
  const desativarConvite = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('convites')
        .update({ ativo: false, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite desativado')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao desativar convite: ${error.message}`)
    },
  })

  // Reativar convite
  const reativarConvite = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('convites')
        .update({ ativo: true, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite reativado')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao reativar convite: ${error.message}`)
    },
  })

  // Soft delete convite
  const deleteConvite = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('convites')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite removido')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao remover convite: ${error.message}`)
    },
  })

  // Gerar link de convite
  const gerarLinkConvite = (codigo: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/convite/${codigo}`
  }

  return {
    convites,
    isLoading,
    createConvite: createConvite.mutate,
    validarConvite: validarConvite.mutate,
    aceitarConvite: aceitarConvite.mutate,
    desativarConvite: desativarConvite.mutate,
    reativarConvite: reativarConvite.mutate,
    deleteConvite: deleteConvite.mutate,
    gerarLinkConvite,
    isCreating: createConvite.isPending,
    isValidating: validarConvite.isPending,
    isAccepting: aceitarConvite.isPending,
    validacaoData: validarConvite.data,
  }
}

