-- Sistema de Tags Personalizadas
-- Permite ao usuário criar tags customizadas para organizar gastos

-- Tabela de Tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(50) NOT NULL,
  cor VARCHAR(7) DEFAULT '#3B82F6', -- Cor em hexadecimal
  icone VARCHAR(10) DEFAULT '🏷️', -- Emoji como ícone
  descricao TEXT,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(nome, usuario_id, familia_id) -- Tag única por usuário/família
);

-- Tabela de relacionamento Gastos <-> Tags (muitos para muitos)
CREATE TABLE IF NOT EXISTS gastos_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gasto_id UUID NOT NULL REFERENCES gastos(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gasto_id, tag_id) -- Não repetir mesma tag no mesmo gasto
);

-- Tabela de relacionamento Parcelas <-> Tags
CREATE TABLE IF NOT EXISTS parcelas_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcela_id UUID NOT NULL REFERENCES parcelas(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parcela_id, tag_id)
);

-- Tabela de relacionamento Contas Fixas <-> Tags
CREATE TABLE IF NOT EXISTS contas_fixas_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conta_fixa_id UUID NOT NULL REFERENCES contas_fixas(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conta_fixa_id, tag_id)
);

-- Tabela de relacionamento Assinaturas <-> Tags
CREATE TABLE IF NOT EXISTS assinaturas_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assinatura_id UUID NOT NULL REFERENCES assinaturas(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assinatura_id, tag_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tags_usuario ON tags(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tags_familia ON tags(familia_id);
CREATE INDEX IF NOT EXISTS idx_gastos_tags_gasto ON gastos_tags(gasto_id);
CREATE INDEX IF NOT EXISTS idx_gastos_tags_tag ON gastos_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_parcelas_tags_parcela ON parcelas_tags(parcela_id);
CREATE INDEX IF NOT EXISTS idx_parcelas_tags_tag ON parcelas_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_contas_fixas_tags_conta ON contas_fixas_tags(conta_fixa_id);
CREATE INDEX IF NOT EXISTS idx_contas_fixas_tags_tag ON contas_fixas_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_tags_assinatura ON assinaturas_tags(assinatura_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_tags_tag ON assinaturas_tags(tag_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_tags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tags_updated_at();

-- Função para buscar gastos por tag
CREATE OR REPLACE FUNCTION buscar_gastos_por_tag(
  p_tag_id UUID,
  p_data_inicio DATE DEFAULT NULL,
  p_data_fim DATE DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  descricao TEXT,
  valor NUMERIC,
  data DATE,
  categoria TEXT,
  usuario_id UUID,
  familia_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g.descricao,
    g.valor,
    g.data,
    c.nome as categoria,
    g.usuario_id,
    g.familia_id
  FROM gastos g
  INNER JOIN gastos_tags gt ON g.id = gt.gasto_id
  LEFT JOIN categorias c ON g.categoria_id = c.id
  WHERE gt.tag_id = p_tag_id
    AND g.deletado = false
    AND (p_data_inicio IS NULL OR g.data >= p_data_inicio)
    AND (p_data_fim IS NULL OR g.data <= p_data_fim)
  ORDER BY g.data DESC;
END;
$$ LANGUAGE plpgsql;

-- Função para estatísticas por tag
CREATE OR REPLACE FUNCTION estatisticas_por_tag(
  p_tag_id UUID,
  p_data_inicio DATE DEFAULT NULL,
  p_data_fim DATE DEFAULT NULL
)
RETURNS TABLE (
  total_gastos NUMERIC,
  quantidade INTEGER,
  media NUMERIC,
  maior_gasto NUMERIC,
  menor_gasto NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(g.valor), 0) as total_gastos,
    COUNT(g.id)::INTEGER as quantidade,
    COALESCE(AVG(g.valor), 0) as media,
    COALESCE(MAX(g.valor), 0) as maior_gasto,
    COALESCE(MIN(g.valor), 0) as menor_gasto
  FROM gastos g
  INNER JOIN gastos_tags gt ON g.id = gt.gasto_id
  WHERE gt.tag_id = p_tag_id
    AND g.deletado = false
    AND (p_data_inicio IS NULL OR g.data >= p_data_inicio)
    AND (p_data_fim IS NULL OR g.data <= p_data_fim);
END;
$$ LANGUAGE plpgsql;

-- View para facilitar consultas de tags com estatísticas
CREATE OR REPLACE VIEW vw_tags_com_stats AS
SELECT 
  t.*,
  COUNT(DISTINCT gt.gasto_id) as total_gastos,
  COALESCE(SUM(g.valor), 0) as valor_total,
  COUNT(DISTINCT EXTRACT(MONTH FROM g.data)) as meses_com_gastos
FROM tags t
LEFT JOIN gastos_tags gt ON t.id = gt.tag_id
LEFT JOIN gastos g ON gt.gasto_id = g.id AND g.deletado = false
GROUP BY t.id;

-- Comentários
COMMENT ON TABLE tags IS 'Tags personalizadas criadas pelos usuários para organizar gastos';
COMMENT ON TABLE gastos_tags IS 'Relacionamento muitos-para-muitos entre gastos e tags';
COMMENT ON COLUMN tags.cor IS 'Cor da tag em formato hexadecimal (#RRGGBB)';
COMMENT ON COLUMN tags.icone IS 'Emoji representando a tag';

-- RLS (Row Level Security)
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcelas_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_fixas_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas_tags ENABLE ROW LEVEL SECURITY;

-- Policies para tags
CREATE POLICY "Usuários podem ver suas próprias tags"
  ON tags FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar suas próprias tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar suas próprias tags"
  ON tags FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar suas próprias tags"
  ON tags FOR DELETE
  USING (auth.uid() = usuario_id);

-- Policies para gastos_tags
CREATE POLICY "Usuários podem ver tags de seus gastos"
  ON gastos_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM gastos g
      WHERE g.id = gastos_tags.gasto_id
      AND g.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem adicionar tags aos seus gastos"
  ON gastos_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM gastos g
      WHERE g.id = gastos_tags.gasto_id
      AND g.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem remover tags de seus gastos"
  ON gastos_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM gastos g
      WHERE g.id = gastos_tags.gasto_id
      AND g.usuario_id = auth.uid()
    )
  );

-- Tags pré-definidas comuns (opcional - pode ser inserido depois)
-- INSERT INTO tags (nome, cor, icone, descricao, usuario_id, familia_id) VALUES
-- ('Pet', '#F59E0B', '🐕', 'Gastos com animais de estimação', auth.uid(), NULL),
-- ('Carro', '#3B82F6', '🚗', 'Gastos relacionados ao carro', auth.uid(), NULL),
-- ('Saúde', '#EF4444', '❤️', 'Gastos com saúde e bem-estar', auth.uid(), NULL),
-- ('Educação', '#8B5CF6', '📚', 'Gastos com educação', auth.uid(), NULL),
-- ('Casa', '#10B981', '🏠', 'Gastos com manutenção da casa', auth.uid(), NULL);


