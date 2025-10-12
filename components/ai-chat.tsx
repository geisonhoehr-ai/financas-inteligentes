'use client'

import { useState, useRef, useEffect } from 'react'
import { useAIAssistant } from '@/hooks/use-ai-assistant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, Send, Trash2, Sparkles, TrendingUp, Target, DollarSign } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export function AIChat() {
  const { messages, isLoading, sendMessage, clearChat } = useAIAssistant()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    await sendMessage(inputValue)
    setInputValue('')
  }

  const quickQuestions = [
    { icon: <TrendingUp className="h-4 w-4" />, text: 'Por que gastei tanto esse mês?' },
    { icon: <Target className="h-4 w-4" />, text: 'Como alcançar minha meta mais rápido?' },
    { icon: <DollarSign className="h-4 w-4" />, text: 'Onde posso economizar?' },
    { icon: <Sparkles className="h-4 w-4" />, text: 'Me dê uma dica de economia' }
  ]

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Assistente Financeiro IA</CardTitle>
              <p className="text-xs text-muted-foreground">
                {isLoading ? 'Pensando...' : 'Online e pronto para ajudar'}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-2">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                <Bot className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold">Olá! Como posso ajudar?</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Pergunte sobre seus gastos, metas ou peça dicas de economia
              </p>
            </div>

            <div className="w-full space-y-2">
              <p className="text-xs text-muted-foreground">Perguntas rápidas:</p>
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4"
                    onClick={() => sendMessage(q.text)}
                  >
                    <span className="mr-2">{q.icon}</span>
                    <span className="text-sm">{q.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-primary'
                      : 'bg-gradient-to-br from-purple-500 to-blue-500'
                  }`}
                >
                  {message.role === 'user' ? (
                    <span className="text-sm text-white font-medium">Você</span>
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>

                <div
                  className={`flex-1 space-y-1 ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`inline-block rounded-2xl px-4 py-2 max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-2">
                    {formatDateTime(message.timestamp.toISOString())}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          🤖 Respostas geradas por IA - Sempre valide informações importantes
        </p>
      </div>
    </Card>
  )
}
