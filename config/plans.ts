import { Plan } from '@/types/subscription'

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Para começar a organizar suas finanças',
    features: [
      '2 membros',
      '1 família',
      '50 lançamentos por mês',
      '2 cartões',
      '30 dias de histórico',
      'Funcionalidades básicas',
      'Suporte por email'
    ],
    limits: {
      max_members: 2,
      max_families: 1,
      max_transactions: 50,
      max_cards: 2,
      history_days: 30
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.90,
    description: 'Para famílias que querem controle total',
    features: [
      'Membros ilimitados',
      'Lançamentos ilimitados',
      'Cartões ilimitados',
      'Histórico completo',
      'Todas as funcionalidades',
      'Relatórios avançados',
      'Upload de comprovantes',
      'Suporte prioritário'
    ],
    limits: {
      max_members: -1, // ilimitado
      max_families: 1,
      max_transactions: -1,
      max_cards: -1,
      history_days: -1
    }
  }
}
