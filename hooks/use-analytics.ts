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

      // TODO: Implementar funções RPC no banco de dados
      // Por enquanto, usar dados mock para evitar erros de build
      const gastos = [
        { mes_ano: 'Jan 2024', total: '2500' },
        { mes_ano: 'Fev 2024', total: '2800' },
        { mes_ano: 'Mar 2024', total: '2600' }
      ]

      const receitas = [
        { mes_ano: 'Jan 2024', total: '5000' },
        { mes_ano: 'Fev 2024', total: '5000' },
        { mes_ano: 'Mar 2024', total: '5000' }
      ]

      const categorias = [
        { categoria: 'Alimentação', total: '1200' },
        { categoria: 'Transporte', total: '800' },
        { categoria: 'Lazer', total: '600' }
      ]

      const investimentos = [
        { mes_ano: 'Jan 2024', valor_atual: '10000', rentabilidade: '1.2' },
        { mes_ano: 'Fev 2024', valor_atual: '10200', rentabilidade: '2.0' },
        { mes_ano: 'Mar 2024', valor_atual: '10400', rentabilidade: '1.96' }
      ]

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
