'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import { useFamilias } from '@/hooks/use-familias'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import { useConvites } from '@/hooks/use-convites'
import { LimitChecker } from '@/components/limit-checker'
import { Users, Building, UserPlus, Copy, Settings, Shield, Share2, Check } from 'lucide-react'
import { showToast } from '@/lib/toast'

export default function ConfiguracoesPage() {
  const { familias, isLoading, createFamilia, updateFamilia, generateInviteCode, useMembros, deleteFamilia } = useFamilias()
  const { familiaAtivaId, setFamiliaAtivaId } = useFamiliaAtiva()
  const familiaAtualId = familiaAtivaId
  const { data: membros = [] } = useMembros(familiaAtualId)
  const { convites, createConvite, isCreating, gerarLinkConvite } = useConvites(familiaAtualId || undefined)
  const [showNewFamilia, setShowNewFamilia] = useState(false)
  const [showConvites, setShowConvites] = useState(false)
  const [novaFamilia, setNovaFamilia] = useState({
    nome: '',
    modo_calculo: 'familiar' as 'familiar' | 'individual'
  })
  const [novoConvite, setNovoConvite] = useState({
    max_usos: null as number | null,
    dias_validade: 7
  })

  const handleCreateFamilia = () => {
    // TODO: Get admin_id from auth context (useAuth hook)
    createFamilia({
      nome: novaFamilia.nome,
      modo_calculo: novaFamilia.modo_calculo,
      // admin_id será definido automaticamente pelo backend via auth.uid()
    })
    setNovaFamilia({ nome: '', modo_calculo: 'familiar' })
    setShowNewFamilia(false)
  }

  const handleCreateConvite = () => {
    if (!familiaAtualId) {
      showToast.error('Selecione uma família primeiro')
      return
    }

    const validade = novoConvite.dias_validade
      ? new Date(Date.now() + novoConvite.dias_validade * 24 * 60 * 60 * 1000).toISOString()
      : null

    createConvite({
      familia_id: familiaAtualId,
      max_usos: novoConvite.max_usos,
      validade,
    })
    setNovoConvite({ max_usos: null, dias_validade: 7 })
  }

  const copyInviteLink = (codigo: string) => {
    const link = gerarLinkConvite(codigo)
    navigator.clipboard.writeText(link)
    showToast.success(`Link copiado: ${link}`)
  }

  const copyInviteCode = (codigo: string | null) => {
    if (!codigo) return
    navigator.clipboard.writeText(codigo)
    showToast.success(`Código copiado: ${codigo}`)
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie famílias, empresas e membros
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Famílias</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {familias.filter(f => f.modo_calculo === 'familiar').length}
            </div>
            <p className="text-xs text-muted-foreground">Grupos familiares</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {familias.filter(f => f.modo_calculo === 'individual').length}
            </div>
            <p className="text-xs text-muted-foreground">Controle empresarial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Totais</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {membros.length}
            </div>
            <p className="text-xs text-muted-foreground">Na família atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Familias/Empresas List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold">Minhas Famílias e Empresas</h3>
          <LimitChecker type="families" current={familias.length}>
            <Button onClick={() => setShowNewFamilia(!showNewFamilia)}>
              <Users className="h-4 w-4 mr-2" />
              Nova Família/Empresa
            </Button>
          </LimitChecker>
        </div>

        {/* Formulário Nova Família */}
        {showNewFamilia && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Criar Nova Família/Empresa</CardTitle>
              <CardDescription>
                Crie um grupo familiar ou empresa para compartilhar finanças
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={novaFamilia.nome}
                  onChange={(e) => setNovaFamilia({ ...novaFamilia, nome: e.target.value })}
                  placeholder="Ex: Família Silva, Empresa XYZ"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNovaFamilia({ ...novaFamilia, modo_calculo: 'familiar' })}
                    className={`h-12 rounded-xl border-2 font-medium transition-all ${
                      novaFamilia.modo_calculo === 'familiar'
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm scale-95'
                        : 'border-input hover:border-muted-foreground/50 hover:bg-muted/50'
                    }`}
                  >
                    <Users className="h-4 w-4 inline mr-2" />
                    Família (Pote Comum)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNovaFamilia({ ...novaFamilia, modo_calculo: 'individual' })}
                    className={`h-12 rounded-xl border-2 font-medium transition-all ${
                      novaFamilia.modo_calculo === 'individual'
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm scale-95'
                        : 'border-input hover:border-muted-foreground/50 hover:bg-muted/50'
                    }`}
                  >
                    <Building className="h-4 w-4 inline mr-2" />
                    Empresa (Individual)
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {novaFamilia.modo_calculo === 'familiar' 
                    ? '💡 Pote Comum: Todos os salários somados, todos os gastos divididos'
                    : '💡 Individual: Cada um paga suas próprias contas'}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNewFamilia(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateFamilia}
                  disabled={!novaFamilia.nome}
                  className="flex-1"
                >
                  Criar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Famílias */}
        <div className="space-y-3">
          {familias.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma família cadastrada
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  Crie sua primeira família ou empresa para começar
                </p>
                <Button onClick={() => setShowNewFamilia(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Criar Família
                </Button>
              </CardContent>
            </Card>
          ) : (
            familias.map((familia) => (
              <Card key={familia.id} className={familiaAtualId === familia.id ? 'border-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {familia.modo_calculo === 'familiar' ? (
                          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-lg">{familia.nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            {familia.modo_calculo === 'familiar' ? '👨‍👩‍👧‍👦 Pote Comum' : '🏢 Individual'}
                          </p>
                        </div>
                      </div>
                      {familia.codigo_convite && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-lg">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <code className="text-sm font-mono">{familia.codigo_convite}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyInviteCode(familia.codigo_convite)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={familiaAtualId === familia.id ? 'default' : 'outline'}
                        onClick={() => setFamiliaAtivaId(familia.id)}
                      >
                        {familiaAtualId === familia.id ? 'Selecionada' : 'Selecionar'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Configurações da Família</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const novoNome = prompt('Digite o novo nome da família:', familia.nome)
                              if (novoNome && novoNome !== familia.nome) {
                                updateFamilia({
                                  id: familia.id,
                                  nome: novoNome,
                                  modo_calculo: (familia.modo_calculo === 'familiar' || familia.modo_calculo === 'individual') ? familia.modo_calculo : undefined
                                })
                              }
                            }}
                          >
                            Editar Nome
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const novoModo = familia.modo_calculo === 'familiar' ? 'individual' : 'familiar'
                              if (confirm(`Deseja alterar o modo de cálculo para ${novoModo === 'familiar' ? 'Pote Comum' : 'Individual'}?`)) {
                                updateFamilia({
                                  id: familia.id,
                                  nome: familia.nome,
                                  modo_calculo: novoModo
                                })
                              }
                            }}
                          >
                            Alterar Modo de Cálculo
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja deletar esta família? Esta ação não pode ser desfeita.')) {
                                deleteFamilia(familia.id)
                              }
                            }}
                          >
                            Deletar Família
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Membros e Convites da Família */}
                  {familiaAtualId === familia.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* Membros */}
                      {membros.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Membros ({membros.length})</h5>
                          <div className="space-y-2">
                            {membros.map((membro: any) => (
                              <div key={membro.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-primary">
                                      {membro.usuario?.nome?.[0] || '?'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{membro.usuario?.nome || 'Usuário'}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {membro.papel} • {membro.usuario?.tipo || 'pessoa'}
                                    </p>
                                  </div>
                                </div>
                                {membro.papel === 'admin' && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                                    Admin
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Convites */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium">Convites ({Array.isArray(convites) ? convites.length : 0})</h5>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowConvites(!showConvites)}
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Gerar Convite
                          </Button>
                        </div>

                        {/* Formulário Novo Convite */}
                        {showConvites && (
                          <Card className="mb-3">
                            <CardContent className="p-4 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-xs font-medium">Máx. Usos</label>
                                  <Input
                                    type="number"
                                    placeholder="Ilimitado"
                                    value={novoConvite.max_usos || ''}
                                    onChange={(e) => setNovoConvite({
                                      ...novoConvite,
                                      max_usos: e.target.value ? parseInt(e.target.value) : null
                                    })}
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-medium">Validade (dias)</label>
                                  <Input
                                    type="number"
                                    value={novoConvite.dias_validade}
                                    onChange={(e) => setNovoConvite({
                                      ...novoConvite,
                                      dias_validade: parseInt(e.target.value) || 7
                                    })}
                                    className="h-9"
                                  />
                                </div>
                              </div>
                              <Button
                                onClick={handleCreateConvite}
                                disabled={isCreating}
                                className="w-full h-9"
                                size="sm"
                              >
                                {isCreating ? 'Criando...' : 'Criar Convite'}
                              </Button>
                            </CardContent>
                          </Card>
                        )}

                        {/* Lista de Convites */}
                        <div className="space-y-2">
                          {convites.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-2">
                              Nenhum convite ativo
                            </p>
                          ) : (
                            convites.map((convite) => (
                              <div key={convite.id} className="p-3 rounded-lg bg-muted/50 border">
                                <div className="flex items-center justify-between mb-2">
                                  <code className="text-sm font-mono font-semibold">{convite.codigo}</code>
                                  <div className="flex items-center gap-1">
                                    {convite.ativo ? (
                                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                        Ativo
                                      </span>
                                    ) : (
                                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                                        Inativo
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                  <span>Usos: {convite.usos_atual}/{convite.max_usos || '∞'}</span>
                                  {convite.validade && (
                                    <span>Expira: {new Date(convite.validade).toLocaleDateString()}</span>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyInviteLink(convite.codigo)}
                                  className="w-full h-8"
                                >
                                  <Share2 className="h-3 w-3 mr-1" />
                                  Copiar Link
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">👨‍👩‍👧‍👦 Modo Familiar</CardTitle>
            <CardDescription>Pote Comum - Ideal para famílias</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>✅ Todos os salários somados</p>
            <p>✅ Todos os gastos vêm do pote comum</p>
            <p>✅ Cada membro pode adicionar gastos</p>
            <p>✅ Dashboard unificado da família</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🏢 Modo Individual</CardTitle>
            <CardDescription>Individual - Ideal para empresas</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>✅ Cada usuário tem seu próprio saldo</p>
            <p>✅ Gastos individuais separados</p>
            <p>✅ Possibilidade de transferências internas</p>
            <p>✅ Relatórios por pessoa/departamento</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

