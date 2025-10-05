'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Check, X, Loader2, AlertCircle } from 'lucide-react'
import { useConvites, type ConviteValidacao } from '@/hooks/use-convites'

export default function ConvitePage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params)
  const router = useRouter()
  const { validarConvite, aceitarConvite, isValidating, isAccepting, validacaoData } = useConvites()
  const [conviteInfo, setConviteInfo] = useState<ConviteValidacao | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    // Validar convite quando página carregar
    validarConvite(codigo)
  }, [codigo, validarConvite])

  useEffect(() => {
    // Atualizar info do convite quando validação retornar
    if (validacaoData) {
      setConviteInfo(validacaoData as ConviteValidacao)
      if (!validacaoData.valido) {
        setErro(validacaoData.mensagem)
      }
    }
  }, [validacaoData])

  const handleAceitar = () => {
    aceitarConvite(codigo, {
      onSuccess: () => {
        router.push('/')
      }
    })
  }

  const handleRecusar = () => {
    router.push('/')
  }

  // Estado de carregamento
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Validando convite...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estado de erro
  if (erro || !conviteInfo?.valido) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Convite Inválido</CardTitle>
            <CardDescription>{erro || 'Este convite não é válido ou expirou'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
            Para participar da {conviteInfo.familia_nome}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Info do Convite */}
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Família:</span>
              <span className="font-medium">{conviteInfo.familia_nome}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Código:</span>
              <code className="font-mono font-medium">{codigo}</code>
            </div>
          </div>

          {/* Descrição */}
          <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Ao aceitar este convite:</strong>
              <br />
              • Você se tornará membro da família
              <br />
              • Poderá visualizar e adicionar gastos
              <br />
              • Terá acesso ao dashboard da família
              <br />
              • Poderá gerenciar suas despesas compartilhadas
            </p>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRecusar}
              className="flex-1"
              disabled={isAccepting}
            >
              <X className="h-4 w-4 mr-2" />
              Recusar
            </Button>
            <Button
              onClick={handleAceitar}
              className="flex-1"
              disabled={isAccepting}
            >
              {isAccepting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Aceitando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Aceitar Convite
                </>
              )}
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

