'use client'

import { AIChat } from '@/components/ai-chat'
import { Bot, Zap, Shield, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AssistenteIAPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Assistente Financeiro IA</h2>
            <p className="text-muted-foreground">
              Converse sobre suas finanças e receba conselhos personalizados
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold">Análise Inteligente</h3>
              <p className="text-sm text-muted-foreground">
                IA analisa seus gastos e identifica padrões e oportunidades de economia
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold">Respostas Instantâneas</h3>
              <p className="text-sm text-muted-foreground">
                Pergunte qualquer coisa sobre suas finanças e receba respostas na hora
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold">100% Privado</h3>
              <p className="text-sm text-muted-foreground">
                Seus dados ficam seguros e nunca são compartilhados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat */}
      <AIChat />

      {/* Info */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Como funciona?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>💬</span>
                <span>Faça perguntas em linguagem natural sobre seus gastos, metas e orçamento</span>
              </li>
              <li className="flex gap-2">
                <span>🧠</span>
                <span>A IA analisa seu histórico financeiro para dar respostas personalizadas</span>
              </li>
              <li className="flex gap-2">
                <span>💡</span>
                <span>Receba dicas práticas e acionáveis para melhorar sua saúde financeira</span>
              </li>
              <li className="flex gap-2">
                <span>📊</span>
                <span>Quanto mais você usa, mais inteligentes ficam as respostas</span>
              </li>
            </ul>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>Dica:</strong> Experimente perguntas como &quot;Por que gastei tanto esse mês?&quot;,
                &quot;Como alcançar minha meta mais rápido?&quot; ou &quot;Onde posso economizar?&quot;
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
