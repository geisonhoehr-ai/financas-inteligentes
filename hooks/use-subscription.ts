import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { UserSubscription } from '@/types/subscription'
import { PLANS } from '@/config/plans'

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      // Verificar se o usuário atual é o geisonhoehr@gmail.com
      const { data: user } = await supabase.auth.getUser()
      const isPro = user.user?.email === 'geisonhoehr@gmail.com'

      return {
        id: 'temp',
        user_id: user.user?.id || 'temp',
        plan: isPro ? 'pro' : 'free',
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
