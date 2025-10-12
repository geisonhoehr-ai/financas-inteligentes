'use client'

import { useState } from 'react'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { useFamilias } from '@/hooks/use-familias'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import {
  ChevronDown,
  Users,
  Check,
  Plus,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FamiliaSelectorProps {
  className?: string
}

export function FamiliaSelector({ className }: FamiliaSelectorProps) {
  const { familiaAtivaId, setFamiliaAtivaId, familiaAtiva } = useFamiliaAtiva()
  const { familias } = useFamilias()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Pegar o nome do usuário
  const userName = user?.email?.split('@')[0] || 'Meu Perfil'

  const handleSelectFamilia = (id: string | null) => {
    setFamiliaAtivaId(id)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3 gap-2 text-sm font-medium border-primary/20 hover:border-primary/50"
      >
        {!familiaAtiva ? (
          <User className="h-4 w-4 text-primary" />
        ) : (
          <Users className="h-4 w-4 text-primary" />
        )}
        <span className="max-w-[140px] truncate">
          {familiaAtiva ? familiaAtiva.nome : userName}
        </span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-xl shadow-lg z-50">
            <div className="p-2">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Selecione o Perfil
              </div>
              
              {/* Perfil Pessoal */}
              <button
                onClick={() => handleSelectFamilia(null)}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors',
                  !familiaAtivaId
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent'
                )}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{userName}</div>
                  <div className="text-xs text-muted-foreground">
                    Perfil Pessoal
                  </div>
                </div>
                {!familiaAtivaId && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>

              {/* Separador */}
              {familias && familias.length > 0 && (
                <div className="border-t border-border my-2"></div>
              )}
              
              {/* Famílias */}
              {familias && familias.map((familia) => {
                const isSelected = familia.id === familiaAtivaId

                return (
                  <button
                    key={familia.id}
                    onClick={() => handleSelectFamilia(familia.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors',
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent'
                    )}
                  >
                    <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{familia.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {familia.modo_calculo === 'familiar' ? 'Família' : 'Empresa'}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                )
              })}
              
              <div className="border-t border-border mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Redirecionar para configurações para criar nova família
                    window.location.href = '/configuracoes'
                  }}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-accent transition-colors"
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Criar Nova Família
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
