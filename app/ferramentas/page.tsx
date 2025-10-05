'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Wrench, Code, Laptop, TrendingDown } from 'lucide-react'

export default function FerramentasPage() {
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ferramentas</h2>
          <p className="text-sm text-muted-foreground">
            Controle gastos com ferramentas e softwares profissionais
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Ferramenta
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
            <p className="text-xs text-muted-foreground">Total do mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ferramentas</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">0</div>
            <p className="text-xs text-muted-foreground">Ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Softwares</CardTitle>
            <Code className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">0</div>
            <p className="text-xs text-muted-foreground">Licenças</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Anual</CardTitle>
            <Laptop className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">Projeção</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Nenhuma ferramenta cadastrada
          </h3>
          <p className="text-muted-foreground text-center mb-6">
            Adicione Adobe, GitHub, Figma, hosting e outras ferramentas profissionais
          </p>
          <Button 
            onClick={() => setShowAddDrawer(true)}
            className="h-12 rounded-xl bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Ferramenta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

