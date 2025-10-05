'use client'

import { useLixeira } from '@/hooks/use-lixeira'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { RotateCcw, Trash2, RefreshCw } from 'lucide-react'

export default function LixeiraPage() {
  const { items, isLoading, restoreItem, permanentlyDeleteItem, isRestoring, isDeleting } =
    useLixeira()

  const handleRestore = (item: any) => {
    if (confirm(`Restaurar "${item.descricao || item.nome}"?`)) {
      restoreItem({ tabela: item.tabela, id: item.id })
    }
  }

  const handlePermanentDelete = (item: any) => {
    if (
      confirm(
        `⚠️ ATENÇÃO!\n\nDeletar PERMANENTEMENTE "${item.descricao || item.nome}"?\n\nEsta ação NÃO pode ser desfeita!`
      )
    ) {
      permanentlyDeleteItem({ tabela: item.tabela, id: item.id })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando lixeira...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">🗑️ Lixeira</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Itens deletados nos últimos 30 dias
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-lg text-muted-foreground">Nenhum item na lixeira</p>
            </CardContent>
          </Card>
        ) : (
          items.map((item, idx) => (
            <Card key={idx} className="transition-all hover:shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-400">
                        {item.tipoLabel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Deletado em {formatDateTime(item.deletado_em)}
                      </span>
                    </div>
                    <div className="font-semibold text-lg mb-1">
                      {item.descricao || item.nome || 'Sem descrição'}
                    </div>
                    {item.valor && (
                      <div className="text-muted-foreground">
                        Valor: {formatCurrency(typeof item.valor === 'number' ? item.valor : parseFloat(item.valor))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestore(item)}
                      disabled={isRestoring || isDeleting}
                      className="hover:bg-green-500/10 hover:text-green-500"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restaurar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handlePermanentDelete(item)}
                      disabled={isRestoring || isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
