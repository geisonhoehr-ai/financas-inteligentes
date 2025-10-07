'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { useDividas } from '@/hooks/use-dividas'
import { useFamilias } from '@/hooks/use-familias'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { UploadComprovante } from '@/components/upload-comprovante'
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
  AlertCircle,
  Upload
} from 'lucide-react'

export default function DividasPage() {
  const { familias } = useFamilias()
  const { familiaAtivaId } = useFamiliaAtiva()
  const familiaAtiva = familias?.find(f => f.id === familiaAtivaId) || familias?.[0]
  const {
    dividasQueDevo,
    dividasQueRecebo,
    resumo,
    marcarComoPaga,
    cancelarDivida,
    createDivida,
    isMarking,
    isCanceling,
    isCreating,
  } = useDividas(familiaAtiva?.id)

  const [showAddDivida, setShowAddDivida] = useState(false)
  const [selectedDivida, setSelectedDivida] = useState<any>(null)
  const [showUploadComprovante, setShowUploadComprovante] = useState(false)
  const [dividaParaComprovante, setDividaParaComprovante] = useState<any>(null)
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data_vencimento: '',
    credor_id: '',
    devedor_id: '',
    parcela_total: '1',
    parcela_numero: '1',
    valor_parcela: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const dividaData = {
      ...formData,
      valor: parseFloat(formData.valor.toString()),
      parcela_total: parseInt(formData.parcela_total.toString()),
      parcela_numero: parseInt(formData.parcela_numero.toString()),
      familia_id: familiaAtiva?.id
    }

    try {
      await createDivida(dividaData)
      setShowAddDivida(false)
      setFormData({
        descricao: '',
        valor: '',
        data_vencimento: '',
        credor_id: '',
        devedor_id: '',
        parcela_total: '1',
        parcela_numero: '1',
        valor_parcela: ''
      })
    } catch (error) {
      console.error('Erro ao salvar dívida:', error)
    }
  }

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
                      variant="outline"
                      onClick={() => {
                        setDividaParaComprovante(divida)
                        setShowUploadComprovante(true)
                      }}
                      title="Enviar comprovante"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
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

      {/* Drawer para adicionar dívida */}
      <Drawer open={showAddDivida} onOpenChange={setShowAddDivida}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Registrar Dívida</DrawerTitle>
            <DrawerDescription>
              Registre uma dívida entre membros da família
            </DrawerDescription>
          </DrawerHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Descrição *
              </label>
              <Input
                type="text"
                placeholder="Ex: Empréstimo para viagem..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Valor *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Data de Vencimento
                </label>
                <Input
                  type="date"
                  value={formData.data_vencimento}
                  onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Credor *
                </label>
                <select
                  value={formData.credor_id}
                  onChange={(e) => setFormData({ ...formData, credor_id: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione...</option>
                  {familiaAtiva?.familia_membros.map((membro) => (
                    <option key={membro.usuario_id} value={membro.usuario_id}>
                      {membro.nome || membro.usuario_id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Devedor *
                </label>
                <select
                  value={formData.devedor_id}
                  onChange={(e) => setFormData({ ...formData, devedor_id: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione...</option>
                  {familiaAtiva?.familia_membros.map((membro) => (
                    <option key={membro.usuario_id} value={membro.usuario_id}>
                      {membro.nome || membro.usuario_id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Parcelamento
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.parcela_total}
                  onChange={(e) => {
                    const total = parseInt(e.target.value) || 1
                    const valor = parseFloat(formData.valor) || 0
                    setFormData({
                      ...formData,
                      parcela_total: e.target.value,
                      parcela_numero: '1',
                      valor_parcela: (valor / total).toFixed(2)
                    })
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Valor da Parcela
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valor_parcela}
                  onChange={(e) => setFormData({ ...formData, valor_parcela: e.target.value })}
                  disabled
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDivida(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1"
                onClick={handleSubmit}
              >
                {isCreating ? 'Salvando...' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer para upload de comprovante */}
      <Drawer open={showUploadComprovante} onOpenChange={setShowUploadComprovante}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Enviar Comprovante</DrawerTitle>
            <DrawerDescription>
              Anexe o comprovante de pagamento da dívida
            </DrawerDescription>
          </DrawerHeader>
          <div className="mt-6">
            {dividaParaComprovante && (
              <>
                <div className="mb-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {dividaParaComprovante.credor_nome || dividaParaComprovante.devedor_nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dividaParaComprovante.descricao}
                      </p>
                    </div>
                    <p className="text-lg font-bold">
                      {formatCurrency(dividaParaComprovante.valor)}
                    </p>
                  </div>
                </div>

                <UploadComprovante
                  dividaId={dividaParaComprovante.id}
                  comprovanteAtual={dividaParaComprovante.comprovante_url}
                  onUploadSuccess={() => {
                    setShowUploadComprovante(false)
                    setDividaParaComprovante(null)
                    // Refresh data
                    window.location.reload()
                  }}
                  onCancel={() => {
                    setShowUploadComprovante(false)
                    setDividaParaComprovante(null)
                  }}
                />
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

