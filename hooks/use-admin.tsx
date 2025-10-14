'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface UserRole {
  id: string
  user_id: string
  role: 'user' | 'admin' | 'super_admin'
  created_at: string
  updated_at: string
  email?: string
}

export interface AdminStats {
  total_users: number
  total_families: number
  active_users: number
  pro_users: number
  free_users: number
  monthly_revenue: number
}

export function useAdmin() {
  const queryClient = useQueryClient()

  // Verificar se usuário atual é admin
  const { data: isAdmin, isLoading: isLoadingAdmin } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_admin')
      if (error) throw error
      return data as boolean
    },
  })

  // Verificar se usuário atual é super admin
  const { data: isSuperAdmin, isLoading: isLoadingSuperAdmin } = useQuery({
    queryKey: ['super-admin-check'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_super_admin')
      if (error) throw error
      return data as boolean
    },
  })

  // Obter role do usuário atual
  const { data: userRole } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_role')
      if (error) throw error
      return data as string
    },
  })

  // Listar todos os usuários (apenas para admins)
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_user_info')

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        throw error
      }

      return (data as any[]).map(item => ({
        id: item.user_id,
        user_id: item.user_id,
        role: item.user_role,
        created_at: item.created_at,
        updated_at: item.updated_at,
        email: item.email,
        last_sign_in_at: null // Não disponível por segurança
      })) as UserRole[]
    },
    enabled: !!isAdmin,
  })

  // Obter estatísticas do sistema
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        // Total de usuários
        const { count: totalUsers } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })

        // Total de famílias
        const { count: totalFamilies } = await supabase
          .from('familias')
          .select('*', { count: 'exact', head: true })

        // Usuários Pro (simplificado - assumindo que todos com role diferente de 'user' são Pro)
        const { count: proUsers } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .not('role', 'eq', 'user')

        return {
          total_users: totalUsers || 0,
          total_families: totalFamilies || 0,
          active_users: totalUsers || 0, // Simplificado
          pro_users: proUsers || 0,
          free_users: (totalUsers || 0) - (proUsers || 0),
          monthly_revenue: 0, // TODO: Implementar cálculo de receita
        } as AdminStats
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
        return {
          total_users: 0,
          total_families: 0,
          active_users: 0,
          pro_users: 0,
          free_users: 0,
          monthly_revenue: 0,
        } as AdminStats
      }
    },
    enabled: !!isAdmin,
  })

  // Alterar role de usuário
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar role do usuário:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  // Alterar plano de usuário (simplificado - alterando role)
  const updateUserPlan = useMutation({
    mutationFn: async ({ userId, plan }: { userId: string; plan: 'free' | 'pro' }) => {
      const role = plan === 'pro' ? 'admin' : 'user'
      
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar plano do usuário:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  // Suspender/reativar usuário
  const toggleUserStatus = useMutation({
    mutationFn: async ({ userId, active }: { userId: string; active: boolean }) => {
      // TODO: Implementar suspensão real (por enquanto apenas log)
      console.log(`Alterando status do usuário ${userId} para ${active ? 'ativo' : 'suspenso'}`)
      
      // Por enquanto, apenas retornar sucesso
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  return {
    // Status de admin
    isAdmin: isAdmin || false,
    isSuperAdmin: isSuperAdmin || false,
    userRole: userRole || 'user',
    isLoadingAdmin: isLoadingAdmin || isLoadingSuperAdmin,

    // Dados
    users,
    stats,
    isLoadingUsers,

    // Ações
    updateUserRole: updateUserRole.mutate,
    updateUserPlan: updateUserPlan.mutate,
    toggleUserStatus: toggleUserStatus.mutate,

    // Estados de loading
    isUpdatingRole: updateUserRole.isPending,
    isUpdatingPlan: updateUserPlan.isPending,
    isTogglingStatus: toggleUserStatus.isPending,
  }
}
