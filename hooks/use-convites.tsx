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
  const { data: convites = [], isLoading } = useQuery<Convite[]>({
    queryKey: ['convites', familiaId],
    queryFn: async () => {
      if (!familiaId) return []

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      const { data, error } = await supabase
        .from('convites')
        .select(`
          id,
          familia_id,
          familia:familias!inner(nome),
          codigo,
          criado_por,
          criador:users!inner(nome),
          max_usos,
          usos_atual,
          validade,
          ativo,
          deletado,
          deletado_em,
          deletado_por,
          created_at,
          updated_at
        `)
        .eq('familia_id', familiaId)
        .eq('deletado', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(d => ({
        ...d,
        familia_nome: d.familia?.nome,
        criador_nome: d.criador?.nome
      })) || []
    },
    enabled: false, 
  })
  const createConvite = useMutation({
    mutationFn: async (novoConvite: NovoConvite) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const codigo = Math.random().toString(36).substring(2, 10).toUpperCase()

      const { data, error } = await supabase
        .from('convites')
        .insert({
          ...novoConvite,
          codigo,
          criado_por: user.user.id,
          usos_atual: 0,
          ativo: true,
          deletado: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite criado com sucesso!')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao criar convite: ${error.message}`)
    },
  })
  const validarConvite = useMutation({
    mutationFn: async (codigo: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .rpc('validar_convite', {
          p_codigo: codigo
        })

      if (error) throw error
      return data
    },
    onError: (error: any) => {
      showToast.error(`Erro ao validar convite: ${error.message}`)
    },
  })
  const aceitarConvite = useMutation({
    mutationFn: async (codigo: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .rpc('aceitar_convite', {
          p_codigo: codigo
        })

      if (error) throw error
      return data
    },
    onSuccess: (data: ConviteAceite) => {
      queryClient.invalidateQueries({ queryKey: ['familias'] })
      queryClient.invalidateQueries({ queryKey: ['familia-membros'] })
      showToast.success(data.mensagem)
    },
    onError: (error: any) => {
      showToast.error(error.message)
    },
  })
  const desativarConvite = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('convites')
        .update({
          ativo: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('criado_por', user.user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite desativado')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao desativar convite: ${error.message}`)
    },
  })
  const reativarConvite = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('convites')
        .update({
          ativo: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('criado_por', user.user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite reativado')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao reativar convite: ${error.message}`)
    },
  })
  const deleteConvite = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('convites')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('criado_por', user.user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite removido')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao remover convite: ${error.message}`)
    },
  })
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


