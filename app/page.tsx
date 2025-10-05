'use client'

import { useDashboard } from '@/hooks/use-dashboard'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { useFamilias } from '@/hooks/use-familias'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardChart } from '@/components/dashboard-chart'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Info } from 'lucide-react'

export default function DashboardPage() {
  const { familiaAtivaId } = useFamiliaAtiva()
  const { familias } = useFamilias()
  const familiaAtiva = familias?.find(f => f.id === familiaAtivaId) || familias?.[0]
  const { dashboard, isLoading } = useDashboard(familiaAtiva?.id)

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  const receitas = dashboard?.receitas_total ?? 0
  const despesas = dashboard?.total_saidas ?? 0
  const saldo = dashboard?.saldo_final ?? 0

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Financeiro</h2>
          {familiaAtiva && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span>{familiaAtiva.modo_calculo === 'familiar' ? '👨‍👩‍👧‍👦' : '🏢'}</span>
              <span className="hidden sm:inline">{familiaAtiva.nome}</span>
            </div>
          )}
        </div>
        {dashboard?.atualizado_em && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
            Última atualização: {formatDateTime(dashboard.atualizado_em)}
          </p>
        )}
        {!familiaAtiva && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-900 dark:text-amber-100">
              Crie uma família em Configurações para começar a usar o sistema
            </p>
          </div>
        )}
      </div>

      {/* Cards Principais */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 hover:border-primary/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-500">
              {formatCurrency(receitas)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-500">
              {formatCurrency(despesas)}
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1 border-primary/20 hover:border-primary/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl md:text-3xl font-bold ${saldo >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {formatCurrency(saldo)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento */}
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Detalhamento de Despesas</h3>
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Gastos Variáveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboard?.gastos_mes ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Parcelas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboard?.parcelas_mes ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Gasolina</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboard?.gasolina_mes ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Assinaturas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboard?.assinaturas_mes ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Contas Fixas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboard?.contas_fixas_mes ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ferramentas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboard?.ferramentas_mes ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Empréstimos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboard?.emprestimos_mes ?? 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chart */}
      <DashboardChart />
    </div>
  )
}
