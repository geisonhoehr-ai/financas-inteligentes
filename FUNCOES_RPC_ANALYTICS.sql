-- Funções RPC para Analytics
-- Execute no SQL Editor do Supabase

-- 1. Buscar gastos por mês
CREATE OR REPLACE FUNCTION buscar_gastos_por_mes(
    p_familia_id UUID,
    p_meses INTEGER DEFAULT 12
)
RETURNS TABLE (
    mes_ano TEXT,
    total NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(DATE_TRUNC('month', g.data), 'MM/YYYY') as mes_ano,
        COALESCE(SUM(g.valor), 0) as total
    FROM gastos g
    WHERE g.familia_id = p_familia_id
        AND g.deletado = false
        AND g.data >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' * p_meses
    GROUP BY DATE_TRUNC('month', g.data)
    ORDER BY DATE_TRUNC('month', g.data);
END;
$$;

-- 2. Buscar receitas por mês
CREATE OR REPLACE FUNCTION buscar_receitas_por_mes(
    p_familia_id UUID,
    p_meses INTEGER DEFAULT 12
)
RETURNS TABLE (
    mes_ano TEXT,
    total NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(DATE_TRUNC('month', s.data_inicio), 'MM/YYYY') as mes_ano,
        COALESCE(SUM(s.valor), 0) as total
    FROM salaries s
    WHERE s.familia_id = p_familia_id
        AND s.deletado = false
        AND s.data_inicio >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' * p_meses
    GROUP BY DATE_TRUNC('month', s.data_inicio)
    ORDER BY DATE_TRUNC('month', s.data_inicio);
END;
$$;

-- 3. Buscar gastos por categoria
CREATE OR REPLACE FUNCTION buscar_gastos_por_categoria(
    p_familia_id UUID,
    p_meses INTEGER DEFAULT 3
)
RETURNS TABLE (
    categoria TEXT,
    total NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(c.nome, 'Sem categoria') as categoria,
        COALESCE(SUM(g.valor), 0) as total
    FROM gastos g
    LEFT JOIN categorias c ON c.id = g.categoria_id
    WHERE g.familia_id = p_familia_id
        AND g.deletado = false
        AND g.data >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' * p_meses
    GROUP BY c.nome
    ORDER BY SUM(g.valor) DESC
    LIMIT 10;
END;
$$;

-- 4. Buscar evolução dos investimentos
CREATE OR REPLACE FUNCTION buscar_investimentos_evolucao(
    p_familia_id UUID,
    p_meses INTEGER DEFAULT 12
)
RETURNS TABLE (
    mes_ano TEXT,
    valor_atual NUMERIC,
    rentabilidade NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(DATE_TRUNC('month', i.created_at), 'MM/YYYY') as mes_ano,
        COALESCE(SUM(i.valor_atual), 0) as valor_atual,
        COALESCE(AVG(
            CASE 
                WHEN i.valor_investido > 0 THEN 
                    ((i.valor_atual - i.valor_investido) / i.valor_investido) * 100
                ELSE 0
            END
        ), 0) as rentabilidade
    FROM investimentos i
    WHERE i.familia_id = p_familia_id
        AND i.deletado = false
        AND i.created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' * p_meses
    GROUP BY DATE_TRUNC('month', i.created_at)
    ORDER BY DATE_TRUNC('month', i.created_at);
END;
$$;

-- 5. Buscar insights gerais
CREATE OR REPLACE FUNCTION buscar_insights_financeiros(
    p_familia_id UUID
)
RETURNS TABLE (
    total_gastos NUMERIC,
    total_receitas NUMERIC,
    saldo_liquido NUMERIC,
    economia_mensal NUMERIC,
    categoria_maior_gasto TEXT,
    meta_progresso NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_gastos NUMERIC;
    v_total_receitas NUMERIC;
    v_saldo_liquido NUMERIC;
    v_economia_mensal NUMERIC;
    v_categoria_maior_gasto TEXT;
    v_meta_progresso NUMERIC;
BEGIN
    -- Total de gastos dos últimos 12 meses
    SELECT COALESCE(SUM(g.valor), 0) INTO v_total_gastos
    FROM gastos g
    WHERE g.familia_id = p_familia_id
        AND g.deletado = false
        AND g.data >= CURRENT_DATE - INTERVAL '12 months';

    -- Total de receitas dos últimos 12 meses
    SELECT COALESCE(SUM(s.valor), 0) INTO v_total_receitas
    FROM salaries s
    WHERE s.familia_id = p_familia_id
        AND s.deletado = false
        AND s.data_inicio >= CURRENT_DATE - INTERVAL '12 months';

    -- Saldo líquido
    v_saldo_liquido := v_total_receitas - v_total_gastos;

    -- Economia mensal média
    v_economia_mensal := v_saldo_liquido / 12;

    -- Categoria com maior gasto
    SELECT COALESCE(c.nome, 'Sem categoria') INTO v_categoria_maior_gasto
    FROM gastos g
    LEFT JOIN categorias c ON c.id = g.categoria_id
    WHERE g.familia_id = p_familia_id
        AND g.deletado = false
        AND g.data >= CURRENT_DATE - INTERVAL '3 months'
    GROUP BY c.nome
    ORDER BY SUM(g.valor) DESC
    LIMIT 1;

    -- Progresso das metas (baseado na receita vs gastos)
    IF v_total_gastos > 0 THEN
        v_meta_progresso := LEAST((v_total_receitas / (v_total_gastos * 1.2)) * 100, 100);
    ELSE
        v_meta_progresso := 100;
    END IF;

    RETURN QUERY
    SELECT 
        v_total_gastos,
        v_total_receitas,
        v_saldo_liquido,
        v_economia_mensal,
        v_categoria_maior_gasto,
        v_meta_progresso;
END;
$$;

-- 6. Buscar alertas inteligentes
CREATE OR REPLACE FUNCTION buscar_alertas_inteligentes(
    p_familia_id UUID
)
RETURNS TABLE (
    tipo_alerta TEXT,
    titulo TEXT,
    mensagem TEXT,
    prioridade TEXT,
    acao_sugerida TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_gastos_mes_atual NUMERIC;
    v_gastos_mes_anterior NUMERIC;
    v_cartoes_proximo_limite INTEGER;
    v_parcelas_vencendo INTEGER;
    v_meta_progresso NUMERIC;
BEGIN
    -- Gastos do mês atual
    SELECT COALESCE(SUM(g.valor), 0) INTO v_gastos_mes_atual
    FROM gastos g
    WHERE g.familia_id = p_familia_id
        AND g.deletado = false
        AND DATE_TRUNC('month', g.data) = DATE_TRUNC('month', CURRENT_DATE);

    -- Gastos do mês anterior
    SELECT COALESCE(SUM(g.valor), 0) INTO v_gastos_mes_anterior
    FROM gastos g
    WHERE g.familia_id = p_familia_id
        AND g.deletado = false
        AND DATE_TRUNC('month', g.data) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');

    -- Cartões próximos do limite (80% ou mais)
    SELECT COUNT(*) INTO v_cartoes_proximo_limite
    FROM cartoes c
    WHERE c.familia_id = p_familia_id
        AND c.deletado = false
        AND c.status = 'ativo'
        AND (c.gasto_atual / c.limite) >= 0.8;

    -- Parcelas vencendo nos próximos 7 dias
    SELECT COUNT(*) INTO v_parcelas_vencendo
    FROM parcelas p
    WHERE p.familia_id = p_familia_id
        AND p.deletado = false
        AND p.data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days';

    -- Gerar alertas baseados nos dados
    -- Alerta de gastos altos
    IF v_gastos_mes_atual > v_gastos_mes_anterior * 1.2 THEN
        RETURN QUERY
        SELECT 
            'gastos_alto'::TEXT,
            'Gastos em Alta'::TEXT,
            'Seus gastos deste mês estão 20% acima do mês anterior.'::TEXT,
            'media'::TEXT,
            'Revise suas despesas e considere reduzir gastos desnecessários.'::TEXT;
    END IF;

    -- Alerta de cartões próximos do limite
    IF v_cartoes_proximo_limite > 0 THEN
        RETURN QUERY
        SELECT 
            'cartao_limite'::TEXT,
            'Cartão Próximo do Limite'::TEXT,
            FORMAT('Você tem %s cartão(ões) com utilização acima de 80%.', v_cartoes_proximo_limite)::TEXT,
            'alta'::TEXT,
            'Considere pagar parte da fatura ou reduzir gastos no cartão.'::TEXT;
    END IF;

    -- Alerta de parcelas vencendo
    IF v_parcelas_vencendo > 0 THEN
        RETURN QUERY
        SELECT 
            'parcelas_vencendo'::TEXT,
            'Parcelas Vencendo'::TEXT,
            FORMAT('Você tem %s parcela(s) vencendo nos próximos 7 dias.', v_parcelas_vencendo)::TEXT,
            'alta'::TEXT,
            'Verifique suas parcelas e programe os pagamentos.'::TEXT;
    END IF;

    -- Alerta de economia baixa
    IF v_gastos_mes_atual > 0 AND v_gastos_mes_atual > v_gastos_mes_anterior THEN
        RETURN QUERY
        SELECT 
            'economia_baixa'::TEXT,
            'Economia Baixa'::TEXT,
            'Seus gastos estão aumentando. Considere revisar seu orçamento.'::TEXT,
            'baixa'::TEXT,
            'Analise suas categorias de gastos e identifique oportunidades de economia.'::TEXT;
    END IF;
END;
$$;

-- Conceder permissões
GRANT EXECUTE ON FUNCTION buscar_gastos_por_mes(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_receitas_por_mes(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_gastos_por_categoria(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_investimentos_evolucao(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_insights_financeiros(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_alertas_inteligentes(UUID) TO authenticated;
