import { Database } from './database.types'

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T] extends { Insert: infer I } ? I : never

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T] extends { Update: infer U } ? U : never

// Specific types for our app
export type User = Tables<'users'>
export type Salary = Tables<'salaries'>
export type Gasto = Tables<'gastos'>
export type Parcela = Tables<'compras_parceladas'>
export type Gasolina = Tables<'gasolina'>
export type Assinatura = Tables<'assinaturas'>
export type ContaFixa = Tables<'contas_fixas'>
export type Ferramenta = Tables<'ferramentas_ia_dev'>
export type Cartao = Tables<'cartoes'>
export type Divida = Tables<'dividas'>
export type Emprestimo = Tables<'emprestimos'>
export type Meta = Tables<'metas'>
export type Orcamento = Tables<'orcamentos'>
export type Investimento = Tables<'investimentos'>
export type Patrimonio = Tables<'patrimonio'>
export type DashboardData = Tables<'mv_dashboard_mensal'>

// Insert types
export type InsertGasto = InsertTables<'gastos'>
export type InsertParcela = InsertTables<'compras_parceladas'>
export type InsertGasolina = InsertTables<'gasolina'>

// Deleted item (for trash view)
export interface DeletedItem {
  id: number
  tabela: string
  tipoLabel: string
  descricao?: string
  nome?: string
  valor?: number
  deletado_em: string
  deletado_por?: number
  [key: string]: any
}

// Categorias
export const CATEGORIAS = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Outros',
] as const

export type Categoria = typeof CATEGORIAS[number]

// Tipos de pagamento
export const TIPOS_PAGAMENTO = [
  'Dinheiro',
  'PIX',
  'Débito',
  'Crédito',
  'Boleto',
  'Transferência',
] as const

export type TipoPagamento = typeof TIPOS_PAGAMENTO[number]

// User types
export const TIPOS_USUARIO = ['Pessoa', 'Empresa'] as const
export type TipoUsuario = typeof TIPOS_USUARIO[number]
