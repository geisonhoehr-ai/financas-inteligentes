'use client'

import { useState } from 'react'
import { useMesada } from '@/hooks/use-mesada'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { formatCurrency } from '@/lib/utils'
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Trophy, 
  Gift,
  AlertTriangle,
  Wallet,
  Award,
  HelpCircle,
  Info,
  Edit
} from 'lucide-react'

const AVATARES = ['👦', '👧', '🧒', '👶', '🧑', '👨', '👩', '😊', '😎', '🤓', '🥳', '😇']

export default function MesadaPage() {
  const { filhos, mesadas, tarefas, createFilho, createMesada, updateMesada, aplicarAjuste, pagarMesada, isCreating } = useMesada()
  const [showAddFilho, setShowAddFilho] = useState(false)
  const [showConfigMesada, setShowConfigMesada] = useState(false)
  const [showEditMesada, setShowEditMesada] = useState(false)
  const [showAjuste, setShowAjuste] = useState(false)
  const [filhoSelecionado, setFilhoSelecionado] = useState<string | null>(null)
  const [mesadaEditando, setMesadaEditando] = useState<any>(null)
  const [showGuia, setShowGuia] = useState(false)
  const [mesadasPagas, setMesadasPagas] = useState<Set<string>>(new Set())

  const getMesadaDoFilho = (filhoId: string) => {
    return mesadas.find(m => m.filho_id === filhoId)
  }

  const isMesadaPaga = (mesadaId: string) => {
    return mesadasPagas.has(mesadaId)
  }

  const handlePagarMesada = async (filhoId: string) => {
    const mesada = getMesadaDoFilho(filhoId)
    if (!mesada) return

    try {
      await pagarMesada(filhoId)
      // Marcar como paga visualmente
      setMesadasPagas(prev => new Set([...prev, mesada.id]))
      
      // Remover da lista após 3 segundos
      setTimeout(() => {
        setMesadasPagas(prev => {
          const newSet = new Set(prev)
          newSet.delete(mesada.id)
          return newSet
        })
      }, 3000)
    } catch (error) {
      console.error('Erro ao pagar mesada:', error)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header com Guia */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            Mesada Digital
          </h2>
          <p className="text-sm text-muted-foreground">
            Ensine educação financeira para seus filhos de forma divertida
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowGuia(true)}
          className="gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          Como Funciona?
        </Button>
      </div>

      {/* Guia Rápido (Sempre Visível) */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-primary">💡 Sistema de Mesada Inteligente</p>
              <p className="text-sm text-muted-foreground">
                Configure a mesada dos seus filhos, defina tarefas, dê bônus por bom comportamento 
                ou descontos por desobediência. Tudo gamificado com pontos, níveis e conquistas!
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowGuia(true)}
                className="h-auto p-0 text-primary"
              >
                Ver guia completo →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adicionar Filho */}
      {filhos.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comece Adicionando um Filho</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Crie perfis para seus filhos e configure a mesada digital deles
            </p>
            <Button 
              onClick={() => setShowAddFilho(true)}
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Filho
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de Filhos com Mesadas */}
      {filhos.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Seus Filhos</h3>
            <Button onClick={() => setShowAddFilho(true)} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Filho
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filhos.map((filho) => {
              const mesada = getMesadaDoFilho(filho.id)
              const nivel = mesada?.nivel || 1
              const xpAtual = mesada?.experiencia || 0
              const xpProximoNivel = Math.pow(nivel + 1, 2) * 100
              const progressoNivel = (xpAtual % xpProximoNivel) / xpProximoNivel * 100

              return (
                <Card key={filho.id} className={`overflow-hidden transition-all duration-500 ${
                  mesada && isMesadaPaga(mesada.id) 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950 shadow-lg shadow-green-500/20' 
                    : ''
                }`}>
                  <CardHeader className={`pb-3 transition-all duration-500 ${
                    mesada && isMesadaPaga(mesada.id)
                      ? 'bg-gradient-to-br from-green-500/20 to-green-400/10'
                      : 'bg-gradient-to-br from-primary/10 to-primary/5'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{filho.avatar}</span>
                        <div>
                          <CardTitle className="text-lg">{filho.nome}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {filho.idade ? `${filho.idade} anos` : 'Idade não definida'}
                          </p>
                        </div>
                      </div>
                      {mesada && (
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="h-4 w-4 fill-yellow-600" />
                            <span className="font-bold">Nv {nivel}</span>
                          </div>
                          {isMesadaPaga(mesada.id) && (
                            <div className="flex items-center gap-1 text-green-600 mt-1">
                              <Star className="h-3 w-3 fill-green-600" />
                              <span className="text-xs font-medium">Pago!</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-4">
                    {!mesada ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          Mesada não configurada
                        </p>
                        <Button
                          size="sm"
                          onClick={() => {
                            setFilhoSelecionado(filho.id)
                            setShowConfigMesada(true)
                          }}
                        >
                          Configurar Mesada
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* Saldo e Mesada */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Saldo Atual:</span>
                            <span className="text-xl font-bold text-green-600">
                              {formatCurrency(mesada.saldo_atual)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Mesada Mensal:</span>
                            <span className="text-sm font-medium">
                              {formatCurrency(mesada.valor_base)}
                            </span>
                          </div>
                        </div>

                        {/* Barra de Nível/XP */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>XP: {xpAtual}</span>
                            <span>Próximo nível: {xpProximoNivel}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                              style={{ width: `${progressoNivel}%` }}
                            />
                          </div>
                        </div>

                        {/* Pontos */}
                        <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                            {mesada.pontos_acumulados} pontos
                          </span>
                        </div>

                        {/* Ações */}
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setMesadaEditando(mesada)
                              setFilhoSelecionado(filho.id)
                              setShowEditMesada(true)
                            }}
                            className="text-xs"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setFilhoSelecionado(filho.id)
                              setShowAjuste(true)
                            }}
                            className="text-xs"
                          >
                            <Gift className="h-3 w-3 mr-1" />
                            +/-
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePagarMesada(filho.id)}
                            disabled={mesada && isMesadaPaga(mesada.id)}
                            className={`text-xs transition-all ${
                              mesada && isMesadaPaga(mesada.id)
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {mesada && isMesadaPaga(mesada.id) ? (
                              <>
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Pago!
                              </>
                            ) : (
                              <>
                                <Wallet className="h-3 w-3 mr-1" />
                                Pagar
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Drawer: Adicionar Filho */}
      <Drawer open={showAddFilho} onOpenChange={setShowAddFilho}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Adicionar Filho</DrawerTitle>
            <DrawerDescription>
              Crie um perfil para seu filho e comece a ensinar educação financeira
            </DrawerDescription>
          </DrawerHeader>
          <AddFilhoForm onClose={() => setShowAddFilho(false)} />
        </DrawerContent>
      </Drawer>

      {/* Drawer: Configurar Mesada */}
      <Drawer open={showConfigMesada} onOpenChange={setShowConfigMesada}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Configurar Mesada</DrawerTitle>
            <DrawerDescription>
              Defina o valor e regras da mesada
            </DrawerDescription>
          </DrawerHeader>
          <ConfigMesadaForm 
            filhoId={filhoSelecionado} 
            onClose={() => {
              setShowConfigMesada(false)
              setFilhoSelecionado(null)
            }} 
          />
        </DrawerContent>
      </Drawer>

      {/* Drawer: Editar Mesada */}
      <Drawer open={showEditMesada} onOpenChange={setShowEditMesada}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Editar Mesada</DrawerTitle>
            <DrawerDescription>
              Altere o valor base, dia de pagamento ou meta de economia
            </DrawerDescription>
          </DrawerHeader>
          <EditMesadaForm 
            mesada={mesadaEditando}
            filhoId={filhoSelecionado}
            onClose={() => {
              setShowEditMesada(false)
              setFilhoSelecionado(null)
              setMesadaEditando(null)
            }} 
          />
        </DrawerContent>
      </Drawer>

      {/* Drawer: Aplicar Ajuste */}
      <Drawer open={showAjuste} onOpenChange={setShowAjuste}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Bônus ou Desconto</DrawerTitle>
            <DrawerDescription>
              Dê recompensas ou aplique penalidades
            </DrawerDescription>
          </DrawerHeader>
          <AjusteForm 
            filhoId={filhoSelecionado}
            mesadaId={mesadas.find(m => m.filho_id === filhoSelecionado)?.id}
            onClose={() => {
              setShowAjuste(false)
              setFilhoSelecionado(null)
            }} 
          />
        </DrawerContent>
      </Drawer>

      {/* Modal: Guia Completo */}
      <Drawer open={showGuia} onOpenChange={setShowGuia}>
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="text-2xl">📚 Guia: Sistema de Mesada Digital</DrawerTitle>
            <DrawerDescription>
              Como funciona e como usar o sistema de mesada gamificado
            </DrawerDescription>
          </DrawerHeader>
          <GuiaCompleto onClose={() => setShowGuia(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

// Componente: Formulário Adicionar Filho
function AddFilhoForm({ onClose }: { onClose: () => void }) {
  const { createFilho } = useMesada()
  const { familiaAtivaId } = useFamiliaAtiva()
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    idade: '',
    avatar: '👦'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== DEBUG ADD FILHO ===')
    console.log('familiaAtivaId:', familiaAtivaId)
    console.log('formData:', formData)
    
    if (!familiaAtivaId) {
      console.error('Família ativa não selecionada!')
      alert('Por favor, selecione uma família primeiro.')
      return
    }

    const filhoData = {
      nome: formData.nome,
      data_nascimento: formData.data_nascimento || undefined,
      idade: formData.idade ? parseInt(formData.idade) : undefined,
      avatar: formData.avatar,
      familia_id: familiaAtivaId,
      ativo: true
    }

    console.log('Dados a serem enviados (criar filho):', filhoData)

    try {
      const result = await createFilho(filhoData as any)
      console.log('Filho criado com sucesso:', result)
      onClose()
    } catch (error) {
      console.error('Erro ao criar filho:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao criar filho: ${errorMessage}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Avatar</Label>
        <div className="grid grid-cols-6 gap-2">
          {AVATARES.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => setFormData({ ...formData, avatar })}
              className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                formData.avatar === avatar ? 'border-primary bg-primary/10' : 'border-border'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Ex: João, Maria..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="idade">Idade</Label>
          <Input
            id="idade"
            type="number"
            min="1"
            max="25"
            value={formData.idade}
            onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
            placeholder="Ex: 10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nascimento">Data de Nascimento</Label>
          <Input
            id="nascimento"
            type="date"
            value={formData.data_nascimento}
            onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Adicionar Filho
        </Button>
      </div>
    </form>
  )
}

// Componente: Editar Mesada
function EditMesadaForm({ mesada, filhoId, onClose }: { mesada: any; filhoId: string | null; onClose: () => void }) {
  const { updateMesada, filhos, isUpdating } = useMesada()
  const [formData, setFormData] = useState({
    valor_base: mesada?.valor_base?.toString() || '',
    dia_pagamento: mesada?.dia_pagamento?.toString() || '1',
    meta_economia: mesada?.meta_economia?.toString() || ''
  })

  const filho = filhos.find(f => f.id === filhoId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mesada?.id) return

    const mesadaData = {
      id: mesada.id,
      valor_base: parseFloat(formData.valor_base),
      dia_pagamento: parseInt(formData.dia_pagamento),
      meta_economia: formData.meta_economia ? parseFloat(formData.meta_economia) : undefined,
    }

    console.log('Dados a serem enviados (atualizar mesada):', mesadaData)

    try {
      await updateMesada(mesadaData as any)
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar mesada:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="p-3 rounded-lg bg-primary/10 text-sm">
        <p className="font-medium text-primary">Editando mesada de: {filho?.nome} {filho?.avatar}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor">Valor da Mesada Mensal *</Label>
        <Input
          id="valor"
          type="number"
          step="0.01"
          value={formData.valor_base}
          onChange={(e) => setFormData({ ...formData, valor_base: e.target.value })}
          placeholder="Ex: 100.00"
          required
        />
        <p className="text-xs text-muted-foreground">
          💡 Valor atual: R$ {mesada?.valor_base?.toFixed(2)}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dia">Dia do Pagamento</Label>
        <Input
          id="dia"
          type="number"
          min="1"
          max="31"
          value={formData.dia_pagamento}
          onChange={(e) => setFormData({ ...formData, dia_pagamento: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta">Meta de Economia (opcional)</Label>
        <Input
          id="meta"
          type="number"
          step="0.01"
          value={formData.meta_economia}
          onChange={(e) => setFormData({ ...formData, meta_economia: e.target.value })}
          placeholder="Ex: 50.00"
        />
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Atenção:</strong> Alterar o valor base não afeta o saldo atual do filho. 
          A mudança valerá a partir do próximo pagamento.
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isUpdating} className="flex-1">
          {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}

// Componente: Configurar Mesada
function ConfigMesadaForm({ filhoId, onClose }: { filhoId: string | null; onClose: () => void }) {
  const { createMesada, filhos } = useMesada()
  const { familiaAtivaId } = useFamiliaAtiva()
  const [formData, setFormData] = useState({
    valor_base: '',
    dia_pagamento: '1',
    meta_economia: ''
  })

  const filho = filhos.find(f => f.id === filhoId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!filhoId || !familiaAtivaId) return

    try {
      await createMesada({
        filho_id: filhoId,
        valor_base: parseFloat(formData.valor_base),
        periodicidade: 'mensal',
        dia_pagamento: parseInt(formData.dia_pagamento),
        meta_economia: formData.meta_economia ? parseFloat(formData.meta_economia) : undefined,
        familia_id: familiaAtivaId,
        ativo: true
      } as any)
      onClose()
    } catch (error) {
      console.error('Erro ao configurar mesada:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="p-3 rounded-lg bg-primary/10 text-sm">
        <p className="font-medium text-primary">Configurando mesada para: {filho?.nome}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor">Valor da Mesada Mensal *</Label>
        <Input
          id="valor"
          type="number"
          step="0.01"
          value={formData.valor_base}
          onChange={(e) => setFormData({ ...formData, valor_base: e.target.value })}
          placeholder="Ex: 100.00"
          required
        />
        <p className="text-xs text-muted-foreground">
          💡 Sugestão: R$ 1 por ano de idade (10 anos = R$ 10/mês)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dia">Dia do Pagamento</Label>
        <Input
          id="dia"
          type="number"
          min="1"
          max="31"
          value={formData.dia_pagamento}
          onChange={(e) => setFormData({ ...formData, dia_pagamento: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Dia do mês que a mesada será creditada
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta">Meta de Economia (opcional)</Label>
        <Input
          id="meta"
          type="number"
          step="0.01"
          value={formData.meta_economia}
          onChange={(e) => setFormData({ ...formData, meta_economia: e.target.value })}
          placeholder="Ex: 50.00"
        />
        <p className="text-xs text-muted-foreground">
          Ensine a poupar! Sugira uma meta de economia mensal
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Salvar Configuração
        </Button>
      </div>
    </form>
  )
}

// Componente: Aplicar Ajuste (Bônus/Penalidade)
function AjusteForm({ filhoId, mesadaId, onClose }: { filhoId: string | null; mesadaId?: string; onClose: () => void }) {
  const { aplicarAjuste, filhos } = useMesada()
  const [tipo, setTipo] = useState<'bonus' | 'penalidade'>('bonus')
  const [formData, setFormData] = useState({
    motivo: '',
    valor: '',
    pontos: ''
  })

  const filho = filhos.find(f => f.id === filhoId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== DEBUG AJUSTE ===')
    console.log('filhoId:', filhoId)
    console.log('mesadaId:', mesadaId)
    console.log('formData:', formData)
    console.log('tipo:', tipo)
    
    if (!filhoId || !mesadaId) {
      console.error('Filho ou mesada não identificados!')
      alert('Erro: Filho ou mesada não identificados. Por favor, configure a mesada do filho primeiro.')
      return
    }

    try {
      const valorFinal = tipo === 'penalidade' ? -Math.abs(parseFloat(formData.valor)) : Math.abs(parseFloat(formData.valor))
      const pontosFinal = tipo === 'penalidade' ? -Math.abs(parseInt(formData.pontos || '0')) : Math.abs(parseInt(formData.pontos || '0'))

      const ajusteData = {
        mesada_id: mesadaId,
        filho_id: filhoId,
        tipo,
        motivo: formData.motivo,
        valor: valorFinal,
        pontos: pontosFinal
      }

      console.log('Dados do ajuste a serem enviados:', ajusteData)

      await aplicarAjuste(ajusteData)
      console.log('Ajuste aplicado com sucesso!')
      onClose()
    } catch (error) {
      console.error('Erro ao aplicar ajuste:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao aplicar ajuste: ${errorMessage}`)
    }
  }

  const sugestoesBônus = [
    { motivo: 'Tirou nota boa', valor: 20, pontos: 50 },
    { motivo: 'Ajudou em casa', valor: 10, pontos: 30 },
    { motivo: 'Comportamento exemplar', valor: 15, pontos: 40 },
    { motivo: 'Completou todas tarefas', valor: 25, pontos: 60 },
  ]

  const sugestoesPenalidade = [
    { motivo: 'Não fez lição de casa', valor: -10, pontos: -20 },
    { motivo: 'Desobedeceu', valor: -15, pontos: -30 },
    { motivo: 'Nota vermelha', valor: -20, pontos: -40 },
    { motivo: 'Comportamento inadequado', valor: -10, pontos: -25 },
  ]

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="p-3 rounded-lg bg-primary/10">
        <p className="font-medium text-primary">Para: {filho?.nome} {filho?.avatar}</p>
      </div>

      {/* Tipo: Bônus ou Penalidade */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant={tipo === 'bonus' ? 'default' : 'outline'}
          onClick={() => setTipo('bonus')}
          className="h-auto py-3 flex-col gap-1"
        >
          <Gift className="h-5 w-5" />
          <span className="text-sm">Bônus</span>
        </Button>
        <Button
          type="button"
          variant={tipo === 'penalidade' ? 'default' : 'outline'}
          onClick={() => setTipo('penalidade')}
          className="h-auto py-3 flex-col gap-1"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm">Penalidade</span>
        </Button>
      </div>

      {/* Sugestões Rápidas */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Sugestões rápidas:</Label>
        <div className="grid grid-cols-1 gap-2">
          {(tipo === 'bonus' ? sugestoesBônus : sugestoesPenalidade).map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFormData({
                motivo: sug.motivo,
                valor: Math.abs(sug.valor).toString(),
                pontos: Math.abs(sug.pontos).toString()
              })}
              className="text-left p-2 rounded-lg border hover:border-primary/50 transition-all text-sm"
            >
              <div className="flex justify-between items-center">
                <span>{sug.motivo}</span>
                <span className={`font-medium ${tipo === 'bonus' ? 'text-green-600' : 'text-red-600'}`}>
                  {tipo === 'bonus' ? '+' : ''}{formatCurrency(sug.valor)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo *</Label>
        <Input
          id="motivo"
          value={formData.motivo}
          onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
          placeholder={tipo === 'bonus' ? 'Ex: Tirou nota 10' : 'Ex: Não fez lição'}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valor">Valor (R$) *</Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pontos">Pontos</Label>
          <Input
            id="pontos"
            type="number"
            value={formData.pontos}
            onChange={(e) => setFormData({ ...formData, pontos: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      <div className={`p-3 rounded-lg ${tipo === 'bonus' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
        <p className="text-sm font-medium">
          {tipo === 'bonus' ? '✅ Bônus:' : '⚠️ Penalidade:'}
        </p>
        <p className={`text-lg font-bold ${tipo === 'bonus' ? 'text-green-600' : 'text-red-600'}`}>
          {tipo === 'bonus' ? '+' : '-'}{formatCurrency(parseFloat(formData.valor || '0'))}
          {formData.pontos && ` | ${tipo === 'bonus' ? '+' : '-'}${formData.pontos} pontos`}
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className={`flex-1 ${tipo === 'bonus' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          Aplicar {tipo === 'bonus' ? 'Bônus' : 'Penalidade'}
        </Button>
      </div>
    </form>
  )
}

// Componente: Guia Completo
function GuiaCompleto({ onClose }: { onClose?: () => void }) {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          Como Funciona o Sistema de Mesada
        </h3>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. 👶 Crie Perfis para seus Filhos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Adicione cada filho com nome, idade e avatar</p>
            <p>• Cada filho terá sua própria &quot;carteira digital&quot;</p>
            <p>• Sistema acompanha evolução individual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. 💰 Configure a Mesada Mensal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Valor Base:</strong> Quanto o filho recebe por mês</p>
            <p><strong>Sugestão:</strong> R$ 1,00 por ano de idade (10 anos = R$ 10/mês)</p>
            <p><strong>Dia de Pagamento:</strong> Quando o dinheiro cai na carteira</p>
            <p><strong>Meta de Economia:</strong> Incentive poupar (ex: 30% da mesada)</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              3. 🎁 Sistema de Bônus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium text-green-600">Use bônus para RECOMPENSAR:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Tirou nota boa (+R$ 20)</li>
              <li>Ajudou em casa (+R$ 10)</li>
              <li>Comportamento exemplar (+R$ 15)</li>
              <li>Completou todas tarefas (+R$ 25)</li>
              <li>Fez algo especial (+R$ 30)</li>
            </ul>
            <p className="text-xs italic mt-2">💡 Dica: Sempre explique POR QUE está dando o bônus!</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              4. ⚠️ Sistema de Penalidades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium text-red-600">Use descontos para ENSINAR:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Não fez lição (-R$ 10)</li>
              <li>Desobedeceu (-R$ 15)</li>
              <li>Nota vermelha (-R$ 20)</li>
              <li>Não cumpriu combinados (-R$ 10)</li>
            </ul>
            <p className="text-xs italic mt-2 text-red-600">⚠️ Importante: Use com moderação e sempre converse!</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              5. 🎮 Gamificação (Pontos e Níveis)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Pontos (XP):</strong> Ganhe completando tarefas e tendo bom comportamento</p>
            <p><strong>Níveis:</strong> Sobe de nível conforme ganha XP</p>
            <p><strong>Conquistas:</strong> Badges especiais por feitos</p>
            <p className="text-xs text-muted-foreground mt-2">
              Quanto mais alto o nível, mais privilégios pode ter!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">6. 📊 Acompanhamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Veja saldo em tempo real</p>
            <p>• Acompanhe gastos do filho</p>
            <p>• Monitore economia mensal</p>
            <p>• Histórico completo de movimentações</p>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 rounded-xl">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Dicas de Ouro para Pais:
          </h4>
          <ul className="space-y-2 text-sm">
            <li>✅ Seja consistente com dia de pagamento</li>
            <li>✅ Explique sempre o motivo de bônus/penalidades</li>
            <li>✅ Incentive a economia com metas</li>
            <li>✅ Comemore conquistas juntos</li>
            <li>✅ Revise gastos semanalmente com o filho</li>
            <li>✅ Use como ferramenta educativa, não punitiva</li>
            <li>✅ Ajuste valores conforme filho cresce</li>
          </ul>
        </div>
      </div>

      {onClose && (
        <Button onClick={onClose} className="w-full">
          Entendi! Vamos Começar
        </Button>
      )}
    </div>
  )
}

// Hook necessário
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'

