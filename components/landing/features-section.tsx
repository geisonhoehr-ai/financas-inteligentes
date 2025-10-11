import {
  CreditCard,
  LineChart,
  Users,
  Wallet,
  PieChart,
  CalendarClock,
  Receipt,
  TrendingUp,
  Tags,
  Target,
  Sparkles,
  Calendar,
  Baby,
  Trophy,
  DollarSign,
  Bell,
  Zap,
  Users2
} from 'lucide-react'

const features = [
  {
    title: 'Gestão Familiar Completa',
    description: 'Controle financeiro compartilhado com todos os membros',
    icon: Users,
    badge: 'ESSENCIAL'
  },
  {
    title: 'Mesada Digital',
    description: 'Sistema completo de mesada com tarefas e conquistas para filhos',
    icon: Baby,
    badge: 'NOVO'
  },
  {
    title: 'Tags Inteligentes',
    description: 'Organize gastos com tags personalizadas e análise por categorias',
    icon: Tags,
    badge: 'NOVO'
  },
  {
    title: 'Orçamentos Avançados',
    description: 'Planeje por categoria, tags e receba alertas automáticos',
    icon: Target,
    badge: 'NOVO'
  },
  {
    title: 'Modo Economia',
    description: 'Desafios familiares para economizar e atingir metas juntos',
    icon: Zap,
    badge: 'NOVO'
  },
  {
    title: 'Análise com IA',
    description: 'Insights inteligentes e previsões baseadas em seus hábitos',
    icon: Sparkles,
    badge: 'NOVO'
  },
  {
    title: 'Calendário Financeiro',
    description: 'Visualize todos seus compromissos financeiros em um calendário',
    icon: Calendar,
    badge: 'NOVO'
  },
  {
    title: 'Dívidas Internas',
    description: 'Controle de quem deve para quem na família com comprovantes PIX',
    icon: Users2,
    badge: 'NOVO'
  },
  {
    title: 'Notificações Smart',
    description: 'Alertas personalizados de contas, vencimentos e metas',
    icon: Bell,
    badge: 'NOVO'
  },
  {
    title: 'Cartões e Faturas',
    description: 'Gerencie cartões de crédito e acompanhe faturas',
    icon: CreditCard,
    badge: null
  },
  {
    title: 'Investimentos',
    description: 'Acompanhe investimentos e rentabilidade em tempo real',
    icon: LineChart,
    badge: null
  },
  {
    title: 'Gastos e Receitas',
    description: 'Registre e categorize todas suas movimentações',
    icon: Wallet,
    badge: null
  },
  {
    title: 'Relatórios Visuais',
    description: 'Análises detalhadas com gráficos e estatísticas',
    icon: PieChart,
    badge: null
  },
  {
    title: 'Contas Fixas',
    description: 'Controle despesas mensais recorrentes',
    icon: CalendarClock,
    badge: null
  },
  {
    title: 'Comprovantes',
    description: 'Upload e organização digital de comprovantes',
    icon: Receipt,
    badge: null
  },
  {
    title: 'Metas Financeiras',
    description: 'Defina e acompanhe objetivos e conquistas',
    icon: Trophy,
    badge: null
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa para
            <span className="text-primary"> organizar suas finanças</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Funcionalidades completas para gestão financeira pessoal e familiar
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              +9 Novas funcionalidades revolucionárias
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:scale-105 relative group"
            >
              {feature.badge && (
                <div className="absolute -top-2 -right-2 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg animate-pulse">
                    {feature.badge}
                  </span>
                </div>
              )}
              
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
