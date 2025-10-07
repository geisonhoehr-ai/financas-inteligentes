export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string // UUID
          nome: string
          email: string
          tipo: string
          cor: string
          ativo: boolean
          foto_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string // UUID
          nome: string
          email: string
          tipo?: string
          cor?: string
          ativo?: boolean
          foto_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string // UUID
          nome?: string
          email?: string
          tipo?: string
          cor?: string
          ativo?: boolean
          foto_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gastos: {
        Row: {
          id: string // UUID
          descricao: string
          valor: number
          usuario_id: string // UUID
          data: string
          categoria: string
          tipo_pagamento: string
          deletado: boolean
          deletado_em: string | null
          deletado_por: string | null // UUID
          created_at: string
        }
        Insert: {
          id?: string // UUID
          descricao: string
          valor: number
          usuario_id: string // UUID
          data: string
          categoria: string
          tipo_pagamento: string
          deletado?: boolean
          deletado_em?: string | null
          deletado_por?: string | null // UUID
          created_at?: string
        }
        Update: {
          id?: string // UUID
          descricao?: string
          valor?: number
          usuario_id?: string // UUID
          data?: string
          categoria?: string
          tipo_pagamento?: string
          deletado?: boolean
          deletado_em?: string | null
          deletado_por?: string | null // UUID
          created_at?: string
        }
      }
      assinaturas: {
        Row: {
          id: string // UUID
          nome: string
          valor: number
          usuario_id: string // UUID
          dia_vencimento: number
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string // UUID
          nome: string
          valor: number
          usuario_id: string // UUID
          dia_vencimento: number
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string // UUID
          nome?: string
          valor?: number
          usuario_id?: string // UUID
          dia_vencimento?: number
          ativo?: boolean
          created_at?: string
        }
      }
      cartoes: {
        Row: {
          id: string // UUID
          nome: string
          limite: number
          usuario_id: string // UUID
          fechamento: number
          vencimento: number
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string // UUID
          nome: string
          limite: number
          usuario_id: string // UUID
          fechamento: number
          vencimento: number
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string // UUID
          nome?: string
          limite?: number
          usuario_id?: string // UUID
          fechamento?: number
          vencimento?: number
          ativo?: boolean
          created_at?: string
        }
      }
      contas_fixas: {
        Row: {
          id: string // UUID
          nome: string
          valor: number
          usuario_id: string // UUID
          dia_vencimento: number
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string // UUID
          nome: string
          valor: number
          usuario_id: string // UUID
          dia_vencimento: number
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string // UUID
          nome?: string
          valor?: number
          usuario_id?: string // UUID
          dia_vencimento?: number
          ativo?: boolean
          created_at?: string
        }
      }
      familias: {
        Row: {
          id: string // UUID
          nome: string
          descricao: string | null
          cor: string
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string // UUID
          nome: string
          descricao?: string | null
          cor?: string
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string // UUID
          nome?: string
          descricao?: string | null
          cor?: string
          ativo?: boolean
          created_at?: string
        }
      }
      familia_membros: {
        Row: {
          id: string // UUID
          familia_id: string // UUID
          usuario_id: string // UUID
          role: string
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string // UUID
          familia_id: string // UUID
          usuario_id: string // UUID
          role?: string
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string // UUID
          familia_id?: string // UUID
          usuario_id?: string // UUID
          role?: string
          ativo?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      soft_delete: {
        Args: {
          p_tabela: string
          p_id: string // UUID
        }
        Returns: boolean
      }
      refresh_dashboard_views: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}