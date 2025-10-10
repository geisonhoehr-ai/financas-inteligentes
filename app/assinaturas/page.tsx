'use client'

import { useState, useMemo } from 'react'
import { useAssinaturas, Assinatura } from '@/hooks/use-assinaturas'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { useFamilias } from '@/hooks/use-familias'
import { useCategorias } from '@/hooks/use-categorias'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, Calendar, TrendingDown, CreditCard, Repeat, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AssinaturasPage() {
  const { assinaturas: todasAssinaturas, stats, isLoading, createAssinatura, updateAssinatura, deleteAssinatura, isCreating, isUpdating, isDeleting } = useAssinaturas()
  const { familiaAtivaId } = useFamiliaAtiva()
  const { familias } = useFamilias()
  const familiaAtiva = familias?.find(f => f.id === familiaAtivaId) || familias?.[0]
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [assinaturaEditando, setAssinaturaEditando] = useState<Assinatura | null>(null)

  // Filtrar assinaturas pela família ativa (temporariamente desabilitado)
  const assinaturas = useMemo(() => {
    // TODO: Implementar filtragem quando familia_id for adicionado à tabela assinaturas
    return todasAssinaturas
    // if (!familiaAtiva?.id) return todasAssinaturas
    // return todasAssinaturas.filter(a => a.familia_id === familiaAtiva.id)
  }, [todasAssinaturas])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Assinaturas</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas assinaturas e serviços recorrentes
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Assinatura
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Mensal</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatCurrency(stats.gastoMensal)}</div>
            <p className="text-xs text-muted-foreground">Total por mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <Repeat className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.assinaturasAtivas}</div>
            <p className="text-xs text-muted-foreground">Em vigor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próx. Vencimento</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {stats.proximoVencimento ? 
                (typeof stats.proximoVencimento === 'string' 
                  ? new Date(stats.proximoVencimento).toLocaleDateString()
                  : new Date(stats.proximoVencimento.dia_vencimento || stats.proximoVencimento.created_at).toLocaleDateString()
                ) : '--'
              }
            </div>
            <p className="text-xs text-muted-foreground">Data próxima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Anual</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.gastoAnual)}</div>
            <p className="text-xs text-muted-foreground">Projeção anual</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Assinaturas */}
      {assinaturas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma assinatura cadastrada
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Adicione Netflix, Spotify, academia e outras assinaturas para controlar gastos recorrentes
            </p>
            <Button 
              onClick={() => setShowAddDrawer(true)}
              className="h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Assinatura
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assinaturas.map((assinatura: any) => (
            <Card key={assinatura.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{assinatura.nome}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${assinatura.ativa ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                        {assinatura.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Vence todo dia {assinatura.dia_cobranca || assinatura.dia_vencimento}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatCurrency(assinatura.valor)}</p>
                      <p className="text-sm text-muted-foreground">
                        por mês
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAssinaturaEditando(assinatura as any)
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
                          if (confirm('Tem certeza que deseja excluir esta assinatura?')) {
                            await deleteAssinatura(assinatura.id)
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
            <DrawerTitle>Nova Assinatura</DrawerTitle>
            <DrawerDescription>
              Adicione uma nova assinatura ou serviço recorrente
            </DrawerDescription>
          </DrawerHeader>
          <AssinaturaForm onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>

      {/* Drawer de Editar */}
      <Drawer open={showEditDrawer} onOpenChange={setShowEditDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Assinatura</DrawerTitle>
            <DrawerDescription>
              Atualize as informações da assinatura
            </DrawerDescription>
          </DrawerHeader>
          <AssinaturaForm
            assinatura={assinaturaEditando}
            onClose={() => {
              setShowEditDrawer(false)
              setAssinaturaEditando(null)
            }}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function AssinaturaForm({ assinatura, onClose }: { assinatura?: Assinatura | null; onClose: () => void }) {
  const { createAssinatura, updateAssinatura, isCreating, isUpdating } = useAssinaturas()
  const { familiaAtivaId } = useFamiliaAtiva()
  const { categorias } = useCategorias()
  const [formData, setFormData] = useState({
    nome: assinatura?.nome || '',
    valor: assinatura?.valor?.toString() || '',
    dia_vencimento: (assinatura?.dia_cobranca || assinatura?.dia_vencimento)?.toString() || '',
    periodicidade: 'mensal',
    categoria_id: (assinatura as any)?.categoria_id || '',
    categoria_texto: assinatura?.categoria || '', // Para manter o texto livre caso não tenha categoria_id
    descricao: assinatura?.observacoes || '',
    data_inicio: assinatura?.data_inicio || new Date().toISOString().split('T')[0],
    data_fim: assinatura?.data_fim || '',
    status: (assinatura?.ativa ? 'ativa' : 'inativa')
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const assinaturaData = {
      ...formData,
      valor: parseFloat(formData.valor.toString()),
      dia_vencimento: parseInt(formData.dia_vencimento.toString()),
      data_inicio: formData.data_inicio,
      data_fim: formData.data_fim || null,
      observacoes: formData.descricao,
      categoria: formData.categoria_texto, // Manter compatibilidade com campo de texto
      categoria_id: formData.categoria_id, // Adicionar categoria_id se disponível
      familia_id: familiaAtivaId || undefined
    }

    try {
      if (assinatura) {
        await updateAssinatura({ id: assinatura.id, ...assinaturaData })
      } else {
        await createAssinatura(assinaturaData)
      }
      onClose()
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nome do Serviço *
        </label>
        <Input
          type="text"
          placeholder="Ex: Netflix, Spotify, Academia..."
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
            Periodicidade
          </label>
          <select
            value={formData.periodicidade}
            onChange={(e) => setFormData({ ...formData, periodicidade: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          >
            <option value="mensal">🔄 Mensal</option>
            <option value="anual">📅 Anual</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
            required
          >
            <option value="ativa">✅ Ativa</option>
            <option value="inativa">❌ Inativa</option>
          </select>
        </div>
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
          {categorias.map((categoria: any) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.icone} {categoria.nome}
            </option>
          ))}
        </select>
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
          placeholder="Ex: Plano familiar, desconto anual..."
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
          {isCreating || isUpdating ? 'Salvando...' : (assinatura ? 'Atualizar' : 'Adicionar')}
        </Button>
      </div>
    </form>
  )
}

