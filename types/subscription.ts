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
  plan: PlanType
  status: 'active' | 'canceled' | 'trial'
  trial_ends_at?: string
  current_period_ends_at: string
  created_at: string
  updated_at: string
}
