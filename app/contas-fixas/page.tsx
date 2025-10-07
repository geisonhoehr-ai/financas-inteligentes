'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, Building, Zap, Droplet, Wifi, Phone } from 'lucide-react'
import { useContasFixas } from '@/hooks/use-contas-fixas'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { formatCurrency } from '@/lib/utils'

export default function ContasFixasPage() {
  const { familiaAtiva } = useFamiliaAtiva()
  const { contas, stats, isLoading, createContaFixa, isCreating } = useContasFixas()
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Contas Fixas</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas contas mensais fixas
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mensal</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalMensal)}</div>
            <p className="text-xs text-muted-foreground">Contas fixas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energia</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalEnergia)}</div>
            <p className="text-xs text-muted-foreground">Luz</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Água</CardTitle>
            <Droplet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{formatCurrency(stats.totalAgua)}</div>
            <p className="text-xs text-muted-foreground">Saneamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internet</CardTitle>
            <Wifi className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{formatCurrency(stats.totalInternet)}</div>
            <p className="text-xs text-muted-foreground">Banda larga</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telefone</CardTitle>
            <Phone className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.totalTelefone)}</div>
            <p className="text-xs text-muted-foreground">Celular</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Contas Fixas */}
      {contas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma conta fixa cadastrada
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Adicione luz, água, internet, aluguel e outras contas fixas mensais
            </p>
            <Button 
              onClick={() => setShowAddDrawer(true)}
              className="h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Conta Fixa
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contas.map((conta) => (
            <Card key={conta.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{conta.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      Vence dia {conta.dia_vencimento}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(conta.valor)}</p>
                    <p className="text-sm text-muted-foreground">
                      {conta.categoria || 'Sem categoria'}
                    </p>
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
            <DrawerTitle>Nova Conta Fixa</DrawerTitle>
            <DrawerDescription>
              Adicione uma nova conta fixa mensal
            </DrawerDescription>
          </DrawerHeader>
          <ContaFixaForm familiaId={familiaAtiva?.id} onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function ContaFixaForm({ familiaId, onClose }: { familiaId?: string; onClose: () => void }) {
  const { createContaFixa, isCreating } = useContasFixas()
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    dia_vencimento: '',
    categoria: '',
    descricao: '',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: '',
    status: 'ativa'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const contaData = {
      ...formData,
      valor: parseFloat(formData.valor.toString()),
      dia_vencimento: parseInt(formData.dia_vencimento.toString()),
      observacoes: formData.descricao,
      familia_id: familiaId
    }

    try {
      await createContaFixa(contaData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar conta fixa:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nome da Conta *
        </label>
        <Input
          type="text"
          placeholder="Ex: Luz, Água, Internet..."
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
            Categoria
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          >
            <option value="">Selecione...</option>
            <option value="energia">⚡ Energia</option>
            <option value="agua">💧 Água</option>
            <option value="internet">📡 Internet</option>
            <option value="telefone">📱 Telefone</option>
            <option value="aluguel">🏠 Aluguel</option>
            <option value="condominio">🏢 Condomínio</option>
            <option value="iptu">📄 IPTU</option>
            <option value="outros">📦 Outros</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Data de Início *
          </label>
          <Input
            type="date"
            value={formData.data_inicio}
            onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Data de Término
        </label>
        <Input
          type="date"
          value={formData.data_fim}
          onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Observações
        </label>
        <Input
          type="text"
          placeholder="Ex: Unidade consumidora 123456..."
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
          disabled={isCreating}
          className="flex-1"
        >
          {isCreating ? 'Salvando...' : 'Adicionar'}
        </Button>
      </div>
    </form>
  )
}

