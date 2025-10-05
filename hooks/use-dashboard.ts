'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { DashboardData } from '@/types'

export function useDashboard(familiaId?: string) {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard', familiaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mv_dashboard_mensal')
        .select('*')
        .eq(familiaId ? 'familia_id' : 'usuario_id', familiaId || 'current_user')
        .single()

      if (error) {
        console.warn('Materialized view not available, using fallback')
        return null
      }

      return data as DashboardData
    },
    staleTime: 30000, // 30 seconds
  })

  return {
    dashboard,
    isLoading,
    error,
  }
}
