'use client'

import { useState, useMemo } from 'react'
import { useParcelas, Parcela } from '@/hooks/use-parcelas'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { useFamilias } from '@/hooks/use-familias'
import { useCategorias } from '@/hooks/use-categorias'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, CreditCard, TrendingDown, Calendar, DollarSign, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ParcelasPage() {
  const { parcelas: todasParcelas, stats, isLoading, createParcela, updateParcela, deleteParcela, isCreating, isUpdating, isDeleting } = useParcelas()
  const { familiaAtivaId } = useFamiliaAtiva()
  const { familias } = useFamilias()
  const familiaAtiva = familias?.find(f => f.id === familiaAtivaId) || familias?.[0]
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [parcelaEditando, setParcelaEditando] = useState<Parcela | null>(null)

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
            <div className="text-2xl font-bold">{formatCurrency(stats.totalParcelado)}</div>
            <p className="text-xs text-muted-foreground">Valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parcela Atual</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatCurrency(stats.parcelaAtual)}</div>
            <p className="text-xs text-muted-foreground">Mês atual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parcelas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.parcelasAtivas}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{formatCurrency(stats.proximasParcelas)}</div>
            <p className="text-xs text-muted-foreground">Próximos meses</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Parcelas */}
      {parcelas.length === 0 ? (
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
      ) : (
        <div className="space-y-3">
          {parcelas.map((parcela) => (
            <Card key={parcela.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{parcela.produto}</h4>
                    <p className="text-sm text-muted-foreground">
                      {parcela.parcelas_pagas || 0}/{parcela.total_parcelas} parcelas pagas
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatCurrency(parcela.valor_parcela)}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: {formatCurrency(parcela.valor_total)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setParcelaEditando(parcela as any)
                          setShowEditDrawer(true)
                        }}
                        className="h-9 w-9"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={async () => {
                          if (confirm('Tem certeza que deseja excluir esta parcela?')) {
                            await deleteParcela(parcela.id)
                          }
                        }}
                        disabled={isDeleting}
                        className="h-9 w-9 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Drawer de Adicionar/Editar */}
      <Drawer open={showAddDrawer} onOpenChange={setShowAddDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Nova Parcela</DrawerTitle>
            <DrawerDescription>
              Adicione uma nova compra parcelada ao seu controle financeiro
            </DrawerDescription>
          </DrawerHeader>
          <ParcelaForm familiaId={familiaAtiva?.id} onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>

      {/* Drawer de Editar */}
      <Drawer open={showEditDrawer} onOpenChange={setShowEditDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Parcela</DrawerTitle>
            <DrawerDescription>
              Atualize as informações da compra parcelada
            </DrawerDescription>
          </DrawerHeader>
          <ParcelaForm
            familiaId={familiaAtiva?.id}
            parcela={parcelaEditando}
            onClose={() => {
              setShowEditDrawer(false)
              setParcelaEditando(null)
            }}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function ParcelaForm({ familiaId, parcela, onClose }: { familiaId?: string; parcela?: Parcela | null; onClose: () => void }) {
  const { createParcela, updateParcela, isCreating, isUpdating } = useParcelas()
  const { categorias } = useCategorias()
  const [formData, setFormData] = useState({
    produto: parcela?.produto || '',
    valor_total: parcela?.valor_total?.toString() || '',
    total_parcelas: parcela?.total_parcelas?.toString() || '',
    valor_parcela: parcela?.valor_parcela?.toString() || '',
    data_compra: parcela?.data_compra || new Date().toISOString().split('T')[0],
    dia_vencimento: parcela?.dia_vencimento?.toString() || '',
    categoria_id: (parcela as any)?.categoria_id || '',
    estabelecimento: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parcelaData = {
      produto: formData.produto,
      descricao: formData.produto, // Mapeando produto para descricao no create
      valor_total: parseFloat(formData.valor_total.toString()),
      valor_parcela: parseFloat(formData.valor_parcela.toString()),
      total_parcelas: parseInt(formData.total_parcelas.toString()),
      dia_vencimento: parseInt(formData.dia_vencimento.toString()),
      data_compra: formData.data_compra || new Date().toISOString().split('T')[0],
      categoria_id: formData.categoria_id,
      estabelecimento: formData.estabelecimento,
      familia_id: familiaId
    } as any

    try {
      if (parcela) {
        await updateParcela({ id: parcela.id, ...parcelaData })
      } else {
        await createParcela(parcelaData)
      }
      onClose()
    } catch (error) {
      console.error('Erro ao salvar parcela:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Descrição *
        </label>
        <Input
          type="text"
          placeholder="Ex: TV Samsung, iPhone 15..."
          value={formData.produto}
          onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Valor Total *
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.valor_total}
            onChange={(e) => {
              const total = parseFloat(e.target.value)
              const parcelas = parseInt(formData.total_parcelas) || 1
              setFormData({ 
                ...formData, 
                valor_total: e.target.value,
                valor_parcela: (total / parcelas).toFixed(2)
              })
            }}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nº de Parcelas *
          </label>
          <Input
            type="number"
            min="1"
            placeholder="1"
            value={formData.total_parcelas}
            onChange={(e) => {
              const parcelas = parseInt(e.target.value) || 1
              const total = parseFloat(formData.valor_total) || 0
              setFormData({ 
                ...formData, 
                total_parcelas: e.target.value,
                valor_parcela: (total / parcelas).toFixed(2)
              })
            }}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Valor da Parcela *
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.valor_parcela}
            onChange={(e) => setFormData({ ...formData, valor_parcela: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Dia do Vencimento *
          </label>
          <Input
            type="number"
            min="1"
            max="31"
            placeholder="1"
            value={formData.dia_vencimento}
            onChange={(e) => setFormData({ ...formData, dia_vencimento: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Data da Compra *
          </label>
          <Input
            type="date"
            value={formData.data_compra}
            onChange={(e) => setFormData({ ...formData, data_compra: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Categoria
          </label>
          <select
            value={formData.categoria_id}
            onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          >
            <option value="">Selecione uma categoria...</option>
            {categorias.filter(c => c.tipo === 'parcela' || c.tipo === 'gasto').map((categoria: any) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.icone} {categoria.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Estabelecimento
        </label>
        <Input
          type="text"
          placeholder="Ex: Magazine Luiza, Amazon..."
          value={formData.estabelecimento}
          onChange={(e) => setFormData({ ...formData, estabelecimento: e.target.value })}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isCreating || isUpdating}
          className="flex-1"
        >
          {isCreating || isUpdating ? 'Salvando...' : (parcela ? 'Atualizar' : 'Adicionar')}
        </Button>
      </div>
    </form>
  )
}

