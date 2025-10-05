/**
 * Types customizados da aplicação
 * Todos os IDs são UUID (string)
 */

// ============================================
// USUARIOS E AUTENTICAÇÃO
// ============================================
export interface User {
  id: string // UUID
  nome: string
  email: string | null
  tipo: 'pessoa' | 'empresa'
  cor: string
  foto_url: string | null
  ativo: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null // UUID
  created_at: string
  updated_at: string
}

// ============================================
// FAMILIAS E MEMBROS
// ============================================
export interface Familia {
  id: string // UUID
  nome: string
  admin_id: string | null // UUID
  modo_calculo: 'familiar' | 'individual'
  codigo_convite: string | null
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null // UUID
  created_at: string
  updated_at: string
}

export interface FamiliaMembro {
  familia_id: string // UUID
  usuario_id: string // UUID
  papel: 'admin' | 'owner' | 'membro' | 'dependente' | 'visualizador'
  aprovado: boolean
  deletado: boolean
  deletado_em: string | null
  created_at: string
  // Joined data
  usuario?: User
  familia?: Familia
}

export interface InsertFamilia {
  nome: string
  admin_id?: string | null // UUID
  modo_calculo?: 'familiar' | 'individual'
  codigo_convite?: string
}

export interface InsertMembro {
  familia_id: string // UUID
  usuario_id: string // UUID
  papel?: 'admin' | 'owner' | 'membro' | 'dependente' | 'visualizador'
  aprovado?: boolean
}

// ============================================
// CONVITES
// ============================================
export interface Convite {
  id: string // UUID
  familia_id: string // UUID
  codigo: string
  email_convidado: string | null
  convidado_por: string // UUID
  usado: boolean
  data_uso: string | null
  expires_at: string
  created_at: string
  // Joined data
  familia?: Familia
  convidador?: User
}

// ============================================
// CATEGORIAS
// ============================================
export interface Categoria {
  id: string // UUID
  nome: string
  icone: string | null
  cor: string
  tipo: string
  ativa: boolean
  sistema: boolean
  usuario_id: string | null // UUID
  familia_id: string | null // UUID
  deletado: boolean
  deletado_em: string | null
  created_at: string
}

// ============================================
// GASTOS
// ============================================
export interface Gasto {
  id: string // UUID
  usuario_id: string // UUID
  categoria_id: string | null // UUID
  descricao: string
  valor: number
  data: string
  tipo_pagamento: 'dinheiro' | 'pix' | 'debito' | 'credito' | 'transferencia'
  observacoes: string | null
  familia_id: string | null // UUID
  privado: boolean
  visivel_familia: boolean
  pago_por: string | null // UUID
  responsavel_por: string | null // UUID
  percentual_divisao: any | null // JSONB
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null // UUID
  created_at: string
  updated_at: string
  // Joined data
  usuario?: User
  categoria?: Categoria
}

export interface InsertGasto {
  usuario_id: string // UUID
  categoria_id?: string | null // UUID
  descricao: string
  valor: number
  data: string
  tipo_pagamento?: 'dinheiro' | 'pix' | 'debito' | 'credito' | 'transferencia'
  observacoes?: string
  familia_id?: string | null // UUID
  privado?: boolean
  visivel_familia?: boolean
  pago_por?: string | null // UUID
  responsavel_por?: string | null // UUID
  percentual_divisao?: any
}

// ============================================
// DIVIDAS INTERNAS
// ============================================
export interface DividaInterna {
  id: string // UUID
  familia_id: string // UUID
  credor_id: string // UUID
  devedor_id: string // UUID
  valor: number
  descricao: string | null
  gasto_original_id: string | null // UUID
  parcela_numero: number | null
  parcela_total: number | null
  status: 'pendente' | 'paga' | 'cancelada'
  data_criacao: string
  data_vencimento: string | null
  data_pagamento: string | null
  comprovante_url: string | null
  observacoes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  // Joined data
  credor?: User
  devedor?: User
  gasto_original?: Gasto
  familia?: Familia
}

export interface ResumoDividas {
  familia_id: string // UUID
  familia_nome: string
  total_devo: number
  total_recebo: number
  saldo_liquido: number
  qtd_dividas_pendentes: number
}

export interface InsertDivida {
  familia_id: string // UUID
  credor_id: string // UUID
  devedor_id: string // UUID
  valor: number
  descricao?: string
  gasto_original_id?: string | null // UUID
  parcela_numero?: number
  parcela_total?: number
  data_vencimento?: string
}

// ============================================
// COMPRAS PARCELADAS
// ============================================
export interface CompraParcelada {
  id: string // UUID
  usuario_id: string | null // UUID
  categoria_id: string | null // UUID
  produto: string
  valor_total: number
  total_parcelas: number
  valor_parcela: number
  parcelas_pagas: number
  data_compra: string
  primeira_parcela: string | null
  dia_vencimento: number | null
  tipo_pagamento: 'dinheiro' | 'pix' | 'debito' | 'credito' | 'transferencia' | null
  observacoes: string | null
  finalizada: boolean
  familia_id: string | null // UUID
  privado: boolean
  visivel_familia: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null // UUID
  created_at: string
  updated_at: string
  // Joined data
  usuario?: User
  categoria?: Categoria
}

// ============================================
// SALARIOS
// ============================================
export interface Salario {
  id: string // UUID
  usuario_id: string // UUID
  valor: number
  descricao: string | null
  mes_referencia: string | null
  tipo: 'principal' | 'extra' | 'bonus' | '13_salario'
  familia_id: string | null // UUID
  visivel_familia: boolean
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null // UUID
  created_at: string
  updated_at: string
  // Joined data
  usuario?: User
}

// ============================================
// CARTOES
// ============================================
export interface Cartao {
  id: string // UUID
  usuario_id: string // UUID
  nome: string
  limite: number | null
  gasto_atual: number
  dia_fechamento: number | null
  dia_vencimento: number | null
  ativo: boolean
  familia_id: string | null // UUID
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null // UUID
  created_at: string
  // Joined data
  usuario?: User
}

// ============================================
// METAS
// ============================================
export interface Meta {
  id: string // UUID
  usuario_id: string | null // UUID
  nome: string
  valor_objetivo: number
  valor_atual: number
  prazo: string | null
  concluida: boolean
  observacoes: string | null
  familia_id: string | null // UUID
  deletado: boolean
  deletado_em: string | null
  deletado_por: string | null // UUID
  created_at: string
  // Joined data
  usuario?: User
}

// ============================================
// DASHBOARD
// ============================================
export interface DashboardMensal {
  mes_referencia: string
  ano: number
  mes: number
  receitas_total: number
  gastos_mes: number
  parcelas_mes: number
  gasolina_mes: number
  assinaturas_mes: number
  contas_fixas_mes: number
  ferramentas_mes: number
  atualizado_em: string
}

// ============================================
// NOTIFICACOES (FUTURO)
// ============================================
export interface Notificacao {
  id: string // UUID
  usuario_id: string // UUID
  tipo: 'divida_criada' | 'divida_paga' | 'convite_recebido' | 'gasto_aprovado' | 'meta_atingida'
  titulo: string
  mensagem: string
  lida: boolean
  link: string | null
  created_at: string
}
