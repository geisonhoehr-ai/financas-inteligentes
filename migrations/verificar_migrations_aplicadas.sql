-- ============================================
-- SCRIPT DE VERIFICAÇÃO DE MIGRATIONS
-- Execute no Supabase SQL Editor
-- ============================================

-- Este script verifica se as migrations já foram aplicadas

-- ============================================
-- 1. VERIFICAR TABELAS EXISTENTES
-- ============================================

SELECT 'TABELAS EXISTENTES' as status;

SELECT
  CASE
    WHEN COUNT(*) = 26 THEN '✅ TODAS AS 26 TABELAS CRIADAS'
    WHEN COUNT(*) > 0 THEN '⚠️ PARCIALMENTE CRIADO (' || COUNT(*) || '/26 tabelas)'
    ELSE '❌ NENHUMA TABELA CRIADA - MIGRATIONS NÃO APLICADAS'
  END as resultado,
  COUNT(*) as tabelas_encontradas,
  26 as tabelas_esperadas
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'tags', 'gastos_tags', 'parcelas_tags', 'contas_fixas_tags', 'assinaturas_tags',
    'orcamentos', 'orcamento_categorias', 'orcamento_tags',
    'perfis_filhos', 'mesadas', 'tarefas', 'tarefas_concluidas',
    'mesada_ajustes', 'gastos_filhos', 'conquistas', 'filho_conquistas',
    'desafios_familia', 'desafio_regras', 'desafio_progresso',
    'configuracao_divisao', 'acerto_contas',
    'lista_desejos', 'lista_desejos_votacao', 'lista_desejos_contribuicoes',
    'score_financeiro', 'score_historico'
  );

-- Lista de tabelas que EXISTEM
SELECT
  'Tabelas Criadas:' as tipo,
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'tags', 'gastos_tags', 'parcelas_tags', 'contas_fixas_tags', 'assinaturas_tags',
    'orcamentos', 'orcamento_categorias', 'orcamento_tags',
    'perfis_filhos', 'mesadas', 'tarefas', 'tarefas_concluidas',
    'mesada_ajustes', 'gastos_filhos', 'conquistas', 'filho_conquistas',
    'desafios_familia', 'desafio_regras', 'desafio_progresso',
    'configuracao_divisao', 'acerto_contas',
    'lista_desejos', 'lista_desejos_votacao', 'lista_desejos_contribuicoes',
    'score_financeiro', 'score_historico'
  )
ORDER BY table_name;

-- Lista de tabelas que NÃO EXISTEM
WITH tabelas_esperadas AS (
  SELECT unnest(ARRAY[
    'tags', 'gastos_tags', 'parcelas_tags', 'contas_fixas_tags', 'assinaturas_tags',
    'orcamentos', 'orcamento_categorias', 'orcamento_tags',
    'perfis_filhos', 'mesadas', 'tarefas', 'tarefas_concluidas',
    'mesada_ajustes', 'gastos_filhos', 'conquistas', 'filho_conquistas',
    'desafios_familia', 'desafio_regras', 'desafio_progresso',
    'configuracao_divisao', 'acerto_contas',
    'lista_desejos', 'lista_desejos_votacao', 'lista_desejos_contribuicoes',
    'score_financeiro', 'score_historico'
  ]) AS tabela_nome
)
SELECT
  '❌ Tabelas Faltando:' as tipo,
  te.tabela_nome
FROM tabelas_esperadas te
WHERE NOT EXISTS (
  SELECT 1
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_name = te.tabela_nome
)
ORDER BY te.tabela_nome;

-- ============================================
-- 2. VERIFICAR CAMPO 'PAGO' (add_pago_field.sql)
-- ============================================

SELECT 'CAMPOS PAGO ADICIONADOS' as status;

SELECT
  CASE
    WHEN COUNT(*) = 4 THEN '✅ add_pago_field.sql APLICADO'
    WHEN COUNT(*) > 0 THEN '⚠️ PARCIALMENTE APLICADO (' || COUNT(*) || '/4 campos)'
    ELSE '❌ add_pago_field.sql NÃO APLICADO'
  END as resultado,
  COUNT(*) as campos_encontrados,
  4 as campos_esperados
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'pago'
  AND table_name IN ('gastos', 'contas_fixas', 'parcelas', 'salarios');

-- Detalhes dos campos 'pago'
SELECT
  table_name,
  column_name,
  data_type,
  CASE WHEN is_nullable = 'YES' THEN 'NULL' ELSE 'NOT NULL' END as nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN ('pago', 'data_pagamento')
  AND table_name IN ('gastos', 'contas_fixas', 'parcelas', 'salarios')
ORDER BY table_name, column_name;

-- ============================================
-- 3. VERIFICAR VIEWS (todas migrations)
-- ============================================

SELECT 'VIEWS CRIADAS' as status;

SELECT
  CASE
    WHEN COUNT(*) >= 4 THEN '✅ VIEWS CRIADAS (' || COUNT(*) || ' views)'
    WHEN COUNT(*) > 0 THEN '⚠️ PARCIALMENTE CRIADO (' || COUNT(*) || ' views)'
    ELSE '❌ NENHUMA VIEW CRIADA'
  END as resultado,
  COUNT(*) as views_encontradas,
  5 as views_esperadas
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name LIKE 'vw_%';

-- Lista de views existentes
SELECT
  'View Criada:' as tipo,
  table_name,
  CASE
    WHEN table_name = 'vw_tags_com_stats' THEN 'create_tags_system.sql'
    WHEN table_name = 'vw_orcamento_consolidado' THEN 'create_orcamento_familiar.sql'
    WHEN table_name = 'vw_mesada_dashboard_pais' THEN 'create_sistema_mesada.sql'
    WHEN table_name = 'vw_desafios_ativos' THEN 'create_funcionalidades_avancadas.sql'
    WHEN table_name = 'vw_desejos_com_votos' THEN 'create_funcionalidades_avancadas.sql'
    ELSE 'migration desconhecida'
  END as origem
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name LIKE 'vw_%'
ORDER BY table_name;

-- ============================================
-- 4. VERIFICAR FUNCTIONS
-- ============================================

SELECT 'FUNCTIONS CRIADAS' as status;

SELECT
  CASE
    WHEN COUNT(*) >= 15 THEN '✅ FUNCTIONS CRIADAS (' || COUNT(*) || ' functions)'
    WHEN COUNT(*) > 0 THEN '⚠️ PARCIALMENTE CRIADO (' || COUNT(*) || ' functions)'
    ELSE '❌ NENHUMA FUNCTION CRIADA'
  END as resultado,
  COUNT(*) as functions_encontradas,
  17 as functions_esperadas
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
  AND routine_name IN (
    'update_tags_updated_at',
    'buscar_gastos_por_tag',
    'estatisticas_por_tag',
    'update_orcamentos_updated_at',
    'buscar_orcamento_atual',
    'calcular_execucao_orcamento_categoria',
    'calcular_execucao_orcamento_tag',
    'atualizar_saldo_mesada',
    'descontar_gasto_filho',
    'calcular_nivel',
    'atualizar_nivel_filho',
    'verificar_conquistas',
    'calcular_percentual_contribuicao',
    'atualizar_valor_desejo',
    'calcular_score_financeiro',
    'soft_delete_tag',
    'restaurar_tag'
  );

-- Lista de functions existentes
SELECT
  'Function Criada:' as tipo,
  routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
  AND routine_name IN (
    'update_tags_updated_at',
    'buscar_gastos_por_tag',
    'estatisticas_por_tag',
    'update_orcamentos_updated_at',
    'buscar_orcamento_atual',
    'calcular_execucao_orcamento_categoria',
    'calcular_execucao_orcamento_tag',
    'atualizar_saldo_mesada',
    'descontar_gasto_filho',
    'calcular_nivel',
    'atualizar_nivel_filho',
    'verificar_conquistas',
    'calcular_percentual_contribuicao',
    'atualizar_valor_desejo',
    'calcular_score_financeiro',
    'soft_delete_tag',
    'restaurar_tag'
  )
ORDER BY routine_name;

-- ============================================
-- 5. VERIFICAR SOFT DELETE EM TAGS
-- ============================================

SELECT 'SOFT DELETE EM TAGS' as status;

SELECT
  CASE
    WHEN COUNT(*) = 3 THEN '✅ melhorias_performance.sql APLICADO (soft delete)'
    WHEN COUNT(*) > 0 THEN '⚠️ PARCIALMENTE APLICADO (' || COUNT(*) || '/3 campos)'
    ELSE '❌ melhorias_performance.sql NÃO APLICADO'
  END as resultado,
  COUNT(*) as campos_encontrados,
  3 as campos_esperados
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'tags'
  AND column_name IN ('deletado', 'deletado_em', 'deletado_por');

-- Detalhes do soft delete
SELECT
  table_name,
  column_name,
  data_type,
  CASE WHEN is_nullable = 'YES' THEN 'NULL' ELSE 'NOT NULL' END as nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'tags'
  AND column_name IN ('deletado', 'deletado_em', 'deletado_por')
ORDER BY column_name;

-- ============================================
-- 6. VERIFICAR ÍNDICES IMPORTANTES
-- ============================================

SELECT 'ÍNDICES CRIADOS' as status;

SELECT
  CASE
    WHEN COUNT(*) >= 30 THEN '✅ ÍNDICES CRIADOS (' || COUNT(*) || ' índices)'
    WHEN COUNT(*) >= 20 THEN '⚠️ PARCIALMENTE CRIADO (' || COUNT(*) || ' índices)'
    WHEN COUNT(*) > 0 THEN '⚠️ POUCOS ÍNDICES (' || COUNT(*) || ' índices)'
    ELSE '❌ NENHUM ÍNDICE CRIADO'
  END as resultado,
  COUNT(*) as indices_encontrados
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%';

-- Lista de alguns índices importantes
SELECT
  'Índice Criado:' as tipo,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'idx_tags_usuario',
    'idx_tags_familia',
    'idx_gastos_tags_gasto',
    'idx_orcamentos_usuario',
    'idx_mesadas_filho',
    'idx_gastos_mes_ano_familia',
    'idx_tags_nao_deletado'
  )
ORDER BY tablename, indexname;

-- ============================================
-- 7. VERIFICAR CONQUISTAS PRÉ-DEFINIDAS
-- ============================================

SELECT 'CONQUISTAS PRÉ-DEFINIDAS' as status;

SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conquistas') THEN
      CASE
        WHEN (SELECT COUNT(*) FROM conquistas) >= 7 THEN '✅ CONQUISTAS INSERIDAS (' || (SELECT COUNT(*) FROM conquistas) || ' conquistas)'
        WHEN (SELECT COUNT(*) FROM conquistas) > 0 THEN '⚠️ PARCIALMENTE INSERIDAS (' || (SELECT COUNT(*) FROM conquistas) || ' conquistas)'
        ELSE '❌ NENHUMA CONQUISTA INSERIDA'
      END
    ELSE '❌ TABELA CONQUISTAS NÃO EXISTE'
  END as resultado;

-- Lista de conquistas (se existirem)
SELECT
  nome,
  icone,
  pontos,
  categoria
FROM conquistas
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conquistas')
ORDER BY categoria, pontos;

-- ============================================
-- 8. RESUMO GERAL
-- ============================================

SELECT 'RESUMO GERAL DAS MIGRATIONS' as status;

WITH verificacoes AS (
  SELECT
    '1. add_pago_field.sql' as migration,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'gastos'
          AND column_name = 'pago'
      ) THEN '✅ APLICADO'
      ELSE '❌ NÃO APLICADO'
    END as status,
    1 as ordem
  UNION ALL
  SELECT
    '2. create_tags_system.sql' as migration,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'tags'
      ) THEN '✅ APLICADO'
      ELSE '❌ NÃO APLICADO'
    END as status,
    2 as ordem
  UNION ALL
  SELECT
    '3. create_orcamento_familiar.sql' as migration,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'orcamentos'
      ) THEN '✅ APLICADO'
      ELSE '❌ NÃO APLICADO'
    END as status,
    3 as ordem
  UNION ALL
  SELECT
    '4. create_sistema_mesada.sql' as migration,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'mesadas'
      ) THEN '✅ APLICADO'
      ELSE '❌ NÃO APLICADO'
    END as status,
    4 as ordem
  UNION ALL
  SELECT
    '5. create_funcionalidades_avancadas.sql' as migration,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'desafios_familia'
      ) THEN '✅ APLICADO'
      ELSE '❌ NÃO APLICADO'
    END as status,
    5 as ordem
  UNION ALL
  SELECT
    '6. melhorias_performance.sql' as migration,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'tags'
          AND column_name = 'deletado'
      ) THEN '✅ APLICADO'
      ELSE '❌ NÃO APLICADO'
    END as status,
    6 as ordem
)
SELECT
  migration,
  status
FROM verificacoes
ORDER BY ordem;

-- ============================================
-- RESULTADO FINAL
-- ============================================

SELECT
  CASE
    WHEN (
      SELECT COUNT(*)
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('tags', 'orcamentos', 'mesadas', 'desafios_familia')
    ) = 4 THEN '🎉 TODAS AS MIGRATIONS PRINCIPAIS APLICADAS! Sistema pronto para uso!'
    WHEN (
      SELECT COUNT(*)
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('tags', 'orcamentos', 'mesadas', 'desafios_familia')
    ) > 0 THEN '⚠️ MIGRATIONS PARCIALMENTE APLICADAS. Execute as migrations faltantes.'
    ELSE '❌ NENHUMA MIGRATION APLICADA. Execute todas as migrations na ordem correta.'
  END as resultado_final;
