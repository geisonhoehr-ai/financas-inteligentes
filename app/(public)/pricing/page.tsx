'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Crown, Star } from 'lucide-react'
import { PLANS } from '@/config/plans'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Escolha o plano ideal para
            <span className="text-primary"> você e sua família</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Comece grátis e faça upgrade quando precisar de mais recursos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Object.values(PLANS).map((plan) => (
            <Card
              key={plan.id}
              className={`
                relative overflow-hidden
                ${plan.id === 'pro' ? 'border-2 border-primary shadow-lg' : 'border border-zinc-200 dark:border-zinc-800'}
              `}
            >
              {plan.id === 'pro' && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                  <Star className="w-4 h-4 inline mr-2" />
                  Mais Popular
                </div>
              )}

              <CardHeader className="pb-6">
                <CardTitle className="text-2xl flex items-center gap-2">
                  {plan.id === 'pro' && <Crown className="w-6 h-6 text-primary" />}
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/mês</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Button
                    asChild
                    className="w-full h-12 text-lg"
                    variant={plan.id === 'pro' ? 'default' : 'outline'}
                  >
                    <Link href="/register">
                      {plan.id === 'free' ? 'Começar Grátis' : 'Assinar Pro'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Perguntas Frequentes
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                Sim! Você pode cancelar sua assinatura a qualquer momento.
                Seus dados ficarão salvos por 30 dias após o cancelamento.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>O plano gratuito tem limitações?</CardTitle>
              </CardHeader>
              <CardContent>
                O plano gratuito permite até 2 membros, 1 família,
                50 lançamentos por mês e 30 dias de histórico.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Posso fazer upgrade a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                Sim! Você pode fazer upgrade do plano gratuito para o Pro
                a qualquer momento. O valor será cobrado proporcionalmente.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meus dados estão seguros?</CardTitle>
              </CardHeader>
              <CardContent>
                Sim! Todos os dados são criptografados e armazenados
                com segurança. Nunca compartilhamos suas informações.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
