'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  MoreHorizontal, 
  Building, 
  Users,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react'
import { showToast } from '@/lib/toast'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Familia {
  id: string
  nome: string
  modo_calculo: 'familiar' | 'individual'
  admin_id: string
  created_at: string
  admin_email?: string
  membros_count?: number
}

export default function AdminFamiliasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState('all')

  const { data: familias = [], isLoading } = useQuery({
    queryKey: ['admin-familias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('familias')
        .select(`
          *,
          admin:admin_id (
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Buscar contagem de membros para cada família
      const familiasComMembros = await Promise.all(
        (data as any[]).map(async (familia) => {
          const { count } = await supabase
            .from('familia_membros')
            .select('*', { count: 'exact', head: true })
            .eq('familia_id', familia.id)

          return {
            ...familia,
            admin_email: familia.admin?.email,
            membros_count: count || 0
          }
        })
      )

      return familiasComMembros as Familia[]
    },
  })

  const filteredFamilias = familias.filter(familia => {
    const matchesSearch = familia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         familia.admin_email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === 'all' || familia.modo_calculo === tipoFilter
    return matchesSearch && matchesTipo
  })

  const getTipoLabel = (tipo: string) => {
    return tipo === 'familiar' ? 'Família' : 'Empresa'
  }

  const getTipoColor = (tipo: string) => {
    return tipo === 'familiar' 
      ? 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
      : 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando famílias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Gerenciar Famílias
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie todas as famílias e empresas cadastradas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Famílias</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{familias.length}</div>
              <p className="text-xs text-muted-foreground">
                {familias.filter(f => f.modo_calculo === 'familiar').length} famílias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {familias.filter(f => f.modo_calculo === 'individual').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Controle empresarial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membros Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {familias.reduce((sum, f) => sum + (f.membros_count || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Em todas as famílias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome ou admin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="familiar">Famílias</option>
                  <option value="individual">Empresas</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Familias Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Famílias e Empresas ({filteredFamilias.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Membros</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFamilias.map((familia) => (
                  <TableRow key={familia.id}>
                    <TableCell className="font-medium">
                      {familia.nome}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(familia.modo_calculo)}`}>
                        {getTipoLabel(familia.modo_calculo)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{familia.admin_email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{familia.membros_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(familia.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Gerenciar Membros
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="h-4 w-4 mr-2" />
                            Suspender Família
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredFamilias.length === 0 && (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma família encontrada com os filtros aplicados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
