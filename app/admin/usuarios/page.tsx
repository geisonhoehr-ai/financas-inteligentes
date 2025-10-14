'use client'

import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Crown,
  Shield,
  User
} from 'lucide-react'
import { showToast } from '@/lib/toast'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AdminUsuariosPage() {
  const { 
    users, 
    isLoadingUsers, 
    updateUserPlan, 
    updateUserRole, 
    isUpdatingPlan, 
    isUpdatingRole,
    isSuperAdmin 
  } = useAdmin()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleUpdatePlan = async (userId: string, currentRole: string) => {
    try {
      const newPlan = currentRole === 'user' ? 'pro' : 'free'
      await updateUserPlan({ userId, plan: newPlan })
      showToast.success(`Plano alterado para ${newPlan === 'pro' ? 'Pro' : 'Gratuito'}`)
    } catch (error) {
      showToast.error('Erro ao alterar plano do usuário')
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ userId, role: newRole })
      showToast.success(`Role alterado para ${newRole}`)
    } catch (error) {
      showToast.error('Erro ao alterar role do usuário')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'admin':
        return 'Admin'
      default:
        return 'Usuário'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
      case 'admin':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  if (isLoadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando usuários...</p>
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
            Gerenciar Usuários
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie todos os usuários do sistema
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os roles</SelectItem>
                    <SelectItem value="user">Usuários</SelectItem>
                    <SelectItem value="admin">Administradores</SelectItem>
                    {isSuperAdmin && (
                      <SelectItem value="super_admin">Super Admins</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Usuários ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'user' 
                          ? 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
                          : 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {user.role === 'user' ? 'Gratuito' : 'Pro'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.last_sign_in_at ? (
                        formatDistanceToNow(new Date(user.last_sign_in_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })
                      ) : (
                        <span className="text-muted-foreground">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(user.created_at), { 
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
                          <DropdownMenuItem
                            onClick={() => handleUpdatePlan(user.user_id, user.role)}
                            disabled={isUpdatingPlan}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            {user.role === 'user' ? 'Tornar Pro' : 'Tornar Gratuito'}
                          </DropdownMenuItem>
                          
                          {isSuperAdmin && (
                            <>
                              {user.role !== 'admin' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateRole(user.user_id, 'admin')}
                                  disabled={isUpdatingRole}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Tornar Admin
                                </DropdownMenuItem>
                              )}
                              
                              {user.role !== 'super_admin' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateRole(user.user_id, 'super_admin')}
                                  disabled={isUpdatingRole}
                                >
                                  <Crown className="h-4 w-4 mr-2" />
                                  Tornar Super Admin
                                </DropdownMenuItem>
                              )}
                              
                              {user.role !== 'user' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateRole(user.user_id, 'user')}
                                  disabled={isUpdatingRole}
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  Remover Admin
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum usuário encontrado com os filtros aplicados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
