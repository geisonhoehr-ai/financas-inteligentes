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

  // TODO: Implementar busca de convites quando tabela estiver disponível
  const { data: convites = [], isLoading } = useQuery<Convite[]>({
    queryKey: ['convites', familiaId],
    queryFn: async () => {
      console.log('Busca de convites desabilitada temporariamente')
      return []
    },
    enabled: false, // Desabilitar temporariamente
  })

  // TODO: Implementar criação de convites quando tabela estiver disponível
  const createConvite = useMutation({
    mutationFn: async (novoConvite: NovoConvite) => {
      console.log('Criação de convite desabilitada temporariamente:', novoConvite)
      throw new Error('Funcionalidade de convites temporariamente desabilitada')
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
      // TODO: Implementar quando função RPC estiver disponível no banco
      console.log('Validação de convite desabilitada temporariamente:', codigo)
      throw new Error('Funcionalidade de validação de convites temporariamente desabilitada')
      
      // const { data, error } = await supabase
      //   .rpc('validar_convite', { p_codigo: codigo })

      // if (error) throw error

      // // RPC retorna array, pegar primeiro item
      // return data && data.length > 0 ? data[0] : null
    },
    onError: (error: any) => {
      showToast.error(`Erro ao validar convite: ${error.message}`)
    },
  })

  // Aceitar convite
  const aceitarConvite = useMutation({
    mutationFn: async (codigo: string) => {
      // TODO: Implementar quando função RPC estiver disponível no banco
      console.log('Aceitar convite desabilitado temporariamente:', codigo)
      throw new Error('Funcionalidade de aceitar convites temporariamente desabilitada')
      
      // const { data: user } = await supabase.auth.getUser()
      // if (!user.user) throw new Error('Usuário não autenticado')

      // const { data, error } = await supabase
      //   .rpc('aceitar_convite', {
      //     p_codigo: codigo,
      //     p_usuario_id: user.user.id,
      //   })

      // if (error) throw error

      // // RPC retorna array, pegar primeiro item
      // const resultado = data && data.length > 0 ? data[0] : null

      // if (!resultado?.sucesso) {
      //   throw new Error(resultado?.mensagem || 'Erro ao aceitar convite')
      // }

      // return resultado
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

  // TODO: Implementar desativação de convites quando tabela estiver disponível
  const desativarConvite = useMutation({
    mutationFn: async (id: string) => {
      console.log('Desativação de convite desabilitada temporariamente:', id)
      throw new Error('Funcionalidade de convites temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite desativado')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao desativar convite: ${error.message}`)
    },
  })

  // TODO: Implementar reativação de convites quando tabela estiver disponível
  const reativarConvite = useMutation({
    mutationFn: async (id: string) => {
      console.log('Reativação de convite desabilitada temporariamente:', id)
      throw new Error('Funcionalidade de convites temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] })
      showToast.success('Convite reativado')
    },
    onError: (error: any) => {
      showToast.error(`Erro ao reativar convite: ${error.message}`)
    },
  })

  // TODO: Implementar exclusão de convites quando tabela estiver disponível
  const deleteConvite = useMutation({
    mutationFn: async (id: string) => {
      console.log('Exclusão de convite desabilitada temporariamente:', id)
      throw new Error('Funcionalidade de convites temporariamente desabilitada')
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

