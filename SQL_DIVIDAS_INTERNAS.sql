-- ============================================
-- SISTEMA DE DÍVIDAS INTERNAS E RESPONSABILIDADE
-- ============================================
-- Solução para: "Comprei no cartão dela, mas a dívida é minha"

-- 1. Adicionar campos de responsabilidade na tabela gastos
-- ============================================
ALTER TABLE gastos 
ADD COLUMN IF NOT EXISTS pago_por UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS responsavel_por UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS percentual_divisao JSONB; -- Para dividir entre múltiplos membros

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_gastos_pago_por ON gastos(pago_por);
CREATE INDEX IF NOT EXISTS idx_gastos_responsavel_por ON gastos(responsavel_por);

COMMENT ON COLUMN gastos.pago_por IS 'Quem efetivamente pagou (ex: usou o cartão)';
COMMENT ON COLUMN gastos.responsavel_por IS 'Quem é responsável pela dívida';
COMMENT ON COLUMN gastos.percentual_divisao IS 'JSON com divisão percentual entre membros: {"user_id": 50, "user_id2": 50}';

-- 2. Tabela de dívidas internas entre membros da família
-- ============================================
CREATE TABLE IF NOT EXISTS dividas_internas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  credor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Quem pagou
  devedor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Quem deve
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  descricao TEXT,
  gasto_original_id UUID REFERENCES gastos(id) ON DELETE SET NULL, -- Link com gasto original
  parcela_numero INT, -- Se for parcela de um gasto parcelado
  parcela_total INT, -- Total de parcelas
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'cancelada')),
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_vencimento DATE, -- Para parcelas mensais
  data_pagamento TIMESTAMP,
  comprovante_url TEXT, -- URL de comprovante de pagamento (opcional)
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Garantir que credor e devedor são diferentes
  CONSTRAINT diferentes_pessoas CHECK (credor_id != devedor_id)
);

-- Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_dividas_familia ON dividas_internas(familia_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dividas_credor ON dividas_internas(credor_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dividas_devedor ON dividas_internas(devedor_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dividas_status ON dividas_internas(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dividas_gasto ON dividas_internas(gasto_original_id) WHERE deleted_at IS NULL;

COMMENT ON TABLE dividas_internas IS 'Registra dívidas internas entre membros da família/empresa';

-- 3. View de resumo de dívidas por pessoa
-- ============================================
CREATE OR REPLACE VIEW resumo_dividas_por_pessoa AS
SELECT 
  familia_id,
  credor_id,
  devedor_id,
  SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as total_pendente,
  SUM(CASE WHEN status = 'paga' THEN valor ELSE 0 END) as total_pago,
  SUM(CASE WHEN status = 'cancelada' THEN valor ELSE 0 END) as total_cancelado,
  COUNT(CASE WHEN status = 'pendente' THEN 1 END) as qtd_pendente,
  COUNT(CASE WHEN status = 'paga' THEN 1 END) as qtd_paga,
  MIN(CASE WHEN status = 'pendente' THEN data_vencimento END) as proxima_vencimento
FROM dividas_internas
WHERE deleted_at IS NULL
GROUP BY familia_id, credor_id, devedor_id;

COMMENT ON VIEW resumo_dividas_por_pessoa IS 'Resumo de dívidas entre cada par de pessoas';

-- 4. View de saldo consolidado (quem deve para quem, líquido)
-- ============================================
CREATE OR REPLACE VIEW saldo_dividas_consolidado AS
WITH dividas_bidirecionais AS (
  -- Dívidas onde pessoa A deve para pessoa B
  SELECT 
    familia_id,
    devedor_id as pessoa_a,
    credor_id as pessoa_b,
    SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as valor_deve
  FROM dividas_internas
  WHERE deleted_at IS NULL
  GROUP BY familia_id, devedor_id, credor_id
),
saldo_liquido AS (
  SELECT 
    d1.familia_id,
    d1.pessoa_a,
    d1.pessoa_b,
    d1.valor_deve,
    COALESCE(d2.valor_deve, 0) as valor_recebe,
    d1.valor_deve - COALESCE(d2.valor_deve, 0) as saldo_liquido
  FROM dividas_bidirecionais d1
  LEFT JOIN dividas_bidirecionais d2 
    ON d1.familia_id = d2.familia_id 
    AND d1.pessoa_a = d2.pessoa_b 
    AND d1.pessoa_b = d2.pessoa_a
)
SELECT 
  familia_id,
  CASE 
    WHEN saldo_liquido > 0 THEN pessoa_a 
    ELSE pessoa_b 
  END as devedor_id,
  CASE 
    WHEN saldo_liquido > 0 THEN pessoa_b 
    ELSE pessoa_a 
  END as credor_id,
  ABS(saldo_liquido) as valor_liquido
FROM saldo_liquido
WHERE ABS(saldo_liquido) > 0.01; -- Ignorar centavos

COMMENT ON VIEW saldo_dividas_consolidado IS 'Saldo líquido entre pessoas (otimizado)';

-- 5. View de meu resumo de dívidas (para usuário logado)
-- ============================================
CREATE OR REPLACE VIEW meu_resumo_dividas AS
SELECT 
  d.familia_id,
  d.devedor_id as user_id,
  SUM(CASE WHEN d.status = 'pendente' THEN d.valor ELSE 0 END) as total_devo,
  COUNT(CASE WHEN d.status = 'pendente' THEN 1 END) as qtd_devo
FROM dividas_internas d
WHERE d.deleted_at IS NULL
GROUP BY d.familia_id, d.devedor_id

UNION ALL

SELECT 
  d.familia_id,
  d.credor_id as user_id,
  -SUM(CASE WHEN d.status = 'pendente' THEN d.valor ELSE 0 END) as total_devo,
  COUNT(CASE WHEN d.status = 'pendente' THEN 1 END) as qtd_devo
FROM dividas_internas d
WHERE d.deleted_at IS NULL
GROUP BY d.familia_id, d.credor_id;

-- 6. Função para criar dívida automaticamente ao criar gasto
-- ============================================
CREATE OR REPLACE FUNCTION criar_divida_automatica()
RETURNS TRIGGER AS $$
BEGIN
  -- Se pago_por é diferente de responsavel_por, criar dívida interna
  IF NEW.pago_por IS NOT NULL 
     AND NEW.responsavel_por IS NOT NULL 
     AND NEW.pago_por != NEW.responsavel_por 
     AND NEW.familia_id IS NOT NULL THEN
    
    -- Inserir dívida interna
    INSERT INTO dividas_internas (
      familia_id,
      credor_id,
      devedor_id,
      valor,
      descricao,
      gasto_original_id,
      data_vencimento,
      status
    ) VALUES (
      NEW.familia_id,
      NEW.pago_por, -- Quem pagou é o credor
      NEW.responsavel_por, -- Quem é responsável é o devedor
      NEW.valor,
      'Ref: ' || NEW.descricao,
      NEW.id,
      NEW.data_vencimento,
      'pendente'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar dívida automaticamente
DROP TRIGGER IF EXISTS trigger_criar_divida_automatica ON gastos;
CREATE TRIGGER trigger_criar_divida_automatica
  AFTER INSERT ON gastos
  FOR EACH ROW
  EXECUTE FUNCTION criar_divida_automatica();

COMMENT ON FUNCTION criar_divida_automatica IS 'Cria dívida interna automaticamente quando pago_por != responsavel_por';

-- 7. Função para dividir gasto entre múltiplos membros
-- ============================================
CREATE OR REPLACE FUNCTION dividir_gasto_entre_membros(
  p_gasto_id UUID,
  p_divisao JSONB -- {"user_id": percentual, "user_id2": percentual}
)
RETURNS void AS $$
DECLARE
  v_gasto RECORD;
  v_membro RECORD;
  v_percentual NUMERIC;
  v_valor_divisao NUMERIC;
  v_total_percentual NUMERIC := 0;
BEGIN
  -- Buscar informações do gasto
  SELECT * INTO v_gasto FROM gastos WHERE id = p_gasto_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Gasto não encontrado';
  END IF;
  
  -- Verificar se a soma dos percentuais é 100
  SELECT SUM((value->>'percentual')::NUMERIC) 
  INTO v_total_percentual
  FROM jsonb_each(p_divisao);
  
  IF v_total_percentual != 100 THEN
    RAISE EXCEPTION 'Soma dos percentuais deve ser 100. Atual: %', v_total_percentual;
  END IF;
  
  -- Criar dívidas para cada membro (exceto quem pagou)
  FOR v_membro IN 
    SELECT key as user_id, (value->>'percentual')::NUMERIC as percentual
    FROM jsonb_each(p_divisao)
  LOOP
    -- Se não for quem pagou, criar dívida
    IF v_membro.user_id::UUID != v_gasto.pago_por THEN
      v_valor_divisao := (v_gasto.valor * v_membro.percentual / 100);
      
      INSERT INTO dividas_internas (
        familia_id,
        credor_id,
        devedor_id,
        valor,
        descricao,
        gasto_original_id,
        status
      ) VALUES (
        v_gasto.familia_id,
        v_gasto.pago_por,
        v_membro.user_id::UUID,
        v_valor_divisao,
        'Divisão: ' || v_gasto.descricao || ' (' || v_membro.percentual || '%)',
        v_gasto.id,
        'pendente'
      );
    END IF;
  END LOOP;
  
  -- Atualizar gasto com a divisão
  UPDATE gastos 
  SET percentual_divisao = p_divisao 
  WHERE id = p_gasto_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION dividir_gasto_entre_membros IS 'Divide um gasto entre múltiplos membros da família';

-- 8. Função para marcar dívida como paga
-- ============================================
CREATE OR REPLACE FUNCTION marcar_divida_paga(
  p_divida_id UUID,
  p_comprovante_url TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE dividas_internas
  SET 
    status = 'paga',
    data_pagamento = NOW(),
    comprovante_url = COALESCE(p_comprovante_url, comprovante_url),
    updated_at = NOW()
  WHERE id = p_divida_id
    AND status = 'pendente';
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dívida não encontrada ou já foi paga';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 9. Função para cancelar dívida
-- ============================================
CREATE OR REPLACE FUNCTION cancelar_divida(
  p_divida_id UUID,
  p_motivo TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE dividas_internas
  SET 
    status = 'cancelada',
    observacoes = COALESCE(p_motivo, observacoes),
    updated_at = NOW()
  WHERE id = p_divida_id
    AND status = 'pendente';
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dívida não encontrada ou já foi processada';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 10. RLS (Row Level Security) para dividas_internas
-- ============================================
ALTER TABLE dividas_internas ENABLE ROW LEVEL SECURITY;

-- Política: Ver apenas dívidas da sua família
CREATE POLICY dividas_ver_propria_familia ON dividas_internas
  FOR SELECT
  USING (
    familia_id IN (
      SELECT familia_id 
      FROM familia_membros 
      WHERE user_id = auth.uid()
      AND deleted_at IS NULL
    )
  );

-- Política: Criar dívidas apenas na sua família
CREATE POLICY dividas_criar_propria_familia ON dividas_internas
  FOR INSERT
  WITH CHECK (
    familia_id IN (
      SELECT familia_id 
      FROM familia_membros 
      WHERE user_id = auth.uid()
      AND deleted_at IS NULL
    )
  );

-- Política: Atualizar apenas se for credor ou devedor
CREATE POLICY dividas_atualizar_envolvidos ON dividas_internas
  FOR UPDATE
  USING (
    credor_id = auth.uid() OR devedor_id = auth.uid()
  );

-- Política: Admin pode deletar
CREATE POLICY dividas_deletar_admin ON dividas_internas
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM familia_membros 
      WHERE familia_id = dividas_internas.familia_id
      AND user_id = auth.uid()
      AND papel IN ('admin', 'owner')
      AND deleted_at IS NULL
    )
  );

-- 11. Atualizar timestamp automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_dividas_updated_at ON dividas_internas;
CREATE TRIGGER trigger_dividas_updated_at
  BEFORE UPDATE ON dividas_internas
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at();

-- 12. Função para obter resumo de dívidas de um usuário
-- ============================================
CREATE OR REPLACE FUNCTION obter_meu_resumo_dividas(p_familia_id UUID DEFAULT NULL)
RETURNS TABLE (
  familia_id UUID,
  familia_nome TEXT,
  total_devo NUMERIC,
  total_recebo NUMERIC,
  saldo_liquido NUMERIC,
  qtd_dividas_pendentes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH minhas_dividas AS (
    SELECT 
      d.familia_id,
      f.nome as familia_nome,
      SUM(CASE WHEN d.devedor_id = auth.uid() AND d.status = 'pendente' THEN d.valor ELSE 0 END) as devo,
      SUM(CASE WHEN d.credor_id = auth.uid() AND d.status = 'pendente' THEN d.valor ELSE 0 END) as recebo,
      COUNT(CASE WHEN d.status = 'pendente' AND (d.devedor_id = auth.uid() OR d.credor_id = auth.uid()) THEN 1 END) as qtd
    FROM dividas_internas d
    JOIN familias f ON f.id = d.familia_id
    WHERE d.deleted_at IS NULL
      AND (p_familia_id IS NULL OR d.familia_id = p_familia_id)
      AND (d.devedor_id = auth.uid() OR d.credor_id = auth.uid())
    GROUP BY d.familia_id, f.nome
  )
  SELECT 
    md.familia_id,
    md.familia_nome,
    md.devo as total_devo,
    md.recebo as total_recebo,
    (md.recebo - md.devo) as saldo_liquido,
    md.qtd as qtd_dividas_pendentes
  FROM minhas_dividas md;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Mensagens informativas
DO $$ 
BEGIN
  RAISE NOTICE '✅ Sistema de Dívidas Internas criado com sucesso!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Funcionalidades implementadas:';
  RAISE NOTICE '   - Campos pago_por e responsavel_por em gastos';
  RAISE NOTICE '   - Tabela dividas_internas';
  RAISE NOTICE '   - Views de resumo e saldo consolidado';
  RAISE NOTICE '   - Criação automática de dívidas';
  RAISE NOTICE '   - Divisão de gastos entre membros';
  RAISE NOTICE '   - Funções de marcar como paga e cancelar';
  RAISE NOTICE '   - RLS configurado';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Casos de uso:';
  RAISE NOTICE '   ✓ Compra parcelada no cartão de outro membro';
  RAISE NOTICE '   ✓ Dividir conta de restaurante';
  RAISE NOTICE '   ✓ Reembolsos entre membros';
  RAISE NOTICE '   ✓ Controle de "quem deve para quem"';
END $$;

