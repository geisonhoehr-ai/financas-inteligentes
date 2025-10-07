'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth-provider'
import { usePlanLimits } from '@/hooks/use-subscription'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/lib/toast'
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { plan, isPro } = usePlanLimits()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({
    email: user?.email || '',
    nome: '',
    telefone: ''
  })

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: profile
      })

      if (error) {
        showToast.error('Erro ao atualizar perfil: ' + error.message)
        return
      }

      showToast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      showToast.error('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações da conta
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="text"
                  value={profile.nome}
                  onChange={(e) => setProfile({ ...profile, nome: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={profile.telefone}
                  onChange={(e) => setProfile({ ...profile, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Plano Atual</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.name} - {plan.description}
                    </p>
                  </div>
                </div>
                {!isPro && (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/pricing">Upgrade</Link>
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Notificações</p>
                    <p className="text-sm text-muted-foreground">
                      Gerencie suas preferências de email
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Pagamentos</p>
                    <p className="text-sm text-muted-foreground">
                      Gerenciar métodos de pagamento
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Gerenciar
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
