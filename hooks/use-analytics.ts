'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'

interface AnalyticsData {
  gastosData: Array<{ name: string; valor: number }>
  receitasData: Array<{ name: string; valor: number }>
  categoriasData: Array<{ name: string; valor: number }>
  investimentosData: Array<{ name: string; valor: number; rentabilidade: number }>
  insights: {
    totalGastos: number
    totalReceitas: number
    saldo: number
    economiaMensal: number
    tendenciaGastos: 'alta' | 'baixa' | 'estável'
    categoriaMaiorGasto: string
    metaProgresso: number
  }
}

export function useAnalytics() {
  const { familiaAtivaId } = useFamiliaAtiva()

  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['analytics', familiaAtivaId],
    queryFn: async () => {
      if (!familiaAtivaId) {
        return {
          gastosData: [],
          receitasData: [],
          categoriasData: [],
          investimentosData: [],
          insights: {
            totalGastos: 0,
            totalReceitas: 0,
            saldo: 0,
            economiaMensal: 0,
            tendenciaGastos: 'estável',
            categoriaMaiorGasto: '',
            metaProgresso: 0
          }
        }
      }

      // Buscar dados dos últimos 12 meses
      const { data: gastos, error: gastosError } = await supabase
        .rpc('buscar_gastos_por_mes', {
          p_familia_id: familiaAtivaId,
          p_meses: 12
        })

      const { data: receitas, error: receitasError } = await supabase
        .rpc('buscar_receitas_por_mes', {
          p_familia_id: familiaAtivaId,
          p_meses: 12
        })

      const { data: categorias, error: categoriasError } = await supabase
        .rpc('buscar_gastos_por_categoria', {
          p_familia_id: familiaAtivaId,
          p_meses: 3
        })

      const { data: investimentos, error: investimentosError } = await supabase
        .rpc('buscar_investimentos_evolucao', {
          p_familia_id: familiaAtivaId,
          p_meses: 12
        })

      // Processar dados para gráficos
      const gastosData = gastos?.map((item: any) => ({
        name: item.mes_ano,
        valor: parseFloat(item.total) || 0
      })) || []

      const receitasData = receitas?.map((item: any) => ({
        name: item.mes_ano,
        valor: parseFloat(item.total) || 0
      })) || []

      const categoriasData = categorias?.map((item: any) => ({
        name: item.categoria || 'Sem categoria',
        valor: parseFloat(item.total) || 0
      })) || []

      const investimentosData = investimentos?.map((item: any) => ({
        name: item.mes_ano,
        valor: parseFloat(item.valor_atual) || 0,
        rentabilidade: parseFloat(item.rentabilidade) || 0
      })) || []

      // Calcular insights
      const totalGastos = gastosData.reduce((sum, item) => sum + item.valor, 0)
      const totalReceitas = receitasData.reduce((sum, item) => sum + item.valor, 0)
      const saldo = totalReceitas - totalGastos
      const economiaMensal = saldo / 12

      // Determinar tendência de gastos
      let tendenciaGastos: 'alta' | 'baixa' | 'estável' = 'estável'
      if (gastosData.length >= 2) {
        const ultimo = gastosData[gastosData.length - 1].valor
        const anterior = gastosData[gastosData.length - 2].valor
        const variacao = ((ultimo - anterior) / anterior) * 100
        
        if (variacao > 10) tendenciaGastos = 'alta'
        else if (variacao < -10) tendenciaGastos = 'baixa'
      }

      // Categoria com maior gasto
      const categoriaMaiorGasto = categoriasData.reduce((max, item) => 
        item.valor > max.valor ? item : max, 
        { name: 'N/A', valor: 0 }
      ).name

      // Progresso das metas (simulado)
      const metaProgresso = Math.min((totalReceitas / (totalGastos * 1.2)) * 100, 100)

      return {
        gastosData,
        receitasData,
        categoriasData,
        investimentosData,
        insights: {
          totalGastos,
          totalReceitas,
          saldo,
          economiaMensal,
          tendenciaGastos,
          categoriaMaiorGasto,
          metaProgresso
        }
      }
    },
    enabled: !!familiaAtivaId,
    refetchInterval: 30000 // Atualizar a cada 30 segundos
  })

  return {
    data,
    isLoading,
    error
  }
}
