// ============================================
// SISTEMA DE GAMIFICAÇÃO
// ============================================
// Conquistas, Badges, XP, Níveis e Desafios

export interface Badge {
  id: string
  nome: string
  descricao: string
  icone: string
  categoria: 'economia' | 'disciplina' | 'meta' | 'streak' | 'especial'
  xp: number
  raridade: 'comum' | 'raro' | 'epico' | 'lendario'
  condicao: (context: GameContext) => boolean
  recompensa?: string
}

export interface Achievement {
  badgeId: string
  unlockedAt: Date
  progress?: number
}

export interface GameContext {
  userId: string
  gastos: Array<{
    descricao: string
    valor: number
    categoria: string
    data: string
  }>
  metas: Array<{
    nome: string
    valor_objetivo: number
    valor_atual: number
    concluida: boolean
  }>
  diasRegistrando: number
  diasSemDelivery: number
  economiaDoMes: number
  metasConcluidas: number
}

export interface UserLevel {
  level: number
  xp: number
  xpParaProximo: number
  titulo: string
  beneficios: string[]
}

// ============================================
// BADGES/CONQUISTAS
// ============================================

export const BADGES: Badge[] = [
  // 🔥 CATEGORIA: STREAK/DISCIPLINA
  {
    id: 'streak-7',
    nome: 'Semana de Fogo',
    descricao: 'Registrou gastos por 7 dias seguidos',
    icone: '🔥',
    categoria: 'streak',
    xp: 100,
    raridade: 'comum',
    condicao: (ctx) => ctx.diasRegistrando >= 7
  },
  {
    id: 'streak-30',
    nome: 'Mestre da Disciplina',
    descricao: 'Registrou gastos por 30 dias seguidos',
    icone: '🏆',
    categoria: 'streak',
    xp: 500,
    raridade: 'epico',
    condicao: (ctx) => ctx.diasRegistrando >= 30,
    recompensa: '10% de desconto no plano premium'
  },
  {
    id: 'streak-100',
    nome: 'Lenda Viva',
    descricao: 'Registrou gastos por 100 dias seguidos',
    icone: '👑',
    categoria: 'streak',
    xp: 2000,
    raridade: 'lendario',
    condicao: (ctx) => ctx.diasRegistrando >= 100,
    recompensa: '1 mês grátis de premium'
  },

  // 💰 CATEGORIA: ECONOMIA
  {
    id: 'economizou-100',
    nome: 'Poupador Iniciante',
    descricao: 'Economizou R$ 100 em um mês',
    icone: '💰',
    categoria: 'economia',
    xp: 50,
    raridade: 'comum',
    condicao: (ctx) => ctx.economiaDoMes >= 100
  },
  {
    id: 'economizou-500',
    nome: 'Mestre das Economias',
    descricao: 'Economizou R$ 500 em um mês',
    icone: '💎',
    categoria: 'economia',
    xp: 200,
    raridade: 'raro',
    condicao: (ctx) => ctx.economiaDoMes >= 500
  },
  {
    id: 'economizou-1000',
    nome: 'Milionário em Potencial',
    descricao: 'Economizou R$ 1.000 em um mês',
    icone: '🌟',
    categoria: 'economia',
    xp: 500,
    raridade: 'epico',
    condicao: (ctx) => ctx.economiaDoMes >= 1000
  },

  // 🎯 CATEGORIA: METAS
  {
    id: 'meta-primeira',
    nome: 'Sonhador',
    descricao: 'Criou sua primeira meta financeira',
    icone: '🎯',
    categoria: 'meta',
    xp: 50,
    raridade: 'comum',
    condicao: (ctx) => ctx.metas.length >= 1
  },
  {
    id: 'meta-concluida',
    nome: 'Realizador',
    descricao: 'Concluiu uma meta financeira',
    icone: '✅',
    categoria: 'meta',
    xp: 300,
    raridade: 'raro',
    condicao: (ctx) => ctx.metasConcluidas >= 1
  },
  {
    id: 'meta-3-concluidas',
    nome: 'Conquistador',
    descricao: 'Concluiu 3 metas financeiras',
    icone: '🏅',
    categoria: 'meta',
    xp: 800,
    raridade: 'epico',
    condicao: (ctx) => ctx.metasConcluidas >= 3
  },

  // 🍕 CATEGORIA: DISCIPLINA
  {
    id: 'sem-delivery-7',
    nome: 'Chef de Cozinha',
    descricao: 'Ficou 7 dias sem pedir delivery',
    icone: '👨‍🍳',
    categoria: 'disciplina',
    xp: 150,
    raridade: 'raro',
    condicao: (ctx) => ctx.diasSemDelivery >= 7
  },
  {
    id: 'sem-delivery-30',
    nome: 'Mestre Cuca',
    descricao: 'Ficou 30 dias sem pedir delivery',
    icone: '🍳',
    categoria: 'disciplina',
    xp: 600,
    raridade: 'epico',
    condicao: (ctx) => ctx.diasSemDelivery >= 30,
    recompensa: 'Vale de R$ 50 em supermercados parceiros'
  },
  {
    id: 'gastos-organizados',
    nome: 'Organizado',
    descricao: 'Categorizou 100% dos gastos do mês',
    icone: '📊',
    categoria: 'disciplina',
    xp: 100,
    raridade: 'comum',
    condicao: (ctx) => ctx.gastos.every(g => g.categoria)
  },

  // ⭐ CATEGORIA: ESPECIAL
  {
    id: 'primeira-semana',
    nome: 'Bem-vindo!',
    descricao: 'Completou sua primeira semana no app',
    icone: '🎉',
    categoria: 'especial',
    xp: 50,
    raridade: 'comum',
    condicao: (ctx) => ctx.diasRegistrando >= 1
  },
  {
    id: 'convite-amigo',
    nome: 'Influencer',
    descricao: 'Convidou um amigo que se cadastrou',
    icone: '🤝',
    categoria: 'especial',
    xp: 200,
    raridade: 'raro',
    condicao: () => false // Implementar lógica de referral
  }
]

// ============================================
// SISTEMA DE NÍVEIS
// ============================================

const NIVEIS = [
  { nivel: 1, xpNecessario: 0, titulo: 'Aprendiz', beneficios: ['Acesso ao app'] },
  { nivel: 2, xpNecessario: 100, titulo: 'Iniciante', beneficios: ['Dashboard básico'] },
  { nivel: 3, xpNecessario: 300, titulo: 'Intermediário', beneficios: ['Relatórios mensais'] },
  { nivel: 4, xpNecessario: 600, titulo: 'Avançado', beneficios: ['IA Assistente'] },
  { nivel: 5, xpNecessario: 1000, titulo: 'Expert', beneficios: ['Previsões avançadas'] },
  { nivel: 6, xpNecessario: 1500, titulo: 'Mestre', beneficios: ['Consultoria premium'] },
  { nivel: 7, xpNecessario: 2500, titulo: 'Guru', beneficios: ['Badge exclusivo'] },
  { nivel: 8, xpNecessario: 4000, titulo: 'Lenda', beneficios: ['Premium vitalício'] },
  { nivel: 9, xpNecessario: 6000, titulo: 'Mito', beneficios: ['Nome no hall da fama'] },
  { nivel: 10, xpNecessario: 10000, titulo: 'Deus das Finanças', beneficios: ['Tudo liberado'] }
]

export function calcularNivel(xpTotal: number): UserLevel {
  let nivelAtual = NIVEIS[0]
  let proximoNivel = NIVEIS[1]

  for (let i = 0; i < NIVEIS.length; i++) {
    if (xpTotal >= NIVEIS[i].xpNecessario) {
      nivelAtual = NIVEIS[i]
      proximoNivel = NIVEIS[i + 1] || NIVEIS[i]
    } else {
      break
    }
  }

  return {
    level: nivelAtual.nivel,
    xp: xpTotal,
    xpParaProximo: proximoNivel.xpNecessario - xpTotal,
    titulo: nivelAtual.titulo,
    beneficios: nivelAtual.beneficios
  }
}

// ============================================
// VERIFICAR CONQUISTAS
// ============================================

export function verificarConquistas(
  context: GameContext,
  conquistasAtuais: string[]
): Badge[] {
  const novasConquistas: Badge[] = []

  for (const badge of BADGES) {
    // Se já tem essa conquista, pular
    if (conquistasAtuais.includes(badge.id)) continue

    // Verificar condição
    if (badge.condicao(context)) {
      novasConquistas.push(badge)
    }
  }

  return novasConquistas
}

// ============================================
// DESAFIOS DIÁRIOS/SEMANAIS
// ============================================

export interface Challenge {
  id: string
  titulo: string
  descricao: string
  icone: string
  tipo: 'diario' | 'semanal' | 'mensal'
  xp: number
  progresso: number
  meta: number
  expiresAt: Date
  completo: boolean
}

export function gerarDesafiosDiarios(): Challenge[] {
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(amanha.getDate() + 1)
  amanha.setHours(0, 0, 0, 0)

  return [
    {
      id: 'registrar-gastos',
      titulo: 'Registre 3 gastos hoje',
      descricao: 'Mantenha seu controle financeiro em dia',
      icone: '📝',
      tipo: 'diario',
      xp: 20,
      progresso: 0,
      meta: 3,
      expiresAt: amanha,
      completo: false
    },
    {
      id: 'sem-compras-impulso',
      titulo: 'Dia sem compras por impulso',
      descricao: 'Só compre o que estava planejado',
      icone: '🛡️',
      tipo: 'diario',
      xp: 30,
      progresso: 0,
      meta: 1,
      expiresAt: amanha,
      completo: false
    },
    {
      id: 'revisar-orcamento',
      titulo: 'Revise seu orçamento',
      descricao: 'Veja onde está gastando mais',
      icone: '📊',
      tipo: 'diario',
      xp: 15,
      progresso: 0,
      meta: 1,
      expiresAt: amanha,
      completo: false
    }
  ]
}

export function gerarDesafiosSemanais(): Challenge[] {
  const hoje = new Date()
  const proximoDomingo = new Date(hoje)
  proximoDomingo.setDate(hoje.getDate() + (7 - hoje.getDay()))
  proximoDomingo.setHours(23, 59, 59, 999)

  return [
    {
      id: 'economizar-100',
      titulo: 'Economize R$ 100 esta semana',
      descricao: 'Gaste menos que a semana passada',
      icone: '💰',
      tipo: 'semanal',
      xp: 100,
      progresso: 0,
      meta: 100,
      expiresAt: proximoDomingo,
      completo: false
    },
    {
      id: 'sem-delivery-semanal',
      titulo: '7 dias sem delivery',
      descricao: 'Cozinhe em casa toda a semana',
      icone: '🍳',
      tipo: 'semanal',
      xp: 150,
      progresso: 0,
      meta: 7,
      expiresAt: proximoDomingo,
      completo: false
    },
    {
      id: 'meta-progresso',
      titulo: 'Avance 10% em uma meta',
      descricao: 'Aproxime-se dos seus objetivos',
      icone: '🎯',
      tipo: 'semanal',
      xp: 120,
      progresso: 0,
      meta: 10,
      expiresAt: proximoDomingo,
      completo: false
    }
  ]
}

// ============================================
// RANKING FAMILIAR
// ============================================

export interface RankingEntry {
  userId: string
  nome: string
  avatar?: string
  xp: number
  nivel: number
  economiaDoMes: number
  posicao: number
}

export function calcularRankingFamiliar(membros: RankingEntry[]): RankingEntry[] {
  return membros
    .sort((a, b) => b.xp - a.xp)
    .map((membro, index) => ({
      ...membro,
      posicao: index + 1
    }))
}
