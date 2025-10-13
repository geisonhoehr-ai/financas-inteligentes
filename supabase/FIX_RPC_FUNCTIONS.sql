-- ============================================
-- CORRIGIR RPC FUNCTIONS DUPLICADAS
-- ============================================

-- 1. Remover TODAS as versões da função criar_conta_fixa
DROP FUNCTION IF EXISTS criar_conta_fixa CASCADE;

-- 2. Remover TODAS as versões da função atualizar_conta_fixa
DROP FUNCTION IF EXISTS atualizar_conta_fixa CASCADE;

-- 3. Remover TODAS as versões da função deletar_conta_fixa
DROP FUNCTION IF EXISTS deletar_conta_fixa CASCADE;

-- 4. Remover função refresh_dashboard_views se existir
DROP FUNCTION IF EXISTS refresh_dashboard_views CASCADE;

-- Agora recriar com a assinatura correta

-- 1. Função para criar conta fixa
CREATE FUNCTION criar_conta_fixa(
  p_nome TEXT,
  p_valor DECIMAL,
  p_dia_vencimento INTEGER,
  p_categoria TEXT,
  p_status TEXT,
  p_observacoes TEXT,
  p_familia_id TEXT,
  p_visivel_familia BOOLEAN,
  p_privado BOOLEAN
) RETURNS json AS $$
DECLARE
  v_usuario_id uuid;
  v_result json;
BEGIN
  v_usuario_id := auth.uid();

  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  INSERT INTO public.contas_fixas (
    nome,
    valor,
    dia_vencimento,
    categoria,
    status,
    observacoes,
    usuario_id,
    familia_id,
    visivel_familia,
    privado,
    deletado
  ) VALUES (
    p_nome,
    p_valor,
    p_dia_vencimento,
    p_categoria,
    p_status,
    p_observacoes,
    v_usuario_id,
    NULLIF(p_familia_id, '')::uuid,
    p_visivel_familia,
    p_privado,
    false
  )
  RETURNING to_json(contas_fixas.*) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Função para atualizar conta fixa
CREATE FUNCTION atualizar_conta_fixa(
  p_id TEXT,
  p_nome TEXT,
  p_valor DECIMAL,
  p_dia_vencimento INTEGER,
  p_categoria TEXT,
  p_status TEXT,
  p_observacoes TEXT,
  p_visivel_familia BOOLEAN,
  p_privado BOOLEAN
) RETURNS json AS $$
DECLARE
  v_usuario_id uuid;
  v_result json;
BEGIN
  v_usuario_id := auth.uid();

  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  UPDATE public.contas_fixas
  SET
    nome = p_nome,
    valor = p_valor,
    dia_vencimento = p_dia_vencimento,
    categoria = p_categoria,
    status = p_status,
    observacoes = p_observacoes,
    visivel_familia = p_visivel_familia,
    privado = p_privado
  WHERE id = p_id::uuid
    AND usuario_id = v_usuario_id
    AND deletado = false
  RETURNING to_json(contas_fixas.*) INTO v_result;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Conta fixa não encontrada ou sem permissão';
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Função para deletar conta fixa (soft delete)
CREATE FUNCTION deletar_conta_fixa(
  p_id TEXT
) RETURNS json AS $$
DECLARE
  v_usuario_id uuid;
  v_result json;
BEGIN
  v_usuario_id := auth.uid();

  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  UPDATE public.contas_fixas
  SET
    deletado = true,
    deletado_em = NOW(),
    deletado_por = v_usuario_id
  WHERE id = p_id::uuid
    AND usuario_id = v_usuario_id
  RETURNING to_json(contas_fixas.*) INTO v_result;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Conta fixa não encontrada ou sem permissão';
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Função auxiliar para refresh de views
CREATE FUNCTION refresh_dashboard_views()
RETURNS void AS $$
BEGIN
  -- Placeholder para futuras materialized views
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir permissões
GRANT EXECUTE ON FUNCTION criar_conta_fixa(TEXT, DECIMAL, INTEGER, TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION atualizar_conta_fixa(TEXT, TEXT, DECIMAL, INTEGER, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION deletar_conta_fixa(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_dashboard_views() TO authenticated;

-- Mensagem final
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓✓✓ RPC Functions corrigidas!';
  RAISE NOTICE '- criar_conta_fixa';
  RAISE NOTICE '- atualizar_conta_fixa';
  RAISE NOTICE '- deletar_conta_fixa';
  RAISE NOTICE '- refresh_dashboard_views';
  RAISE NOTICE '========================================';
END $$;
