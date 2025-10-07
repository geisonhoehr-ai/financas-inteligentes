'use client'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { DashboardData } from '@/types'
export function useDashboard(familiaId?: string) {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard', familiaId],
    queryFn: async () => {
      console.warn('Materialized view not available, using fallback')
      return null
    },
    staleTime: 30000, 
  })
  return {
    dashboard,
    isLoading,
    error,
  }
}


