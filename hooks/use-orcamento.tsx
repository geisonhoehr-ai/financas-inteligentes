'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'
import { showToast } from '@/lib/toast'

export interface Orcamento {
  id: string
  nome: string
  descricao?: string
  valor_total: number
  mes_referencia: number
  ano_referencia: number
  usuario_id: string
  familia_id?: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface OrcamentoCategoria {
  id: string
  orcamento_id: string
  categoria_id?: string
  nome_categoria?: string
  valor_planejado: number
  alerta_percentual: number
  // Dados calculados
  valor_realizado?: number
  percentual_usado?: number
  restante?: number
  status?: 'bom' | 'atencao' | 'alerta' | 'estourado'
}

export interface OrcamentoTag {
  id: string
  orcamento_id: string
  tag_id: string
  valor_planejado: number
  alerta_percentual: number
  // Dados calculados
  valor_realizado?: number
  percentual_usado?: number
  restante?: number
  status?: 'bom' | 'atencao' | 'alerta' | 'estourado'
}

export function useOrcamento() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()

  // Buscar orçamento do mês atual
  const { data: orcamentoAtual, isLoading } = useQuery({
    queryKey: ['orcamento-atual', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return null

      const hoje = new Date()
      const mes = hoje.getMonth() + 1
      const ano = hoje.getFullYear()

      const query = (supabase as any)
        .from('orcamentos')
        .select('*')
        .eq('usuario_id', user.user.id)
        .eq('mes_referencia', mes)
        .eq('ano_referencia', ano)
        .eq('ativo', true)

      if (familiaAtivaId) {
        query.eq('familia_id', familiaAtivaId)
      } else {
        query.is('familia_id', null)
      }

      const { data, error } = await query.single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar orçamento:', error)
        return null
      }

      return data as Orcamento | null
    },
  })

  // Buscar categorias do orçamento
  const { data: orcamentoCategorias = [] } = useQuery({
    queryKey: ['orcamento-categorias', orcamentoAtual?.id],
    queryFn: async () => {
      if (!orcamentoAtual?.id) return []

      const { data, error } = await (supabase as any)
        .from('orcamento_categorias')
        .select('*, categorias(nome, icone)')
        .eq('orcamento_id', orcamentoAtual.id)

      if (error) {
        console.error('Erro ao buscar categorias do orçamento:', error)
        return []
      }

      return data
    },
    enabled: !!orcamentoAtual?.id,
  })

  // Buscar tags do orçamento
  const { data: orcamentoTags = [] } = useQuery({
    queryKey: ['orcamento-tags', orcamentoAtual?.id],
    queryFn: async () => {
      if (!orcamentoAtual?.id) return []

      const { data, error } = await (supabase as any)
        .from('orcamento_tags')
        .select('*, tags(nome, icone, cor)')
        .eq('orcamento_id', orcamentoAtual.id)

      if (error) {
        console.error('Erro ao buscar tags do orçamento:', error)
        return []
      }

      return data
    },
    enabled: !!orcamentoAtual?.id,
  })

  // Criar orçamento
  const createOrcamento = useMutation({
    mutationFn: async (orcamento: Omit<Orcamento, 'id' | 'usuario_id' | 'created_at' | 'updated_at'>) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await (supabase as any)
        .from('orcamentos')
        .insert([{
          nome: orcamento.nome,
          descricao: orcamento.descricao || '',
          valor_total: orcamento.valor_total,
          mes_referencia: orcamento.mes_referencia,
          ano_referencia: orcamento.ano_referencia,
          usuario_id: user.user.id,
          familia_id: familiaAtivaId || null,
          ativo: true
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar orçamento:', error)
        console.error('Dados enviados:', orcamento)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orcamento-atual'] })
      showToast.success('Orçamento criado com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao criar orçamento: ' + error.message)
    },
  })

  // Adicionar categoria ao orçamento
  const addCategoriaToOrcamento = useMutation({
    mutationFn: async ({ orcamentoId, categoriaId, valorPlanejado, alertaPercentual = 80 }: {
      orcamentoId: string
      categoriaId: string
      valorPlanejado: number
      alertaPercentual?: number
    }) => {
      const { data, error } = await (supabase as any)
        .from('orcamento_categorias')
        .insert([{
          orcamento_id: orcamentoId,
          categoria_id: categoriaId,
          valor_planejado: valorPlanejado,
          alerta_percentual: alertaPercentual
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orcamento-categorias'] })
      showToast.success('Categoria adicionada ao orçamento!')
    },
  })

  // Adicionar tag ao orçamento
  const addTagToOrcamento = useMutation({
    mutationFn: async ({ orcamentoId, tagId, valorPlanejado, alertaPercentual = 80 }: {
      orcamentoId: string
      tagId: string
      valorPlanejado: number
      alertaPercentual?: number
    }) => {
      const { data, error } = await (supabase as any)
        .from('orcamento_tags')
        .insert([{
          orcamento_id: orcamentoId,
          tag_id: tagId,
          valor_planejado: valorPlanejado,
          alerta_percentual: alertaPercentual
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orcamento-tags'] })
      showToast.success('Tag adicionada ao orçamento!')
    },
  })

  return {
    orcamentoAtual,
    orcamentoCategorias,
    orcamentoTags,
    isLoading,
    createOrcamento: createOrcamento.mutate,
    addCategoriaToOrcamento: addCategoriaToOrcamento.mutate,
    addTagToOrcamento: addTagToOrcamento.mutate,
    isCreating: createOrcamento.isPending,
  }
}

