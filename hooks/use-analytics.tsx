'use client'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

interface AnalyticsData {
  insights: {
    saldo: number
    economiaMensal: number
    tendenciaGastos: 'alta' | 'baixa' | 'estável'
    metaProgresso: number
    totalReceitas: number
    totalGastos: number
    categoriaMaiorGasto: string
  }
  gastosData: Array<{ mes: string; valor: number }>
  receitasData: Array<{ mes: string; valor: number }>
  categoriasData: Array<{ categoria: string; valor: number }>
  investimentosData: Array<{ tipo: string; valor: number }>
}

export function useAnalytics() {
  const { familiaAtivaId } = useFamiliaAtiva()

  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['analytics', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const hoje = new Date()
      const inicioMesAtual = startOfMonth(hoje)
      const fimMesAtual = endOfMonth(hoje)
      const inicioMesAnterior = startOfMonth(subMonths(hoje, 1))
      const fimMesAnterior = endOfMonth(subMonths(hoje, 1))

      // Buscar gastos do mês atual
      const { data: gastosAtual } = await supabase
        .from('gastos')
        .select('valor, categoria_id, categorias(nome)')
        .eq('deletado', false)
        .gte('data', inicioMesAtual.toISOString())
        .lte('data', fimMesAtual.toISOString())
        .eq(familiaAtivaId ? 'familia_id' : 'usuario_id', familiaAtivaId || user.user.id)

      // Buscar gastos do mês anterior
      const { data: gastosAnterior } = await supabase
        .from('gastos')
        .select('valor')
        .eq('deletado', false)
        .gte('data', inicioMesAnterior.toISOString())
        .lte('data', fimMesAnterior.toISOString())
        .eq(familiaAtivaId ? 'familia_id' : 'usuario_id', familiaAtivaId || user.user.id)

      // Buscar receitas (salários)
      const { data: salarios } = await supabase
        .from('salaries')
        .select('valor')
        .eq('deletado', false)
        .gte('mes_referencia', inicioMesAtual.toISOString().slice(0, 7))
        .lte('mes_referencia', fimMesAtual.toISOString().slice(0, 7))
        .eq(familiaAtivaId ? 'familia_id' : 'usuario_id', familiaAtivaId || user.user.id)

      // Buscar investimentos
      const { data: investimentos } = await supabase
        .from('investimentos')
        .select('tipo, valor')
        .eq('deletado', false)
        .eq('ativo', true)
        .eq(familiaAtivaId ? 'familia_id' : 'usuario_id', familiaAtivaId || user.user.id)

      // Calcular totais
      const totalGastosAtual = (gastosAtual as any)?.reduce((sum: number, g: any) => sum + Number(g.valor), 0) || 0
      const totalGastosAnterior = (gastosAnterior as any)?.reduce((sum: number, g: any) => sum + Number(g.valor), 0) || 0
      const totalReceitas = (salarios as any)?.reduce((sum: number, s: any) => sum + Number(s.valor), 0) || 0
      const totalInvestimentos = (investimentos as any)?.reduce((sum: number, i: any) => sum + Number(i.valor), 0) || 0

      // Calcular tendência
      const percentualMudanca = totalGastosAnterior > 0 
        ? ((totalGastosAtual - totalGastosAnterior) / totalGastosAnterior) * 100 
        : 0

      let tendenciaGastos: 'alta' | 'baixa' | 'estável' = 'estável'
      if (percentualMudanca > 10) tendenciaGastos = 'alta'
      else if (percentualMudanca < -10) tendenciaGastos = 'baixa'

      // Categoria com maior gasto
      const categoriasPorValor: Record<string, number> = {}
      ;(gastosAtual as any)?.forEach((g: any) => {
        const catNome = g.categorias?.nome || 'Sem categoria'
        categoriasPorValor[catNome] = (categoriasPorValor[catNome] || 0) + Number(g.valor)
      })

      const categoriaMaiorGasto = Object.entries(categoriasPorValor)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Nenhuma'

      // Preparar dados para gráficos
      const categoriasData = Object.entries(categoriasPorValor).map(([categoria, valor]) => ({
        categoria,
        valor
      }))

      const investimentosData = (investimentos as any)?.reduce((acc: any[], inv: any) => {
        const existing = acc.find(item => item.tipo === inv.tipo)
        if (existing) {
          existing.valor += Number(inv.valor)
        } else {
          acc.push({ tipo: inv.tipo, valor: Number(inv.valor) })
        }
        return acc
      }, []) || []

      // Dados mensais (últimos 6 meses)
      const mesesData = []
      for (let i = 5; i >= 0; i--) {
        const mesData = subMonths(hoje, i)
        const inicio = startOfMonth(mesData)
        const fim = endOfMonth(mesData)

        const { data: gastosMes } = await supabase
          .from('gastos')
          .select('valor')
          .eq('deletado', false)
          .gte('data', inicio.toISOString())
          .lte('data', fim.toISOString())
          .eq(familiaAtivaId ? 'familia_id' : 'usuario_id', familiaAtivaId || user.user.id)

        const totalMes = (gastosMes as any)?.reduce((sum: number, g: any) => sum + Number(g.valor), 0) || 0

        mesesData.push({
          mes: mesData.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          valor: totalMes
        })
      }

      return {
        insights: {
          saldo: totalReceitas - totalGastosAtual,
          economiaMensal: totalReceitas - totalGastosAtual,
          tendenciaGastos,
          metaProgresso: totalReceitas > 0 ? ((totalReceitas - totalGastosAtual) / totalReceitas) * 100 : 0,
          totalReceitas,
          totalGastos: totalGastosAtual,
          categoriaMaiorGasto
        },
        gastosData: mesesData,
        receitasData: mesesData.map(m => ({ ...m, valor: totalReceitas })),
        categoriasData,
        investimentosData
      }
    },
    staleTime: 30000, // 30 segundos
  })

  return {
    data,
    isLoading,
    error
  }
}

