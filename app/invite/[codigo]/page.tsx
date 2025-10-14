'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/lib/toast'
import {
  Users,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const codigo = params.codigo as string
  const [isLoading, setIsLoading] = useState(false)
  const [invite, setInvite] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!codigo) return

    const fetchInvite = async () => {
      try {
        const { data, error } = await supabase
          .from('convites')
          .select(`
            *,
            familia:familias(
              nome,
              modo_calculo
            )
          `)
          .eq('codigo', codigo)
          .single()

        if (error) {
          setError('Convite não encontrado ou expirado')
          return
        }

        setInvite(data)
      } catch (err) {
        setError('Erro ao carregar convite')
      }
    }

    fetchInvite()
  }, [codigo])

  const handleAcceptInvite = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        showToast.error('Você precisa estar autenticado para aceitar o convite')
        router.push('/login')
        return
      }

      console.log('Aceitando convite:', { codigo, usuario_id: user.id })

      const { error } = await supabase.rpc('aceitar_convite', {
        p_codigo: codigo,
        p_usuario_id: user.id
      })

      if (error) {
        console.error('Erro ao aceitar convite:', error)
        showToast.error('Erro ao aceitar convite: ' + error.message)
        return
      }

      showToast.success('Convite aceito com sucesso!')
      router.push('/')
    } catch (err) {
      showToast.error('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Convite Inválido</h2>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
              <Button onClick={() => router.push('/')}>
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Carregando...</h2>
              <p className="text-muted-foreground">
                Verificando convite...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Convite para Família
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {invite.familia.nome}
            </h3>
            <p className="text-muted-foreground">
              {invite.familia.modo_calculo === 'familiar' 
                ? 'Família (Pote Comum)' 
                : 'Empresa (Individual)'
              }
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Código do Convite</p>
                <p className="text-sm text-muted-foreground">{codigo}</p>
              </div>
            </div>

            {invite.validade && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Válido até</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invite.validade).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleAcceptInvite}
              disabled={isLoading}
              className="w-full h-12"
            >
              {isLoading ? 'Aceitando...' : 'Aceitar Convite'}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}