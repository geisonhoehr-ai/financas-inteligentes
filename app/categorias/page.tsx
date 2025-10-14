'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Plus, Tag, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { showToast } from '@/lib/toast'

export default function CategoriasPage() {
  const queryClient = useQueryClient()
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState<any>(null)

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['todas-categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('deletado', false)
        .order('nome')

      if (error) throw error
      return data || []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('categorias')
        .update({ deletado: true, deletado_em: new Date().toISOString() })
        .eq('id', id)
        .eq('sistema', false) // Só permite deletar categorias não-sistema

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todas-categorias'] })
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showToast.success('Categoria excluída com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao excluir categoria: ' + error.message)
    },
  })

  const categoriasPorTipo = {
    gasto: categorias.filter((c: any) => c.tipo === 'gasto'),
    parcela: categorias.filter((c: any) => c.tipo === 'parcela'),
    receita: categorias.filter((c: any) => c.tipo === 'receita'),
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando categorias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Categorias</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas categorias personalizadas
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDrawer(true)}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Categorias de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriasPorTipo.gasto.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Categorias de Parcelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriasPorTipo.parcela.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Categorias de Gastos */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Categorias de Gastos</h3>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categoriasPorTipo.gasto.map((categoria: any) => (
            <Card key={categoria.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{categoria.icone}</div>
                    <div>
                      <h4 className="font-medium">{categoria.nome}</h4>
                      {categoria.sistema && (
                        <p className="text-xs text-muted-foreground">Sistema</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setCategoriaEditando(categoria)
                        setShowEditDrawer(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!categoria.sistema && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta categoria?')) {
                            deleteMutation.mutate(categoria.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Categorias de Parcelas */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Categorias de Parcelas</h3>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categoriasPorTipo.parcela.map((categoria: any) => (
            <Card key={categoria.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{categoria.icone}</div>
                    <div>
                      <h4 className="font-medium">{categoria.nome}</h4>
                      {categoria.sistema && (
                        <p className="text-xs text-muted-foreground">Sistema</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setCategoriaEditando(categoria)
                        setShowEditDrawer(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!categoria.sistema && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta categoria?')) {
                            deleteMutation.mutate(categoria.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Drawer de Adicionar */}
      <Drawer open={showAddDrawer} onOpenChange={setShowAddDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Nova Categoria</DrawerTitle>
            <DrawerDescription>
              Crie uma categoria personalizada
            </DrawerDescription>
          </DrawerHeader>
          <CategoriaForm onClose={() => setShowAddDrawer(false)} />
        </DrawerContent>
      </Drawer>

      {/* Drawer de Editar */}
      <Drawer open={showEditDrawer} onOpenChange={setShowEditDrawer}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Categoria</DrawerTitle>
            <DrawerDescription>
              Atualize a categoria
            </DrawerDescription>
          </DrawerHeader>
          <CategoriaForm
            categoria={categoriaEditando}
            onClose={() => {
              setShowEditDrawer(false)
              setCategoriaEditando(null)
            }}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function CategoriaForm({ categoria, onClose }: { categoria?: any; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    nome: categoria?.nome || '',
    icone: categoria?.icone || '📦',
    cor: categoria?.cor || '#007AFF',
    tipo: categoria?.tipo || 'gasto'
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('categorias')
        .insert([{
          nome: data.nome,
          icone: data.icone,
          cor: data.cor,
          tipo: data.tipo,
          ativa: true,
          sistema: false,
          usuario_id: user.user.id,
          deletado: false
        }])

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todas-categorias'] })
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showToast.success('Categoria criada com sucesso!')
      onClose()
    },
    onError: (error: any) => {
      showToast.error('Erro ao criar categoria: ' + error.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('categorias')
        .update({
          nome: data.nome,
          icone: data.icone,
          cor: data.cor,
          tipo: data.tipo
        })
        .eq('id', categoria.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todas-categorias'] })
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showToast.success('Categoria atualizada com sucesso!')
      onClose()
    },
    onError: (error: any) => {
      showToast.error('Erro ao atualizar categoria: ' + error.message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Dados a serem enviados (categorias):', formData)
    
    if (categoria) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
  }

  const emojisSugeridos = ['🍔', '🚗', '🏥', '📚', '🎮', '👕', '🏠', '📦', '💰', '🔌', '📱', '🛋️', '🔨', '💳', '🎯', '🎁', '🛒', '✈️', '🏖️', '⛽']

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nome da Categoria *
        </label>
        <Input
          type="text"
          placeholder="Ex: Supermercado, Farmácia..."
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Ícone *
          </label>
          <Input
            type="text"
            placeholder="🏪"
            value={formData.icone}
            onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
            required
            maxLength={2}
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {emojisSugeridos.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData({ ...formData, icone: emoji })}
                className="text-xl p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Cor
          </label>
          <Input
            type="color"
            value={formData.cor}
            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Tipo *
        </label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          required
        >
          <option value="gasto">💸 Gasto</option>
          <option value="parcela">💳 Parcela</option>
          <option value="receita">💰 Receita</option>
        </select>
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
          disabled={createMutation.isPending || updateMutation.isPending}
          className="flex-1"
        >
          {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : (categoria ? 'Atualizar' : 'Criar')}
        </Button>
      </div>
    </form>
  )
}

