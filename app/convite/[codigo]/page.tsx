'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Check, X } from 'lucide-react'
import { useConvites } from '@/hooks/use-convites'

export default function ConvitePage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params)
  const router = useRouter()
  const { aceitarConvite, recusarConvite } = useConvites()

  // TODO: Buscar dados do convite pelo código
  const convite = {
    familia: { nome: 'Família Silva', modo_calculo: 'familiar' },
    convidadoPor: 'João Silva',
    email: 'esposa@email.com'
  }

  const handleAceitar = () => {
    // TODO: Get usuario_id from auth
    aceitarConvite({ conviteId: 1, usuarioId: 2 })
    router.push('/')
  }

  const handleRecusar = () => {
    recusarConvite(1)
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Você foi convidado!</CardTitle>
          <CardDescription>
            Para participar da {convite.familia.nome}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Info do Convite */}
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Família:</span>
              <span className="font-medium">{convite.familia.nome}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Modo:</span>
              <span className="font-medium">
                {convite.familia.modo_calculo === 'familiar' 
                  ? '👨‍👩‍👧‍👦 Pote Comum' 
                  : '🏢 Individual'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Convidado por:</span>
              <span className="font-medium">{convite.convidadoPor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Código:</span>
              <code className="font-mono font-medium">{codigo}</code>
            </div>
          </div>

          {/* Descrição do Modo */}
          <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <p className="text-sm text-muted-foreground mb-2">
              {convite.familia.modo_calculo === 'familiar' ? (
                <>
                  <strong className="text-foreground">Modo Familiar (Pote Comum):</strong>
                  <br />
                  • Todos os salários são somados
                  <br />
                  • Gastos compartilhados pela família
                  <br />
                  • Dashboard unificado
                  <br />• Cada membro pode adicionar gastos
                </>
              ) : (
                <>
                  <strong className="text-foreground">Modo Individual:</strong>
                  <br />
                  • Cada um tem seu próprio saldo
                  <br />
                  • Gastos individuais separados
                  <br />
                  • Dashboard por pessoa
                  <br />• Possibilidade de transferências
                </>
              )}
            </p>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRecusar}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Recusar
            </Button>
            <Button
              onClick={handleAceitar}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              Aceitar Convite
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Ao aceitar, você terá acesso ao controle financeiro da família
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

