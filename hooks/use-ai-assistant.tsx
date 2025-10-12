'use client'

import { useState, useCallback } from 'react'
import { aiAssistant, ChatMessage } from '@/lib/ai-assistant'
import { useGastos } from './use-gastos'
import { useMetas } from './use-metas'
import { useOrcamento } from './use-orcamento'
import { showToast } from '@/lib/toast'

export function useAIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<string[]>([])

  // Buscar contexto financeiro
  const { gastos = [], stats } = useGastos()
  const { metas = [] } = useMetas()
  const { orcamentoAtual } = useOrcamento()

  // Preparar contexto
  const getContext = useCallback(() => {
    return {
      userId: 'current-user', // TODO: pegar do auth
      gastos: gastos.slice(0, 50).map((g: any) => ({
        descricao: g.descricao,
        valor: parseFloat(g.valor),
        categoria: g.categoria || 'Outros',
        data: g.data
      })),
      metas: metas.map((m: any) => ({
        nome: m.nome,
        valor_objetivo: m.valor_objetivo,
        valor_atual: m.valor_atual || 0
      })),
      orcamento: orcamentoAtual ? {
        total: orcamentoAtual.valor_total || 0,
        gastoAtual: stats?.total_mes || 0
      } : undefined,
      periodo: 'Mês atual'
    }
  }, [gastos, metas, orcamentoAtual, stats])

  // Enviar mensagem
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return

    // Adicionar mensagem do usuário
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      // Chamar IA
      const context = getContext()
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await aiAssistant.chat(
        userMessage,
        context,
        conversationHistory
      )

      // Adicionar resposta da IA
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMsg])

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      showToast.error('Erro ao se comunicar com o assistente')

      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [messages, getContext])

  // Buscar insights automáticos
  const loadInsights = useCallback(async () => {
    try {
      const context = getContext()
      const autoInsights = await aiAssistant.getAutoInsights(context)
      setInsights(autoInsights)
    } catch (error) {
      console.error('Erro ao carregar insights:', error)
    }
  }, [getContext])

  // Limpar conversa
  const clearChat = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    insights,
    sendMessage,
    loadInsights,
    clearChat
  }
}
