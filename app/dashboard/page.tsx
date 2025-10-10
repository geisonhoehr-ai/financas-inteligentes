'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { usePlanLimits } from '@/hooks/use-subscription'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { useGastos } from '@/hooks/use-gastos'
import { useCartoes } from '@/hooks/use-cartoes'
import { useMetas } from '@/hooks/use-metas'
import { useInvestimentos } from '@/hooks/use-investimentos'
import { useSalarios } from '@/hooks/use-salarios'
import { formatCurrency } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Target,
  PiggyBank,
  Receipt,
  Wallet
} from 'lucide-react'
import Link from 'next/link'
import { InsightsWidget } from '@/components/analytics/insights-widget'

export default function DashboardPage() {
  const { user } = useAuth()
  const { plan, isPro } = usePlanLimits()
  const { familiaAtiva } = useFamiliaAtiva()
  
  // Carregar apenas dados essenciais inicialmente
  const { gastos, stats: gastosStats } = useGastos()
  const { investimentos } = useInvestimentos()
  const { cartoes } = useCartoes()
  const { metas } = useMetas()
  const { stats: salariosStats } = useSalarios()

  const saldo = salariosStats.receitaFamilia - gastosStats.total_mes

  const stats = [
    {
      title: 'Saldo do Mês',
      value: formatCurrency(saldo),
      icon: Wallet,
      color: saldo >= 0 ? 'text-green-500' : 'text-red-500',
      description: `Receita: ${formatCurrency(salariosStats.receitaFamilia)} - Gastos: ${formatCurrency(gastosStats.total_mes)}`
    },
    {
      title: 'Gastos do Mês',
      value: formatCurrency(gastosStats.total_mes),
      icon: TrendingDown,
      color: 'text-red-500'
    },
    {
      title: 'Investimentos',
      value: formatCurrency(investimentos.reduce((acc, inv) => acc + inv.valor, 0)),
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Cartões',
      value: cartoes.length,
      icon: CreditCard,
      color: 'text-blue-500'
    },
    {
      title: 'Metas',
      value: metas.length,
      icon: Target,
      color: 'text-purple-500'
    }
  ]

  const quickActions = [
    {
      title: 'Adicionar Gasto',
      icon: Receipt,
      href: '/gastos',
      color: 'bg-red-500'
    },
    {
      title: 'Adicionar Investimento',
      icon: PiggyBank,
      href: '/investimentos',
      color: 'bg-green-500'
    },
    {
      title: 'Adicionar Meta',
      icon: Target,
      href: '/metas',
      color: 'bg-purple-500'
    },
    {
      title: 'Adicionar Cartão',
      icon: CreditCard,
      href: '/cartoes',
      color: 'bg-blue-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Olá, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel financeiro
          {familiaAtiva && ` - ${familiaAtiva.nome}`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              {(stat as any).description && (
                <p className="text-xs text-muted-foreground mt-1">{(stat as any).description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Inteligentes */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    asChild
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Link href={action.href}>
                      <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      {action.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Widget de Insights */}
        <div>
          <InsightsWidget />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gastos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gastos.slice(0, 5).map((gasto: any) => (
                <div key={gasto.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{gasto.descricao}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(gasto.data).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-500">
                      -{formatCurrency(gasto.valor)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investimentos.slice(0, 5).map((investimento) => (
                <div key={investimento.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{investimento.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {investimento.tipo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">
                      {formatCurrency(investimento.valor)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Info */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{plan.name}</p>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>
            {!isPro && (
              <Button asChild>
                <Link href="/pricing">Upgrade</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
