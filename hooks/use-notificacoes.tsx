'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from './use-familia-ativa'
import { differenceInDays, isToday, isPast, parseISO } from 'date-fns'

export interface Notificacao {
  id: string
  tipo: 'vencimento' | 'meta' | 'gasto_excessivo' | 'alerta' | 'conquista'
  titulo: string
  mensagem: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  data: string
  lida: boolean
  acao?: {
    label: string
    href: string
  }
  icone?: string
}

export function useNotificacoes() {
  const { familiaAtivaId } = useFamiliaAtiva()
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [naoLidas, setNaoLidas] = useState(0)

  useEffect(() => {
    verificarNotificacoes()
    
    // Verificar notificações a cada 5 minutos
    const interval = setInterval(() => {
      verificarNotificacoes()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [familiaAtivaId])

  const verificarNotificacoes = async () => {
    const novas: Notificacao[] = []

    // 1. Verificar Contas Fixas a vencer
    await verificarContasFixas(novas)

    // 2. Verificar Parcelas a vencer
    await verificarParcelas(novas)

    // 3. Verificar Assinaturas
    await verificarAssinaturas(novas)

    // 4. Verificar Metas
    await verificarMetas(novas)

    // 5. Verificar Gastos Excessivos
    await verificarGastosExcessivos(novas)

    // 6. Verificar Cartões
    await verificarCartoes(novas)

    // Ordenar por prioridade e data
    novas.sort((a, b) => {
      const prioridadeOrdem = { urgente: 0, alta: 1, media: 2, baixa: 3 }
      return prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade]
    })

    setNotificacoes(novas)
    setNaoLidas(novas.filter(n => !n.lida).length)
  }

  const verificarContasFixas = async (notificacoes: Notificacao[]) => {
    try {
      const { data: contas } = await supabase
        .from('contas_fixas')
        .select('*')
        .eq('deletado', false)
        .eq('familia_id', familiaAtivaId || '')

      if (!contas) return

      const hoje = new Date()
      const diaHoje = hoje.getDate()

      contas.forEach((conta: any) => {
        const diasAteVencimento = conta.dia_vencimento - diaHoje
        
        // Não notificar se já foi pago
        if (conta.pago) return

        // Vencimento hoje
        if (diasAteVencimento === 0) {
          notificacoes.push({
            id: `conta-hoje-${conta.id}`,
            tipo: 'vencimento',
            titulo: '🚨 VENCE HOJE!',
            mensagem: `${conta.nome} vence hoje! Valor: R$ ${conta.valor.toFixed(2)}`,
            prioridade: 'urgente',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Conta', href: '/contas-fixas' },
            icone: '🚨'
          })
        }
        // Vencido
        else if (diasAteVencimento < 0) {
          notificacoes.push({
            id: `conta-vencida-${conta.id}`,
            tipo: 'vencimento',
            titulo: '❌ Conta Vencida!',
            mensagem: `${conta.nome} está vencida há ${Math.abs(diasAteVencimento)} dias! R$ ${conta.valor.toFixed(2)}`,
            prioridade: 'urgente',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Pagar Agora', href: '/contas-fixas' },
            icone: '❌'
          })
        }
        // Vence em 3 dias
        else if (diasAteVencimento <= 3) {
          notificacoes.push({
            id: `conta-3dias-${conta.id}`,
            tipo: 'vencimento',
            titulo: '⚠️ Vencimento Próximo',
            mensagem: `${conta.nome} vence em ${diasAteVencimento} dias. Valor: R$ ${conta.valor.toFixed(2)}`,
            prioridade: 'alta',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Conta', href: '/contas-fixas' },
            icone: '⚠️'
          })
        }
        // Vence em 7 dias
        else if (diasAteVencimento <= 7) {
          notificacoes.push({
            id: `conta-7dias-${conta.id}`,
            tipo: 'vencimento',
            titulo: '📅 Vencimento se aproximando',
            mensagem: `${conta.nome} vence em ${diasAteVencimento} dias. Valor: R$ ${conta.valor.toFixed(2)}`,
            prioridade: 'media',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Conta', href: '/contas-fixas' },
            icone: '📅'
          })
        }
      })
    } catch (error) {
      console.error('Erro ao verificar contas fixas:', error)
    }
  }

  const verificarParcelas = async (notificacoes: Notificacao[]) => {
    try {
      // Comentado até aplicar migrations
      const parcelas: any[] = []
      // const { data: parcelas } = await (supabase as any)
      //   .from('parcelas')
      //   .select('*')
      //   .eq('deletado', false)
      //   .eq('familia_id', familiaAtivaId || '')
      //   .eq('pago', false)

      if (!parcelas || parcelas.length === 0) return

      const hoje = new Date()

      parcelas.forEach((parcela: any) => {
        if (!parcela.data_vencimento) return

        const dataVencimento = parseISO(parcela.data_vencimento)
        const diasAteVencimento = differenceInDays(dataVencimento, hoje)

        if (isToday(dataVencimento)) {
          notificacoes.push({
            id: `parcela-hoje-${parcela.id}`,
            tipo: 'vencimento',
            titulo: '🚨 Parcela Vence Hoje!',
            mensagem: `Parcela ${parcela.numero_parcela}/${parcela.total_parcelas} de ${parcela.descricao} - R$ ${parcela.valor.toFixed(2)}`,
            prioridade: 'urgente',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Parcelas', href: '/parcelas' },
            icone: '🚨'
          })
        } else if (isPast(dataVencimento) && diasAteVencimento < 0) {
          notificacoes.push({
            id: `parcela-vencida-${parcela.id}`,
            tipo: 'vencimento',
            titulo: '❌ Parcela Vencida!',
            mensagem: `Parcela ${parcela.numero_parcela}/${parcela.total_parcelas} vencida há ${Math.abs(diasAteVencimento)} dias!`,
            prioridade: 'urgente',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Pagar Agora', href: '/parcelas' },
            icone: '❌'
          })
        } else if (diasAteVencimento <= 3 && diasAteVencimento > 0) {
          notificacoes.push({
            id: `parcela-3dias-${parcela.id}`,
            tipo: 'vencimento',
            titulo: '⚠️ Parcela a Vencer',
            mensagem: `Parcela ${parcela.numero_parcela}/${parcela.total_parcelas} vence em ${diasAteVencimento} dias - R$ ${parcela.valor.toFixed(2)}`,
            prioridade: 'alta',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Parcelas', href: '/parcelas' },
            icone: '⚠️'
          })
        }
      })
    } catch (error) {
      console.error('Erro ao verificar parcelas:', error)
    }
  }

  const verificarAssinaturas = async (notificacoes: Notificacao[]) => {
    try {
      const { data: assinaturas } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('deletado', false)
        .eq('ativa', true)
        .eq('familia_id', familiaAtivaId || '')

      if (!assinaturas) return

      const hoje = new Date()
      const diaHoje = hoje.getDate()

      assinaturas.forEach((assinatura: any) => {
        const diaVencimento = assinatura.dia_cobranca || assinatura.dia_vencimento
        const diasAteVencimento = diaVencimento - diaHoje

        if (diasAteVencimento === 0) {
          notificacoes.push({
            id: `assinatura-hoje-${assinatura.id}`,
            tipo: 'vencimento',
            titulo: '💳 Assinatura Hoje!',
            mensagem: `${assinatura.nome} será cobrada hoje - R$ ${assinatura.valor.toFixed(2)}`,
            prioridade: 'media',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Assinaturas', href: '/assinaturas' },
            icone: '💳'
          })
        } else if (diasAteVencimento <= 3 && diasAteVencimento > 0) {
          notificacoes.push({
            id: `assinatura-3dias-${assinatura.id}`,
            tipo: 'vencimento',
            titulo: '📅 Assinatura Próxima',
            mensagem: `${assinatura.nome} será cobrada em ${diasAteVencimento} dias - R$ ${assinatura.valor.toFixed(2)}`,
            prioridade: 'baixa',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Assinaturas', href: '/assinaturas' },
            icone: '📅'
          })
        }
      })
    } catch (error) {
      console.error('Erro ao verificar assinaturas:', error)
    }
  }

  const verificarMetas = async (notificacoes: Notificacao[]) => {
    try {
      const { data: metas } = await supabase
        .from('metas')
        .select('*')
        .eq('deletado', false)
        .eq('concluida', false)
        .eq('familia_id', familiaAtivaId || '')

      if (!metas) return

      metas.forEach((meta: any) => {
        const progresso = (meta.valor_atual / meta.valor_objetivo) * 100

        // Meta quase concluída (>=90%)
        if (progresso >= 90 && progresso < 100) {
          notificacoes.push({
            id: `meta-quase-${meta.id}`,
            tipo: 'meta',
            titulo: '🎯 Meta Quase Alcançada!',
            mensagem: `Faltam apenas R$ ${(meta.valor_objetivo - meta.valor_atual).toFixed(2)} para "${meta.nome}"! (${progresso.toFixed(0)}%)`,
            prioridade: 'media',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Meta', href: '/metas' },
            icone: '🎯'
          })
        }

        // Meta concluída
        if (progresso >= 100) {
          notificacoes.push({
            id: `meta-concluida-${meta.id}`,
            tipo: 'conquista',
            titulo: '🎉 Meta Alcançada!',
            mensagem: `Parabéns! Você alcançou a meta "${meta.nome}"! 🏆`,
            prioridade: 'alta',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Metas', href: '/metas' },
            icone: '🎉'
          })
        }

        // Prazo próximo (7 dias)
        if (meta.prazo) {
          const prazo = parseISO(meta.prazo)
          const diasRestantes = differenceInDays(prazo, new Date())

          if (diasRestantes <= 7 && diasRestantes > 0 && progresso < 100) {
            notificacoes.push({
              id: `meta-prazo-${meta.id}`,
              tipo: 'alerta',
              titulo: '⏰ Prazo da Meta Próximo',
              mensagem: `"${meta.nome}" tem prazo em ${diasRestantes} dias. Progresso: ${progresso.toFixed(0)}%`,
              prioridade: 'media',
              data: new Date().toISOString(),
              lida: false,
              acao: { label: 'Ver Meta', href: '/metas' },
              icone: '⏰'
            })
          } else if (diasRestantes <= 0 && progresso < 100) {
            notificacoes.push({
              id: `meta-atrasada-${meta.id}`,
              tipo: 'alerta',
              titulo: '⚠️ Meta Atrasada',
              mensagem: `O prazo de "${meta.nome}" expirou. Progresso: ${progresso.toFixed(0)}%`,
              prioridade: 'alta',
              data: new Date().toISOString(),
              lida: false,
              acao: { label: 'Ajustar Meta', href: '/metas' },
              icone: '⚠️'
            })
          }
        }
      })
    } catch (error) {
      console.error('Erro ao verificar metas:', error)
    }
  }

  const verificarGastosExcessivos = async (notificacoes: Notificacao[]) => {
    try {
      // Buscar gastos do mês atual
      const hoje = new Date()
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      
      const { data: gastosAtual } = await supabase
        .from('gastos')
        .select('valor, categoria_id')
        .eq('deletado', false)
        .eq('familia_id', familiaAtivaId || '')
        .gte('data', primeiroDiaMes.toISOString())

      // Buscar gastos do mês anterior
      const primeiroDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
      const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0)

      const { data: gastosAnterior } = await supabase
        .from('gastos')
        .select('valor')
        .eq('deletado', false)
        .eq('familia_id', familiaAtivaId || '')
        .gte('data', primeiroDiaMesAnterior.toISOString())
        .lte('data', ultimoDiaMesAnterior.toISOString())

      if (!gastosAtual || !gastosAnterior) return

      const totalAtual = (gastosAtual as any).reduce((sum: number, g: any) => sum + parseFloat(g.valor.toString()), 0)
      const totalAnterior = (gastosAnterior as any).reduce((sum: number, g: any) => sum + parseFloat(g.valor.toString()), 0)

      const diferenca = totalAtual - totalAnterior
      const percentual = totalAnterior > 0 ? (diferenca / totalAnterior) * 100 : 0

      // Alerta se gastos aumentaram mais de 20%
      if (percentual > 20) {
        notificacoes.push({
          id: 'gasto-excessivo-geral',
          tipo: 'gasto_excessivo',
          titulo: '📈 Gastos Acima do Normal',
          mensagem: `Seus gastos aumentaram ${percentual.toFixed(0)}% em relação ao mês passado! (+R$ ${diferenca.toFixed(2)})`,
          prioridade: 'alta',
          data: new Date().toISOString(),
          lida: false,
          acao: { label: 'Ver Análise', href: '/analytics' },
          icone: '📈'
        })
      }

      // Alerta se está economizando muito (incentivo)
      if (percentual < -20) {
        notificacoes.push({
          id: 'economia-boa',
          tipo: 'conquista',
          titulo: '🎉 Você Está Economizando!',
          mensagem: `Parabéns! Seus gastos diminuíram ${Math.abs(percentual).toFixed(0)}% este mês! (Economia de R$ ${Math.abs(diferenca).toFixed(2)})`,
          prioridade: 'media',
          data: new Date().toISOString(),
          lida: false,
          acao: { label: 'Ver Detalhes', href: '/analytics' },
          icone: '🎉'
        })
      }
    } catch (error) {
      console.error('Erro ao verificar gastos excessivos:', error)
    }
  }

  const verificarCartoes = async (notificacoes: Notificacao[]) => {
    try {
      const { data: cartoes } = await supabase
        .from('cartoes')
        .select('*')
        .eq('deletado', false)
        .eq('familia_id', familiaAtivaId || '')

      if (!cartoes) return

      cartoes.forEach((cartao: any) => {
        if (!cartao.limite) return

        const percentualUsado = (cartao.fatura_atual / cartao.limite) * 100

        // Limite quase estourado (>= 85%)
        if (percentualUsado >= 85 && percentualUsado < 100) {
          notificacoes.push({
            id: `cartao-limite-${cartao.id}`,
            tipo: 'alerta',
            titulo: '⚠️ Limite do Cartão Alto!',
            mensagem: `${cartao.nome}: ${percentualUsado.toFixed(0)}% do limite usado (R$ ${cartao.fatura_atual.toFixed(2)} de R$ ${cartao.limite.toFixed(2)})`,
            prioridade: 'alta',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Cartão', href: '/cartoes' },
            icone: '⚠️'
          })
        }

        // Limite estourado
        if (percentualUsado >= 100) {
          notificacoes.push({
            id: `cartao-estourado-${cartao.id}`,
            tipo: 'alerta',
            titulo: '🚨 Limite Estourado!',
            mensagem: `${cartao.nome}: Você ultrapassou o limite! R$ ${cartao.fatura_atual.toFixed(2)} de R$ ${cartao.limite.toFixed(2)}`,
            prioridade: 'urgente',
            data: new Date().toISOString(),
            lida: false,
            acao: { label: 'Ver Cartão', href: '/cartoes' },
            icone: '🚨'
          })
        }
      })
    } catch (error) {
      console.error('Erro ao verificar cartões:', error)
    }
  }

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev =>
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    )
    setNaoLidas(prev => Math.max(0, prev - 1))
  }

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev =>
      prev.map(n => ({ ...n, lida: true }))
    )
    setNaoLidas(0)
  }

  return {
    notificacoes,
    naoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    verificarNotificacoes
  }
}

