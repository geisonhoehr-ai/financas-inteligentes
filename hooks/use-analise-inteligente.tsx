'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface InsightFinanceiro {
  id: string
  tipo: 'economia' | 'alerta' | 'sugestao' | 'conquista' | 'previsao'
  titulo: string
  descricao: string
  valor?: number
  percentual?: number
  icone: string
  prioridade: 'baixa' | 'media' | 'alta'
  acao?: {
    label: string
    href: string
  }
}

export interface ComparacaoMensal {
  mesAtual: {
    total: number
    porCategoria: Record<string, number>
  }
  mesAnterior: {
    total: number
    porCategoria: Record<string, number>
  }
  diferenca: number
  percentual: number
}

export interface PrevisaoGastos {
  previstoFimMes: number
  mediaDiaria: number
  diasRestantes: number
  tendencia: 'acima' | 'abaixo' | 'normal'
}

interface GastoComCategoria {
  valor: number
  categoria_id: string
  categorias?: {
    nome: string
  } | null
}

export function useAnaliseInteligente() {
  const { familiaAtivaId } = useFamiliaAtiva()
  const [insights, setInsights] = useState<InsightFinanceiro[]>([])
  const [comparacao, setComparacao] = useState<ComparacaoMensal | null>(null)
  const [previsao, setPrevisao] = useState<PrevisaoGastos | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (familiaAtivaId !== undefined) {
      analisarDados()
    }
  }, [familiaAtivaId])

  const analisarDados = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        compararMeses(),
        preverGastos(),
        gerarInsights()
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const compararMeses = async () => {
    try {
      const hoje = new Date()
      const inicioMesAtual = startOfMonth(hoje)
      const fimMesAtual = endOfMonth(hoje)
      
      const inicioMesAnterior = startOfMonth(subMonths(hoje, 1))
      const fimMesAnterior = endOfMonth(subMonths(hoje, 1))

      // Buscar gastos do mês atual
      const queryAtual = supabase
        .from('gastos')
        .select('valor, categoria_id, categorias(nome)')
        .eq('deletado', false)
        .gte('data', inicioMesAtual.toISOString())
        .lte('data', fimMesAtual.toISOString())

      if (familiaAtivaId) {
        queryAtual.eq('familia_id', familiaAtivaId)
      } else {
        queryAtual.is('familia_id', null)
      }

      const { data: gastosAtual } = await queryAtual

      // Buscar gastos do mês anterior
      const queryAnterior = supabase
        .from('gastos')
        .select('valor, categoria_id, categorias(nome)')
        .eq('deletado', false)
        .gte('data', inicioMesAnterior.toISOString())
        .lte('data', fimMesAnterior.toISOString())

      if (familiaAtivaId) {
        queryAnterior.eq('familia_id', familiaAtivaId)
      } else {
        queryAnterior.is('familia_id', null)
      }

      const { data: gastosAnterior } = await queryAnterior

      // Processar dados
      const totalAtual = (gastosAtual as GastoComCategoria[])?.reduce((sum, g) => sum + Number(g.valor), 0) || 0
      const totalAnterior = (gastosAnterior as GastoComCategoria[])?.reduce((sum, g) => sum + Number(g.valor), 0) || 0

      const categoriasAtual: Record<string, number> = {}
      ;(gastosAtual as GastoComCategoria[])?.forEach((g) => {
        const catNome = g.categorias?.nome || 'Sem categoria'
        categoriasAtual[catNome] = (categoriasAtual[catNome] || 0) + Number(g.valor)
      })

      const categoriasAnterior: Record<string, number> = {}
      ;(gastosAnterior as GastoComCategoria[])?.forEach((g) => {
        const catNome = g.categorias?.nome || 'Sem categoria'
        categoriasAnterior[catNome] = (categoriasAnterior[catNome] || 0) + Number(g.valor)
      })

      const diferenca = totalAtual - totalAnterior
      const percentual = totalAnterior > 0 ? (diferenca / totalAnterior) * 100 : 0

      setComparacao({
        mesAtual: {
          total: totalAtual,
          porCategoria: categoriasAtual
        },
        mesAnterior: {
          total: totalAnterior,
          porCategoria: categoriasAnterior
        },
        diferenca,
        percentual
      })
    } catch (error) {
      console.error('Erro ao comparar meses:', error)
    }
  }

  const preverGastos = async () => {
    try {
      const hoje = new Date()
      const diaAtual = hoje.getDate()
      const ultimoDiaMes = endOfMonth(hoje).getDate()
      const diasRestantes = ultimoDiaMes - diaAtual

      const inicioMes = startOfMonth(hoje)
      
      const query = supabase
        .from('gastos')
        .select('valor')
        .eq('deletado', false)
        .gte('data', inicioMes.toISOString())
        .lte('data', hoje.toISOString())

      if (familiaAtivaId) {
        query.eq('familia_id', familiaAtivaId)
      } else {
        query.is('familia_id', null)
      }

      const { data: gastos } = await query

      const totalGasto = (gastos as { valor: number }[])?.reduce((sum, g) => sum + Number(g.valor), 0) || 0
      const mediaDiaria = totalGasto / diaAtual
      const previstoFimMes = mediaDiaria * ultimoDiaMes

      // Buscar meta ou média histórica
      const mediaHistorica = comparacao?.mesAnterior.total || totalGasto

      let tendencia: 'acima' | 'abaixo' | 'normal' = 'normal'
      if (previstoFimMes > mediaHistorica * 1.1) {
        tendencia = 'acima'
      } else if (previstoFimMes < mediaHistorica * 0.9) {
        tendencia = 'abaixo'
      }

      setPrevisao({
        previstoFimMes,
        mediaDiaria,
        diasRestantes,
        tendencia
      })
    } catch (error) {
      console.error('Erro ao prever gastos:', error)
    }
  }

  const gerarInsights = async () => {
    const novosInsights: InsightFinanceiro[] = []

    // Insight de comparação mensal
    if (comparacao) {
      if (comparacao.percentual < -10) {
        novosInsights.push({
          id: 'economia-mensal',
          tipo: 'conquista',
          titulo: '🎉 Excelente Economia!',
          descricao: `Você gastou ${Math.abs(comparacao.percentual).toFixed(0)}% menos que o mês passado! Continue assim!`,
          valor: Math.abs(comparacao.diferenca),
          percentual: Math.abs(comparacao.percentual),
          icone: '🎉',
          prioridade: 'alta'
        })
      } else if (comparacao.percentual > 20) {
        novosInsights.push({
          id: 'alerta-gasto-alto',
          tipo: 'alerta',
          titulo: '⚠️ Gastos Elevados',
          descricao: `Seus gastos aumentaram ${comparacao.percentual.toFixed(0)}% em relação ao mês passado. Vamos ajustar?`,
          valor: comparacao.diferenca,
          percentual: comparacao.percentual,
          icone: '⚠️',
          prioridade: 'alta',
          acao: {
            label: 'Ver Análise',
            href: '/analytics'
          }
        })
      }

      // Análise por categoria
      Object.entries(comparacao.mesAtual.porCategoria).forEach(([categoria, valorAtual]) => {
        const valorAnterior = comparacao.mesAnterior.porCategoria[categoria] || 0
        if (valorAnterior > 0) {
          const variacao = ((valorAtual - valorAnterior) / valorAnterior) * 100
          
          if (variacao > 50) {
            novosInsights.push({
              id: `categoria-alta-${categoria}`,
              tipo: 'sugestao',
              titulo: `📊 ${categoria} em Alta`,
              descricao: `Seus gastos com ${categoria} aumentaram ${variacao.toFixed(0)}%. Considere reduzir nesta área.`,
              valor: valorAtual - valorAnterior,
              percentual: variacao,
              icone: '📊',
              prioridade: 'media',
              acao: {
                label: 'Ver Categoria',
                href: '/gastos'
              }
            })
          }
        }
      })
    }

    // Insight de previsão
    if (previsao) {
      if (previsao.tendencia === 'acima') {
        novosInsights.push({
          id: 'previsao-alta',
          tipo: 'previsao',
          titulo: '🔮 Previsão: Gastos Acima',
          descricao: `Com seu ritmo atual, você vai gastar R$ ${previsao.previstoFimMes.toFixed(2)} até o final do mês. Cuidado!`,
          valor: previsao.previstoFimMes,
          icone: '🔮',
          prioridade: 'media',
          acao: {
            label: 'Ver Detalhes',
            href: '/analytics'
          }
        })
      } else if (previsao.tendencia === 'abaixo') {
        novosInsights.push({
          id: 'previsao-economia',
          tipo: 'conquista',
          titulo: '💰 Economizando Bem!',
          descricao: `Previsão: R$ ${previsao.previstoFimMes.toFixed(2)} no mês. Você está gastando menos que o normal!`,
          valor: previsao.previstoFimMes,
          icone: '💰',
          prioridade: 'baixa'
        })
      }
    }

    // Sugestões de economia
    await gerarSugestoesEconomia(novosInsights)

    setInsights(novosInsights)
  }

  const gerarSugestoesEconomia = async (insights: InsightFinanceiro[]) => {
    try {
      // Verificar assinaturas não usadas (simulação)
      const { data: assinaturas } = await supabase
        .from('assinaturas')
        .select('nome, valor, ativa')
        .eq('deletado', false)
        .eq('ativa', true)
        .eq('familia_id', familiaAtivaId || '')

      if (assinaturas && assinaturas.length > 3) {
        const totalAssinaturas = assinaturas.reduce((sum, a) => sum + Number(a.valor), 0)
        insights.push({
          id: 'sugestao-assinaturas',
          tipo: 'sugestao',
          titulo: '💡 Oportunidade de Economia',
          descricao: `Você tem ${assinaturas.length} assinaturas ativas (R$ ${totalAssinaturas.toFixed(2)}/mês). Revise se usa todas!`,
          valor: totalAssinaturas,
          icone: '💡',
          prioridade: 'media',
          acao: {
            label: 'Ver Assinaturas',
            href: '/assinaturas'
          }
        })
      }

      // Sugestão baseada em gastos recentes
      if (comparacao && comparacao.mesAtual.porCategoria['Alimentação']) {
        const gastoAlimentacao = comparacao.mesAtual.porCategoria['Alimentação']
        const porcentagemTotal = (gastoAlimentacao / comparacao.mesAtual.total) * 100

        if (porcentagemTotal > 30) {
          const economiaEstimada = gastoAlimentacao * 0.2 // 20% de economia
          insights.push({
            id: 'sugestao-alimentacao',
            tipo: 'sugestao',
            titulo: '🍽️ Dica de Economia',
            descricao: `Alimentação representa ${porcentagemTotal.toFixed(0)}% dos seus gastos. Cozinhando 2x mais por semana, você pode economizar até R$ ${economiaEstimada.toFixed(2)}!`,
            valor: economiaEstimada,
            icone: '🍽️',
            prioridade: 'media'
          })
        }
      }
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error)
    }
  }

  return {
    insights,
    comparacao,
    previsao,
    isLoading,
    refetch: analisarDados
  }
}

