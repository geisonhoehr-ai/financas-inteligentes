-- Verificação completa do banco
-- Execute no Supabase para ver tudo

-- 1. Contar TODAS as tabelas esperadas
SELECT COUNT(*) as total_tabelas
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

-- 2. Verificar soft delete em tags (melhorias_performance.sql)
SELECT
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tags' AND column_name = 'deletado'
  ) THEN '✅ melhorias_performance.sql APLICADO'
  ELSE '❌ melhorias_performance.sql NÃO APLICADO'
  END as status_melhorias;

-- 3. Verificar campo pago
SELECT COUNT(*) as campos_pago
FROM information_schema.columns
WHERE table_name IN ('gastos', 'contas_fixas', 'parcelas', 'salarios')
  AND column_name = 'pago';

-- 4. Contar views
SELECT COUNT(*) as total_views
FROM information_schema.views
WHERE table_schema = 'public' AND table_name LIKE 'vw_%';

-- 5. Contar functions
SELECT COUNT(*) as total_functions
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';

-- 6. Verificar conquistas
SELECT COUNT(*) as total_conquistas FROM conquistas;
