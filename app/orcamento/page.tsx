'use client'

import { useState } from 'react'
import { useOrcamento } from '@/hooks/use-orcamento'
import { useCategorias } from '@/hooks/use-categorias'
import { useTags } from '@/hooks/use-tags'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { formatCurrency } from '@/lib/utils'
import { Plus, PiggyBank, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'
import { GuiaAjuda } from '@/components/guia-ajuda'

export default function OrcamentoPage() {
  const { orcamentoAtual, orcamentoCategorias, orcamentoTags, createOrcamento, addCategoriaToOrcamento, addTagToOrcamento, isCreating } = useOrcamento()
  const { categorias } = useCategorias()
  const { tags } = useTags()
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [showAddCategoriaDrawer, setShowAddCategoriaDrawer] = useState(false)
  const [showAddTagDrawer, setShowAddTagDrawer] = useState(false)

  const hoje = new Date()
  const mesAtual = hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  // Calcular totais
  const totalPlanejado = orcamentoAtual?.valor_total || 0
  const totalCategoriasTag = [
    ...orcamentoCategorias.map((c: any) => c.valor_planejado),
    ...orcamentoTags.map((t: any) => t.valor_planejado)
  ].reduce((sum, v) => sum + Number(v), 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bom': return 'bg-green-500'
      case 'atencao': return 'bg-yellow-500'
      case 'alerta': return 'bg-orange-500'
      case 'estourado': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'bom': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'atencao': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'alerta': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'estourado': return <TrendingUp className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <PiggyBank className="h-8 w-8" />
            Orçamento Familiar
          </h2>
          <p className="text-sm text-muted-foreground capitalize">
            {mesAtual}
          </p>
        </div>
        {!orcamentoAtual && (
          <Button 
            onClick={() => setShowCreateDrawer(true)}
            className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
          >
            <Plus className="h-5 w-5 mr-2" />
            Criar Orçamento
          </Button>
        )}
      </div>

      {/* Guia de Ajuda */}
      {!orcamentoAtual && (
        <GuiaAjuda
          titulo="💰 Sistema de Orçamento Familiar"
          topicos={[
            {
              titulo: '📋 Como Funciona',
              conteudo: 'Defina quanto sua família pode gastar no mês. Distribua por categorias (Alimentação, Transporte) ou tags (Pet, Carro, Filho).',
              icone: '📋'
            },
            {
              titulo: '⚠️ Alertas Automáticos',
              conteudo: 'O sistema avisa quando você usar 80% do orçamento de qualquer item. Barras coloridas mostram o status visual.',
              icone: '⚠️'
            },
            {
              titulo: '🎯 Benefícios',
              conteudo: 'Evite surpresas no fim do mês! Saiba exatamente quanto pode gastar em cada área.',
              icone: '🎯'
            }
          ]}
        />
      )}

      {/* Orçamento não criado */}
      {!orcamentoAtual ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <PiggyBank className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Crie seu Orçamento</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Defina quanto você planeja gastar este mês e acompanhe em tempo real 
              o quanto já foi usado em cada categoria e tag.
            </p>
            <Button 
              onClick={() => setShowCreateDrawer(true)}
              size="lg"
              className="h-12"
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar Orçamento do Mês
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resumo do Orçamento */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Orçamento Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(totalPlanejado)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Planejado para o mês</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Disponível</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(Math.max(0, totalPlanejado - totalCategoriasTag))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Para distribuir</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Itens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {orcamentoCategorias.length + orcamentoTags.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {orcamentoCategorias.length} categorias • {orcamentoTags.length} tags
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <Button onClick={() => setShowAddCategoriaDrawer(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Categoria
            </Button>
            <Button onClick={() => setShowAddTagDrawer(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tag
            </Button>
          </div>

          {/* Categorias do Orçamento */}
          {orcamentoCategorias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Orçamento por Categoria</CardTitle>
                <CardDescription>Acompanhe gastos por categoria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {orcamentoCategorias.map((item: any) => {
                  const percentual = item.percentual_usado || 0
                  const valorRealizado = item.valor_realizado || 0
                  const restante = item.valor_planejado - valorRealizado

                  return (
                    <div key={item.id} className="p-4 rounded-xl border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.categorias?.icone || '📁'}</span>
                          <div>
                            <p className="font-semibold">{item.categorias?.nome || item.nome_categoria}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(valorRealizado)} de {formatCurrency(item.valor_planejado)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${restante >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {restante >= 0 ? formatCurrency(restante) : `-${formatCurrency(Math.abs(restante))}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {restante >= 0 ? 'Restante' : 'Estourado'}
                          </p>
                        </div>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              percentual <= 50 ? 'bg-green-500' :
                              percentual <= 80 ? 'bg-yellow-500' :
                              percentual <= 100 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, percentual)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{percentual.toFixed(0)}% usado</span>
                          {percentual > 100 && (
                            <span className="text-red-600 font-medium">
                              {(percentual - 100).toFixed(0)}% acima do limite!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* Tags do Orçamento */}
          {orcamentoTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Orçamento por Tag</CardTitle>
                <CardDescription>Acompanhe gastos por tag personalizada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {orcamentoTags.map((item: any) => {
                  const percentual = item.percentual_usado || 0
                  const valorRealizado = item.valor_realizado || 0
                  const restante = item.valor_planejado - valorRealizado

                  return (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-xl border-2"
                      style={{ 
                        borderColor: item.tags?.cor + '40',
                        backgroundColor: item.tags?.cor + '05'
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.tags?.icone || '🏷️'}</span>
                          <div>
                            <p className="font-semibold" style={{ color: item.tags?.cor }}>
                              {item.tags?.nome}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(valorRealizado)} de {formatCurrency(item.valor_planejado)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${restante >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {restante >= 0 ? formatCurrency(restante) : `-${formatCurrency(Math.abs(restante))}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {restante >= 0 ? 'Restante' : 'Estourado'}
                          </p>
                        </div>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(100, percentual)}%`,
                              backgroundColor: item.tags?.cor
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{percentual.toFixed(0)}% usado</span>
                          {percentual > 100 && (
                            <span className="text-red-600 font-medium">
                              {(percentual - 100).toFixed(0)}% acima!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Drawer: Criar Orçamento */}
      <Drawer open={showCreateDrawer} onOpenChange={setShowCreateDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Criar Orçamento do Mês</DrawerTitle>
            <DrawerDescription>
              Defina o orçamento total para {mesAtual}
            </DrawerDescription>
          </DrawerHeader>
          <CreateOrcamentoForm onClose={() => setShowCreateDrawer(false)} />
        </DrawerContent>
      </Drawer>

      {/* Drawer: Adicionar Categoria */}
      <Drawer open={showAddCategoriaDrawer} onOpenChange={setShowAddCategoriaDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Adicionar Categoria ao Orçamento</DrawerTitle>
            <DrawerDescription>
              Defina quanto planeja gastar nesta categoria
            </DrawerDescription>
          </DrawerHeader>
          <AddCategoriaForm 
            orcamentoId={orcamentoAtual?.id} 
            onClose={() => setShowAddCategoriaDrawer(false)} 
          />
        </DrawerContent>
      </Drawer>

      {/* Drawer: Adicionar Tag */}
      <Drawer open={showAddTagDrawer} onOpenChange={setShowAddTagDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Adicionar Tag ao Orçamento</DrawerTitle>
            <DrawerDescription>
              Defina quanto planeja gastar nesta tag
            </DrawerDescription>
          </DrawerHeader>
          <AddTagForm 
            orcamentoId={orcamentoAtual?.id} 
            onClose={() => setShowAddTagDrawer(false)} 
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function CreateOrcamentoForm({ onClose }: { onClose: () => void }) {
  const { createOrcamento, isCreating } = useOrcamento()
  const [formData, setFormData] = useState({
    nome: 'Orçamento Familiar',
    descricao: '',
    valor_total: ''
  })

  const hoje = new Date()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createOrcamento({
        nome: formData.nome,
        descricao: formData.descricao,
        valor_total: parseFloat(formData.valor_total),
        mes_referencia: hoje.getMonth() + 1,
        ano_referencia: hoje.getFullYear(),
        ativo: true
      } as any)
      onClose()
    } catch (error) {
      console.error('Erro ao criar orçamento:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Orçamento</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor">Valor Total do Orçamento *</Label>
        <Input
          id="valor"
          type="number"
          step="0.01"
          placeholder="Ex: 5000.00"
          value={formData.valor_total}
          onChange={(e) => setFormData({ ...formData, valor_total: e.target.value })}
          required
        />
        <p className="text-xs text-muted-foreground">
          Quanto você planeja gastar no total este mês?
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição (opcional)</Label>
        <Input
          id="descricao"
          placeholder="Ex: Orçamento apertado, férias..."
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isCreating} className="flex-1">
          {isCreating ? 'Criando...' : 'Criar Orçamento'}
        </Button>
      </div>
    </form>
  )
}

function AddCategoriaForm({ orcamentoId, onClose }: { orcamentoId?: string; onClose: () => void }) {
  const { addCategoriaToOrcamento } = useOrcamento()
  const { categorias } = useCategorias()
  const [formData, setFormData] = useState({
    categoria_id: '',
    valor_planejado: '',
    alerta_percentual: '80'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orcamentoId) return

    try {
      await addCategoriaToOrcamento({
        orcamentoId,
        categoriaId: formData.categoria_id,
        valorPlanejado: parseFloat(formData.valor_planejado),
        alertaPercentual: parseInt(formData.alerta_percentual)
      })
      onClose()
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Categoria *</Label>
        <select
          value={formData.categoria_id}
          onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2"
          required
        >
          <option value="">Selecione...</option>
          {categorias.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.icone} {cat.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Valor Planejado *</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="Ex: 500.00"
          value={formData.valor_planejado}
          onChange={(e) => setFormData({ ...formData, valor_planejado: e.target.value })}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Adicionar
        </Button>
      </div>
    </form>
  )
}

function AddTagForm({ orcamentoId, onClose }: { orcamentoId?: string; onClose: () => void }) {
  const { addTagToOrcamento } = useOrcamento()
  const { tags } = useTags()
  const [formData, setFormData] = useState({
    tag_id: '',
    valor_planejado: '',
    alerta_percentual: '80'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orcamentoId) return

    try {
      await addTagToOrcamento({
        orcamentoId,
        tagId: formData.tag_id,
        valorPlanejado: parseFloat(formData.valor_planejado),
        alertaPercentual: parseInt(formData.alerta_percentual)
      })
      onClose()
    } catch (error) {
      console.error('Erro ao adicionar tag:', error)
    }
  }

  const tagSelecionada = tags.find(t => t.id === formData.tag_id)

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Tag *</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setFormData({ ...formData, tag_id: tag.id })}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all
                ${formData.tag_id === tag.id ? 'ring-2 ring-primary border-primary' : 'border-border'}
              `}
              style={{
                backgroundColor: formData.tag_id === tag.id ? tag.cor + '30' : tag.cor + '10',
                color: tag.cor
              }}
            >
              <span>{tag.icone}</span>
              <span className="font-medium">{tag.nome}</span>
            </button>
          ))}
        </div>
        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Você ainda não tem tags. <a href="/tags" className="text-primary hover:underline">Criar tags</a>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Valor Planejado *</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="Ex: 500.00"
          value={formData.valor_planejado}
          onChange={(e) => setFormData({ ...formData, valor_planejado: e.target.value })}
          required
        />
        {tagSelecionada && (
          <p className="text-xs text-muted-foreground">
            💡 Quanto você planeja gastar com &quot;{tagSelecionada.nome}&quot; este mês?
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={!formData.tag_id}>
          Adicionar
        </Button>
      </div>
    </form>
  )
}

