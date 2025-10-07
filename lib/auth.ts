import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name?: string
}

export interface AuthResponse {
  user: User | null
  error: Error | null
}

// Sign up com email e senha
export async function signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
        // Não requer confirmação de email para desenvolvimento
        emailRedirectTo: undefined,
      },
    })

    if (error) throw error

    if (data.user) {
      // Verificar se o usuário já existe na tabela users
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single()

      // Se não existe, criar registro na tabela users
      if (checkError && checkError.code === 'PGRST116') {
        const { error: dbError } = await supabase.from('users').insert({
          id: data.user.id,
          nome: name || email.split('@')[0],
          email: email,
          tipo: 'pessoa',
          ativo: true,
          cor: '#007AFF',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (dbError) console.warn('Aviso ao criar usuário no DB:', dbError)
      }
    }

    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name,
          }
        : null,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error as Error,
    }
  }
}

// Login com email e senha
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    // Para usuário demo, usar credenciais especiais
    if (email === 'demo@financeiro.com' && password === 'demo123') {
      console.log('🎮 Login com usuário demo...')
      
      // Tentar login normal primeiro
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (data.user && !error) {
        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || 'Usuário Demo',
          },
          error: null,
        }
      }

      // Se não funcionar, tentar criar o usuário demo
      console.log('🔧 Criando usuário demo...')
      const signUpResult = await signUp(email, password, 'Usuário Demo')
      
      if (signUpResult.user) {
        console.log('✅ Usuário demo criado!')
        return signUpResult
      }

      // Se ainda não funcionar, retornar erro
      return {
        user: null,
        error: new Error('Não foi possível criar o usuário demo. Tente criar uma conta nova.'),
      }
    }

    // Login normal para outros usuários
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Se for erro de email não confirmado, tentar criar o usuário
      if (error.message.includes('email_not_confirmed')) {
        console.log('🔧 Email não confirmado, tentando criar usuário...')
        
        const signUpResult = await signUp(email, password, email.split('@')[0])
        
        if (signUpResult.user) {
          console.log('✅ Usuário criado com sucesso!')
          return signUpResult
        }
      }
      throw error
    }

    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name,
          }
        : null,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error as Error,
    }
  }
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Pegar usuário atual
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Pegar sessão
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Reset de senha
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) throw error
}

// Atualizar senha
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
}
