import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { UserSubscription } from '@/types/subscription'
import { PLANS } from '@/config/plans'

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      // Por enquanto, retornamos sempre o plano free
      // TODO: Implementar sistema de assinaturas real quando necessário
      return {
        id: 'temp',
        user_id: 'temp',
        plan: 'free',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserSubscription
    },
  })
}

export function usePlanLimits() {
  const { data: subscription } = useSubscription()
  const plan = PLANS[subscription?.plan || 'free']

  return {
    plan,
    limits: plan.limits,
    isPro: subscription?.plan === 'pro'
  }
}
