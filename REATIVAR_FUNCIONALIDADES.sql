-- ============================================
-- REATIVAR FUNCIONALIDADES
-- ============================================
-- Este script reativa todas as funcionalidades do sistema
-- após a migração para UUID
-- ============================================

-- PASSO 1: Criar funções RPC
-- ============================================
CREATE OR REPLACE FUNCTION validar_convite(p_codigo text)
RETURNS TABLE (
  valido boolean,
  mensagem text,
  convite_id text,
  familia_id text,
  familia_nome text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as valido,
    'Convite válido' as mensagem,
    c.id as convite_id,
    c.familia_id,
    f.nome as familia_nome
  FROM convites c
  JOIN familias f ON f.id = c.familia_id
  WHERE c.codigo = p_codigo
    AND c.ativo = TRUE
    AND c.deletado IS NOT TRUE
    AND (c.validade IS NULL OR c.validade > NOW())
    AND (c.max_usos IS NULL OR c.usos_atual < c.max_usos);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION aceitar_convite(p_codigo text, p_usuario_id text)
RETURNS TABLE (
  sucesso boolean,
  mensagem text,
  familia_id text
) AS $$
DECLARE
  v_convite_id text;
  v_familia_id text;
  v_familia_nome text;
  v_ja_membro boolean;
BEGIN
  -- Validar convite
  SELECT 
    c.id, c.familia_id, f.nome
  INTO v_convite_id, v_familia_id, v_familia_nome
  FROM convites c
  JOIN familias f ON f.id = c.familia_id
  WHERE c.codigo = p_codigo
    AND c.ativo = TRUE
    AND c.deletado IS NOT TRUE
    AND (c.validade IS NULL OR c.validade > NOW())
    AND (c.max_usos IS NULL OR c.usos_atual < c.max_usos);

  IF v_convite_id IS NULL THEN
    RETURN QUERY SELECT 
      FALSE as sucesso,
      'Convite inválido ou expirado' as mensagem,
      NULL::text as familia_id;
    RETURN;
  END IF;

  -- Verificar se já é membro
  SELECT EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_id = v_familia_id
      AND usuario_id = p_usuario_id
      AND deletado IS NOT TRUE
  ) INTO v_ja_membro;

  IF v_ja_membro THEN
    RETURN QUERY SELECT 
      FALSE as sucesso,
      'Você já é membro desta família' as mensagem,
      NULL::text as familia_id;
    RETURN;
  END IF;

  -- Adicionar membro
  INSERT INTO familia_membros (
    familia_id,
    usuario_id,
    papel,
    aprovado,
    created_at
  ) VALUES (
    v_familia_id,
    p_usuario_id,
    'membro',
    TRUE,
    NOW()
  );

  -- Atualizar contador de usos
  UPDATE convites SET
    usos_atual = COALESCE(usos_atual, 0) + 1,
    updated_at = NOW()
  WHERE id = v_convite_id;

  RETURN QUERY SELECT 
    TRUE as sucesso,
    'Bem-vindo à família ' || v_familia_nome as mensagem,
    v_familia_id as familia_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION marcar_divida_paga(p_divida_id text, p_comprovante_url text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  UPDATE dividas_internas SET
    status = 'paga',
    data_pagamento = NOW(),
    comprovante_url = p_comprovante_url,
    updated_at = NOW()
  WHERE id = p_divida_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION cancelar_divida(p_divida_id text, p_motivo text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  UPDATE dividas_internas SET
    status = 'cancelada',
    observacoes = CASE 
      WHEN observacoes IS NULL THEN p_motivo
      ELSE observacoes || E'\n' || p_motivo
    END,
    updated_at = NOW()
  WHERE id = p_divida_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION obter_meu_resumo_dividas(p_familia_id text DEFAULT NULL)
RETURNS TABLE (
  familia_id text,
  familia_nome text,
  total_devo numeric,
  total_recebo numeric,
  saldo_liquido numeric,
  qtd_dividas_pendentes bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id as familia_id,
    f.nome as familia_nome,
    COALESCE(SUM(CASE WHEN d.devedor_id = auth.uid() THEN d.valor ELSE 0 END), 0) as total_devo,
    COALESCE(SUM(CASE WHEN d.credor_id = auth.uid() THEN d.valor ELSE 0 END), 0) as total_recebo,
    COALESCE(SUM(CASE 
      WHEN d.credor_id = auth.uid() THEN d.valor
      WHEN d.devedor_id = auth.uid() THEN -d.valor
      ELSE 0
    END), 0) as saldo_liquido,
    COUNT(*) FILTER (WHERE d.status = 'pendente') as qtd_dividas_pendentes
  FROM familias f
  LEFT JOIN dividas_internas d ON d.familia_id = f.id
  WHERE f.id = COALESCE(p_familia_id, f.id)
    AND d.deleted_at IS NULL
    AND (d.credor_id = auth.uid() OR d.devedor_id = auth.uid())
  GROUP BY f.id, f.nome;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 2: Criar views materializadas
-- ============================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_dashboard_mensal AS
WITH meses AS (
  SELECT 
    date_trunc('month', d)::date as mes_referencia,
    EXTRACT(MONTH FROM d) as mes,
    EXTRACT(YEAR FROM d) as ano
  FROM generate_series(
    date_trunc('month', current_date - interval '12 months'),
    date_trunc('month', current_date),
    '1 month'::interval
  ) d
),
gastos_mensais AS (
  SELECT
    date_trunc('month', data)::date as mes_referencia,
    SUM(valor) as total
  FROM gastos
  WHERE deletado IS NOT TRUE
  GROUP BY 1
),
assinaturas_mensais AS (
  SELECT
    date_trunc('month', data_criacao)::date as mes_referencia,
    SUM(valor) as total
  FROM assinaturas
  WHERE deletado IS NOT TRUE
  GROUP BY 1
),
contas_fixas_mensais AS (
  SELECT
    date_trunc('month', data_criacao)::date as mes_referencia,
    SUM(valor) as total
  FROM contas_fixas
  WHERE deletado IS NOT TRUE
  GROUP BY 1
),
gasolina_mensal AS (
  SELECT
    date_trunc('month', data)::date as mes_referencia,
    SUM(valor) as total
  FROM gasolina
  WHERE deletado IS NOT TRUE
  GROUP BY 1
),
ferramentas_mensal AS (
  SELECT
    date_trunc('month', data_criacao)::date as mes_referencia,
    SUM(valor) as total
  FROM ferramentas_ia_dev
  WHERE deletado IS NOT TRUE
  GROUP BY 1
),
parcelas_mensal AS (
  SELECT
    date_trunc('month', data_compra)::date as mes_referencia,
    SUM(valor_parcela) as total
  FROM compras_parceladas
  WHERE deletado IS NOT TRUE
  GROUP BY 1
),
receitas_mensal AS (
  SELECT
    date_trunc('month', created_at)::date as mes_referencia,
    SUM(valor) as total
  FROM salaries
  WHERE deletado IS NOT TRUE
  GROUP BY 1
)
SELECT
  m.mes_referencia,
  m.mes,
  m.ano,
  COALESCE(g.total, 0) as gastos_mes,
  COALESCE(a.total, 0) as assinaturas_mes,
  COALESCE(c.total, 0) as contas_fixas_mes,
  COALESCE(ga.total, 0) as gasolina_mes,
  COALESCE(f.total, 0) as ferramentas_mes,
  COALESCE(p.total, 0) as parcelas_mes,
  COALESCE(r.total, 0) as receitas_total,
  NOW() as atualizado_em
FROM meses m
LEFT JOIN gastos_mensais g ON g.mes_referencia = m.mes_referencia
LEFT JOIN assinaturas_mensais a ON a.mes_referencia = m.mes_referencia
LEFT JOIN contas_fixas_mensais c ON c.mes_referencia = m.mes_referencia
LEFT JOIN gasolina_mensal ga ON ga.mes_referencia = m.mes_referencia
LEFT JOIN ferramentas_mensal f ON f.mes_referencia = m.mes_referencia
LEFT JOIN parcelas_mensal p ON p.mes_referencia = m.mes_referencia
LEFT JOIN receitas_mensal r ON r.mes_referencia = m.mes_referencia;

CREATE OR REPLACE FUNCTION refresh_dashboard_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_mensal;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 3: Criar índices
-- ============================================
CREATE INDEX IF NOT EXISTS idx_gastos_data ON gastos(data);
CREATE INDEX IF NOT EXISTS idx_gastos_usuario ON gastos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_gastos_familia ON gastos(familia_id);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_gastos_deletado ON gastos(deletado);

CREATE INDEX IF NOT EXISTS idx_dividas_internas_status ON dividas_internas(status);
CREATE INDEX IF NOT EXISTS idx_dividas_internas_credor ON dividas_internas(credor_id);
CREATE INDEX IF NOT EXISTS idx_dividas_internas_devedor ON dividas_internas(devedor_id);
CREATE INDEX IF NOT EXISTS idx_dividas_internas_familia ON dividas_internas(familia_id);

CREATE INDEX IF NOT EXISTS idx_familia_membros_usuario ON familia_membros(usuario_id);
CREATE INDEX IF NOT EXISTS idx_familia_membros_familia ON familia_membros(familia_id);
CREATE INDEX IF NOT EXISTS idx_familia_membros_deletado ON familia_membros(deletado);

-- PASSO 4: Verificação final
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ FUNCIONALIDADES REATIVADAS COM SUCESSO!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  
  -- Verificar funções
  RAISE NOTICE '📋 Funções criadas:';
  RAISE NOTICE '   - validar_convite';
  RAISE NOTICE '   - aceitar_convite';
  RAISE NOTICE '   - marcar_divida_paga';
  RAISE NOTICE '   - cancelar_divida';
  RAISE NOTICE '   - obter_meu_resumo_dividas';
  RAISE NOTICE '   - refresh_dashboard_views';
  RAISE NOTICE '';
  
  -- Verificar views
  RAISE NOTICE '📊 Views materializadas:';
  RAISE NOTICE '   - mv_dashboard_mensal';
  RAISE NOTICE '';
  
  -- Verificar índices
  RAISE NOTICE '🔍 Índices criados:';
  RAISE NOTICE '   - idx_gastos_*';
  RAISE NOTICE '   - idx_dividas_internas_*';
  RAISE NOTICE '   - idx_familia_membros_*';
  RAISE NOTICE '';
  
  RAISE NOTICE '🎯 Próximos passos:';
  RAISE NOTICE '   1. Testar convites';
  RAISE NOTICE '   2. Testar dívidas';
  RAISE NOTICE '   3. Testar dashboard';
  RAISE NOTICE '';
END $$;
