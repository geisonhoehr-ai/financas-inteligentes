import {
  CreditCard,
  LineChart,
  Users,
  Wallet,
  PieChart,
  CalendarClock,
  Receipt,
  TrendingUp
} from 'lucide-react'

const features = [
  {
    title: 'Gestão Familiar',
    description: 'Controle financeiro compartilhado com toda família',
    icon: Users
  },
  {
    title: 'Cartões e Contas',
    description: 'Organize todos seus cartões, contas e faturas',
    icon: CreditCard
  },
  {
    title: 'Investimentos',
    description: 'Acompanhe seus investimentos e rentabilidade',
    icon: LineChart
  },
  {
    title: 'Gastos e Receitas',
    description: 'Registre e categorize todas suas movimentações',
    icon: Wallet
  },
  {
    title: 'Relatórios',
    description: 'Análises e gráficos para melhor visualização',
    icon: PieChart
  },
  {
    title: 'Contas Fixas',
    description: 'Controle suas despesas mensais recorrentes',
    icon: CalendarClock
  },
  {
    title: 'Comprovantes',
    description: 'Upload e organização de comprovantes',
    icon: Receipt
  },
  {
    title: 'Metas',
    description: 'Defina e acompanhe suas metas financeiras',
    icon: TrendingUp
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
          <p className="text-xl text-muted-foreground">
            Funcionalidades completas para gestão financeira pessoal e familiar
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
