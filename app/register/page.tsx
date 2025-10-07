'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Crown, Star } from 'lucide-react'
import { PLANS } from '@/config/plans'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/lib/toast'

export default function RegisterPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      showToast.error('As senhas não coincidem')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            plan: selectedPlan
          }
        }
      })

      if (error) {
        showToast.error('Erro ao criar conta: ' + error.message)
        return
      }

      showToast.success('Conta criada com sucesso! Verifique seu email para ativar a conta.')
      router.push('/login')
    } catch (error) {
      showToast.error('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Crie sua conta e
            <span className="text-primary"> comece a organizar suas finanças</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Escolha um plano e crie sua conta em poucos minutos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Escolha seu plano</h2>
            {Object.values(PLANS).map((plan) => (
              <Card
                key={plan.id}
                className={`
                  cursor-pointer transition-all
                  ${selectedPlan === plan.id ? 'border-2 border-primary shadow-lg' : 'border border-zinc-200 dark:border-zinc-800'}
                `}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {plan.id === 'pro' && <Crown className="w-5 h-5 text-primary" />}
                      {plan.name}
                    </CardTitle>
                    {plan.id === 'pro' && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 inline mr-1" />
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/mês</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plan.features.slice(0, 4).map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
              <p className="text-muted-foreground">
                Preencha os dados abaixo para criar sua conta
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Digite a senha novamente"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-primary hover:underline">
                    Fazer login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
