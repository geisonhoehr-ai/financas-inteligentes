'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, TrendingDown, CreditCard, Repeat } from 'lucide-react'

export default function AssinaturasPage() {
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Assinaturas</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas assinaturas e serviços recorrentes
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Assinatura
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Mensal</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">Total por mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <Repeat className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">0</div>
            <p className="text-xs text-muted-foreground">Em vigor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próx. Vencimento</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">--</div>
            <p className="text-xs text-muted-foreground">Data próxima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Anual</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">Projeção anual</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Nenhuma assinatura cadastrada
          </h3>
          <p className="text-muted-foreground text-center mb-6">
            Adicione Netflix, Spotify, academia e outras assinaturas para controlar gastos recorrentes
          </p>
          <Button 
            onClick={() => setShowAddDrawer(true)}
            className="h-12 rounded-xl bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Assinatura
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

