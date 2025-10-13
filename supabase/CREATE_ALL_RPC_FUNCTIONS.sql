-- ============================================
-- CRIAR TODAS AS RPC FUNCTIONS NECESSÁRIAS
-- Script completo e final
-- ============================================

-- REMOVER TODAS as funções existentes primeiro
DROP FUNCTION IF EXISTS criar_cartao CASCADE;
DROP FUNCTION IF EXISTS atualizar_cartao CASCADE;
DROP FUNCTION IF EXISTS deletar_cartao CASCADE;
DROP FUNCTION IF EXISTS criar_gasolina CASCADE;
DROP FUNCTION IF EXISTS atualizar_gasolina CASCADE;
DROP FUNCTION IF EXISTS deletar_gasolina CASCADE;

-- ============================================
-- CARTÕES
-- ============================================

-- Criar cartão
CREATE FUNCTION criar_cartao(
  p_nome TEXT,
  p_bandeira TEXT,
  p_ultimos_digitos TEXT,
  p_limite DECIMAL,
  p_dia_vencimento INTEGER,
  p_dia_fechamento INTEGER,
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

  INSERT INTO public.cartoes (
    nome, bandeira, ultimos_digitos, limite, dia_vencimento, dia_fechamento,
    status, observacoes, usuario_id, familia_id, visivel_familia, privado, deletado
  ) VALUES (
    p_nome, p_bandeira, p_ultimos_digitos, p_limite, p_dia_vencimento, p_dia_fechamento,
    p_status, p_observacoes, v_usuario_id, NULLIF(p_familia_id, '')::uuid, p_visivel_familia, p_privado, false
  )
  RETURNING to_json(cartoes.*) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar cartão
CREATE FUNCTION atualizar_cartao(
  p_id TEXT,
  p_nome TEXT,
  p_bandeira TEXT,
  p_ultimos_digitos TEXT,
  p_limite DECIMAL,
  p_dia_vencimento INTEGER,
  p_dia_fechamento INTEGER,
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

  UPDATE public.cartoes SET
    nome = p_nome,
    bandeira = p_bandeira,
    ultimos_digitos = p_ultimos_digitos,
    limite = p_limite,
    dia_vencimento = p_dia_vencimento,
    dia_fechamento = p_dia_fechamento,
    status = p_status,
    observacoes = p_observacoes,
    visivel_familia = p_visivel_familia,
    privado = p_privado
  WHERE id = p_id::uuid AND usuario_id = v_usuario_id AND deletado = false
  RETURNING to_json(cartoes.*) INTO v_result;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Cartão não encontrado ou sem permissão';
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Deletar cartão
CREATE FUNCTION deletar_cartao(
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

  UPDATE public.cartoes SET
    deletado = true,
    deletado_em = NOW(),
    deletado_por = v_usuario_id
  WHERE id = p_id::uuid AND usuario_id = v_usuario_id
  RETURNING to_json(cartoes.*) INTO v_result;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Cartão não encontrado ou sem permissão';
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GASOLINA
-- ============================================

-- Criar gasolina
CREATE FUNCTION criar_gasolina(
  p_descricao TEXT,
  p_valor DECIMAL,
  p_litros DECIMAL,
  p_preco_litro DECIMAL,
  p_km_atual INTEGER,
  p_data TEXT,
  p_posto TEXT,
  p_tipo_combustivel TEXT,
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

  INSERT INTO public.gasolina (
    descricao, valor, litros, preco_litro, km_atual, data, posto, tipo_combustivel,
    usuario_id, familia_id, visivel_familia, privado, deletado
  ) VALUES (
    p_descricao, p_valor, p_litros, p_preco_litro, p_km_atual, p_data::date, p_posto, p_tipo_combustivel,
    v_usuario_id, NULLIF(p_familia_id, '')::uuid, p_visivel_familia, p_privado, false
  )
  RETURNING to_json(gasolina.*) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar gasolina
CREATE FUNCTION atualizar_gasolina(
  p_id TEXT,
  p_descricao TEXT,
  p_valor DECIMAL,
  p_litros DECIMAL,
  p_preco_litro DECIMAL,
  p_km_atual INTEGER,
  p_data TEXT,
  p_posto TEXT,
  p_tipo_combustivel TEXT,
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

  UPDATE public.gasolina SET
    descricao = p_descricao,
    valor = p_valor,
    litros = p_litros,
    preco_litro = p_preco_litro,
    km_atual = p_km_atual,
    data = p_data::date,
    posto = p_posto,
    tipo_combustivel = p_tipo_combustivel,
    visivel_familia = p_visivel_familia,
    privado = p_privado
  WHERE id = p_id::uuid AND usuario_id = v_usuario_id AND deletado = false
  RETURNING to_json(gasolina.*) INTO v_result;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Registro não encontrado ou sem permissão';
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Deletar gasolina
CREATE FUNCTION deletar_gasolina(
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

  UPDATE public.gasolina SET
    deletado = true,
    deletado_em = NOW(),
    deletado_por = v_usuario_id
  WHERE id = p_id::uuid AND usuario_id = v_usuario_id
  RETURNING to_json(gasolina.*) INTO v_result;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Registro não encontrado ou sem permissão';
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PERMISSÕES
-- ============================================

GRANT EXECUTE ON FUNCTION criar_cartao TO authenticated;
GRANT EXECUTE ON FUNCTION atualizar_cartao TO authenticated;
GRANT EXECUTE ON FUNCTION deletar_cartao TO authenticated;
GRANT EXECUTE ON FUNCTION criar_gasolina TO authenticated;
GRANT EXECUTE ON FUNCTION atualizar_gasolina TO authenticated;
GRANT EXECUTE ON FUNCTION deletar_gasolina TO authenticated;

-- Mensagem final
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓✓✓ Todas as RPC Functions criadas!';
  RAISE NOTICE '- Cartões: criar, atualizar, deletar';
  RAISE NOTICE '- Gasolina: criar, atualizar, deletar';
  RAISE NOTICE '- Contas Fixas: (já criadas anteriormente)';
  RAISE NOTICE '========================================';
END $$;
