'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, Wrench, Code, Laptop, TrendingDown } from 'lucide-react'
import { useFerramentas } from '@/hooks/use-ferramentas'
import { formatCurrency } from '@/lib/utils'

export default function FerramentasPage() {
  const { ferramentas, stats, isLoading, createFerramenta, isCreating } = useFerramentas()
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ferramentas</h2>
          <p className="text-sm text-muted-foreground">
            Controle gastos com ferramentas e softwares profissionais
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Ferramenta
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
            <p className="text-xs text-muted-foreground">Total do mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ferramentas</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.totalFerramentas}</div>
            <p className="text-xs text-muted-foreground">Ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Softwares</CardTitle>
            <Code className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.totalSoftwares}</div>
            <p className="text-xs text-muted-foreground">Licenças</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Anual</CardTitle>
            <Laptop className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.gastoAnual)}</div>
            <p className="text-xs text-muted-foreground">Projeção</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Ferramentas */}
      {ferramentas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma ferramenta cadastrada
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Adicione Adobe, GitHub, Figma, hosting e outras ferramentas profissionais
            </p>
            <Button 
              onClick={() => setShowAddDrawer(true)}
              className="h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Ferramenta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {ferramentas.map((ferramenta) => (
            <Card key={ferramenta.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{ferramenta.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {ferramenta.tipo || 'Sem tipo'} • {ferramenta.status === 'ativa' ? 'Ativa' : 'Inativa'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(ferramenta.valor)}</p>
                    <p className="text-sm text-muted-foreground">
                      {ferramenta.periodicidade === 'mensal' ? 'Mensal' : 'Anual'}
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
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Nova Ferramenta</DrawerTitle>
            <DrawerDescription>
              Adicione uma nova ferramenta ou software profissional
            </DrawerDescription>
          </DrawerHeader>
          <FerramentaForm onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function FerramentaForm({ onClose }: { onClose: () => void }) {
  const { createFerramenta, isCreating } = useFerramentas()
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    tipo: '',
    periodicidade: 'mensal',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: '',
    status: 'ativa',
    descricao: '',
    link: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const ferramentaData = {
      ...formData,
      valor: parseFloat(formData.valor.toString())
    }

    try {
      await createFerramenta(ferramentaData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar ferramenta:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nome da Ferramenta *
        </label>
        <Input
          type="text"
          placeholder="Ex: Adobe Creative Cloud, GitHub..."
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Tipo
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          >
            <option value="">Selecione...</option>
            <option value="software">💻 Software</option>
            <option value="hosting">🌐 Hosting</option>
            <option value="cloud">☁️ Cloud</option>
            <option value="design">🎨 Design</option>
            <option value="desenvolvimento">👨‍💻 Desenvolvimento</option>
            <option value="produtividade">⚡ Produtividade</option>
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
            <option value="ativa">✅ Ativa</option>
            <option value="inativa">❌ Inativa</option>
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
          Link
        </label>
        <Input
          type="url"
          placeholder="Ex: https://adobe.com"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Observações
        </label>
        <Input
          type="text"
          placeholder="Ex: Plano Team, 5 usuários..."
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

