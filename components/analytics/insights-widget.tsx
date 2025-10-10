'use client'

import { useAnaliseInteligente } from '@/hooks/use-analise-inteligente'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingDown, TrendingUp, Lightbulb, Trophy, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export function InsightsWidget() {
  const { insights, comparacao, previsao, isLoading } = useAnaliseInteligente()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>💡 Insights Inteligentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getIconForTipo = (tipo: string) => {
    switch (tipo) {
      case 'economia': return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'alerta': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'sugestao': return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case 'conquista': return <Trophy className="h-4 w-4 text-purple-500" />
      case 'previsao': return <TrendingUp className="h-4 w-4 text-blue-500" />
      default: return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Comparação Rápida */}
      {comparacao && (
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Este mês vs. Anterior</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(comparacao.mesAtual.total)}
                </p>
              </div>
              <div className={`text-right ${comparacao.percentual < 0 ? 'text-green-600' : 'text-red-600'}`}>
                <div className="flex items-center gap-1 justify-end">
                  {comparacao.percentual < 0 ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <TrendingUp className="h-5 w-5" />
                  )}
                  <span className="text-2xl font-bold">
                    {Math.abs(comparacao.percentual).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm mt-1">
                  {comparacao.percentual < 0 ? 'Economia' : 'Aumento'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previsão */}
      {previsao && (
        <Card className="border-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  🔮 Previsão Fim do Mês
                </p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(previsao.previstoFimMes)}
                </p>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  previsao.tendencia === 'abaixo' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : previsao.tendencia === 'acima'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {previsao.tendencia === 'abaixo' ? '👍 Abaixo' : 
                   previsao.tendencia === 'acima' ? '⚠️ Acima' : '✅ Normal'}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {previsao.diasRestantes} dias restantes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Insights para Você
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Continue usando o app para receber insights personalizados! 📊
            </p>
          ) : (
            insights.slice(0, 4).map((insight) => (
              <div
                key={insight.id}
                className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIconForTipo(insight.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {insight.titulo}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.descricao}
                    </p>
                    {insight.acao && (
                      <Button
                        variant="link"
                        size="sm"
                        asChild
                        className="h-auto p-0 mt-2 text-xs"
                      >
                        <Link href={insight.acao.href}>
                          {insight.acao.label}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

