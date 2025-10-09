'use client'

import { useState } from 'react'
import { useSalarios } from '@/hooks/use-salarios'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, DollarSign, TrendingUp, Users, Calendar, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function SalariosPage() {
  const { salarios, stats, isLoading, createSalario, updateSalario, deleteSalario, isCreating, isUpdating, isDeleting } = useSalarios()
  const { familiaAtivaId } = useFamiliaAtiva()
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [salarioEditando, setSalarioEditando] = useState<any>(null)

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando salários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Salários e Receitas</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os salários e receitas da família
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Salário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.receitaTotal)}</div>
            <p className="text-xs text-muted-foreground">Soma de todos salários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita da Família</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{formatCurrency(stats.receitaFamilia)}</div>
            <p className="text-xs text-muted-foreground">Salários compartilhados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salários Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.salariosAtivos}</div>
            <p className="text-xs text-muted-foreground">Cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mês Atual</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatCurrency(stats.receitaMesAtual)}</div>
            <p className="text-xs text-muted-foreground">Referente a este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Salários */}
      {salarios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum salário cadastrado
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Adicione os salários dos membros da família para controlar receitas e calcular saldo
            </p>
            <Button 
              onClick={() => setShowAddDrawer(true)}
              className="h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Salário
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {salarios.map((salario: any) => (
            <Card key={salario.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{salario.descricao || 'Salário'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {salario.tipo === 'principal' ? '💼 Salário Principal' : 
                       salario.tipo === 'extra' ? '💰 Renda Extra' :
                       salario.tipo === 'bonus' ? '🎁 Bônus' : '📅 13º Salário'}
                      {salario.visivel_familia && ' • Compartilhado com família'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(salario.valor)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {salario.mes_referencia ? new Date(salario.mes_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'Mensal'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSalarioEditando(salario)
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
                          if (confirm('Tem certeza que deseja excluir este salário?')) {
                            await deleteSalario(salario.id)
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
            <DrawerTitle>Adicionar Salário</DrawerTitle>
            <DrawerDescription>
              Adicione uma receita mensal ou extra
            </DrawerDescription>
          </DrawerHeader>
          <SalarioForm familiaId={familiaAtivaId} onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>

      {/* Drawer de Editar */}
      <Drawer open={showEditDrawer} onOpenChange={setShowEditDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Salário</DrawerTitle>
            <DrawerDescription>
              Atualize as informações do salário
            </DrawerDescription>
          </DrawerHeader>
          <SalarioForm
            familiaId={familiaAtivaId}
            salario={salarioEditando}
            onClose={() => {
              setShowEditDrawer(false)
              setSalarioEditando(null)
            }}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function SalarioForm({ familiaId, salario, onClose }: { familiaId?: string; salario?: any; onClose: () => void }) {
  const { createSalario, updateSalario, isCreating, isUpdating } = useSalarios()
  const [formData, setFormData] = useState({
    valor: salario?.valor?.toString() || '',
    descricao: salario?.descricao || '',
    tipo: salario?.tipo || 'principal',
    mes_referencia: salario?.mes_referencia || new Date().toISOString().split('T')[0].substring(0, 7),
    visivel_familia: salario?.visivel_familia !== false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const salarioData = {
      valor: parseFloat(formData.valor.toString()),
      descricao: formData.descricao,
      tipo: formData.tipo,
      mes_referencia: formData.mes_referencia + '-01',
      visivel_familia: formData.visivel_familia,
      familia_id: familiaId
    }

    try {
      if (salario) {
        await updateSalario({ id: salario.id, ...salarioData })
      } else {
        await createSalario(salarioData)
      }
      onClose()
    } catch (error) {
      console.error('Erro ao salvar salário:', error)
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
          placeholder="Ex: Salário Empresa, Freelance, Bônus..."
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
            Mês de Referência
          </label>
          <Input
            type="month"
            value={formData.mes_referencia}
            onChange={(e) => setFormData({ ...formData, mes_referencia: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Tipo de Receita
        </label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
        >
          <option value="principal">💼 Salário Principal</option>
          <option value="extra">💰 Renda Extra</option>
          <option value="bonus">🎁 Bônus</option>
          <option value="13_salario">📅 13º Salário</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="visivel_familia"
          checked={formData.visivel_familia}
          onChange={(e) => setFormData({ ...formData, visivel_familia: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="visivel_familia" className="text-sm font-medium cursor-pointer">
          💚 Compartilhar com família (para cálculo de saldo familiar)
        </label>
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
          {isCreating || isUpdating ? 'Salvando...' : (salario ? 'Atualizar' : 'Adicionar')}
        </Button>
      </div>
    </form>
  )
}

