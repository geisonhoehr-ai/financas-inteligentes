'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsDashboard } from '@/components/analytics/chart-container'
import { useAnalytics } from '@/hooks/use-analytics'
import { formatCurrency } from '@/lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function AnalyticsPage() {
  const { data, isLoading, error } = useAnalytics()

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando análise financeira...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-muted-foreground">Não foi possível carregar a análise financeira</p>
        </div>
      </div>
    )
  }

  const { insights } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Análise Financeira</h1>
        <p className="text-muted-foreground">
          Insights e tendências dos seus dados financeiros
        </p>
      </div>

      {/* Cards de Insights */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              insights.saldo >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(insights.saldo)}
            </div>
            <p className="text-xs text-muted-foreground">
              {insights.saldo >= 0 ? 'Positivo' : 'Negativo'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              insights.economiaMensal >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(insights.economiaMensal)}
            </div>
            <p className="text-xs text-muted-foreground">
              Média dos últimos 12 meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendência de Gastos</CardTitle>
            {insights.tendenciaGastos === 'alta' && <TrendingUp className="h-4 w-4 text-red-600" />}
            {insights.tendenciaGastos === 'baixa' && <TrendingDown className="h-4 w-4 text-green-600" />}
            {insights.tendenciaGastos === 'estável' && <Clock className="h-4 w-4 text-blue-600" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              insights.tendenciaGastos === 'alta' ? 'text-red-600' :
              insights.tendenciaGastos === 'baixa' ? 'text-green-600' : 'text-blue-600'
            }`}>
              {insights.tendenciaGastos === 'alta' ? 'Em Alta' :
               insights.tendenciaGastos === 'baixa' ? 'Em Baixa' : 'Estável'}
            </div>
            <p className="text-xs text-muted-foreground">
              Comparado ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso das Metas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {insights.metaProgresso.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado na receita vs gastos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights Adicionais */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total de Receitas:</span>
              <span className="text-green-600 font-semibold">
                {formatCurrency(insights.totalReceitas)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total de Gastos:</span>
              <span className="text-red-600 font-semibold">
                {formatCurrency(insights.totalGastos)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-bold">Saldo Líquido:</span>
              <span className={`font-bold ${
                insights.saldo >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(insights.saldo)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Categoria com Maior Gasto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {insights.categoriaMaiorGasto}
              </div>
              <p className="text-sm text-muted-foreground">
                Considere revisar os gastos nesta categoria
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <AnalyticsDashboard
        gastosData={data.gastosData}
        receitasData={data.receitasData}
        categoriasData={data.categoriasData}
        investimentosData={data.investimentosData}
      />
    </div>
  )
}
