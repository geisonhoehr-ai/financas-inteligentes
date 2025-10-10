'use client'

import { useState } from 'react'
import { useModoEconomia } from '@/hooks/use-modo-economia'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { formatCurrency } from '@/lib/utils'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { 
  TrendingDown, 
  Target, 
  Trophy, 
  Flame,
  CheckCircle,
  Plus,
  Calendar,
  Users
} from 'lucide-react'
import { differenceInDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GuiaAjuda } from '@/components/guia-ajuda'

export default function ModoEconomiaPage() {
  const { desafiosAtivos, createDesafio, registrarProgresso, isCreating } = useModoEconomia()
  const { familiaAtivaId } = useFamiliaAtiva()
  const [showCreateDesafio, setShowCreateDesafio] = useState(false)

  const desafioAtual = desafiosAtivos[0] // Desafio mais recente

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Flame className="h-8 w-8 text-orange-500" />
            Modo Economia
          </h2>
          <p className="text-sm text-muted-foreground">
            Desafios familiares para economizar juntos
          </p>
        </div>
        {!desafioAtual && (
          <Button 
            onClick={() => setShowCreateDesafio(true)}
            className="h-12 rounded-xl bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Criar Desafio
          </Button>
        )}
      </div>

      {/* Guia */}
      <GuiaAjuda
        titulo="🔥 Modo Economia - Como Funciona"
        topicos={[
          {
            titulo: '🎯 O que é?',
            conteudo: 'Quando a família precisa economizar, crie um desafio! Defina meta, prazo e prêmio. Todo mundo participa e vê o progresso em tempo real.',
            icone: '🎯'
          },
          {
            titulo: '👨‍👩‍👧‍👦 Família Junta',
            conteudo: 'Todos contribuem para a meta. Sistema gamifica a economia, tornando divertido apertar o cinto!',
            icone: '👨‍👩‍👧‍👦'
          },
          {
            titulo: '🏆 Prêmios',
            conteudo: 'Ao alcançar a meta, a família ganha o prêmio combinado! Ex: Pizza, passeio, dia especial.',
            icone: '🏆'
          }
        ]}
      />

      {/* Desafio Ativo */}
      {desafioAtual ? (
        <>
          {/* Card Principal do Desafio */}
          <Card className="border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-red-500/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Flame className="h-6 w-6 text-orange-500" />
                    {desafioAtual.nome}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {desafioAtual.descricao}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-medium">
                    🔥 ATIVO
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progresso */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Meta de Economia:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(desafioAtual.meta_economia || 0)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="h-4 rounded-full bg-gradient-to-r from-orange-500 to-green-500 transition-all"
                      style={{ 
                        width: `${Math.min(100, ((desafioAtual.economia_total || 0) / (desafioAtual.meta_economia || 1)) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-orange-600">
                      {formatCurrency(desafioAtual.economia_total || 0)} economizados
                    </span>
                    <span className="text-muted-foreground">
                      {(((desafioAtual.economia_total || 0) / (desafioAtual.meta_economia || 1)) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Info do Desafio */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-background border">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Início</p>
                  <p className="font-semibold text-sm">
                    {format(new Date(desafioAtual.data_inicio), 'dd/MM')}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-background border">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                  <p className="text-xs text-muted-foreground">Fim</p>
                  <p className="font-semibold text-sm">
                    {format(new Date(desafioAtual.data_fim), 'dd/MM')}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-background border">
                  <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-xs text-muted-foreground">Participantes</p>
                  <p className="font-semibold text-sm">{desafioAtual.participantes || 0}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-background border">
                  <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                  <p className="text-xs text-muted-foreground">Dias Restantes</p>
                  <p className="font-semibold text-sm">
                    {Math.max(0, differenceInDays(new Date(desafioAtual.data_fim), new Date()))}
                  </p>
                </div>
              </div>

              {/* Prêmio */}
              {desafioAtual.premio && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Prêmio ao Completar:</p>
                      <p className="font-bold text-lg">{desafioAtual.premio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const economia = prompt('Quanto economizou hoje?')
                    if (economia) {
                      registrarProgresso({
                        desafioId: desafioAtual.id,
                        economiaDia: parseFloat(economia),
                        observacoes: 'Economia diária'
                      })
                    }
                  }}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Economia
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Flame className="h-16 w-16 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Crie um Desafio de Economia</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Una a família em um desafio para economizar! Defina meta, prazo e prêmio. 
              Todos participam e veem o progresso juntos.
            </p>
            <Button 
              onClick={() => setShowCreateDesafio(true)}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar Primeiro Desafio
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Drawer: Criar Desafio */}
      <Drawer open={showCreateDesafio} onOpenChange={setShowCreateDesafio}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Criar Desafio de Economia</DrawerTitle>
            <DrawerDescription>
              Defina uma meta de economia para a família alcançar juntos
            </DrawerDescription>
          </DrawerHeader>
          <CreateDesafioForm onClose={() => setShowCreateDesafio(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function CreateDesafioForm({ onClose }: { onClose: () => void }) {
  const { createDesafio, isCreating } = useModoEconomia()
  const { familiaAtivaId } = useFamiliaAtiva()
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    meta_economia: '',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: '',
    premio: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!familiaAtivaId) return

    try {
      await createDesafio({
        familia_id: familiaAtivaId,
        nome: formData.nome,
        descricao: formData.descricao,
        tipo: 'economia',
        meta_economia: parseFloat(formData.meta_economia),
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        premio: formData.premio,
        ativo: true,
        concluido: false
      } as any)
      onClose()
    } catch (error) {
      console.error('Erro ao criar desafio:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Desafio *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Ex: Mês Sem Delivery, Outubro Econômico..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta">Meta de Economia (R$) *</Label>
        <Input
          id="meta"
          type="number"
          step="0.01"
          value={formData.meta_economia}
          onChange={(e) => setFormData({ ...formData, meta_economia: e.target.value })}
          placeholder="Ex: 1000.00"
          required
        />
        <p className="text-xs text-muted-foreground">
          💡 Quanto a família quer economizar no período?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inicio">Data Início *</Label>
          <Input
            id="inicio"
            type="date"
            value={formData.data_inicio}
            onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fim">Data Fim *</Label>
          <Input
            id="fim"
            type="date"
            value={formData.data_fim}
            onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="premio">Prêmio (opcional)</Label>
        <Input
          id="premio"
          value={formData.premio}
          onChange={(e) => setFormData({ ...formData, premio: e.target.value })}
          placeholder="Ex: Pizza em família, Passeio no parque..."
        />
        <p className="text-xs text-muted-foreground">
          🎁 O que a família ganha se alcançar a meta?
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Ex: Vamos apertar o cinto este mês..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isCreating} className="flex-1 bg-orange-500 hover:bg-orange-600">
          {isCreating ? 'Criando...' : 'Criar Desafio'}
        </Button>
      </div>
    </form>
  )
}

