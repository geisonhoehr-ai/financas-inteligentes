'use client'

import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Building,
  Activity,
  Calendar
} from 'lucide-react'

export default function AdminAnalyticsPage() {
  const { stats, users } = useAdmin()

  // Simular dados de analytics (em produção viriam do banco)
  const analyticsData = {
    dailyActiveUsers: [
      { date: '2024-01-01', users: 45 },
      { date: '2024-01-02', users: 52 },
      { date: '2024-01-03', users: 48 },
      { date: '2024-01-04', users: 61 },
      { date: '2024-01-05', users: 55 },
      { date: '2024-01-06', users: 67 },
      { date: '2024-01-07', users: 73 },
    ],
    monthlyGrowth: [
      { month: 'Jan', users: 120, revenue: 2400 },
      { month: 'Fev', users: 135, revenue: 2700 },
      { month: 'Mar', users: 148, revenue: 2960 },
      { month: 'Abr', users: 162, revenue: 3240 },
      { month: 'Mai', users: 175, revenue: 3500 },
      { month: 'Jun', users: 189, revenue: 3780 },
    ],
    topFeatures: [
      { feature: 'Gastos', usage: 95 },
      { feature: 'Metas', usage: 78 },
      { feature: 'Cartões', usage: 65 },
      { feature: 'Relatórios', usage: 52 },
      { feature: 'Investimentos', usage: 41 },
    ]
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Analytics e Relatórios
          </h1>
          <p className="text-muted-foreground mt-2">
            Métricas detalhadas do sistema e comportamento dos usuários
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos (7 dias)</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.dailyActiveUsers[analyticsData.dailyActiveUsers.length - 1].users}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% vs semana anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((stats?.pro_users || 0) / (stats?.total_users || 1) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Free → Pro
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats?.monthly_revenue?.toLocaleString('pt-BR') || '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +8% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Famílias Ativas</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_families || 0}</div>
              <p className="text-xs text-muted-foreground">
                {((stats?.total_families || 0) / (stats?.total_users || 1) * 100).toFixed(1)}% dos usuários
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Active Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Usuários Ativos Diários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {analyticsData.dailyActiveUsers.map((day, index) => (
                  <div key={day.date} className="flex flex-col items-center gap-2">
                    <div
                      className="bg-primary rounded-t w-8 transition-all hover:bg-primary/80"
                      style={{ height: `${(day.users / 80) * 200}px` }}
                      title={`${day.users} usuários em ${day.date}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Crescimento Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.monthlyGrowth.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{month.users} usuários</div>
                        <div className="text-xs text-muted-foreground">
                          R$ {month.revenue.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(month.users / 200) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Uso de Funcionalidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topFeatures.map((feature, index) => (
                  <div key={feature.feature} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{feature.feature}</span>
                      <span className="text-sm text-muted-foreground">{feature.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${feature.usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Resumo do Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Novos Usuários</p>
                    <p className="text-sm text-green-600 dark:text-green-300">Este mês</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    +{Math.floor((stats?.total_users || 0) * 0.15)}
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Famílias Criadas</p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Este mês</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    +{Math.floor((stats?.total_families || 0) * 0.12)}
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <div>
                    <p className="font-medium text-purple-800 dark:text-purple-200">Conversões</p>
                    <p className="text-sm text-purple-600 dark:text-purple-300">Free → Pro</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor((stats?.pro_users || 0) * 0.08)}
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <div>
                    <p className="font-medium text-orange-800 dark:text-orange-200">Churn Rate</p>
                    <p className="text-sm text-orange-600 dark:text-orange-300">Últimos 30 dias</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    2.1%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
