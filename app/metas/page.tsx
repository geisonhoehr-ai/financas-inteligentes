'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, Target, TrendingUp, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react'
import { useMetas, Meta } from '@/hooks/use-metas'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { formatCurrency } from '@/lib/utils'

export default function MetasPage() {
  const { familiaAtiva } = useFamiliaAtiva()
  const { metas, stats, isLoading, createMeta, updateMeta, deleteMeta, isCreating, isUpdating, isDeleting } = useMetas()
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [metaEditando, setMetaEditando] = useState<Meta | null>(null)

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
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEmMetas)}</div>
            <p className="text-xs text-muted-foreground">Objetivo total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economizado</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.economizado)}</div>
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
                  <div className="flex-1">
                    <h4 className="font-medium">{meta.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {meta.concluida ? 'Concluída' : 'Em andamento'}
                      {meta.prazo && ` • Prazo: ${new Date(meta.prazo).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatCurrency(meta.valor_atual || 0)} / {formatCurrency(meta.valor_objetivo)}</p>
                      <p className="text-sm text-muted-foreground">
                        {((( meta.valor_atual || 0) / meta.valor_objetivo) * 100).toFixed(1)}% alcançado
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setMetaEditando(meta as any)
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
                          if (confirm('Tem certeza que deseja excluir esta meta?')) {
                            await deleteMeta(meta.id)
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
            <DrawerTitle>Nova Meta</DrawerTitle>
            <DrawerDescription>
              Defina uma nova meta financeira
            </DrawerDescription>
          </DrawerHeader>
          <MetaForm familiaId={familiaAtiva?.id} onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>

      {/* Drawer de Editar */}
      <Drawer open={showEditDrawer} onOpenChange={setShowEditDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Meta</DrawerTitle>
            <DrawerDescription>
              Atualize as informações da meta
            </DrawerDescription>
          </DrawerHeader>
          <MetaForm
            familiaId={familiaAtiva?.id}
            meta={metaEditando}
            onClose={() => {
              setShowEditDrawer(false)
              setMetaEditando(null)
            }}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function MetaForm({ familiaId, meta, onClose }: { familiaId?: string; meta?: Meta | null; onClose: () => void }) {
  const { createMeta, updateMeta, isCreating, isUpdating } = useMetas()
  const [formData, setFormData] = useState({
    nome: meta?.nome || '',
    valor_objetivo: meta?.valor_objetivo?.toString() || '',
    valor_atual: meta?.valor_atual?.toString() || '',
    prazo: meta?.prazo || '',
    observacoes: meta?.observacoes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const metaData = {
      nome: formData.nome,
      valor_objetivo: parseFloat(formData.valor_objetivo.toString()),
      valor_atual: parseFloat(formData.valor_atual.toString()) || 0,
      prazo: formData.prazo || null,
      observacoes: formData.observacoes || null,
      familia_id: familiaId
    }

    console.log('Dados a serem enviados (metas):', metaData)

    try {
      if (meta) {
        await updateMeta({ id: meta.id, ...metaData })
      } else {
        await createMeta(metaData)
      }
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
            value={formData.valor_objetivo}
            onChange={(e) => setFormData({ ...formData, valor_objetivo: e.target.value })}
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Prazo
        </label>
        <Input
          type="date"
          value={formData.prazo}
          onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Observações
        </label>
        <Input
          type="text"
          placeholder="Ex: Guardar R$ 500 por mês..."
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
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
          {isCreating || isUpdating ? 'Salvando...' : (meta ? 'Atualizar' : 'Adicionar')}
        </Button>
      </div>
    </form>
  )
}

