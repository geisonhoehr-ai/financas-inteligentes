export type PlanType = 'free' | 'pro'

export interface Plan {
  id: PlanType
  name: string
  price: number
  description: string
  features: string[]
  limits: {
    max_members: number
    max_families: number
    max_transactions: number
    max_cards: number
    history_days: number
  }
}

export interface UserSubscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  plan: PlanType
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end?: boolean
  created_at: string
  updated_at: string
}
