'use client'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { DashboardData } from '@/types'

export function useDashboard(familiaId?: string) {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard', familiaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        return {
          receitas_total: 0,
          total_saidas: 0,
          saldo_final: 0,
          gastos_mes: 0,
          parcelas_mes: 0,
          gasolina_mes: 0,
          assinaturas_mes: 0,
          contas_fixas_mes: 0,
          ferramentas_mes: 0,
          emprestimos_mes: 0,
          atualizado_em: new Date().toISOString()
        }
      }

      // Buscar gastos do mês atual
      const hoje = new Date()
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString()
      const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString()

      const { data: gastos } = await supabase
        .from('gastos')
        .select('valor')
        .eq('deletado', false)
        .gte('data', primeiroDiaMes)
        .lte('data', ultimoDiaMes)
        .eq(familiaId ? 'familia_id' : 'usuario_id', familiaId || user.user.id)

      // TODO: Tabela parcelas não existe no banco
      const parcelas: any[] = []

      const { data: assinaturas } = await supabase
        .from('assinaturas')
        .select('valor')
        .eq('deletado', false)
        .eq('ativo', true)
        .eq(familiaId ? 'familia_id' : 'usuario_id', familiaId || user.user.id)

      const { data: contas } = await supabase
        .from('contas_fixas')
        .select('valor')
        .eq('deletado', false)
        .eq('ativo', true)
        .eq(familiaId ? 'familia_id' : 'usuario_id', familiaId || user.user.id)

      const gastos_mes = gastos?.reduce((acc, g) => acc + (g.valor || 0), 0) || 0
      const parcelas_mes = parcelas?.reduce((acc, p) => acc + (p.valor || 0), 0) || 0
      const assinaturas_mes = assinaturas?.reduce((acc, a) => acc + (a.valor || 0), 0) || 0
      const contas_fixas_mes = contas?.reduce((acc, c) => acc + (c.valor || 0), 0) || 0

      const total_saidas = gastos_mes + parcelas_mes + assinaturas_mes + contas_fixas_mes

      return {
        receitas_total: 0,
        total_saidas,
        saldo_final: -total_saidas,
        gastos_mes,
        parcelas_mes,
        gasolina_mes: 0,
        assinaturas_mes,
        contas_fixas_mes,
        ferramentas_mes: 0,
        emprestimos_mes: 0,
        atualizado_em: new Date().toISOString()
      }
    },
    staleTime: 30000,
  })

  return {
    dashboard,
    isLoading,
    error,
  }
}


