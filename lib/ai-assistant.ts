// ============================================
// IA ASSISTENTE FINANCEIRO
// ============================================
// Analisa gastos e dá conselhos personalizados

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface FinancialContext {
  userId: string
  gastos: Array<{
    descricao: string
    valor: number
    categoria: string
    data: string
  }>
  metas?: Array<{
    nome: string
    valor_objetivo: number
    valor_atual: number
  }>
  orcamento?: {
    total: number
    gastoAtual: number
  }
  periodo?: string
}

// ============================================
// PROMPTS ESPECIALIZADOS
// ============================================

function buildSystemPrompt(): string {
  return `Você é um assistente financeiro pessoal especializado em finanças familiares brasileiras.

SUAS CARACTERÍSTICAS:
- Empático e encorajador
- Prático e objetivo
- Conhece realidade brasileira
- Usa exemplos concretos
- Dá dicas acionáveis

REGRAS:
- Sempre responda em português brasileiro
- Use emojis moderadamente para deixar mais amigável
- Seja breve (máximo 200 palavras por resposta)
- Sempre termine com uma ação concreta que o usuário pode fazer
- Use valores em Reais (R$)
- Não invente dados - use apenas o contexto fornecido
- Se não tiver dados suficientes, peça mais informações

FORMATO DE RESPOSTA:
1. Análise breve do que foi perguntado
2. Insight principal (1-2 frases)
3. Ação concreta sugerida
4. (Opcional) Dica extra ou motivação

EXEMPLOS DE BOA RESPOSTA:
"Analisando seus gastos de alimentação, notei que você gastou R$ 1.200 este mês, 40% acima da média brasileira para sua faixa de renda.

💡 O vilão são os 8 pedidos de delivery (R$ 480). Se você cozinhar em casa 3x por semana, pode economizar até R$ 200/mês.

🎯 AÇÃO: Esta semana, tente fazer meal prep no domingo. Separe 2h para preparar marmitas.

Lembre-se: cada real economizado é um passo mais perto da sua meta! 💪"`
}

function buildContextPrompt(context: FinancialContext): string {
  const { gastos, metas, orcamento, periodo } = context

  let prompt = `CONTEXTO FINANCEIRO DO USUÁRIO:\n\n`

  // Resumo de gastos
  if (gastos && gastos.length > 0) {
    const totalGastos = gastos.reduce((sum, g) => sum + g.valor, 0)
    const categorias = gastos.reduce((acc: any, g) => {
      acc[g.categoria] = (acc[g.categoria] || 0) + g.valor
      return acc
    }, {})

    prompt += `GASTOS (${periodo || 'Período atual'}):\n`
    prompt += `- Total gasto: R$ ${totalGastos.toFixed(2)}\n`
    prompt += `- Número de gastos: ${gastos.length}\n`
    prompt += `- Gasto médio: R$ ${(totalGastos / gastos.length).toFixed(2)}\n\n`

    prompt += `POR CATEGORIA:\n`
    Object.entries(categorias)
      .sort(([, a]: any, [, b]: any) => b - a)
      .forEach(([cat, valor]: any) => {
        const percent = ((valor / totalGastos) * 100).toFixed(1)
        prompt += `- ${cat}: R$ ${valor.toFixed(2)} (${percent}%)\n`
      })
    prompt += `\n`

    // Últimos 5 gastos
    prompt += `ÚLTIMOS GASTOS:\n`
    gastos.slice(0, 5).forEach(g => {
      prompt += `- ${g.data}: ${g.descricao} - R$ ${g.valor.toFixed(2)} (${g.categoria})\n`
    })
    prompt += `\n`
  }

  // Metas
  if (metas && metas.length > 0) {
    prompt += `METAS FINANCEIRAS:\n`
    metas.forEach(m => {
      const progresso = ((m.valor_atual / m.valor_objetivo) * 100).toFixed(1)
      const falta = m.valor_objetivo - m.valor_atual
      prompt += `- ${m.nome}: R$ ${m.valor_atual.toFixed(2)} / R$ ${m.valor_objetivo.toFixed(2)} (${progresso}% - faltam R$ ${falta.toFixed(2)})\n`
    })
    prompt += `\n`
  }

  // Orçamento
  if (orcamento) {
    const percent = ((orcamento.gastoAtual / orcamento.total) * 100).toFixed(1)
    const restante = orcamento.total - orcamento.gastoAtual
    prompt += `ORÇAMENTO:\n`
    prompt += `- Limite: R$ ${orcamento.total.toFixed(2)}\n`
    prompt += `- Gasto: R$ ${orcamento.gastoAtual.toFixed(2)} (${percent}%)\n`
    prompt += `- Disponível: R$ ${restante.toFixed(2)}\n`
  }

  return prompt
}

// ============================================
// CLIENTE DA API
// ============================================

export class AIFinancialAssistant {
  private apiKey: string
  private baseURL: string = 'https://api.openai.com/v1/chat/completions'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''

    if (!this.apiKey) {
      console.warn('⚠️ OpenAI API Key não configurada. Use NEXT_PUBLIC_OPENAI_API_KEY')
    }
  }

  async chat(
    userMessage: string,
    context: FinancialContext,
    conversationHistory: Message[] = []
  ): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackResponse(userMessage, context)
    }

    try {
      const messages: Message[] = [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'system', content: buildContextPrompt(context) },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ]

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Mais barato e rápido
          messages,
          max_tokens: 300,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta.'

    } catch (error) {
      console.error('Erro ao chamar OpenAI:', error)
      return this.getFallbackResponse(userMessage, context)
    }
  }

  // Respostas sem IA (fallback quando API não está disponível)
  private getFallbackResponse(message: string, context: FinancialContext): string {
    const messageLower = message.toLowerCase()
    const { gastos, metas, orcamento } = context

    // Análise de gastos
    if (messageLower.includes('gastei') || messageLower.includes('gast') || messageLower.includes('quanto')) {
      const total = gastos?.reduce((sum, g) => sum + g.valor, 0) || 0
      const count = gastos?.length || 0

      if (count === 0) {
        return `Você ainda não registrou nenhum gasto este período. 📝\n\n🎯 AÇÃO: Comece registrando seus gastos diários para ter uma visão clara de para onde seu dinheiro está indo!`
      }

      const categorias = gastos?.reduce((acc: any, g) => {
        acc[g.categoria] = (acc[g.categoria] || 0) + g.valor
        return acc
      }, {}) || {}

      const topCategoria = Object.entries(categorias)
        .sort(([, a]: any, [, b]: any) => b - a)[0]

      return `Você gastou R$ ${total.toFixed(2)} em ${count} transações este período.\n\n💡 Sua categoria com mais gastos foi ${topCategoria?.[0]} (R$ ${(topCategoria?.[1] as number)?.toFixed(2)}).\n\n🎯 AÇÃO: Revise os gastos dessa categoria e identifique onde pode economizar 10%.`
    }

    // Metas
    if (messageLower.includes('meta') || messageLower.includes('objetivo')) {
      if (!metas || metas.length === 0) {
        return `Você ainda não tem metas definidas! 🎯\n\n💡 Ter metas claras aumenta em 40% a chance de alcançar seus objetivos financeiros.\n\n🎯 AÇÃO: Defina sua primeira meta agora. Pode ser algo simples como "Reserva de emergência de R$ 1.000".`
      }

      const metaEmProgresso = metas.find(m => m.valor_atual < m.valor_objetivo)
      if (metaEmProgresso) {
        const progresso = ((metaEmProgresso.valor_atual / metaEmProgresso.valor_objetivo) * 100).toFixed(1)
        const falta = metaEmProgresso.valor_objetivo - metaEmProgresso.valor_atual

        return `Sua meta "${metaEmProgresso.nome}" está ${progresso}% completa! 🎉\n\n💡 Faltam apenas R$ ${falta.toFixed(2)} para alcançar seu objetivo.\n\n🎯 AÇÃO: Se economizar R$ ${(falta / 3).toFixed(2)} por mês, você alcança em 3 meses!`
      }

      return `Parabéns! Você completou todas as suas metas! 🏆\n\n🎯 AÇÃO: Que tal definir uma nova meta ainda mais desafiadora?`
    }

    // Orçamento
    if (messageLower.includes('orçamento') || messageLower.includes('orcamento') || messageLower.includes('limite')) {
      if (!orcamento) {
        return `Você ainda não definiu um orçamento. 💰\n\n💡 Ter um orçamento reduz gastos desnecessários em até 20%!\n\n🎯 AÇÃO: Defina um limite de gastos mensal baseado em 70% da sua renda.`
      }

      const percent = ((orcamento.gastoAtual / orcamento.total) * 100).toFixed(1)
      const restante = orcamento.total - orcamento.gastoAtual

      if (parseFloat(percent) > 90) {
        return `⚠️ ATENÇÃO! Você já usou ${percent}% do seu orçamento!\n\n💡 Restam apenas R$ ${restante.toFixed(2)}.\n\n🎯 AÇÃO: Priorize apenas gastos essenciais até o fim do período.`
      } else if (parseFloat(percent) > 70) {
        return `Você está em ${percent}% do seu orçamento. Atenção! ⚠️\n\n💡 Ainda tem R$ ${restante.toFixed(2)} disponíveis.\n\n🎯 AÇÃO: Evite compras por impulso nos próximos dias.`
      } else {
        return `Muito bem! Você está em ${percent}% do orçamento. 👏\n\n💡 Restam R$ ${restante.toFixed(2)}.\n\n🎯 AÇÃO: Continue nesse ritmo e considere investir o que sobrar!`
      }
    }

    // Resposta genérica
    return `Olá! Sou seu assistente financeiro. 🤖\n\nPosso te ajudar a:\n- Analisar seus gastos\n- Acompanhar metas\n- Controlar orçamento\n- Dar dicas de economia\n\n🎯 AÇÃO: Pergunte algo como "Por que gastei tanto?" ou "Como alcançar minha meta?"`
  }

  // Análises automáticas (sem pergunta do usuário)
  async getAutoInsights(context: FinancialContext): Promise<string[]> {
    const insights: string[] = []
    const { gastos, metas, orcamento } = context

    if (!gastos || gastos.length === 0) return insights

    // Insight 1: Categoria com mais gastos
    const categorias = gastos.reduce((acc: any, g) => {
      acc[g.categoria] = (acc[g.categoria] || 0) + g.valor
      return acc
    }, {})

    const topCategoria = Object.entries(categorias)
      .sort(([, a]: any, [, b]: any) => b - a)[0]

    if (topCategoria) {
      const [cat, valor] = topCategoria
      const total = gastos.reduce((sum, g) => sum + g.valor, 0)
      const percent = ((valor as number / total) * 100).toFixed(0)
      insights.push(`💡 ${percent}% dos seus gastos são em ${cat} (R$ ${(valor as number).toFixed(2)})`)
    }

    // Insight 2: Alerta de orçamento
    if (orcamento) {
      const percent = (orcamento.gastoAtual / orcamento.total) * 100
      if (percent > 80) {
        insights.push(`⚠️ Você já usou ${percent.toFixed(0)}% do orçamento!`)
      }
    }

    // Insight 3: Progresso de meta
    if (metas && metas.length > 0) {
      const metaMaisProxima = metas
        .filter(m => m.valor_atual < m.valor_objetivo)
        .sort((a, b) => {
          const progA = (a.valor_atual / a.valor_objetivo)
          const progB = (b.valor_atual / b.valor_objetivo)
          return progB - progA
        })[0]

      if (metaMaisProxima) {
        const progresso = ((metaMaisProxima.valor_atual / metaMaisProxima.valor_objetivo) * 100).toFixed(0)
        insights.push(`🎯 Sua meta "${metaMaisProxima.nome}" está ${progresso}% completa!`)
      }
    }

    return insights
  }
}

// ============================================
// EXPORTAR INSTÂNCIA
// ============================================

export const aiAssistant = new AIFinancialAssistant()

// ============================================
// HOOKS PARA USAR NO REACT
// ============================================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
