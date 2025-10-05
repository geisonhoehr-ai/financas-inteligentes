'use client'

import { useState } from 'react'
import { useGastos } from '@/hooks/use-gastos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { GastoSheet } from '@/components/gasto-sheet'

export default function GastosPage() {
  const { gastos, isLoading, deleteGasto, isDeleting } = useGastos()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = async (id: number, descricao: string) => {
    if (confirm(`Excluir "${descricao}"?\n\n(Pode ser restaurado nos próximos 30 dias)`)) {
      deleteGasto(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando gastos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gastos Variáveis</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Gasto
        </Button>
      </div>

      <div className="space-y-3">
        {gastos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum gasto cadastrado. Clique em &quot;Novo Gasto&quot; para adicionar.
              </p>
            </CardContent>
          </Card>
        ) : (
          gastos.map((gasto) => (
            <Card key={gasto.id} className="transition-all hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{gasto.descricao}</h3>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {gasto.categoria}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{gasto.tipo_pagamento}</span>
                    <span>•</span>
                    <span>{formatDate(gasto.data)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(gasto.valor)}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(gasto.id, gasto.descricao)}
                    disabled={isDeleting}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <GastoSheet open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
