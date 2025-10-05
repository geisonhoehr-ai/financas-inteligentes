'use client'

import { useState, useMemo } from 'react'
import { useParcelas } from '@/hooks/use-parcelas'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { useFamilias } from '@/hooks/use-familias'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, CreditCard, TrendingDown, Calendar, DollarSign } from 'lucide-react'

export default function ParcelasPage() {
  const { parcelas: todasParcelas, isLoading } = useParcelas()
  const { familiaAtivaId } = useFamiliaAtiva()
  const { familias } = useFamilias()
  const familiaAtiva = familias?.find(f => f.id === familiaAtivaId) || familias?.[0]
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  // Filtrar parcelas pela família ativa (temporariamente desabilitado)
  const parcelas = useMemo(() => {
    // TODO: Implementar filtragem quando familia_id for adicionado à tabela compras_parceladas
    return todasParcelas
    // if (!familiaAtiva?.id) return todasParcelas
    // return todasParcelas.filter(p => p.familia_id === familiaAtiva.id)
  }, [todasParcelas])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Parcelas</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas compras parceladas
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Parcela
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcelado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">Valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parcela Atual</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">Mês atual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parcelas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">0</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">0</div>
            <p className="text-xs text-muted-foreground">Próximos meses</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Nenhuma parcela cadastrada
          </h3>
          <p className="text-muted-foreground text-center mb-6">
            Comece adicionando suas compras parceladas para acompanhar os pagamentos
          </p>
          <Button 
            onClick={() => setShowAddDrawer(true)}
            className="h-12 rounded-xl bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Parcela
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

