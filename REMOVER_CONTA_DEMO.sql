-- ============================================
-- REMOVER CONTA DEMO
-- ============================================
-- Este script remove a conta demo e todos os seus dados
-- de forma segura, mantendo a integridade do banco
-- ============================================

DO $$
DECLARE
  v_demo_id text;
  v_demo_email text := 'demo@financeiro.com';
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔄 ============================================';
  RAISE NOTICE '🔄 INICIANDO REMOÇÃO DA CONTA DEMO';
  RAISE NOTICE '🔄 ============================================';
  RAISE NOTICE '';

  -- Obter ID do usuário demo
  SELECT id INTO v_demo_id
  FROM users
  WHERE email = v_demo_email;

  IF v_demo_id IS NULL THEN
    RAISE NOTICE '❌ Usuário demo não encontrado';
    RETURN;
  END IF;

  RAISE NOTICE '📊 Removendo dados do usuário demo (ID: %)', v_demo_id;

  -- Remover registros relacionados
  DELETE FROM familia_membros WHERE usuario_id = v_demo_id;
  DELETE FROM gastos WHERE usuario_id = v_demo_id;
  DELETE FROM assinaturas WHERE usuario_id = v_demo_id;
  DELETE FROM cartoes WHERE usuario_id = v_demo_id;
  DELETE FROM contas_fixas WHERE usuario_id = v_demo_id;
  DELETE FROM dividas_internas WHERE credor_id = v_demo_id OR devedor_id = v_demo_id;
  DELETE FROM gasolina WHERE usuario_id = v_demo_id;
  DELETE FROM investimentos WHERE usuario_id = v_demo_id;
  DELETE FROM metas WHERE usuario_id = v_demo_id;
  DELETE FROM salaries WHERE usuario_id = v_demo_id;

  -- Remover usuário do auth.users
  DELETE FROM auth.users WHERE id = v_demo_id;

  -- Remover usuário da tabela users
  DELETE FROM users WHERE id = v_demo_id;

  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ CONTA DEMO REMOVIDA COM SUCESSO!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';

  -- Verificar remoção
  IF EXISTS (SELECT 1 FROM users WHERE email = v_demo_email) THEN
    RAISE WARNING '⚠️ Usuário ainda existe na tabela users';
  ELSE
    RAISE NOTICE '✅ Usuário removido da tabela users';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = v_demo_email) THEN
    RAISE WARNING '⚠️ Usuário ainda existe na tabela auth.users';
  ELSE
    RAISE NOTICE '✅ Usuário removido da tabela auth.users';
  END IF;

  -- Atualizar views materializadas
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_mensal;

  RAISE NOTICE '';
  RAISE NOTICE '🎯 Próximos passos:';
  RAISE NOTICE '   1. Verificar login com geisonhoehr@gmail.com';
  RAISE NOTICE '   2. Confirmar que dados demo não aparecem mais';
  RAISE NOTICE '';
END $$;
