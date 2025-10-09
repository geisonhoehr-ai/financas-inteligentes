'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, AlertTriangle, CheckCircle, Info, X, RefreshCw } from 'lucide-react'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { supabase } from '@/lib/supabase'

interface Notification {
  id: string
  tipo_alerta: string
  titulo: string
  mensagem: string
  prioridade: 'alta' | 'media' | 'baixa'
  acao_sugerida: string
  lida: boolean
  created_at: string
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { familiaAtivaId } = useFamiliaAtiva()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!familiaAtivaId) return

    setIsLoading(true)
    try {
      // TODO: Implementar função RPC buscar_alertas_inteligentes no banco
      // Por enquanto, usar dados mock para evitar erros de build
      const mockAlerts: Notification[] = [
        {
          id: 'alert_1',
          tipo_alerta: 'orcamento',
          titulo: 'Orçamento Quase Estourado',
          mensagem: 'Você já gastou 85% do seu orçamento de Alimentação este mês.',
          prioridade: 'alta',
          acao_sugerida: 'Revise seus gastos e considere reduzir despesas nesta categoria.',
          lida: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'alert_2',
          tipo_alerta: 'conta',
          titulo: 'Conta a Vencer',
          mensagem: 'Você tem uma conta de R$ 150,00 vencendo em 3 dias.',
          prioridade: 'media',
          acao_sugerida: 'Agende o pagamento para evitar multas.',
          lida: false,
          created_at: new Date().toISOString()
        }
      ]

      setNotifications(mockAlerts)
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
    } finally {
      setIsLoading(false)
    }
  }, [familiaAtivaId])

  useEffect(() => {
    if (isOpen && familiaAtivaId) {
      fetchNotifications()
    }
  }, [isOpen, familiaAtivaId, fetchNotifications])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, lida: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, lida: true }))
    )
  }

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baixa':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'media':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'baixa':
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const unreadCount = notifications.filter(n => !n.lida).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notificações</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchNotifications}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
              >
                Marcar todas como lidas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando notificações...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tudo em ordem!</h3>
              <p className="text-muted-foreground">
                Não há notificações no momento.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all ${
                  notification.lida 
                    ? 'opacity-60 bg-muted/50' 
                    : 'border-l-4 border-l-primary'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getPriorityIcon(notification.prioridade)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">
                            {notification.titulo}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(notification.prioridade)}`}
                          >
                            {notification.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.mensagem}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          💡 {notification.acao_sugerida}
                        </p>
                      </div>
                    </div>
                    {!notification.lida && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de botão de notificação para o header
interface NotificationButtonProps {
  onClick: () => void
}

export function NotificationButton({ onClick }: NotificationButtonProps) {
  const { familiaAtivaId } = useFamiliaAtiva()
  const [unreadCount, setUnreadCount] = useState(0)

  const checkUnreadNotifications = useCallback(async () => {
    if (!familiaAtivaId) return

    try {
      // TODO: Implementar função RPC para buscar notificações reais
      // Por enquanto, usar dados mock para evitar erros
      const mockNotifications = [
        {
          id: '1',
          type: 'warning',
          title: 'Orçamento Quase Estourado',
          message: 'Você já gastou 85% do seu orçamento de Alimentação este mês.',
          read: false,
          timestamp: new Date().toISOString(),
        }
      ]

      setUnreadCount(mockNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Erro ao verificar notificações:', error)
      setUnreadCount(0)
    }
  }, [familiaAtivaId])

  useEffect(() => {
    checkUnreadNotifications()
    const interval = setInterval(checkUnreadNotifications, 30000) // Verificar a cada 30s
    return () => clearInterval(interval)
  }, [familiaAtivaId, checkUnreadNotifications])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="relative"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  )
}
