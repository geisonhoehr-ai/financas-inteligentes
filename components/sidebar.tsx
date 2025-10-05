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
  TrendingUp,
  X,
  Users
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
    name: 'Dívidas',
    href: '/dividas',
    icon: Users,
  },
  {
    name: 'Lixeira',
    href: '/lixeira',
    icon: Trash2,
  },
  {
    name: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Financeiro</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Controle Financeiro</p>
        </div>
        {/* Botão fechar - apenas mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </button>
        )}
      </div>
      
      <nav className="space-y-1 overflow-y-auto flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors flex-shrink-0",
                isActive 
                  ? "text-white" 
                  : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
              )} />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 border-r border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-6">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-6 flex flex-col animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
