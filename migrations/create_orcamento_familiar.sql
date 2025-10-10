-- Sistema de Orçamento Familiar
-- Permite definir orçamentos por categoria e tag, com acompanhamento em tempo real

-- Tabela de Orçamentos
CREATE TABLE IF NOT EXISTS orcamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  valor_total DECIMAL(10, 2) NOT NULL,
  mes_referencia INTEGER NOT NULL CHECK (mes_referencia >= 1 AND mes_referencia <= 12),
  ano_referencia INTEGER NOT NULL CHECK (ano_referencia >= 2000),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, familia_id, mes_referencia, ano_referencia)
);

-- Tabela de Itens do Orçamento (por categoria)
CREATE TABLE IF NOT EXISTS orcamento_categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  nome_categoria VARCHAR(100), -- Para categorias customizadas
  valor_planejado DECIMAL(10, 2) NOT NULL,
  alerta_percentual INTEGER DEFAULT 80, -- Alertar quando usar X% do orçamento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(orcamento_id, categoria_id)
);

-- Tabela de Itens do Orçamento (por tag)
CREATE TABLE IF NOT EXISTS orcamento_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  valor_planejado DECIMAL(10, 2) NOT NULL,
  alerta_percentual INTEGER DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(orcamento_id, tag_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_orcamentos_usuario ON orcamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_familia ON orcamentos(familia_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_mes_ano ON orcamentos(mes_referencia, ano_referencia);
CREATE INDEX IF NOT EXISTS idx_orcamento_categorias_orcamento ON orcamento_categorias(orcamento_id);
CREATE INDEX IF NOT EXISTS idx_orcamento_tags_orcamento ON orcamento_tags(orcamento_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_orcamentos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_orcamentos_updated_at
  BEFORE UPDATE ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_orcamentos_updated_at();

-- Função para buscar orçamento do mês atual
CREATE OR REPLACE FUNCTION buscar_orcamento_atual(
  p_usuario_id UUID,
  p_familia_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  nome VARCHAR,
  descricao TEXT,
  valor_total DECIMAL,
  mes_referencia INTEGER,
  ano_referencia INTEGER,
  ativo BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.nome,
    o.descricao,
    o.valor_total,
    o.mes_referencia,
    o.ano_referencia,
    o.ativo
  FROM orcamentos o
  WHERE o.usuario_id = p_usuario_id
    AND (p_familia_id IS NULL OR o.familia_id = p_familia_id)
    AND o.mes_referencia = EXTRACT(MONTH FROM CURRENT_DATE)
    AND o.ano_referencia = EXTRACT(YEAR FROM CURRENT_DATE)
    AND o.ativo = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular execução do orçamento por categoria
CREATE OR REPLACE FUNCTION calcular_execucao_orcamento_categoria(
  p_orcamento_id UUID,
  p_categoria_id UUID
)
RETURNS TABLE (
  valor_planejado DECIMAL,
  valor_realizado DECIMAL,
  percentual_usado DECIMAL,
  restante DECIMAL,
  status TEXT
) AS $$
DECLARE
  v_mes INTEGER;
  v_ano INTEGER;
  v_familia_id UUID;
BEGIN
  -- Buscar mês e ano do orçamento
  SELECT mes_referencia, ano_referencia, familia_id
  INTO v_mes, v_ano, v_familia_id
  FROM orcamentos
  WHERE id = p_orcamento_id;

  RETURN QUERY
  SELECT 
    oc.valor_planejado,
    COALESCE(SUM(g.valor), 0) as valor_realizado,
    CASE 
      WHEN oc.valor_planejado > 0 THEN 
        (COALESCE(SUM(g.valor), 0) / oc.valor_planejado * 100)
      ELSE 0 
    END as percentual_usado,
    oc.valor_planejado - COALESCE(SUM(g.valor), 0) as restante,
    CASE 
      WHEN COALESCE(SUM(g.valor), 0) <= oc.valor_planejado * 0.5 THEN 'bom'
      WHEN COALESCE(SUM(g.valor), 0) <= oc.valor_planejado * 0.8 THEN 'atencao'
      WHEN COALESCE(SUM(g.valor), 0) <= oc.valor_planejado THEN 'alerta'
      ELSE 'estourado'
    END as status
  FROM orcamento_categorias oc
  LEFT JOIN gastos g ON g.categoria_id = p_categoria_id
    AND g.deletado = false
    AND EXTRACT(MONTH FROM g.data) = v_mes
    AND EXTRACT(YEAR FROM g.data) = v_ano
    AND (v_familia_id IS NULL OR g.familia_id = v_familia_id)
  WHERE oc.orcamento_id = p_orcamento_id
    AND oc.categoria_id = p_categoria_id
  GROUP BY oc.valor_planejado, oc.alerta_percentual;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular execução do orçamento por tag
CREATE OR REPLACE FUNCTION calcular_execucao_orcamento_tag(
  p_orcamento_id UUID,
  p_tag_id UUID
)
RETURNS TABLE (
  valor_planejado DECIMAL,
  valor_realizado DECIMAL,
  percentual_usado DECIMAL,
  restante DECIMAL,
  status TEXT
) AS $$
DECLARE
  v_mes INTEGER;
  v_ano INTEGER;
  v_familia_id UUID;
BEGIN
  -- Buscar mês e ano do orçamento
  SELECT mes_referencia, ano_referencia, familia_id
  INTO v_mes, v_ano, v_familia_id
  FROM orcamentos
  WHERE id = p_orcamento_id;

  RETURN QUERY
  SELECT 
    ot.valor_planejado,
    COALESCE(SUM(g.valor), 0) as valor_realizado,
    CASE 
      WHEN ot.valor_planejado > 0 THEN 
        (COALESCE(SUM(g.valor), 0) / ot.valor_planejado * 100)
      ELSE 0 
    END as percentual_usado,
    ot.valor_planejado - COALESCE(SUM(g.valor), 0) as restante,
    CASE 
      WHEN COALESCE(SUM(g.valor), 0) <= ot.valor_planejado * 0.5 THEN 'bom'
      WHEN COALESCE(SUM(g.valor), 0) <= ot.valor_planejado * 0.8 THEN 'atencao'
      WHEN COALESCE(SUM(g.valor), 0) <= ot.valor_planejado THEN 'alerta'
      ELSE 'estourado'
    END as status
  FROM orcamento_tags ot
  LEFT JOIN gastos_tags gt ON gt.tag_id = p_tag_id
  LEFT JOIN gastos g ON g.id = gt.gasto_id
    AND g.deletado = false
    AND EXTRACT(MONTH FROM g.data) = v_mes
    AND EXTRACT(YEAR FROM g.data) = v_ano
    AND (v_familia_id IS NULL OR g.familia_id = v_familia_id)
  WHERE ot.orcamento_id = p_orcamento_id
    AND ot.tag_id = p_tag_id
  GROUP BY ot.valor_planejado, ot.alerta_percentual;
END;
$$ LANGUAGE plpgsql;

-- View para orçamento consolidado
CREATE OR REPLACE VIEW vw_orcamento_consolidado AS
SELECT 
  o.id as orcamento_id,
  o.nome,
  o.valor_total as planejado,
  o.mes_referencia,
  o.ano_referencia,
  o.usuario_id,
  o.familia_id,
  COALESCE(
    (SELECT SUM(g.valor)
     FROM gastos g
     WHERE g.deletado = false
       AND EXTRACT(MONTH FROM g.data) = o.mes_referencia
       AND EXTRACT(YEAR FROM g.data) = o.ano_referencia
       AND (o.familia_id IS NULL OR g.familia_id = o.familia_id)),
    0
  ) as realizado,
  CASE 
    WHEN o.valor_total > 0 THEN 
      (COALESCE(
        (SELECT SUM(g.valor)
         FROM gastos g
         WHERE g.deletado = false
           AND EXTRACT(MONTH FROM g.data) = o.mes_referencia
           AND EXTRACT(YEAR FROM g.data) = o.ano_referencia
           AND (o.familia_id IS NULL OR g.familia_id = o.familia_id)),
        0
      ) / o.valor_total * 100)
    ELSE 0 
  END as percentual_usado
FROM orcamentos o
WHERE o.ativo = true;

-- RLS
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_tags ENABLE ROW LEVEL SECURITY;

-- Policies para orcamentos
CREATE POLICY "Usuários podem ver seus próprios orçamentos"
  ON orcamentos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar seus próprios orçamentos"
  ON orcamentos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar seus próprios orçamentos"
  ON orcamentos FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar seus próprios orçamentos"
  ON orcamentos FOR DELETE
  USING (auth.uid() = usuario_id);

-- Policies para orcamento_categorias
CREATE POLICY "Usuários podem ver categorias de seus orçamentos"
  ON orcamento_categorias FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos o
      WHERE o.id = orcamento_categorias.orcamento_id
      AND o.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem adicionar categorias aos seus orçamentos"
  ON orcamento_categorias FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orcamentos o
      WHERE o.id = orcamento_categorias.orcamento_id
      AND o.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem atualizar categorias de seus orçamentos"
  ON orcamento_categorias FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos o
      WHERE o.id = orcamento_categorias.orcamento_id
      AND o.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem deletar categorias de seus orçamentos"
  ON orcamento_categorias FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos o
      WHERE o.id = orcamento_categorias.orcamento_id
      AND o.usuario_id = auth.uid()
    )
  );

-- Policies similares para orcamento_tags
CREATE POLICY "Usuários podem ver tags de seus orçamentos"
  ON orcamento_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos o
      WHERE o.id = orcamento_tags.orcamento_id
      AND o.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem adicionar tags aos seus orçamentos"
  ON orcamento_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orcamentos o
      WHERE o.id = orcamento_tags.orcamento_id
      AND o.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem atualizar tags de seus orçamentos"
  ON orcamento_tags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos o
      WHERE o.id = orcamento_tags.orcamento_id
      AND o.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem deletar tags de seus orçamentos"
  ON orcamento_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos o
      WHERE o.id = orcamento_tags.orcamento_id
      AND o.usuario_id = auth.uid()
    )
  );

-- Comentários
COMMENT ON TABLE orcamentos IS 'Orçamentos mensais da família';
COMMENT ON TABLE orcamento_categorias IS 'Valores planejados por categoria dentro do orçamento';
COMMENT ON TABLE orcamento_tags IS 'Valores planejados por tag dentro do orçamento';
COMMENT ON COLUMN orcamentos.alerta_percentual IS 'Percentual para disparar alerta (padrão: 80%)';


