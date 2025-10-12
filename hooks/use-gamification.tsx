'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import {
  Badge,
  Achievement,
  UserLevel,
  Challenge,
  GameContext,
  BADGES,
  calcularNivel,
  verificarConquistas,
  gerarDesafiosDiarios,
  gerarDesafiosSemanais
} from '@/lib/gamification'
import { useGastos } from './use-gastos'
import { useMetas } from './use-metas'
import { showToast } from '@/lib/toast'

export function useGamification() {
  const queryClient = useQueryClient()
  const { gastos = [] } = useGastos()
  const { metas = [], stats: metasStats } = useMetas()

  // ============================================
  // BUSCAR DADOS DO USUÁRIO
  // ============================================

  const { data: userData, isLoading } = useQuery({
    queryKey: ['gamification-user'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return null

      // Buscar ou criar perfil de gamificação
      let { data: profile, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.user.id)
        .single()

      if (error || !profile) {
        // Criar perfil se não existir
        const { data: newProfile } = await supabase
          .from('user_gamification')
          .insert([{
            user_id: user.user.id,
            xp_total: 0,
            conquistas: [],
            dias_registrando: 0,
            ultima_atividade: new Date().toISOString()
          }])
          .select()
          .single()

        profile = newProfile
      }

      return profile
    }
  })

  // ============================================
  // BUSCAR DESAFIOS
  // ============================================

  const { data: desafios = [] } = useQuery({
    queryKey: ['gamification-challenges'],
    queryFn: async () => {
      // TODO: Buscar do banco quando implementar tabela
      // Por enquanto, gerar localmente
      return [
        ...gerarDesafiosDiarios(),
        ...gerarDesafiosSemanais()
      ]
    }
  })

  // ============================================
  // CALCULAR CONTEXTO
  // ============================================

  const getGameContext = useCallback((): GameContext => {
    return {
      userId: userData?.user_id || '',
      gastos: gastos.slice(0, 100).map((g: any) => ({
        descricao: g.descricao,
        valor: parseFloat(g.valor),
        categoria: g.categoria || 'Outros',
        data: g.data
      })),
      metas: metas.map((m: any) => ({
        nome: m.nome,
        valor_objetivo: m.valor_objetivo,
        valor_atual: m.valor_atual || 0,
        concluida: m.concluida || false
      })),
      diasRegistrando: userData?.dias_registrando || 0,
      diasSemDelivery: userData?.dias_sem_delivery || 0,
      economiaDoMes: userData?.economia_do_mes || 0,
      metasConcluidas: metasStats?.metasConcluidas || 0
    }
  }, [userData, gastos, metas, metasStats])

  // ============================================
  // VERIFICAR NOVAS CONQUISTAS
  // ============================================

  const verificarNovasConquistas = useCallback(async () => {
    if (!userData) return

    const context = getGameContext()
    const conquistasAtuais = userData.conquistas || []
    const novasConquistas = verificarConquistas(context, conquistasAtuais)

    if (novasConquistas.length > 0) {
      // Atualizar XP e conquistas
      const xpGanho = novasConquistas.reduce((sum, b) => sum + b.xp, 0)
      const novasConquistaIds = novasConquistas.map(b => b.id)

      await supabase
        .from('user_gamification')
        .update({
          xp_total: userData.xp_total + xpGanho,
          conquistas: [...conquistasAtuais, ...novasConquistaIds]
        })
        .eq('user_id', userData.user_id)

      // Mostrar notificação para cada conquista
      novasConquistas.forEach(badge => {
        showToast.success(
          `🎉 Conquista desbloqueada: ${badge.icone} ${badge.nome}! +${badge.xp} XP`
        )
      })

      // Invalidar query
      queryClient.invalidateQueries({ queryKey: ['gamification-user'] })

      return novasConquistas
    }

    return []
  }, [userData, getGameContext, queryClient])

  // Verificar conquistas automaticamente
  useEffect(() => {
    if (userData && gastos.length > 0) {
      verificarNovasConquistas()
    }
  }, [gastos.length, metas.length])

  // ============================================
  // CALCULAR NÍVEL
  // ============================================

  const nivel: UserLevel = userData
    ? calcularNivel(userData.xp_total)
    : {
        level: 1,
        xp: 0,
        xpParaProximo: 100,
        titulo: 'Aprendiz',
        beneficios: []
      }

  // ============================================
  // BUSCAR CONQUISTAS DESBLOQUEADAS
  // ============================================

  const conquistasDesbloqueadas: Badge[] = userData
    ? BADGES.filter(b => userData.conquistas?.includes(b.id))
    : []

  // ============================================
  // ADICIONAR XP MANUALMENTE
  // ============================================

  const adicionarXP = useMutation({
    mutationFn: async (xp: number) => {
      if (!userData) return

      const { error } = await supabase
        .from('user_gamification')
        .update({
          xp_total: userData.xp_total + xp
        })
        .eq('user_id', userData.user_id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamification-user'] })
    }
  })

  // ============================================
  // COMPLETAR DESAFIO
  // ============================================

  const completarDesafio = useMutation({
    mutationFn: async (desafioId: string) => {
      const desafio = desafios.find(d => d.id === desafioId)
      if (!desafio) return

      // Adicionar XP
      await adicionarXP.mutateAsync(desafio.xp)

      showToast.success(
        `✅ Desafio completo! +${desafio.xp} XP`
      )
    }
  })

  return {
    // Dados
    userData,
    nivel,
    conquistasDesbloqueadas,
    desafios,
    isLoading,

    // Funções
    verificarNovasConquistas,
    completarDesafio: completarDesafio.mutate,
    adicionarXP: adicionarXP.mutate,

    // Contexto
    gameContext: getGameContext()
  }
}
