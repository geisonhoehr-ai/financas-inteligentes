'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { PerfilSelector } from '@/components/perfil-selector'
import { DashboardToggle } from '@/components/dashboard-toggle'
import { useAuth } from '@/components/auth-provider'
import { useFamilias } from '@/hooks/use-familias'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const { familias, isLoading } = useFamilias()
  
  // Se for página de autenticação, renderizar apenas o conteúdo
  if (pathname.startsWith('/login') || pathname.startsWith('/convite')) {
    return <>{children}</>
  }

  if (!user) {
    return null
  }
  
  // Layout normal com sidebar e header
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Seletor de Perfil - apenas se o usuário tiver famílias */}
          {!isLoading && familias && familias.length > 0 && (
            <div className="mb-6">
              <PerfilSelector />
            </div>
          )}

          {/* Toggle do Dashboard - apenas na página principal */}
          {pathname === '/' && (
            <div className="mb-6">
              <DashboardToggle />
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}
