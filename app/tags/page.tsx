'use client'

import { useState } from 'react'
import { useTags, Tag } from '@/hooks/use-tags'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, Edit, Trash2, Tag as TagIcon, TrendingUp, Hash } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { GuiaAjuda } from '@/components/guia-ajuda'

const CORES_POPULARES = [
  { nome: 'Azul', valor: '#3B82F6' },
  { nome: 'Verde', valor: '#10B981' },
  { nome: 'Vermelho', valor: '#EF4444' },
  { nome: 'Amarelo', valor: '#F59E0B' },
  { nome: 'Roxo', valor: '#8B5CF6' },
  { nome: 'Rosa', valor: '#EC4899' },
  { nome: 'Laranja', valor: '#F97316' },
  { nome: 'Ciano', valor: '#06B6D4' },
]

const ICONES_POPULARES = ['🏷️', '🐕', '🚗', '🏠', '❤️', '📚', '💼', '✈️', '🍕', '⚽', '🎮', '🎵', '💊', '👶', '🏋️', '🎯']

export default function TagsPage() {
  const { tags, tagsComStats, isLoading, createTag, updateTag, deleteTag, isCreating, isUpdating, isDeleting } = useTags()
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [tagEditando, setTagEditando] = useState<Tag | null>(null)

  const totalGastosTags = tagsComStats.reduce((sum, tag) => sum + (tag.valor_total || 0), 0)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <TagIcon className="h-8 w-8" />
            Tags Personalizadas
          </h2>
          <p className="text-sm text-muted-foreground">
            Organize seus gastos com tags customizadas
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Tag
        </Button>
      </div>

      {/* Guia de Ajuda */}
      <GuiaAjuda
        titulo="💡 Como Usar Tags"
        topicos={[
          {
            titulo: '🏷️ O que são Tags?',
            conteudo: 'Tags são etiquetas personalizadas para organizar gastos do SEU jeito! Exemplo: Pet, Carro, Filho João, Casa...',
            icone: '🏷️'
          },
          {
            titulo: '✨ Por que usar?',
            conteudo: 'Organize gastos que não cabem em categorias fixas. Você pode ter múltiplas tags no mesmo gasto!',
            icone: '✨'
          },
          {
            titulo: '📊 Análise',
            conteudo: 'Veja quanto gastou por tag no mês/ano. Ex: "Quanto gastei com meu cachorro este ano?"',
            icone: '📊'
          }
        ]}
      />

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tags</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
            <p className="text-xs text-muted-foreground">Tags criadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags em Uso</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {tagsComStats.filter(t => (t.total_gastos || 0) > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Com gastos associados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total por Tags</CardTitle>
            <TagIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {formatCurrency(totalGastosTags)}
            </div>
            <p className="text-xs text-muted-foreground">Gastos organizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tags com Estatísticas */}
      {tagsComStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suas Tags</CardTitle>
            <CardDescription>
              Tags com estatísticas de uso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {tagsComStats.map((tag) => (
                <div
                  key={tag.id}
                  className="p-4 rounded-xl border-2 hover:border-primary/50 transition-all"
                  style={{ borderColor: tag.cor + '20', backgroundColor: tag.cor + '10' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tag.icone}</span>
                      <div>
                        <h3 className="font-semibold">{tag.nome}</h3>
                        {tag.descricao && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {tag.descricao}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setTagEditando(tag)
                          setShowEditDrawer(true)
                        }}
                        className="h-8 w-8"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={async () => {
                          if (confirm(`Tem certeza que deseja excluir a tag "${tag.nome}"?`)) {
                            await deleteTag(tag.id)
                          }
                        }}
                        disabled={isDeleting}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total gasto:</span>
                      <span className="font-semibold" style={{ color: tag.cor }}>
                        {formatCurrency(tag.valor_total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantidade:</span>
                      <span className="font-medium">{tag.total_gastos || 0} gastos</span>
                    </div>
                    {(tag.meses_com_gastos || 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Período:</span>
                        <span className="font-medium">{tag.meses_com_gastos} {tag.meses_com_gastos === 1 ? 'mês' : 'meses'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não há tags */}
      {tags.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TagIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma tag criada
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Crie tags personalizadas para organizar melhor seus gastos.
              Exemplo: Pet, Carro, Filho João, Casa, etc.
            </p>
            <Button 
              onClick={() => setShowAddDrawer(true)}
              className="h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar Primeira Tag
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Drawer de Adicionar */}
      <Drawer open={showAddDrawer} onOpenChange={setShowAddDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Nova Tag</DrawerTitle>
            <DrawerDescription>
              Crie uma tag personalizada para organizar seus gastos
            </DrawerDescription>
          </DrawerHeader>
          <TagForm onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>

      {/* Drawer de Editar */}
      <Drawer open={showEditDrawer} onOpenChange={setShowEditDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Tag</DrawerTitle>
            <DrawerDescription>
              Atualize as informações da tag
            </DrawerDescription>
          </DrawerHeader>
          <TagForm
            tag={tagEditando}
            onClose={() => {
              setShowEditDrawer(false)
              setTagEditando(null)
            }}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function TagForm({ tag, onClose }: { tag?: Tag | null; onClose: () => void }) {
  const { createTag, updateTag, isCreating, isUpdating } = useTags()
  const [formData, setFormData] = useState({
    nome: tag?.nome || '',
    cor: tag?.cor || '#3B82F6',
    icone: tag?.icone || '🏷️',
    descricao: tag?.descricao || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Dados a serem enviados (tags):', formData)

    try {
      if (tag) {
        await updateTag({ id: tag.id, ...formData })
      } else {
        await createTag(formData)
      }
      onClose()
    } catch (error) {
      console.error('Erro ao salvar tag:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Tag *</Label>
        <Input
          id="nome"
          type="text"
          placeholder="Ex: Pet, Carro, Filho João..."
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
          maxLength={50}
        />
      </div>

      <div className="space-y-2">
        <Label>Ícone *</Label>
        <div className="grid grid-cols-8 gap-2">
          {ICONES_POPULARES.map((icone) => (
            <button
              key={icone}
              type="button"
              onClick={() => setFormData({ ...formData, icone })}
              className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                formData.icone === icone 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {icone}
            </button>
          ))}
        </div>
        <Input
          type="text"
          placeholder="Ou digite um emoji..."
          value={formData.icone}
          onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
          className="mt-2"
          maxLength={10}
        />
      </div>

      <div className="space-y-2">
        <Label>Cor *</Label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {CORES_POPULARES.map((cor) => (
            <button
              key={cor.valor}
              type="button"
              onClick={() => setFormData({ ...formData, cor: cor.valor })}
              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                formData.cor === cor.valor 
                  ? 'border-primary ring-2 ring-primary' 
                  : 'border-border'
              }`}
              style={{ backgroundColor: cor.valor }}
            >
              <span className="text-white text-xs font-medium">{cor.nome}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="color"
            value={formData.cor}
            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
            className="w-20 h-10"
          />
          <Input
            type="text"
            value={formData.cor}
            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
            placeholder="#3B82F6"
            maxLength={7}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          id="descricao"
          type="text"
          placeholder="Ex: Gastos relacionados ao meu cachorro"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
        />
      </div>

      {/* Preview */}
      <div className="p-4 rounded-xl border-2" style={{ 
        borderColor: formData.cor + '40',
        backgroundColor: formData.cor + '10'
      }}>
        <p className="text-sm text-muted-foreground mb-2">Preview:</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{formData.icone}</span>
          <div>
            <p className="font-semibold">{formData.nome || 'Nome da Tag'}</p>
            {formData.descricao && (
              <p className="text-xs text-muted-foreground">{formData.descricao}</p>
            )}
          </div>
        </div>
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
          {isCreating || isUpdating ? 'Salvando...' : (tag ? 'Atualizar' : 'Criar Tag')}
        </Button>
      </div>
    </form>
  )
}

