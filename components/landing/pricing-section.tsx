import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PLANS } from '@/config/plans'
import Link from 'next/link'

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planos para todas as
            <span className="text-primary"> necessidades</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Escolha o plano ideal para você e sua família
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Object.values(PLANS).map((plan) => (
            <div
              key={plan.id}
              className={`
                rounded-2xl p-8 bg-white dark:bg-zinc-900
                ${plan.id === 'pro' ? 'border-2 border-primary' : 'border border-zinc-200 dark:border-zinc-800'}
              `}
            >
              <h3 className="text-2xl font-bold mb-2">
                {plan.name}
              </h3>
              
              <p className="text-muted-foreground mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/mês</span>
                )}
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className="w-full h-12"
                variant={plan.id === 'pro' ? 'default' : 'outline'}
              >
                <Link href="/register">
                  {plan.id === 'free' ? 'Começar Grátis' : 'Assinar Agora'}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
