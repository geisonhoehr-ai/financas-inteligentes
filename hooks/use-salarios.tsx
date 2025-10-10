'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/lib/toast'
import { useFamiliaAtiva } from './use-familia-ativa'

export interface Salario {
  id: string
  usuario_id: string
  valor: number
  descricao: string
  mes_referencia: string
  tipo: 'principal' | 'extra' | 'bonus' | '13_salario'
  familia_id?: string
  visivel_familia: boolean
  deletado: boolean
  created_at: string
}

export interface InsertSalario {
  valor: number
  descricao: string
  tipo: string
  mes_referencia: string
  familia_id?: string
  visivel_familia: boolean
}

export function useSalarios() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva()
  
  const { data: salarios = [], isLoading, error } = useQuery<Salario[]>({
    queryKey: ['salarios', familiaAtivaId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return []

      let query = supabase
        .from('salaries')
        .select('*')
        .eq('deletado', false)
      
      // Filtrar por família ativa se houver
      if (familiaAtivaId) {
        query = query.eq('familia_id', familiaAtivaId)
      } else {
        // Se não há família, mostrar apenas pessoais (sem família)
        query = query.is('familia_id', null)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar salários:', error)
        throw error
      }
      
      return (data as Salario[]) || []
    },
  })

  const createSalario = useMutation({
    mutationFn: async (salario: InsertSalario) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('salaries')
        .insert([{
          valor: salario.valor,
          descricao: salario.descricao,
          tipo: salario.tipo,
          mes_referencia: salario.mes_referencia,
          usuario_id: user.user.id,
          familia_id: salario.familia_id || null,
          visivel_familia: salario.visivel_familia,
          deletado: false
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar salário:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salarios'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast.success('Salário adicionado com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao adicionar salário: ' + error.message)
    },
  })

  const updateSalario = useMutation({
    mutationFn: async ({ id, ...salario }: Partial<Salario> & { id: string }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('salaries')
        .update({
          valor: salario.valor,
          descricao: salario.descricao,
          tipo: salario.tipo,
          mes_referencia: salario.mes_referencia,
          visivel_familia: salario.visivel_familia
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar salário:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salarios'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast.success('Salário atualizado com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao atualizar salário: ' + error.message)
    },
  })

  const deleteSalario = useMutation({
    mutationFn: async (id: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('salaries')
        .update({
          deletado: true,
          deletado_em: new Date().toISOString(),
          deletado_por: user.user.id
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao deletar salário:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salarios'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast.success('Salário excluído com sucesso!')
    },
    onError: (error: any) => {
      showToast.error('Erro ao excluir salário: ' + error.message)
    },
  })

  const stats = {
    receitaTotal: salarios.reduce((sum, s) => sum + parseFloat(s.valor.toString()), 0),
    receitaFamilia: salarios.filter(s => s.visivel_familia).reduce((sum, s) => sum + parseFloat(s.valor.toString()), 0),
    salariosAtivos: salarios.length,
    receitaMesAtual: salarios
      .filter(s => {
        if (!s.mes_referencia) return true
        const mes = new Date(s.mes_referencia)
        const hoje = new Date()
        return mes.getMonth() === hoje.getMonth() && mes.getFullYear() === hoje.getFullYear()
      })
      .reduce((sum, s) => sum + parseFloat(s.valor.toString()), 0)
  }

  return {
    salarios,
    stats,
    isLoading,
    error,
    createSalario: createSalario.mutate,
    updateSalario: updateSalario.mutate,
    deleteSalario: deleteSalario.mutate,
    isCreating: createSalario.isPending,
    isUpdating: updateSalario.isPending,
    isDeleting: deleteSalario.isPending,
  }
}

