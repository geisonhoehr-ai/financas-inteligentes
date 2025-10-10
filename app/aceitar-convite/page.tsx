'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { UserPlus, ArrowRight } from 'lucide-react'

export default function AceitarConvitePage() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!codigo.trim()) {
      alert('Por favor, digite o código do convite')
      return
    }

    // Redirecionar para a página de convite com o código
    router.push(`/invite/${codigo.trim()}`)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Aceitar Convite</CardTitle>
          <CardDescription>
            Digite o código do convite que você recebeu para entrar em uma família
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código do Convite</Label>
              <Input
                id="codigo"
                type="text"
                placeholder="Digite o código aqui..."
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                className="text-center font-mono text-lg tracking-wider"
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                O código geralmente tem 6-8 caracteres
              </p>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full h-12"
                disabled={!codigo.trim()}
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/configuracoes')}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                💡 <strong>Dica:</strong> Se você recebeu um link de convite, basta clicar nele. 
                Use esta página apenas se tiver o código.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

