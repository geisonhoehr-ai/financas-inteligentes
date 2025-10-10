'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'
import { showToast } from '@/lib/toast'

export interface DesafioFamilia {
  id: string
  familia_id: string
  nome: string
  descricao?: string
  tipo: string
  meta_economia?: number
  data_inicio: string
  data_fim: string
  ativo: boolean
  concluido: boolean
  premio?: string
  criado_por: string
  created_at: string
  // Da view
  economia_total?: number
  participantes?: number
  total_regras?: number
  regras_concluidas?: number
}

export function useModoEconomia() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()

  // Buscar desafios ativos
  const { data: desafiosAtivos = [], isLoading } = useQuery({
    queryKey: ['desafios-ativos', familiaAtivaId],
    queryFn: async () => {
      if (!familiaAtivaId) return []

      const { data, error } = await (supabase as any)
        .from('vw_desafios_ativos')
        .select('*')
        .eq('familia_id', familiaAtivaId)
        .order('data_inicio', { ascending: false })

      if (error) {
        console.error('Erro ao buscar desafios:', error)
        return []
      }

      return data as unknown as DesafioFamilia[]
    },
    enabled: !!familiaAtivaId,
  })

  // Criar desafio
  const createDesafio = useMutation({
    mutationFn: async (desafio: Omit<DesafioFamilia, 'id' | 'criado_por' | 'created_at'>) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await (supabase as any)
        .from('desafios_familia')
        .insert([{
          familia_id: desafio.familia_id,
          nome: desafio.nome,
          descricao: desafio.descricao,
          tipo: desafio.tipo,
          meta_economia: desafio.meta_economia,
          data_inicio: desafio.data_inicio,
          data_fim: desafio.data_fim,
          premio: desafio.premio,
          criado_por: user.user.id,
          ativo: true,
          concluido: false
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desafios-ativos'] })
      showToast.success('Desafio criado! Boa sorte! 🎯')
    },
  })

  // Registrar progresso
  const registrarProgresso = useMutation({
    mutationFn: async ({ desafioId, economiaDia, observacoes }: {
      desafioId: string
      economiaDia: number
      observacoes?: string
    }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await (supabase as any)
        .from('desafio_progresso')
        .insert([{
          desafio_id: desafioId,
          usuario_id: user.user.id,
          economia_dia: economiaDia,
          observacoes
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desafios-ativos'] })
      showToast.success('Progresso registrado! 💪')
    },
  })

  const modoEconomiaAtivo = desafiosAtivos.length > 0

  return {
    desafiosAtivos,
    modoEconomiaAtivo,
    isLoading,
    createDesafio: createDesafio.mutate,
    registrarProgresso: registrarProgresso.mutate,
    isCreating: createDesafio.isPending,
  }
}

