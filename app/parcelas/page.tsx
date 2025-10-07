'use client'

import { useState, useMemo } from 'react'
import { useParcelas } from '@/hooks/use-parcelas'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { useFamilias } from '@/hooks/use-familias'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, CreditCard, TrendingDown, Calendar, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ParcelasPage() {
  const { parcelas: todasParcelas, stats, isLoading, createParcela, isCreating } = useParcelas()
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
                  <div>
                    <h4 className="font-medium">{parcela.descricao}</h4>
                    <p className="text-sm text-muted-foreground">
                      {parcela.parcela_atual}/{parcela.total_parcelas} parcelas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(parcela.valor_parcela)}</p>
                    <p className="text-sm text-muted-foreground">
                      Total: {formatCurrency(parcela.valor_total)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Drawer de Adicionar/Editar */}
      <Drawer open={showAddDrawer} onOpenChange={setShowAddDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Nova Parcela</DrawerTitle>
            <DrawerDescription>
              Adicione uma nova compra parcelada ao seu controle financeiro
            </DrawerDescription>
          </DrawerHeader>
          <ParcelaForm onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function ParcelaForm({ onClose }: { onClose: () => void }) {
  const { createParcela, isCreating } = useParcelas()
  const [formData, setFormData] = useState({
    descricao: '',
    valor_total: '',
    total_parcelas: '',
    valor_parcela: '',
    data_compra: new Date().toISOString().split('T')[0],
    dia_vencimento: '',
    categoria: '',
    estabelecimento: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const parcelaData = {
      ...formData,
      valor_total: parseFloat(formData.valor_total.toString()),
      valor_parcela: parseFloat(formData.valor_parcela.toString()),
      total_parcelas: parseInt(formData.total_parcelas.toString()),
      dia_vencimento: parseInt(formData.dia_vencimento.toString())
    }

    try {
      await createParcela(parcelaData)
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
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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
          <Input
            type="text"
            placeholder="Ex: Eletrônicos, Móveis..."
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          />
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
          disabled={isCreating}
          className="flex-1"
        >
          {isCreating ? 'Salvando...' : 'Adicionar'}
        </Button>
      </div>
    </form>
  )
}

