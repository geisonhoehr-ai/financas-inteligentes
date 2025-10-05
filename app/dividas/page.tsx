'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useDividas } from '@/hooks/use-dividas'
import { useFamilias } from '@/hooks/use-familias'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Check, 
  X,
  Plus,
  Calendar,
  Receipt,
  Users,
  AlertCircle
} from 'lucide-react'

export default function DividasPage() {
  const { familias } = useFamilias()
  const familiaAtiva = familias?.[0] // Por enquanto, pega a primeira família
  const {
    dividasQueDevo,
    dividasQueRecebo,
    resumo,
    marcarComoPaga,
    cancelarDivida,
    createDivida,
    isMarking,
    isCanceling,
  } = useDividas(familiaAtiva?.id)

  const [showAddDivida, setShowAddDivida] = useState(false)
  const [selectedDivida, setSelectedDivida] = useState<any>(null)

  const resumoAtual = resumo?.[0]
  const saldoLiquido = resumoAtual?.saldo_liquido || 0
  const totalDevo = resumoAtual?.total_devo || 0
  const totalRecebo = resumoAtual?.total_recebo || 0

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dívidas Internas</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Controle de dívidas entre membros da família
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Saldo Líquido */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              saldoLiquido > 0 ? 'text-green-600 dark:text-green-500' : 
              saldoLiquido < 0 ? 'text-red-600 dark:text-red-500' : 
              'text-muted-foreground'
            }`}>
              {formatCurrency(saldoLiquido)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {saldoLiquido > 0 ? 'Você tem a receber' : 
               saldoLiquido < 0 ? 'Você tem a pagar' : 
               'Tudo acertado'}
            </p>
          </CardContent>
        </Card>

        {/* Total que Devo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Você Deve</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              {formatCurrency(totalDevo)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dividasQueDevo.length} {dividasQueDevo.length === 1 ? 'dívida' : 'dívidas'}
            </p>
          </CardContent>
        </Card>

        {/* Total a Receber */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Você Recebe</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
              {formatCurrency(totalRecebo)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dividasQueRecebo.length} {dividasQueRecebo.length === 1 ? 'dívida' : 'dívidas'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => setShowAddDivida(true)}
          className="w-full sm:w-auto shadow-lg shadow-primary/30"
        >
          <Plus className="h-5 w-5 mr-2" />
          Registrar Dívida
        </Button>
      </div>

      {/* Lista de Dívidas que Devo */}
      {dividasQueDevo.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-500" />
              <div>
                <CardTitle>Você Deve</CardTitle>
                <CardDescription>Dívidas pendentes de pagamento</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dividasQueDevo.map((divida: any) => (
              <div
                key={divida.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{divida.credor_nome}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{divida.descricao}</p>
                  {divida.data_vencimento && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Vence em: {formatDate(divida.data_vencimento)}
                    </div>
                  )}
                  {divida.parcela_numero && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Parcela {divida.parcela_numero} de {divida.parcela_total}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-600 dark:text-red-500">
                      {formatCurrency(divida.valor)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => marcarComoPaga({ id: divida.id })}
                      disabled={isMarking}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelarDivida({ id: divida.id })}
                      disabled={isCanceling}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Lista de Dívidas a Receber */}
      {dividasQueRecebo.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
              <div>
                <CardTitle>Você Recebe</CardTitle>
                <CardDescription>Dívidas que outros membros têm com você</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dividasQueRecebo.map((divida: any) => (
              <div
                key={divida.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{divida.devedor_nome}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{divida.descricao}</p>
                  {divida.data_vencimento && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Vence em: {formatDate(divida.data_vencimento)}
                    </div>
                  )}
                  {divida.parcela_numero && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Parcela {divida.parcela_numero} de {divida.parcela_total}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600 dark:text-green-500">
                      {formatCurrency(divida.valor)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDivida(divida)}
                    >
                      <Receipt className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não há dívidas */}
      {dividasQueDevo.length === 0 && dividasQueRecebo.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">Nenhuma dívida pendente</p>
            <p className="text-sm text-muted-foreground text-center">
              Todas as contas estão acertadas! 🎉
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sheet para adicionar dívida */}
      <Sheet open={showAddDivida} onOpenChange={setShowAddDivida}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Registrar Dívida</SheetTitle>
            <SheetDescription>
              Registre uma dívida entre membros da família
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">
              Funcionalidade em desenvolvimento...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              💡 Dica: As dívidas são criadas automaticamente quando você registra um gasto
              indicando que foi pago por um membro mas é responsabilidade de outro.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

