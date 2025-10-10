'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { HelpCircle, X } from 'lucide-react'

interface GuiaAjudaProps {
  titulo: string
  topicos: {
    titulo: string
    conteudo: string | React.ReactNode
    icone?: string
  }[]
  compact?: boolean
}

export function GuiaAjuda({ titulo, topicos, compact = false }: GuiaAjudaProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (compact) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="text-xs gap-1"
        >
          <HelpCircle className="h-3 w-3" />
          Ajuda
        </Button>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="max-h-[85vh] overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>{titulo}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              {topicos.map((topico, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {topico.icone && <span>{topico.icone}</span>}
                      {topico.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {topico.conteudo}
                  </CardContent>
                </Card>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {titulo}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-3 pt-0">
          {topicos.map((topico, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-background border">
              <p className="font-medium text-sm mb-1 flex items-center gap-2">
                {topico.icone && <span>{topico.icone}</span>}
                {topico.titulo}
              </p>
              <div className="text-sm text-muted-foreground">
                {topico.conteudo}
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}


