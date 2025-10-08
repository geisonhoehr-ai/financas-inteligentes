'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, CreditCard, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { useCartoes } from '@/hooks/use-cartoes'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { formatCurrency } from '@/lib/utils'

export default function CartoesPage() {
  const { familiaAtiva } = useFamiliaAtiva()
  const { cartoes, stats, isLoading, createCartao, isCreating } = useCartoes()
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Cartões</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie seus cartões de crédito e débito
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Cartão
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fatura Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatCurrency(stats.faturaAtual)}</div>
            <p className="text-xs text-muted-foreground">A pagar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Limite Disponível</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.limiteDisponivel)}</div>
            <p className="text-xs text-muted-foreground">Total disponível</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartões Ativos</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.cartoesAtivos}</div>
            <p className="text-xs text-muted-foreground">Cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próx. Vencimento</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.proximoVencimento ? new Date(stats.proximoVencimento).toLocaleDateString() : '--'}</div>
            <p className="text-xs text-muted-foreground">Data</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cartões */}
      {cartoes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum cartão cadastrado
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Adicione seus cartões de crédito e débito para controlar faturas e limites
            </p>
            <Button 
              onClick={() => setShowAddDrawer(true)}
              className="h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Cartão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cartoes.map((cartao) => (
            <Card key={cartao.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{cartao.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      Vence dia {cartao.dia_vencimento}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(cartao.limite || 0)}</p>
                    <p className="text-sm text-muted-foreground">
                      {cartao.tipo === 'credito' ? 'Crédito' : 'Débito'}
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
            <DrawerTitle>Novo Cartão</DrawerTitle>
            <DrawerDescription>
              Adicione um novo cartão de crédito ou débito
            </DrawerDescription>
          </DrawerHeader>
          <CartaoForm familiaId={familiaAtiva?.id} onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function CartaoForm({ familiaId, onClose }: { familiaId?: string; onClose: () => void }) {
  const { createCartao, isCreating } = useCartoes()
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'credito',
    bandeira: '',
    limite: '',
    dia_vencimento: '',
    dia_fechamento: '',
    numero_final: '',
    status: 'ativo',
    descricao: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const cartaoData = {
      ...formData,
      limite: parseFloat(formData.limite.toString()),
      dia_vencimento: parseInt(formData.dia_vencimento.toString()),
      dia_fechamento: parseInt(formData.dia_fechamento.toString()),
      ultimos_digitos: formData.numero_final ? formData.numero_final.toString() : '',
      observacoes: formData.descricao,
      familia_id: familiaId
    }

    try {
      await createCartao(cartaoData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar cartão:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nome do Cartão *
        </label>
        <Input
          type="text"
          placeholder="Ex: Nubank, Inter..."
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
            <option value="credito">💳 Crédito</option>
            <option value="debito">💰 Débito</option>
            <option value="credito_debito">💳💰 Crédito e Débito</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Bandeira
          </label>
          <select
            value={formData.bandeira}
            onChange={(e) => setFormData({ ...formData, bandeira: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          >
            <option value="">Selecione...</option>
            <option value="mastercard">💳 Mastercard</option>
            <option value="visa">💳 Visa</option>
            <option value="elo">💳 Elo</option>
            <option value="american_express">💳 American Express</option>
            <option value="hipercard">💳 Hipercard</option>
            <option value="outros">💳 Outros</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Limite *
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.limite}
            onChange={(e) => setFormData({ ...formData, limite: e.target.value })}
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
            Dia do Fechamento *
          </label>
          <Input
            type="number"
            min="1"
            max="31"
            placeholder="1"
            value={formData.dia_fechamento}
            onChange={(e) => setFormData({ ...formData, dia_fechamento: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Final do Cartão
          </label>
          <Input
            type="number"
            min="0"
            max="9999"
            placeholder="Ex: 1234"
            value={formData.numero_final}
            onChange={(e) => setFormData({ ...formData, numero_final: e.target.value })}
          />
        </div>
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
          <option value="bloqueado">🔒 Bloqueado</option>
          <option value="cancelado">❌ Cancelado</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Observações
        </label>
        <Input
          type="text"
          placeholder="Ex: Cartão adicional, limite compartilhado..."
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

