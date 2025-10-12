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
      try {
        const { data: user, error: authError } = await supabase.auth.getUser()
        if (authError) {
          console.error('Erro de autenticação:', {
            message: authError.message,
            name: authError.name,
            status: authError.status
          })
          throw authError
        }
        if (!user.user) throw new Error('Usuário não autenticado')

      const hoje = new Date()
      const inicioMesAtual = startOfMonth(hoje)
      const fimMesAtual = endOfMonth(hoje)
      const inicioMesAnterior = startOfMonth(subMonths(hoje, 1))
      const fimMesAnterior = endOfMonth(subMonths(hoje, 1))

        // Buscar gastos do mês atual
        const { data: gastosAtual, error: erroGastos } = await supabase
          .from('gastos')
          .select('valor, categoria_id, categorias(nome)')
          .eq('deletado', false)
          .gte('data', inicioMesAtual.toISOString())
          .lte('data', fimMesAtual.toISOString())
          .eq(familiaAtivaId ? 'familia_id' : 'usuario_id', familiaAtivaId || user.user.id)

        if (erroGastos) {
          console.error('Erro ao buscar gastos do mês:', {
            message: erroGastos.message,
            details: erroGastos.details,
            hint: erroGastos.hint,
            code: erroGastos.code
          })
        }

        // Buscar gastos do mês anterior
        const { data: gastosAnterior, error: erroGastosAnt } = await supabase
          .from('gastos')
          .select('valor')
          .eq('deletado', false)
          .gte('data', inicioMesAnterior.toISOString())
          .lte('data', fimMesAnterior.toISOString())
          .eq(familiaAtivaId ? 'familia_id' : 'usuario_id', familiaAtivaId || user.user.id)

        if (erroGastosAnt) {
          console.error('Erro ao buscar gastos do mês anterior:', {
            message: erroGastosAnt.message,
            details: erroGastosAnt.details
          })
        }

        // Buscar receitas (salários)
        const { data: salarios, error: erroSalarios } = await supabase
          .from('salarios')
          .select('valor')
          .eq('ativo', true)
          .eq('usuario_id', user.user.id)

        if (erroSalarios) {
          console.error('Erro ao buscar salários:', {
            message: erroSalarios.message,
            details: erroSalarios.details,
            hint: erroSalarios.hint,
            code: erroSalarios.code
          })
        }

        // Buscar investimentos
        const { data: investimentos, error: erroInvest } = await supabase
          .from('investimentos')
          .select('tipo, valor')
          .eq('deletado', false)
          .eq('ativo', true)
          .eq(familiaAtivaId ? 'familia_id' : 'usuario_id', familiaAtivaId || user.user.id)

        if (erroInvest) {
          console.error('Erro ao buscar investimentos:', {
            message: erroInvest.message,
            details: erroInvest.details
          })
        }

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

          const { data: gastosMes, error: erroMes } = await supabase
            .from('gastos')
            .select('valor')
            .eq('deletado', false)
            .gte('data', inicio.toISOString())
            .lte('data', fim.toISOString())
            .eq(familiaAtivaId ? 'familia_id' : 'usuario_id', familiaAtivaId || user.user.id)

          if (erroMes) {
            console.error(`Erro ao buscar gastos do mês ${i}:`, {
              message: erroMes.message,
              details: erroMes.details
            })
          }

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
      } catch (error: any) {
        console.error('Erro geral ao buscar analytics:', {
          message: error?.message,
          name: error?.name,
          stack: error?.stack
        })
        throw error
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

