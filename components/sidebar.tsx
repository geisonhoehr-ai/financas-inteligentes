'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Receipt, 
  Trash2, 
  CreditCard, 
  Car, 
  Calendar,
  Settings,
  Target,
  PieChart,
  Building,
  Wrench,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Gastos',
    href: '/gastos',
    icon: Receipt,
  },
  {
    name: 'Parcelas',
    href: '/parcelas',
    icon: CreditCard,
  },
  {
    name: 'Gasolina',
    href: '/gasolina',
    icon: Car,
  },
  {
    name: 'Assinaturas',
    href: '/assinaturas',
    icon: Calendar,
  },
  {
    name: 'Contas Fixas',
    href: '/contas-fixas',
    icon: Building,
  },
  {
    name: 'Ferramentas',
    href: '/ferramentas',
    icon: Wrench,
  },
  {
    name: 'Cartões',
    href: '/cartoes',
    icon: CreditCard,
  },
  {
    name: 'Metas',
    href: '/metas',
    icon: Target,
  },
  {
    name: 'Investimentos',
    href: '/investimentos',
    icon: TrendingUp,
  },
  {
    name: 'Relatórios',
    href: '/relatorios',
    icon: PieChart,
  },
  {
    name: 'Lixeira',
    href: '/lixeira',
    icon: Trash2,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 border-r border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Financeiro</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Controle Financeiro</p>
      </div>
      
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive 
                  ? "text-white" 
                  : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
