import { createClient } from './supabase/client'
import { Database } from '@/types/database.types'

// Cliente para uso no frontend (browser)
export const supabase = createClient()
