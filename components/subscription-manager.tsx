'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Loader2, ExternalLink, CreditCard } from 'lucide-react'
import { useSubscription } from '@/hooks/use-subscription'
import { PLANS } from '@/config/plans'
import Link from 'next/link'

export function SubscriptionManager() {
  const { data: subscription, isLoading } = useSubscription()
  const [managingBilling, setManagingBilling] = useState(false)

  const handleManageBilling = async () => {
    try {
      setManagingBilling(true)

      const response = await fetch('/api/billing-portal', {
        method: 'POST',
      })

      const { url, error } = await response.json()

      if (error) {
        alert('Erro ao abrir portal: ' + error)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao abrir portal de cobrança')
    } finally {
      setManagingBilling(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const plan = PLANS[subscription?.plan || 'free']
  const isPro = subscription?.plan === 'pro'
  const statusColor = subscription?.status === 'active' ? 'default' : 'destructive'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isPro && <Crown className="w-5 h-5 text-primary" />}
              Plano {plan.name}
            </CardTitle>
            <CardDescription>
              {plan.description}
            </CardDescription>
          </div>
          <Badge variant={statusColor as any}>
            {subscription?.status === 'active' ? 'Ativo' : subscription?.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Preço</p>
            <p className="text-2xl font-bold">
              {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}/mês`}
            </p>
          </div>

          {isPro && subscription.current_period_end && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Renovação</p>
              <p className="text-sm font-semibold">
                {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
              </p>
              {subscription.cancel_at_period_end && (
                <p className="text-xs text-destructive mt-1">
                  Será cancelada
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Recursos inclusos:</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 flex gap-2">
          {!isPro ? (
            <Button asChild className="flex-1">
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade para Pro
              </Link>
            </Button>
          ) : (
            <Button
              onClick={handleManageBilling}
              disabled={managingBilling}
              variant="outline"
              className="flex-1"
            >
              {managingBilling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Abrindo...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Gerenciar Cobrança
                </>
              )}
            </Button>
          )}
        </div>

        {!isPro && (
          <p className="text-xs text-muted-foreground text-center">
            Faça upgrade para desbloquear todos os recursos premium
          </p>
        )}
      </CardContent>
    </Card>
  )
}

