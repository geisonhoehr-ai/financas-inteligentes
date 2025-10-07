// Teste simples para verificar autenticação
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  const { data: { user }, error } = await supabase.auth.getUser()
  console.log('User:', user)
  console.log('Error:', error)
}

testAuth()
