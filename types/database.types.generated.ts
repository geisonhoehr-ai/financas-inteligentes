export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // ============================================
      // TABELAS B�SICAS DO SISTEMA
      // ============================================

      users: {
        Row: {
          id: string
          email: string
          nome: string | null
          avatar_url: string | null
          plano: 'free' | 'pro' | 'premium'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: 'active' | 'canceled' | 'past_due' | null
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nome?: string | null
          avatar_url?: string | null
          plano?: 'free' | 'pro' | 'premium'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nome?: string | null
          avatar_url?: string | null
          plano?: 'free' | 'pro' | 'premium'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      categorias: {
        Row: {
          id: string
          user_id: string
          nome: string
          tipo: 'gasto' | 'receita'
          icone: string | null
          cor: string | null
          ordem: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          tipo: 'gasto' | 'receita'
          icone?: string | null
          cor?: string | null
          ordem?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          tipo?: 'gasto' | 'receita'
          icone?: string | null
          cor?: string | null
          ordem?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      cartoes: {
        Row: {
          id: string
          user_id: string
          nome: string
          bandeira: string | null
          limite: number | null
          dia_fechamento: number
          dia_vencimento: number
          cor: string | null
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          bandeira?: string | null
          limite?: number | null
          dia_fechamento: number
          dia_vencimento: number
          cor?: string | null
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          bandeira?: string | null
          limite?: number | null
          dia_fechamento?: number
          dia_vencimento?: number
          cor?: string | null
          ativo?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cartoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      gastos: {
        Row: {
          id: string
          user_id: string
          categoria_id: string | null
          cartao_id: string | null
          descricao: string
          valor: number
          data: string
          tipo_pagamento: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'transferencia'
          parcelado: boolean
          num_parcelas: number | null
          parcela_atual: number | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          categoria_id?: string | null
          cartao_id?: string | null
          descricao: string
          valor: number
          data: string
          tipo_pagamento: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'transferencia'
          parcelado?: boolean
          num_parcelas?: number | null
          parcela_atual?: number | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          categoria_id?: string | null
          cartao_id?: string | null
          descricao?: string
          valor?: number
          data?: string
          tipo_pagamento?: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'transferencia'
          parcelado?: boolean
          num_parcelas?: number | null
          parcela_atual?: number | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gastos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_cartao_id_fkey"
            columns: ["cartao_id"]
            isOneToOne: false
            referencedRelation: "cartoes"
            referencedColumns: ["id"]
          }
        ]
      }

      salarios: {
        Row: {
          id: string
          user_id: string
          nome_pessoa: string
          valor: number
          dia_recebimento: number
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome_pessoa: string
          valor: number
          dia_recebimento: number
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome_pessoa?: string
          valor?: number
          dia_recebimento?: number
          ativo?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      investimentos: {
        Row: {
          id: string
          user_id: string
          nome: string
          tipo: string
          valor_investido: number
          valor_atual: number
          rentabilidade: number
          data_aplicacao: string
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          tipo: string
          valor_investido: number
          valor_atual: number
          rentabilidade?: number
          data_aplicacao: string
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          tipo?: string
          valor_investido?: number
          valor_atual?: number
          rentabilidade?: number
          data_aplicacao?: string
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investimentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      metas: {
        Row: {
          id: string
          user_id: string
          nome: string
          valor_objetivo: number
          valor_atual: number
          prazo: string | null
          cor: string | null
          icone: string | null
          concluida: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          valor_objetivo: number
          valor_atual?: number
          prazo?: string | null
          cor?: string | null
          icone?: string | null
          concluida?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          valor_objetivo?: number
          valor_atual?: number
          prazo?: string | null
          cor?: string | null
          icone?: string | null
          concluida?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "metas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      contas_fixas: {
        Row: {
          id: string
          user_id: string
          categoria_id: string | null
          nome: string
          valor: number
          dia_vencimento: number
          ativo: boolean
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          categoria_id?: string | null
          nome: string
          valor: number
          dia_vencimento: number
          ativo?: boolean
          observacoes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          categoria_id?: string | null
          nome?: string
          valor?: number
          dia_vencimento?: number
          ativo?: boolean
          observacoes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_fixas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_fixas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          }
        ]
      }

      assinaturas: {
        Row: {
          id: string
          user_id: string
          categoria_id: string | null
          nome: string
          valor: number
          dia_cobranca: number
          ativo: boolean
          url_servico: string | null
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          categoria_id?: string | null
          nome: string
          valor: number
          dia_cobranca: number
          ativo?: boolean
          url_servico?: string | null
          observacoes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          categoria_id?: string | null
          nome?: string
          valor?: number
          dia_cobranca?: number
          ativo?: boolean
          url_servico?: string | null
          observacoes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          }
        ]
      }

      dividas_internas: {
        Row: {
          id: string
          user_id: string
          pessoa: string
          tipo: 'devo' | 'me_devem'
          valor_total: number
          valor_pago: number
          descricao: string
          data_emprestimo: string
          data_vencimento: string | null
          quitada: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pessoa: string
          tipo: 'devo' | 'me_devem'
          valor_total: number
          valor_pago?: number
          descricao: string
          data_emprestimo: string
          data_vencimento?: string | null
          quitada?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pessoa?: string
          tipo?: 'devo' | 'me_devem'
          valor_total?: number
          valor_pago?: number
          descricao?: string
          data_emprestimo?: string
          data_vencimento?: string | null
          quitada?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dividas_internas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // ============================================
      // SISTEMA DE TAGS
      // ============================================

      tags: {
        Row: {
          id: string
          user_id: string
          nome: string
          cor: string
          icone: string | null
          descricao: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          cor: string
          icone?: string | null
          descricao?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          cor?: string
          icone?: string | null
          descricao?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      gastos_tags: {
        Row: {
          id: string
          gasto_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          gasto_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          gasto_id?: string
          tag_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gastos_tags_gasto_id_fkey"
            columns: ["gasto_id"]
            isOneToOne: false
            referencedRelation: "gastos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }

      contas_fixas_tags: {
        Row: {
          id: string
          conta_fixa_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          conta_fixa_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          conta_fixa_id?: string
          tag_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_fixas_tags_conta_fixa_id_fkey"
            columns: ["conta_fixa_id"]
            isOneToOne: false
            referencedRelation: "contas_fixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_fixas_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }

      assinaturas_tags: {
        Row: {
          id: string
          assinatura_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          assinatura_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          assinatura_id?: string
          tag_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_tags_assinatura_id_fkey"
            columns: ["assinatura_id"]
            isOneToOne: false
            referencedRelation: "assinaturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }

      // ============================================
      // SISTEMA DE OR�AMENTO
      // ============================================

      orcamentos: {
        Row: {
          id: string
          user_id: string
          mes: number
          ano: number
          orcamento_total: number
          orcamento_flexivel: number
          meta_economia: number | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mes: number
          ano: number
          orcamento_total: number
          orcamento_flexivel: number
          meta_economia?: number | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mes?: number
          ano?: number
          orcamento_total?: number
          orcamento_flexivel?: number
          meta_economia?: number | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      orcamento_categorias: {
        Row: {
          id: string
          orcamento_id: string
          categoria_id: string
          valor_planejado: number
          valor_gasto: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          orcamento_id: string
          categoria_id: string
          valor_planejado: number
          valor_gasto?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          orcamento_id?: string
          categoria_id?: string
          valor_planejado?: number
          valor_gasto?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_categorias_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_categorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          }
        ]
      }

      orcamento_tags: {
        Row: {
          id: string
          orcamento_id: string
          tag_id: string
          valor_planejado: number
          valor_gasto: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          orcamento_id: string
          tag_id: string
          valor_planejado: number
          valor_gasto?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          orcamento_id?: string
          tag_id?: string
          valor_planejado?: number
          valor_gasto?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_tags_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }

      // ============================================
      // SISTEMA DE MESADA (GAMIFICA��O)
      // ============================================

      perfis_filhos: {
        Row: {
          id: string
          user_id: string
          nome: string
          data_nascimento: string
          avatar_url: string | null
          nivel: number
          xp_atual: number
          xp_proximo_nivel: number
          saldo_total: number
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          data_nascimento: string
          avatar_url?: string | null
          nivel?: number
          xp_atual?: number
          xp_proximo_nivel?: number
          saldo_total?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          data_nascimento?: string
          avatar_url?: string | null
          nivel?: number
          xp_atual?: number
          xp_proximo_nivel?: number
          saldo_total?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfis_filhos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      mesadas: {
        Row: {
          id: string
          filho_id: string
          valor_base: number
          periodicidade: 'semanal' | 'quinzenal' | 'mensal'
          dia_pagamento: number
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          filho_id: string
          valor_base: number
          periodicidade: 'semanal' | 'quinzenal' | 'mensal'
          dia_pagamento: number
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          filho_id?: string
          valor_base?: number
          periodicidade?: 'semanal' | 'quinzenal' | 'mensal'
          dia_pagamento?: number
          ativo?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mesadas_filho_id_fkey"
            columns: ["filho_id"]
            isOneToOne: false
            referencedRelation: "perfis_filhos"
            referencedColumns: ["id"]
          }
        ]
      }

      tarefas: {
        Row: {
          id: string
          filho_id: string
          titulo: string
          descricao: string | null
          valor_recompensa: number
          xp_recompensa: number
          dificuldade: 'facil' | 'media' | 'dificil'
          recorrente: boolean
          dias_semana: number[] | null
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          filho_id: string
          titulo: string
          descricao?: string | null
          valor_recompensa: number
          xp_recompensa: number
          dificuldade: 'facil' | 'media' | 'dificil'
          recorrente?: boolean
          dias_semana?: number[] | null
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          filho_id?: string
          titulo?: string
          descricao?: string | null
          valor_recompensa?: number
          xp_recompensa?: number
          dificuldade?: 'facil' | 'media' | 'dificil'
          recorrente?: boolean
          dias_semana?: number[] | null
          ativo?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_filho_id_fkey"
            columns: ["filho_id"]
            isOneToOne: false
            referencedRelation: "perfis_filhos"
            referencedColumns: ["id"]
          }
        ]
      }

      tarefas_concluidas: {
        Row: {
          id: string
          tarefa_id: string
          filho_id: string
          data_conclusao: string
          valor_recebido: number
          xp_recebido: number
          aprovado_por: string | null
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tarefa_id: string
          filho_id: string
          data_conclusao: string
          valor_recebido: number
          xp_recebido: number
          aprovado_por?: string | null
          observacoes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tarefa_id?: string
          filho_id?: string
          data_conclusao?: string
          valor_recebido?: number
          xp_recebido?: number
          aprovado_por?: string | null
          observacoes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_concluidas_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_concluidas_filho_id_fkey"
            columns: ["filho_id"]
            isOneToOne: false
            referencedRelation: "perfis_filhos"
            referencedColumns: ["id"]
          }
        ]
      }

      mesada_ajustes: {
        Row: {
          id: string
          filho_id: string
          tipo: 'bonus' | 'penalidade'
          valor: number
          motivo: string
          data: string
          criado_por: string
          created_at: string
        }
        Insert: {
          id?: string
          filho_id: string
          tipo: 'bonus' | 'penalidade'
          valor: number
          motivo: string
          data: string
          criado_por: string
          created_at?: string
        }
        Update: {
          id?: string
          filho_id?: string
          tipo?: 'bonus' | 'penalidade'
          valor?: number
          motivo?: string
          data?: string
          criado_por?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mesada_ajustes_filho_id_fkey"
            columns: ["filho_id"]
            isOneToOne: false
            referencedRelation: "perfis_filhos"
            referencedColumns: ["id"]
          }
        ]
      }

      conquistas: {
        Row: {
          id: string
          nome: string
          descricao: string
          icone: string
          cor: string
          criterio: string
          xp_bonus: number
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao: string
          icone: string
          cor: string
          criterio: string
          xp_bonus: number
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string
          icone?: string
          cor?: string
          criterio?: string
          xp_bonus?: number
          created_at?: string
        }
        Relationships: []
      }

      filho_conquistas: {
        Row: {
          id: string
          filho_id: string
          conquista_id: string
          data_desbloqueio: string
          created_at: string
        }
        Insert: {
          id?: string
          filho_id: string
          conquista_id: string
          data_desbloqueio: string
          created_at?: string
        }
        Update: {
          id?: string
          filho_id?: string
          conquista_id?: string
          data_desbloqueio?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "filho_conquistas_filho_id_fkey"
            columns: ["filho_id"]
            isOneToOne: false
            referencedRelation: "perfis_filhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filho_conquistas_conquista_id_fkey"
            columns: ["conquista_id"]
            isOneToOne: false
            referencedRelation: "conquistas"
            referencedColumns: ["id"]
          }
        ]
      }

      // ============================================
      // FUNCIONALIDADES AVAN�ADAS
      // ============================================

      desafios_familia: {
        Row: {
          id: string
          user_id: string
          nome: string
          descricao: string
          tipo: 'economia' | 'meta_gastos' | 'categoria_limite'
          meta_valor: number
          valor_atual: number
          data_inicio: string
          data_fim: string
          status: 'ativo' | 'concluido' | 'falhou'
          recompensa: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          descricao: string
          tipo: 'economia' | 'meta_gastos' | 'categoria_limite'
          meta_valor: number
          valor_atual?: number
          data_inicio: string
          data_fim: string
          status?: 'ativo' | 'concluido' | 'falhou'
          recompensa?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          descricao?: string
          tipo?: 'economia' | 'meta_gastos' | 'categoria_limite'
          meta_valor?: number
          valor_atual?: number
          data_inicio?: string
          data_fim?: string
          status?: 'ativo' | 'concluido' | 'falhou'
          recompensa?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "desafios_familia_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      desafio_regras: {
        Row: {
          id: string
          desafio_id: string
          tipo_regra: 'categoria' | 'tag' | 'valor_maximo'
          categoria_id: string | null
          tag_id: string | null
          valor_limite: number | null
          created_at: string
        }
        Insert: {
          id?: string
          desafio_id: string
          tipo_regra: 'categoria' | 'tag' | 'valor_maximo'
          categoria_id?: string | null
          tag_id?: string | null
          valor_limite?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          desafio_id?: string
          tipo_regra?: 'categoria' | 'tag' | 'valor_maximo'
          categoria_id?: string | null
          tag_id?: string | null
          valor_limite?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "desafio_regras_desafio_id_fkey"
            columns: ["desafio_id"]
            isOneToOne: false
            referencedRelation: "desafios_familia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desafio_regras_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desafio_regras_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }

      desafio_progresso: {
        Row: {
          id: string
          desafio_id: string
          user_id: string
          valor_contribuido: number
          percentual_contribuicao: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          desafio_id: string
          user_id: string
          valor_contribuido?: number
          percentual_contribuicao?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          desafio_id?: string
          user_id?: string
          valor_contribuido?: number
          percentual_contribuicao?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "desafio_progresso_desafio_id_fkey"
            columns: ["desafio_id"]
            isOneToOne: false
            referencedRelation: "desafios_familia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desafio_progresso_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      configuracao_divisao: {
        Row: {
          id: string
          user_id: string
          nome_pessoa: string
          percentual_renda: number
          salario_id: string | null
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome_pessoa: string
          percentual_renda: number
          salario_id?: string | null
          ativo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome_pessoa?: string
          percentual_renda?: number
          salario_id?: string | null
          ativo?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configuracao_divisao_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "configuracao_divisao_salario_id_fkey"
            columns: ["salario_id"]
            isOneToOne: false
            referencedRelation: "salarios"
            referencedColumns: ["id"]
          }
        ]
      }

      acerto_contas: {
        Row: {
          id: string
          user_id: string
          mes: number
          ano: number
          pessoa1: string
          pessoa2: string
          valor_pessoa1: number
          valor_pessoa2: number
          diferenca: number
          quem_paga: string
          quitado: boolean
          data_quitacao: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mes: number
          ano: number
          pessoa1: string
          pessoa2: string
          valor_pessoa1: number
          valor_pessoa2: number
          diferenca: number
          quem_paga: string
          quitado?: boolean
          data_quitacao?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mes?: number
          ano?: number
          pessoa1?: string
          pessoa2?: string
          valor_pessoa1?: number
          valor_pessoa2?: number
          diferenca?: number
          quem_paga?: string
          quitado?: boolean
          data_quitacao?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "acerto_contas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      lista_desejos: {
        Row: {
          id: string
          user_id: string
          nome: string
          descricao: string | null
          valor_total: number
          valor_economizado: number
          prioridade: number
          url_produto: string | null
          imagem_url: string | null
          data_desejo: string
          data_meta: string | null
          status: 'ativo' | 'comprado' | 'cancelado'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          descricao?: string | null
          valor_total: number
          valor_economizado?: number
          prioridade?: number
          url_produto?: string | null
          imagem_url?: string | null
          data_desejo: string
          data_meta?: string | null
          status?: 'ativo' | 'comprado' | 'cancelado'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          descricao?: string | null
          valor_total?: number
          valor_economizado?: number
          prioridade?: number
          url_produto?: string | null
          imagem_url?: string | null
          data_desejo?: string
          data_meta?: string | null
          status?: 'ativo' | 'comprado' | 'cancelado'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lista_desejos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      lista_desejos_votacao: {
        Row: {
          id: string
          desejo_id: string
          user_id: string
          voto: number
          comentario: string | null
          created_at: string
        }
        Insert: {
          id?: string
          desejo_id: string
          user_id: string
          voto: number
          comentario?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          desejo_id?: string
          user_id?: string
          voto?: number
          comentario?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lista_desejos_votacao_desejo_id_fkey"
            columns: ["desejo_id"]
            isOneToOne: false
            referencedRelation: "lista_desejos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lista_desejos_votacao_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      lista_desejos_contribuicoes: {
        Row: {
          id: string
          desejo_id: string
          user_id: string
          valor: number
          data: string
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          desejo_id: string
          user_id: string
          valor: number
          data: string
          observacoes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          desejo_id?: string
          user_id?: string
          valor?: number
          data?: string
          observacoes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lista_desejos_contribuicoes_desejo_id_fkey"
            columns: ["desejo_id"]
            isOneToOne: false
            referencedRelation: "lista_desejos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lista_desejos_contribuicoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      score_financeiro: {
        Row: {
          id: string
          user_id: string
          score_total: number
          score_gastos: number
          score_economia: number
          score_investimentos: number
          score_dividas: number
          score_regularidade: number
          ultima_atualizacao: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score_total: number
          score_gastos?: number
          score_economia?: number
          score_investimentos?: number
          score_dividas?: number
          score_regularidade?: number
          ultima_atualizacao?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score_total?: number
          score_gastos?: number
          score_economia?: number
          score_investimentos?: number
          score_dividas?: number
          score_regularidade?: number
          ultima_atualizacao?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "score_financeiro_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      score_historico: {
        Row: {
          id: string
          score_id: string
          score_total: number
          data: string
          created_at: string
        }
        Insert: {
          id?: string
          score_id: string
          score_total: number
          data: string
          created_at?: string
        }
        Update: {
          id?: string
          score_id?: string
          score_total?: number
          data?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "score_historico_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "score_financeiro"
            referencedColumns: ["id"]
          }
        ]
      }

      // ============================================
      // GAMIFICA��O DO USU�RIO
      // ============================================

      user_gamification: {
        Row: {
          id: string
          user_id: string
          xp_total: number
          conquistas: string[]
          dias_registrando: number
          dias_sem_delivery: number
          economia_do_mes: number
          ultimo_registro_dia: string | null
          streak_atual: number
          maior_streak: number
          ultima_atividade: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          xp_total?: number
          conquistas?: string[]
          dias_registrando?: number
          dias_sem_delivery?: number
          economia_do_mes?: number
          ultimo_registro_dia?: string | null
          streak_atual?: number
          maior_streak?: number
          ultima_atividade?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          xp_total?: number
          conquistas?: string[]
          dias_registrando?: number
          dias_sem_delivery?: number
          economia_do_mes?: number
          ultimo_registro_dia?: string | null
          streak_atual?: number
          maior_streak?: number
          ultima_atividade?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      vw_tags_com_stats: {
        Row: {
          id: string
          user_id: string
          nome: string
          cor: string
          icone: string | null
          descricao: string | null
          total_gastos: number
          valor_total: number
          created_at: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      vw_orcamento_consolidado: {
        Row: {
          id: string
          user_id: string
          mes: number
          ano: number
          orcamento_total: number
          gasto_total: number
          diferenca: number
          percentual_usado: number
          status: string
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      vw_desafios_ativos: {
        Row: {
          id: string
          user_id: string
          nome: string
          descricao: string
          tipo: string
          meta_valor: number
          valor_atual: number
          percentual_completo: number
          dias_restantes: number
          status: string
        }
        Relationships: [
          {
            foreignKeyName: "desafios_familia_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      vw_ranking_gamification: {
        Row: {
          user_id: string
          xp_total: number
          streak_atual: number
          maior_streak: number
          dias_registrando: number
          conquistas: string[]
          posicao: number
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      buscar_gastos_por_tag: {
        Args: {
          p_user_id: string
          p_tag_id: string
          p_data_inicio?: string
          p_data_fim?: string
        }
        Returns: {
          id: string
          descricao: string
          valor: number
          data: string
          categoria_nome: string
        }[]
      }
      estatisticas_por_tag: {
        Args: {
          p_user_id: string
          p_tag_id: string
          p_mes?: number
          p_ano?: number
        }
        Returns: {
          total_gastos: number
          valor_total: number
          valor_medio: number
          maior_gasto: number
          menor_gasto: number
        }
      }
      calcular_nivel: {
        Args: {
          p_xp: number
        }
        Returns: number
      }
      atualizar_saldo_mesada: {
        Args: {
          p_filho_id: string
          p_valor: number
          p_tipo: 'adicionar' | 'remover'
        }
        Returns: void
      }
      atualizar_nivel_filho: {
        Args: {
          p_filho_id: string
          p_xp: number
        }
        Returns: void
      }
      calcular_percentual_contribuicao: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
      atualizar_valor_desejo: {
        Args: {
          p_desejo_id: string
        }
        Returns: void
      }
      atualizar_streak_usuario: {
        Args: {
          p_user_id: string
        }
        Returns: void
      }
    }
    Enums: {
      plano_tipo: 'free' | 'pro' | 'premium'
      subscription_status: 'active' | 'canceled' | 'past_due'
      tipo_categoria: 'gasto' | 'receita'
      tipo_pagamento: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'transferencia'
      tipo_divida: 'devo' | 'me_devem'
      periodicidade_mesada: 'semanal' | 'quinzenal' | 'mensal'
      dificuldade_tarefa: 'facil' | 'media' | 'dificil'
      tipo_ajuste: 'bonus' | 'penalidade'
      tipo_desafio: 'economia' | 'meta_gastos' | 'categoria_limite'
      status_desafio: 'ativo' | 'concluido' | 'falhou'
      tipo_regra: 'categoria' | 'tag' | 'valor_maximo'
      status_desejo: 'ativo' | 'comprado' | 'cancelado'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never




