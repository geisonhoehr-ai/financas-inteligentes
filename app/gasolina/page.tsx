'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, Car, TrendingUp, Fuel, MapPin, Edit, Trash2 } from 'lucide-react'
import { useGasolina, Gasolina } from '@/hooks/use-gasolina'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { formatCurrency } from '@/lib/utils'

export default function GasolinaPage() {
  const { familiaAtiva } = useFamiliaAtiva()
  const { abastecimentos, stats, isLoading, createGasolina, updateGasolina, deleteGasolina, isCreating, isUpdating, isDeleting } = useGasolina()
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [abastecimentoEditando, setAbastecimentoEditando] = useState<Gasolina | null>(null)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Gasolina</h2>
          <p className="text-sm text-muted-foreground">
            Controle seus abastecimentos e consumo
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Abastecimento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Total</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.gastoTotal)}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Litros</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.litrosTotais.toFixed(1)} L</div>
            <p className="text-xs text-muted-foreground">Abastecidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatCurrency(stats.precoMedio)}</div>
            <p className="text-xs text-muted-foreground">Por litro</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abastecimentos</CardTitle>
            <Car className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.totalAbastecimentos}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Abastecimentos */}
      {abastecimentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum abastecimento registrado
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Registre seus abastecimentos para acompanhar consumo e gastos com combustível
            </p>
            <Button 
              onClick={() => setShowAddDrawer(true)}
              className="h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Abastecimento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {abastecimentos.map((abastecimento) => (
            <Card key={abastecimento.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">Abastecimento</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(abastecimento.data).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatCurrency(abastecimento.valor)}</p>
                      <p className="text-sm text-muted-foreground">
                        {abastecimento.litros ? abastecimento.litros.toFixed(1) : '0.0'} L ({formatCurrency(abastecimento.preco_litro || 0)}/L)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAbastecimentoEditando(abastecimento as any)
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
                          if (confirm('Tem certeza que deseja excluir este abastecimento?')) {
                            await deleteGasolina(abastecimento.id)
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

      {/* Drawer de Adicionar */}
      <Drawer open={showAddDrawer} onOpenChange={setShowAddDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Novo Abastecimento</DrawerTitle>
            <DrawerDescription>
              Registre um novo abastecimento de combustível
            </DrawerDescription>
          </DrawerHeader>
          <GasolinaForm familiaId={familiaAtiva?.id} onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>

      {/* Drawer de Editar */}
      <Drawer open={showEditDrawer} onOpenChange={setShowEditDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Abastecimento</DrawerTitle>
            <DrawerDescription>
              Atualize as informações do abastecimento
            </DrawerDescription>
          </DrawerHeader>
          <GasolinaForm
            familiaId={familiaAtiva?.id}
            gasolina={abastecimentoEditando}
            onClose={() => {
              setShowEditDrawer(false)
              setAbastecimentoEditando(null)
            }}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function GasolinaForm({ familiaId, gasolina, onClose }: { familiaId?: string; gasolina?: Gasolina | null; onClose: () => void }) {
  const { createGasolina, updateGasolina, isCreating, isUpdating } = useGasolina()
  const [formData, setFormData] = useState({
    valor: gasolina?.valor?.toString() || '',
    litros: gasolina?.litros?.toString() || '',
    preco_litro: gasolina?.preco_litro?.toString() || '',
    km_atual: gasolina?.km_atual?.toString() || '',
    data: gasolina?.data || new Date().toISOString().split('T')[0],
    tipo_combustivel: 'gasolina',
    descricao: gasolina?.descricao || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const gasolinaData = {
      ...formData,
      valor: parseFloat(formData.valor.toString()),
      litros: parseFloat(formData.litros.toString()),
      preco_litro: parseFloat(formData.preco_litro.toString()),
      km_atual: formData.km_atual ? parseInt(formData.km_atual.toString()) : undefined,
      data: formData.data || new Date().toISOString().split('T')[0],
      descricao: formData.descricao,
      familia_id: familiaId
    }

    try {
      if (gasolina) {
        await updateGasolina({ id: gasolina.id, ...gasolinaData })
      } else {
        await createGasolina(gasolinaData)
      }
      onClose()
    } catch (error) {
      console.error('Erro ao salvar abastecimento:', error)
    }
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseFloat(e.target.value) || 0
    const litros = parseFloat(formData.litros) || 0
    setFormData({
      ...formData,
      valor: e.target.value,
      preco_litro: litros > 0 ? (valor / litros).toFixed(3) : formData.preco_litro
    })
  }

  const handleLitrosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const litros = parseFloat(e.target.value) || 0
    const valor = parseFloat(formData.valor) || 0
    setFormData({
      ...formData,
      litros: e.target.value,
      preco_litro: litros > 0 ? (valor / litros).toFixed(3) : formData.preco_litro
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Valor Total *
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.valor}
            onChange={handleValorChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Litros *
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.litros}
            onChange={handleLitrosChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Preço por Litro *
          </label>
          <Input
            type="number"
            step="0.001"
            placeholder="0,000"
            value={formData.preco_litro}
            onChange={(e) => setFormData({ ...formData, preco_litro: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Data *
          </label>
          <Input
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Quilometragem
          </label>
          <Input
            type="number"
            placeholder="Ex: 12345"
            value={formData.km_atual}
            onChange={(e) => setFormData({ ...formData, km_atual: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Tipo de Combustível
        </label>
        <select
          value={formData.tipo_combustivel}
          onChange={(e) => setFormData({ ...formData, tipo_combustivel: e.target.value })}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
        >
          <option value="gasolina">⛽ Gasolina Comum</option>
          <option value="gasolina_aditivada">⛽ Gasolina Aditivada</option>
          <option value="etanol">🌱 Etanol</option>
          <option value="diesel">🚛 Diesel</option>
          <option value="gnv">🔋 GNV</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Observações
        </label>
        <Input
          type="text"
          placeholder="Ex: Tanque cheio, promoção..."
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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
          {isCreating || isUpdating ? 'Salvando...' : (gasolina ? 'Atualizar' : 'Adicionar')}
        </Button>
      </div>
    </form>
  )
}

