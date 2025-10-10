'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTags } from '@/hooks/use-tags'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Tag as TagIcon, Calendar, TrendingUp, BarChart3, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Periodo = 'semana' | 'mes' | 'ano' | 'tudo'

export default function AnaliseTagsPage() {
  const { tagsComStats, buscarGastosPorTag, buscarEstatisticasPorTag } = useTags()
  const [tagSelecionada, setTagSelecionada] = useState<string | null>(null)
  const [periodo, setPeriodo] = useState<Periodo>('mes')
  const [gastosDaTag, setGastosDaTag] = useState<any[]>([])
  const [estatisticas, setEstatisticas] = useState<any>(null)

  const tagAtual = tagsComStats.find(t => t.id === tagSelecionada)

  const getPeriodoDatas = useCallback(() => {
    const hoje = new Date()
    switch (periodo) {
      case 'semana':
        return {
          inicio: format(startOfWeek(hoje), 'yyyy-MM-dd'),
          fim: format(endOfWeek(hoje), 'yyyy-MM-dd')
        }
      case 'mes':
        return {
          inicio: format(startOfMonth(hoje), 'yyyy-MM-dd'),
          fim: format(endOfMonth(hoje), 'yyyy-MM-dd')
        }
      case 'ano':
        return {
          inicio: format(startOfYear(hoje), 'yyyy-MM-dd'),
          fim: format(endOfYear(hoje), 'yyyy-MM-dd')
        }
      default:
        return { inicio: undefined, fim: undefined }
    }
  }, [periodo])

  const carregarDadosTag = useCallback(async () => {
    if (!tagSelecionada) return

    const { inicio, fim } = getPeriodoDatas()

    try {
      const [gastos, stats] = await Promise.all([
        buscarGastosPorTag(tagSelecionada, inicio, fim),
        buscarEstatisticasPorTag(tagSelecionada, inicio, fim)
      ])

      setGastosDaTag(Array.isArray(gastos) ? gastos : [])
      setEstatisticas(stats)
    } catch (error) {
      console.error('Erro ao carregar dados da tag:', error)
      setGastosDaTag([])
      setEstatisticas(null)
    }
  }, [tagSelecionada, getPeriodoDatas, buscarGastosPorTag, buscarEstatisticasPorTag])

  useEffect(() => {
    if (tagSelecionada) {
      carregarDadosTag()
    }
  }, [tagSelecionada, carregarDadosTag])

  const getPeriodoLabel = () => {
    const hoje = new Date()
    switch (periodo) {
      case 'semana': return 'Esta Semana'
      case 'mes': return format(hoje, 'MMMM yyyy', { locale: ptBR })
      case 'ano': return format(hoje, 'yyyy')
      default: return 'Todo o Período'
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Análise por Tags
          </h2>
          <p className="text-sm text-muted-foreground">
            Veja gastos detalhados por tag e período
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/tags">
            <TagIcon className="h-4 w-4 mr-2" />
            Gerenciar Tags
          </Link>
        </Button>
      </div>

      {/* Seleção de Tag */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione uma Tag</CardTitle>
          <CardDescription>Escolha a tag que deseja analisar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tagsComStats.length === 0 ? (
              <div className="text-center w-full py-8">
                <TagIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem tags criadas
                </p>
                <Button asChild>
                  <Link href="/tags">
                    Criar Primeira Tag
                  </Link>
                </Button>
              </div>
            ) : (
              tagsComStats.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setTagSelecionada(tag.id)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2
                    transition-all hover:scale-105
                    ${tagSelecionada === tag.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                  style={{
                    backgroundColor: tagSelecionada === tag.id ? tag.cor + '30' : tag.cor + '10',
                    color: tag.cor,
                  }}
                >
                  <span className="text-xl">{tag.icone}</span>
                  <div className="text-left">
                    <p className="font-semibold">{tag.nome}</p>
                    <p className="text-xs opacity-75">
                      {tag.total_gastos || 0} gastos • {formatCurrency(tag.valor_total || 0)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filtro de Período */}
      {tagSelecionada && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={periodo === 'semana' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriodo('semana')}
              >
                Esta Semana
              </Button>
              <Button
                variant={periodo === 'mes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriodo('mes')}
              >
                Este Mês
              </Button>
              <Button
                variant={periodo === 'ano' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriodo('ano')}
              >
                Este Ano
              </Button>
              <Button
                variant={periodo === 'tudo' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriodo('tudo')}
              >
                Tudo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas da Tag */}
      {tagSelecionada && tagAtual && estatisticas && (
        <>
          <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card style={{ borderColor: tagAtual.cor + '40' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                <DollarSign className="h-4 w-4" style={{ color: tagAtual.cor }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: tagAtual.cor }}>
                  {formatCurrency(estatisticas.total_gastos || 0)}
                </div>
                <p className="text-xs text-muted-foreground">{getPeriodoLabel()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quantidade</CardTitle>
                <TagIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.quantidade || 0}</div>
                <p className="text-xs text-muted-foreground">Gastos registrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {formatCurrency(estatisticas.media || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Por gasto</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maior Gasto</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {formatCurrency(estatisticas.maior_gasto || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Maior valor</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Gastos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{tagAtual.icone}</span>
                <div>
                  <CardTitle>Gastos: {tagAtual.nome}</CardTitle>
                  <CardDescription>{getPeriodoLabel()}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {gastosDaTag.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum gasto encontrado neste período
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {gastosDaTag.map((gasto: any) => (
                    <div
                      key={gasto.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{gasto.descricao}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {new Date(gasto.data).toLocaleDateString('pt-BR')}
                          </p>
                          {gasto.categoria && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">{gasto.categoria}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                          -{formatCurrency(gasto.valor)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Mensagem inicial */}
      {!tagSelecionada && tagsComStats.length > 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <TagIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Selecione uma tag acima para ver a análise detalhada
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

