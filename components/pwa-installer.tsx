'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, X } from 'lucide-react'

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  useEffect(() => {
    // Registrar service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration)
        })
        .catch((error) => {
          console.log('Erro ao registrar Service Worker:', error)
        })
    }

    // Capturar evento de instalação PWA
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Verificar se já foi instalado ou se o usuário já recusou
      const hasDeclined = localStorage.getItem('pwa-install-declined')
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      
      if (!hasDeclined && !isStandalone) {
        // Mostrar banner após 3 segundos
        setTimeout(() => {
          setShowInstallBanner(true)
        }, 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou instalar o PWA')
    } else {
      localStorage.setItem('pwa-install-declined', 'true')
    }
    
    setDeferredPrompt(null)
    setShowInstallBanner(false)
  }

  const handleClose = () => {
    localStorage.setItem('pwa-install-declined', 'true')
    setShowInstallBanner(false)
  }

  if (!showInstallBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-5">
      <Card className="shadow-2xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">Instalar App</CardTitle>
              <CardDescription className="text-sm mt-1">
                Instale nosso app no seu celular para acesso rápido
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2 -mt-2"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1"
            >
              Agora não
            </Button>
            <Button
              onClick={handleInstallClick}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Instalar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

