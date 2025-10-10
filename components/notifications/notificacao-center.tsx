'use client'

import { useState } from 'react'
import { useNotificacoes } from '@/hooks/use-notificacoes'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, X, Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function NotificacaoCenter() {
  const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas } = useNotificacoes()
  const [isOpen, setIsOpen] = useState(false)

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-500'
      case 'alta': return 'bg-orange-500'
      case 'media': return 'bg-yellow-500'
      case 'baixa': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {naoLidas > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </Button>

      {/* Painel de Notificações */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Painel */}
          <div className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-popover border border-border rounded-xl shadow-lg z-50 max-h-[calc(100vh-10rem)] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Notificações</h3>
                <p className="text-sm text-muted-foreground">
                  {naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}` : 'Tudo em dia'}
                </p>
              </div>
              {naoLidas > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={marcarTodasComoLidas}
                  className="text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Marcar todas
                </Button>
              )}
            </div>

            {/* Lista de Notificações */}
            <div className="overflow-y-auto flex-1">
              {notificacoes.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Nenhuma notificação no momento
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Você receberá alertas sobre vencimentos e metas aqui
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notificacoes.map((notificacao) => (
                    <div
                      key={notificacao.id}
                      className={cn(
                        'p-4 hover:bg-accent transition-colors cursor-pointer',
                        !notificacao.lida && 'bg-primary/5'
                      )}
                      onClick={() => marcarComoLida(notificacao.id)}
                    >
                      <div className="flex gap-3">
                        {/* Icone/Prioridade */}
                        <div className="flex-shrink-0">
                          <div className={cn(
                            'w-2 h-2 rounded-full mt-2',
                            getPrioridadeColor(notificacao.prioridade)
                          )} />
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm flex items-center gap-2">
                                {notificacao.icone && <span>{notificacao.icone}</span>}
                                {notificacao.titulo}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notificacao.mensagem}
                              </p>
                            </div>
                            {!notificacao.lida && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                            )}
                          </div>

                          {/* Ação */}
                          {notificacao.acao && (
                            <Link
                              href={notificacao.acao.href}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center text-xs text-primary hover:underline mt-2"
                            >
                              {notificacao.acao.label}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notificacoes.length > 0 && (
              <div className="p-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Fechar
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

