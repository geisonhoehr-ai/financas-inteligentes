'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Se for página de autenticação, renderizar apenas o conteúdo
  if (pathname.startsWith('/login')) {
    return <>{children}</>
  }
  
  // Layout normal com sidebar e header
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
