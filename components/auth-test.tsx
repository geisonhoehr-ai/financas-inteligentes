'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function AuthTest() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log('Auth Test - User:', user)
        console.log('Auth Test - Error:', error)
        setUser(user)
      } catch (error) {
        console.error('Auth Test - Error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) return <div>Verificando autenticação...</div>

  return (
    <div className="p-4 border rounded">
      <h3>Teste de Autenticação</h3>
      <p>Usuário: {user ? user.email : 'Não autenticado'}</p>
      <p>ID: {user ? user.id : 'N/A'}</p>
    </div>
  )
}
