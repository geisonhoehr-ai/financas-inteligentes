import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { UserSubscription } from '@/types/subscription'
import { PLANS } from '@/config/plans'

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return null

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.user.id)
        .single()

      if (error) {
        console.error('Erro ao buscar assinatura:', error)
        return null
      }

      return data as UserSubscription
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
