'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { DeletedItem } from '@/types'
import { showToast } from '@/lib/toast'
const TABELAS = [
  { nome: 'gastos', label: 'Gasto' },
  { nome: 'compras_parceladas', label: 'Parcela' },
  { nome: 'gasolina', label: 'Gasolina' },
  { nome: 'assinaturas', label: 'Assinatura' },
  { nome: 'contas_fixas', label: 'Conta Fixa' },
  { nome: 'ferramentas_ia_dev', label: 'Ferramenta' },
  { nome: 'cartoes', label: 'Cartão' },
  { nome: 'dividas', label: 'Dívida' },
  { nome: 'emprestimos', label: 'Empréstimo' },
  { nome: 'metas', label: 'Meta' },
  { nome: 'orcamentos', label: 'Orçamento' },
  { nome: 'investimentos', label: 'Investimento' },
  { nome: 'patrimonio', label: 'Patrimônio' },
] as const
export function useLixeira() {
  const queryClient = useQueryClient()
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['lixeira'],
    queryFn: async () => {
      const todosItens: DeletedItem[] = []
      const dataLimite = new Date()
      dataLimite.setDate(dataLimite.getDate() - 30) 
      for (const tabela of TABELAS) {
        const { data } = await supabase
          .gte('deletado_em', dataLimite.toISOString())
        if (data && data.length > 0) {
          todosItens.push(
            ...data.map((item: any) => ({
              ...item,
              tabela: tabela.nome,
              tipoLabel: tabela.label,
            }))
          )
        }
      }
      todosItens.sort(
        (a, b) =>
          new Date(b.deletado_em).getTime() - new Date(a.deletado_em).getTime()
      )
      return todosItens
    },
    staleTime: 10000, 
  })
  const restoreItem = useMutation({
    mutationFn: async ({ tabela, id }: { tabela: string; id: number }) => {
      console.log('RPC desabilitado temporariamente')
      throw new Error('Funcionalidade temporariamente desabilitada')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
      queryClient.invalidateQueries({ queryKey: ['gastos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      refreshDashboard()
      showToast.success('Item restaurado com sucesso!')
    },
    onError: (error) => {
      showToast.error('Erro ao restaurar item: ' + error.message)
    },
  })
  const permanentlyDeleteItem = useMutation({
    mutationFn: async ({ tabela, id }: { tabela: string; id: number }) => {
      const { error } = await supabase.from(tabela as any).delete().eq('id', id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lixeira'] })
    },
  })
  const refreshDashboard = async () => {
    await supabase.rpc('refresh_dashboard_views')
  }
  return {
    items,
    isLoading,
    error,
    restoreItem: restoreItem.mutate,
    permanentlyDeleteItem: permanentlyDeleteItem.mutate,
    isRestoring: restoreItem.isPending,
    isDeleting: permanentlyDeleteItem.isPending,
  }
}
