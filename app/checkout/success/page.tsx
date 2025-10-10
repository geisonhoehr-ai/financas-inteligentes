'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      router.push('/pricing')
      return
    }

    // Aguardar processamento do webhook
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [sessionId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Processando pagamento...</h2>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos sua assinatura
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Sua assinatura Pro foi ativada com sucesso! Agora você tem acesso a todos os recursos premium.
          </p>

          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold">O que você ganhou:</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Membros ilimitados
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Lançamentos ilimitados
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Cartões ilimitados
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Histórico completo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Relatórios avançados
              </li>
            </ul>
          </div>

          <div className="pt-4 space-y-2">
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard">
                Ir para o Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile">
                Gerenciar Assinatura
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

