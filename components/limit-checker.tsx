import { usePlanLimits } from '@/hooks/use-subscription'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, Users, CreditCard, FileText } from 'lucide-react'
import Link from 'next/link'

interface LimitCheckerProps {
  type: 'members' | 'families' | 'transactions' | 'cards'
  current: number
  children: React.ReactNode
}

const limitLabels = {
  members: 'membros',
  families: 'famílias',
  transactions: 'lançamentos',
  cards: 'cartões'
}

const limitIcons = {
  members: Users,
  families: Users,
  transactions: FileText,
  cards: CreditCard
}

export function LimitChecker({ type, current, children }: LimitCheckerProps) {
  const { limits, isPro } = usePlanLimits()
  const limit = limits[`max_${type}` as keyof typeof limits]
  const isUnlimited = limit === -1
  const isExceeded = !isUnlimited && current >= limit

  if (isPro || (!isExceeded && !isUnlimited)) {
    return <>{children}</>
  }

  const Icon = limitIcons[type]
  const label = limitLabels[type]

  return (
    <Card className="border-dashed border-2 border-muted">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold mb-1">
              Limite de {label} atingido
            </h3>
            <p className="text-sm text-muted-foreground">
              Você já utilizou {current} de {limit} {label} disponíveis no seu plano atual.
            </p>
          </div>

          <Button asChild>
            <Link href="/pricing">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
