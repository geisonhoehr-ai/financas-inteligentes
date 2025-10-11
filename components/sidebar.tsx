'use client'

import { useState } from 'react'
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
  TrendingDown,
  X,
  Users,
  BarChart3,
  DollarSign,
  Tag,
  UserPlus,
  Wallet,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Navegação organizada com grupos
const navigation = [
  {
    type: 'link' as const,
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    type: 'group' as const,
    name: 'Receitas',
    icon: DollarSign,
    items: [
      { name: 'Salários', href: '/salarios', icon: DollarSign },
      { name: 'Investimentos', href: '/investimentos', icon: TrendingUp },
    ]
  },
  {
    type: 'group' as const,
    name: 'Despesas',
    icon: Receipt,
    items: [
      { name: 'Gastos', href: '/gastos', icon: Receipt },
      { name: 'Parcelas', href: '/parcelas', icon: CreditCard },
      { name: 'Assinaturas', href: '/assinaturas', icon: Calendar },
      { name: 'Contas Fixas', href: '/contas-fixas', icon: Building },
      { name: 'Gasolina', href: '/gasolina', icon: Car },
      { name: 'Ferramentas', href: '/ferramentas', icon: Wrench },
      { name: 'Cartões', href: '/cartoes', icon: CreditCard },
    ]
  },
  {
    type: 'group' as const,
    name: 'Planejamento',
    icon: Target,
    items: [
      { name: 'Metas', href: '/metas', icon: Target },
      { name: 'Orçamento', href: '/orcamento', icon: PieChart },
      { name: 'Calendário', href: '/calendario', icon: Calendar },
      { name: 'Modo Economia', href: '/modo-economia', icon: TrendingDown },
    ]
  },
  {
    type: 'group' as const,
    name: 'Família',
    icon: Users,
    items: [
      { name: 'Mesada Digital', href: '/mesada', icon: Wallet },
      { name: 'Dívidas', href: '/dividas', icon: Users },
      { name: 'Aceitar Convite', href: '/aceitar-convite', icon: UserPlus },
    ]
  },
  {
    type: 'group' as const,
    name: 'Análise',
    icon: BarChart3,
    items: [
      { name: 'Relatórios', href: '/relatorios', icon: PieChart },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Tags', href: '/tags', icon: Tag },
      { name: 'Análise por Tags', href: '/analise-tags', icon: BarChart3 },
    ]
  },
  {
    type: 'link' as const,
    name: 'Categorias',
    href: '/categorias',
    icon: Tag,
  },
  {
    type: 'link' as const,
    name: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
  {
    type: 'link' as const,
    name: 'Lixeira',
    href: '/lixeira',
    icon: Trash2,
  },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    )
  }

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
        {navigation.map((item, index) => {
          if (item.type === 'link') {
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
          }

          // Grupo colapsável
          const isExpanded = expandedGroups.includes(item.name)
          const GroupIcon = item.icon
          const hasActiveItem = item.items.some(subItem => pathname === subItem.href)

          return (
            <div key={item.name}>
              <button
                onClick={() => toggleGroup(item.name)}
                className={cn(
                  'w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 group',
                  hasActiveItem
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <GroupIcon className={cn(
                    "h-5 w-5 transition-colors flex-shrink-0",
                    hasActiveItem
                      ? "text-blue-600" 
                      : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                  )} />
                  <span className="truncate">{item.name}</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform flex-shrink-0",
                  isExpanded && "rotate-180"
                )} />
              </button>

              {isExpanded && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-zinc-200 dark:border-zinc-700 space-y-1">
                  {item.items.map(subItem => {
                    const isActive = pathname === subItem.href
                    const SubIcon = subItem.icon

                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 group',
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                        )}
                      >
                        <SubIcon className={cn(
                          "h-4 w-4 transition-colors flex-shrink-0",
                          isActive 
                            ? "text-white" 
                            : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                        )} />
                        <span className="truncate">{subItem.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
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
