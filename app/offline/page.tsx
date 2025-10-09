'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WifiOff, RefreshCcw } from 'lucide-react'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-500/10 rounded-full">
              <WifiOff className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Você está offline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.
          </p>

          <Button
            onClick={handleRetry}
            className="w-full"
            size="lg"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

