import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { UserSubscription } from '@/types/subscription'
import { PLANS } from '@/config/plans'

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      
      if (!user.user) {
        throw new Error('Usuário não autenticado')
      }

      // Buscar assinatura no banco
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.user.id)
        .single()

      if (error || !subscription) {
        // Criar assinatura free se não existir
        const { data: newSubscription } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.user.id,
            plan: 'free',
            status: 'active'
          })
          .select()
          .single()

        return newSubscription as UserSubscription
      }

      return subscription as UserSubscription
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
