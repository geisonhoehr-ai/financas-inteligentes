'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
// import { PerfilSelector } from '@/components/perfil-selector'
// import { DashboardToggle } from '@/components/dashboard-toggle'
import { useAuth } from '@/components/auth-provider'
import { useFamilias } from '@/hooks/use-familias'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoading: authLoading } = useAuth()
  const { familias, isLoading: familiasLoading } = useFamilias()
  const { familiaAtiva } = useFamiliaAtiva()
  
  // Se for página pública ou de autenticação, renderizar apenas o conteúdo
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/pricing') || pathname.startsWith('/convite')) {
    return <>{children}</>
  }

  // Mostrar loading enquanto carrega autenticação
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
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
          {!familiasLoading && familiaAtiva && (
            <div className="mb-6">
              {/* PerfilSelector temporariamente removido - precisa ser implementado */}
            </div>
          )}

          {/* Toggle do Dashboard - apenas na página principal */}
          {pathname === '/' && (
            <div className="mb-6">
              {/* DashboardToggle temporariamente removido - precisa ser implementado */}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}
