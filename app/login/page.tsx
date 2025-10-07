'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wallet } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { user, error } =
        mode === 'login'
          ? await signIn(email, password)
          : await signUp(email, password, name)

      if (error) {
        setError(error.message)
      } else if (user) {
        console.log('Login successful, redirecting...')
        // Aguardar um pouco para garantir que os cookies sejam salvos
        await new Promise(resolve => setTimeout(resolve, 100))
        // Redirecionar usando window.location para forçar reload completo
        window.location.href = '/'
      }
    } catch (err: any) {
      console.error('❌ Erro geral:', err)
      setError(err.message || 'Ocorreu um erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Controle Financeiro Familiar</h1>
        </div>

        {/* Card de Login */}
        <div className="glass rounded-2xl border p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'login'
                ? 'Entre com suas credenciais'
                : 'Preencha os dados para começar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (apenas signup) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl text-base"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl text-base"
                required
                autoFocus
                autoComplete="email"
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl text-base"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Botão Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/30"
            >
              {loading
                ? 'Aguarde...'
                : mode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
              }}
              className="text-sm text-primary hover:underline"
            >
              {mode === 'login'
                ? 'Não tem conta? Criar agora'
                : 'Já tem conta? Fazer login'}
            </button>
          </div>

        </div>
      </div>
  )
}
