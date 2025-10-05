'use client'

import { useState } from 'react'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { useFamilias } from '@/hooks/use-familias'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, 
  Users, 
  Building2, 
  Check,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FamiliaSelectorProps {
  className?: string
}

export function FamiliaSelector({ className }: FamiliaSelectorProps) {
  const { familiaAtivaId, setFamiliaAtivaId, familiaAtiva } = useFamiliaAtiva()
  const { familias } = useFamilias()
  const [isOpen, setIsOpen] = useState(false)

  if (!familiaAtiva || !familias || familias.length === 0) {
    return null
  }

  const handleSelectFamilia = (id: string) => {
    setFamiliaAtivaId(id)
    setIsOpen(false)
  }

  const getFamiliaIcon = (tipo: string) => {
    return tipo === 'empresa' ? Building2 : Users
  }

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-2 gap-2 text-sm font-medium hover:bg-accent"
      >
        {(() => {
          const Icon = getFamiliaIcon(familiaAtiva.tipo)
          return <Icon className="h-4 w-4" />
        })()}
        <span className="hidden sm:inline max-w-[120px] truncate">
          {familiaAtiva.nome}
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
                Famílias Disponíveis
              </div>
              
              {familias.map((familia) => {
                const Icon = getFamiliaIcon(familia.tipo)
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
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{familia.nome}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {familia.tipo}
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
