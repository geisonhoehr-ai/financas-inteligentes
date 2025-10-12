'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/lib/toast'
import { useFamiliaAtiva } from './use-familia-ativa'

export interface Salario {
  id: string
  usuario_id: string
  nome_pessoa: string
  valor: number
  dia_recebimento: number
  ativo: boolean
  created_at: string
  // Campos compatíveis com a interface antiga
  descricao?: string
  mes_referencia?: string
  tipo?: 'principal' | 'extra' | 'bonus' | '13_salario'
  familia_id?: string
  visivel_familia?: boolean
  deletado?: boolean
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

      const { data, error } = await supabase
        .from('salarios')
        .select('*')
        .eq('usuario_id', user.user.id)
        .eq('ativo', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar salários:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      // Mapear nome_pessoa para descricao para compatibilidade
      const mappedData = (data || []).map((s: any) => ({
        ...s,
        descricao: s.nome_pessoa // Adiciona descricao como alias
      }))

      return mappedData as Salario[]
    },
  })

  const createSalario = useMutation({
    mutationFn: async (salario: InsertSalario) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('salarios')
        .insert([{
          valor: salario.valor,
          nome_pessoa: salario.descricao,
          dia_recebimento: new Date(salario.mes_referencia).getDate(),
          usuario_id: user.user.id,
          ativo: true
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar salário:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
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
        .from('salarios')
        .update({
          valor: salario.valor,
          nome_pessoa: salario.descricao,
          dia_recebimento: salario.mes_referencia ? new Date(salario.mes_referencia).getDate() : undefined
        })
        .eq('id', id)
        .eq('usuario_id', user.user.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar salário:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
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
        .from('salarios')
        .delete()
        .eq('id', id)
        .eq('usuario_id', user.user.id)

      if (error) {
        console.error('Erro ao deletar salário:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
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
    receitaFamilia: salarios.reduce((sum, s) => sum + parseFloat(s.valor.toString()), 0), // Todos são visíveis
    salariosAtivos: salarios.filter(s => s.ativo).length,
    receitaMesAtual: salarios.reduce((sum, s) => sum + parseFloat(s.valor.toString()), 0) // Todos os salários ativos
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

