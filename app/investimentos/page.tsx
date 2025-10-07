'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, TrendingUp, DollarSign, PieChart, LineChart } from 'lucide-react'
import { useInvestimentos } from '@/hooks/use-investimentos'
import { formatCurrency } from '@/lib/utils'

export default function InvestimentosPage() {
  const { investimentos, stats, isLoading, createInvestimento, isCreating } = useInvestimentos()
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Investimentos</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe seus investimentos e rentabilidade
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Investimento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalInvestido)}</div>
            <p className="text-xs text-muted-foreground">Patrimônio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.rentabilidade >= 0 ? '+' : ''}{stats.rentabilidade.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
            <PieChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.totalInvestimentos}</div>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendimento</CardTitle>
            <LineChart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{formatCurrency(stats.rendimentoTotal)}</div>
            <p className="text-xs text-muted-foreground">Total ganho</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Investimentos */}
      {investimentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum investimento cadastrado
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Registre suas ações, fundos, poupança, CDB e outros investimentos
            </p>
            <Button 
              onClick={() => setShowAddDrawer(true)}
              className="h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Investimento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {investimentos.map((investimento) => (
            <Card key={investimento.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{investimento.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {investimento.tipo || 'Sem tipo'} • {investimento.status === 'ativo' ? 'Ativo' : 'Resgatado'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(investimento.valor_atual)}</p>
                    <p className="text-sm text-muted-foreground">
                      {investimento.rentabilidade >= 0 ? '+' : ''}{investimento.rentabilidade.toFixed(2)}% ({formatCurrency(investimento.valor_inicial)})
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
            <DrawerTitle>Novo Investimento</DrawerTitle>
            <DrawerDescription>
              Registre um novo investimento
            </DrawerDescription>
          </DrawerHeader>
          <InvestimentoForm onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function InvestimentoForm({ onClose }: { onClose: () => void }) {
  const { createInvestimento, isCreating } = useInvestimentos()
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    valor_inicial: '',
    valor_atual: '',
    rentabilidade: '',
    data_inicio: new Date().toISOString().split('T')[0],
    data_vencimento: '',
    status: 'ativo',
    descricao: '',
    instituicao: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const investimentoData = {
      ...formData,
      valor_inicial: parseFloat(formData.valor_inicial.toString()),
      valor_atual: parseFloat(formData.valor_atual.toString()) || parseFloat(formData.valor_inicial.toString()),
      rentabilidade: parseFloat(formData.rentabilidade.toString()) || 0
    }

    try {
      await createInvestimento(investimentoData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar investimento:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nome do Investimento *
        </label>
        <Input
          type="text"
          placeholder="Ex: PETR4, Tesouro IPCA+..."
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
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
            <option value="acao">📈 Ação</option>
            <option value="fii">🏢 FII</option>
            <option value="tesouro_direto">🏛️ Tesouro Direto</option>
            <option value="cdb">💰 CDB</option>
            <option value="lci_lca">🏦 LCI/LCA</option>
            <option value="poupanca">🏦 Poupança</option>
            <option value="fundo">📊 Fundo</option>
            <option value="cripto">💎 Cripto</option>
            <option value="outros">📦 Outros</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Instituição
          </label>
          <Input
            type="text"
            placeholder="Ex: Nubank, XP..."
            value={formData.instituicao}
            onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Valor Inicial *
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.valor_inicial}
            onChange={(e) => setFormData({ ...formData, valor_inicial: e.target.value })}
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
            onChange={(e) => {
              const valorInicial = parseFloat(formData.valor_inicial) || 0
              const valorAtual = parseFloat(e.target.value) || 0
              const rentabilidade = valorInicial > 0 ? ((valorAtual - valorInicial) / valorInicial) * 100 : 0
              setFormData({
                ...formData,
                valor_atual: e.target.value,
                rentabilidade: rentabilidade.toFixed(2)
              })
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Rentabilidade (%)
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.rentabilidade}
            onChange={(e) => {
              const valorInicial = parseFloat(formData.valor_inicial) || 0
              const rentabilidade = parseFloat(e.target.value) || 0
              const valorAtual = valorInicial * (1 + rentabilidade / 100)
              setFormData({
                ...formData,
                rentabilidade: e.target.value,
                valor_atual: valorAtual.toFixed(2)
              })
            }}
          />
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
            <option value="ativo">✅ Ativo</option>
            <option value="resgatado">💰 Resgatado</option>
            <option value="vencido">⌛ Vencido</option>
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
            Data de Vencimento
          </label>
          <Input
            type="date"
            value={formData.data_vencimento}
            onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Observações
        </label>
        <Input
          type="text"
          placeholder="Ex: IPCA + 5,5% a.a., CDI 120%..."
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

