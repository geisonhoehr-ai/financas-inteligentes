'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, Target, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import { useMetas } from '@/hooks/use-metas'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { formatCurrency } from '@/lib/utils'

export default function MetasPage() {
  const { familiaAtiva } = useFamiliaAtiva()
  const { metas, stats, isLoading, createMeta, isCreating } = useMetas()
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Metas Financeiras</h2>
          <p className="text-sm text-muted-foreground">
            Defina e acompanhe suas metas de economia
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Metas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalMetas)}</div>
            <p className="text-xs text-muted-foreground">Objetivo total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economizado</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.totalEconomizado)}</div>
            <p className="text-xs text-muted-foreground">Já guardado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.metasAtivas}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.metasConcluidas}</div>
            <p className="text-xs text-muted-foreground">Alcançadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      {metas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma meta definida
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Crie metas para viagem, carro novo, reserva de emergência ou qualquer objetivo financeiro
            </p>
            <Button 
              onClick={() => setShowAddDrawer(true)}
              className="h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar Meta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {metas.map((meta) => (
            <Card key={meta.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{meta.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {meta.categoria || 'Sem categoria'} • {meta.status === 'concluida' ? 'Concluída' : 'Em andamento'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(meta.valor_atual)} / {formatCurrency(meta.valor_meta)}</p>
                    <p className="text-sm text-muted-foreground">
                      {((meta.valor_atual / meta.valor_meta) * 100).toFixed(1)}% alcançado
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
            <DrawerTitle>Nova Meta</DrawerTitle>
            <DrawerDescription>
              Defina uma nova meta financeira
            </DrawerDescription>
          </DrawerHeader>
          <MetaForm familiaId={familiaAtiva?.id} onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function MetaForm({ familiaId, onClose }: { familiaId?: string; onClose: () => void }) {
  const { createMeta, isCreating } = useMetas()
  const [formData, setFormData] = useState({
    nome: '',
    valor_meta: '',
    valor_atual: '',
    categoria: '',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: '',
    status: 'em_andamento',
    descricao: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const metaData = {
      ...formData,
      valor_objetivo: parseFloat(formData.valor_meta.toString()),
      valor_atual: parseFloat(formData.valor_atual.toString()) || 0,
      familia_id: familiaId
    }

    try {
      await createMeta(metaData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar meta:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nome da Meta *
        </label>
        <Input
          type="text"
          placeholder="Ex: Viagem para Europa, Carro novo..."
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Valor da Meta *
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.valor_meta}
            onChange={(e) => setFormData({ ...formData, valor_meta: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Valor Atual
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.valor_atual}
            onChange={(e) => setFormData({ ...formData, valor_atual: e.target.value })}
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
            <option value="viagem">✈️ Viagem</option>
            <option value="carro">🚗 Carro</option>
            <option value="casa">🏠 Casa</option>
            <option value="emergencia">🚨 Emergência</option>
            <option value="educacao">📚 Educação</option>
            <option value="aposentadoria">👴 Aposentadoria</option>
            <option value="outros">📦 Outros</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          >
            <option value="em_andamento">🎯 Em Andamento</option>
            <option value="concluida">✅ Concluída</option>
            <option value="pausada">⏸️ Pausada</option>
            <option value="cancelada">❌ Cancelada</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Observações
        </label>
        <Input
          type="text"
          placeholder="Ex: Guardar R$ 500 por mês..."
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

