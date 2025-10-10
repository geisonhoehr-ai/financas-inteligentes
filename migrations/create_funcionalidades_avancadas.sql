-- Funcionalidades Avançadas: Modo Economia, Divisão, Lista Desejos, Score

-- ============================================
-- 1. MODO ECONOMIA / DESAFIOS FAMILIARES
-- ============================================

CREATE TABLE IF NOT EXISTS desafios_familia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) DEFAULT 'economia', -- economia, organizacao, investimento
  meta_economia DECIMAL(10, 2), -- Quanto quer economizar
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  ativo BOOLEAN DEFAULT true,
  concluido BOOLEAN DEFAULT false,
  premio TEXT, -- Descrição do prêmio
  criado_por UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS desafio_regras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  desafio_id UUID NOT NULL REFERENCES desafios_familia(id) ON DELETE CASCADE,
  descricao VARCHAR(200) NOT NULL,
  tipo VARCHAR(50), -- bloquear_categoria, alertar_valor, sugerir_alternativa
  categoria_bloqueada VARCHAR(100),
  valor_maximo DECIMAL(10, 2),
  valor_economia DECIMAL(10, 2),
  concluida BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS desafio_progresso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  desafio_id UUID NOT NULL REFERENCES desafios_familia(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id),
  data DATE DEFAULT CURRENT_DATE,
  economia_dia DECIMAL(10, 2) DEFAULT 0,
  observacoes TEXT
);

-- ============================================
-- 2. DIVISÃO INTELIGENTE DE DESPESAS
-- ============================================

CREATE TABLE IF NOT EXISTS configuracao_divisao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id),
  renda_mensal DECIMAL(10, 2) NOT NULL,
  percentual_contribuicao DECIMAL(5, 2), -- Calculado automaticamente
  ativo BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(familia_id, usuario_id)
);

CREATE TABLE IF NOT EXISTS acerto_contas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  mes_referencia INTEGER NOT NULL,
  ano_referencia INTEGER NOT NULL,
  pagador_id UUID NOT NULL REFERENCES auth.users(id),
  recebedor_id UUID NOT NULL REFERENCES auth.users(id),
  valor DECIMAL(10, 2) NOT NULL,
  descricao TEXT,
  pago BOOLEAN DEFAULT false,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. LISTA DE DESEJOS FAMILIAR
-- ============================================

CREATE TABLE IF NOT EXISTS lista_desejos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  valor_objetivo DECIMAL(10, 2) NOT NULL,
  valor_economizado DECIMAL(10, 2) DEFAULT 0,
  prioridade VARCHAR(20) DEFAULT 'media', -- alta, media, baixa
  categoria VARCHAR(100),
  link_produto TEXT,
  imagem_url TEXT,
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  criado_por UUID NOT NULL REFERENCES auth.users(id),
  meta_data DATE, -- Quando quer comprar
  comprado BOOLEAN DEFAULT false,
  data_compra DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lista_desejos_votacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  desejo_id UUID NOT NULL REFERENCES lista_desejos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id),
  voto INTEGER DEFAULT 1, -- 1 = prioridade baixa, 5 = prioridade alta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(desejo_id, usuario_id)
);

CREATE TABLE IF NOT EXISTS lista_desejos_contribuicoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  desejo_id UUID NOT NULL REFERENCES lista_desejos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id),
  valor DECIMAL(10, 2) NOT NULL,
  data DATE DEFAULT CURRENT_DATE,
  observacoes TEXT
);

-- ============================================
-- 4. SCORE DE SAÚDE FINANCEIRA
-- ============================================

CREATE TABLE IF NOT EXISTS score_financeiro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  familia_id UUID REFERENCES familias(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mes_referencia INTEGER NOT NULL,
  ano_referencia INTEGER NOT NULL,
  score_total INTEGER DEFAULT 0, -- 0-1000
  
  -- Componentes do score
  score_pagamentos INTEGER DEFAULT 0, -- 0-150
  score_reserva_emergencia INTEGER DEFAULT 0, -- 0-150
  score_dividas INTEGER DEFAULT 0, -- 0-150
  score_investimentos INTEGER DEFAULT 0, -- 0-150
  score_organizacao INTEGER DEFAULT 0, -- 0-100
  score_planejamento INTEGER DEFAULT 0, -- 0-100
  score_economia INTEGER DEFAULT 0, -- 0-100
  score_educacao_financeira INTEGER DEFAULT 0, -- 0-100
  
  calculado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(familia_id, usuario_id, mes_referencia, ano_referencia)
);

CREATE TABLE IF NOT EXISTS score_historico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score_id UUID NOT NULL REFERENCES score_financeiro(id) ON DELETE CASCADE,
  data DATE DEFAULT CURRENT_DATE,
  score_total INTEGER,
  melhorias TEXT[], -- Array de sugestões
  pontos_fortes TEXT[],
  pontos_fracos TEXT[]
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_desafios_familia ON desafios_familia(familia_id);
CREATE INDEX IF NOT EXISTS idx_configuracao_divisao_familia ON configuracao_divisao(familia_id);
CREATE INDEX IF NOT EXISTS idx_acerto_contas_familia ON acerto_contas(familia_id);
CREATE INDEX IF NOT EXISTS idx_lista_desejos_familia ON lista_desejos(familia_id);
CREATE INDEX IF NOT EXISTS idx_score_financeiro_familia ON score_financeiro(familia_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Calcular percentual de contribuição automaticamente
CREATE OR REPLACE FUNCTION calcular_percentual_contribuicao()
RETURNS TRIGGER AS $$
DECLARE
  v_total_renda DECIMAL;
BEGIN
  -- Somar todas as rendas da família
  SELECT SUM(renda_mensal) INTO v_total_renda
  FROM configuracao_divisao
  WHERE familia_id = NEW.familia_id AND ativo = true;

  -- Calcular percentual
  IF v_total_renda > 0 THEN
    NEW.percentual_contribuicao = (NEW.renda_mensal / v_total_renda) * 100;
  ELSE
    NEW.percentual_contribuicao = 0;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_percentual
  BEFORE INSERT OR UPDATE ON configuracao_divisao
  FOR EACH ROW
  EXECUTE FUNCTION calcular_percentual_contribuicao();

-- Atualizar valor economizado na lista de desejos
CREATE OR REPLACE FUNCTION atualizar_valor_desejo()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lista_desejos
  SET valor_economizado = valor_economizado + NEW.valor
  WHERE id = NEW.desejo_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_valor_desejo
  AFTER INSERT ON lista_desejos_contribuicoes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_valor_desejo();

-- Calcular score financeiro automaticamente
CREATE OR REPLACE FUNCTION calcular_score_financeiro(
  p_familia_id UUID,
  p_usuario_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
  v_score_pagamentos INTEGER := 0;
  v_score_reserva INTEGER := 0;
  v_score_dividas INTEGER := 0;
  v_score_investimentos INTEGER := 0;
  v_score_organizacao INTEGER := 0;
  v_total_gastos DECIMAL;
  v_total_investimentos DECIMAL;
BEGIN
  -- 1. Pagamentos em dia (0-150 pontos)
  -- Verificar se tem contas vencidas não pagas
  SELECT COUNT(*) INTO v_score_pagamentos
  FROM contas_fixas
  WHERE familia_id = p_familia_id
    AND deletado = false
    AND pago = false
    AND dia_vencimento < EXTRACT(DAY FROM CURRENT_DATE);
    
  v_score_pagamentos = GREATEST(0, 150 - (v_score_pagamentos * 30));

  -- 2. Reserva de emergência (0-150 pontos)
  SELECT COALESCE(SUM(valor), 0) INTO v_total_investimentos
  FROM investimentos
  WHERE familia_id = p_familia_id AND deletado = false;

  SELECT COALESCE(SUM(valor), 0) INTO v_total_gastos
  FROM gastos
  WHERE familia_id = p_familia_id 
    AND deletado = false
    AND EXTRACT(MONTH FROM data) = EXTRACT(MONTH FROM CURRENT_DATE);

  -- Reserva ideal = 6x gastos mensais
  IF v_total_gastos > 0 THEN
    v_score_reserva = LEAST(150, (v_total_investimentos / (v_total_gastos * 6)) * 150);
  END IF;

  -- 3. Dívidas (0-150 pontos) - menos dívidas = mais pontos
  -- Por enquanto simplificado
  v_score_dividas = 150;

  -- 4. Investimentos (0-150 pontos)
  v_score_investimentos = LEAST(150, v_total_investimentos / 100);

  -- 5. Organização (0-100 pontos)
  -- Se tem categorias, tags, orçamento = mais organizado
  v_score_organizacao = 50; -- Base

  IF EXISTS (SELECT 1 FROM orcamentos WHERE familia_id = p_familia_id AND ativo = true) THEN
    v_score_organizacao = v_score_organizacao + 50;
  END IF;

  -- Total
  v_score = v_score_pagamentos + v_score_reserva + v_score_dividas + 
            v_score_investimentos + v_score_organizacao;

  RETURN LEAST(1000, v_score);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS
-- ============================================

-- View para desafios ativos com progresso
CREATE OR REPLACE VIEW vw_desafios_ativos AS
SELECT 
  d.*,
  COALESCE(SUM(dp.economia_dia), 0) as economia_total,
  COUNT(DISTINCT dp.usuario_id) as participantes,
  COUNT(dr.id) as total_regras,
  COUNT(CASE WHEN dr.concluida THEN 1 END) as regras_concluidas
FROM desafios_familia d
LEFT JOIN desafio_progresso dp ON d.id = dp.desafio_id
LEFT JOIN desafio_regras dr ON d.id = dr.desafio_id
WHERE d.ativo = true
  AND d.data_fim >= CURRENT_DATE
GROUP BY d.id;

-- View para lista de desejos com votação
CREATE OR REPLACE VIEW vw_desejos_com_votos AS
SELECT 
  ld.*,
  COUNT(DISTINCT ldv.usuario_id) as total_votos,
  COALESCE(AVG(ldv.voto), 0) as media_votos,
  COALESCE(SUM(ldc.valor), 0) as total_contribuido,
  COUNT(DISTINCT ldc.usuario_id) as total_contribuintes,
  (ld.valor_economizado / ld.valor_objetivo * 100) as percentual_completo
FROM lista_desejos ld
LEFT JOIN lista_desejos_votacao ldv ON ld.id = ldv.desejo_id
LEFT JOIN lista_desejos_contribuicoes ldc ON ld.id = ldc.desejo_id
WHERE ld.comprado = false
GROUP BY ld.id
ORDER BY media_votos DESC, prioridade DESC;

-- ============================================
-- RLS
-- ============================================

ALTER TABLE desafios_familia ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracao_divisao ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_desejos ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_financeiro ENABLE ROW LEVEL SECURITY;

-- Policies básicas (membros da família podem ver)
CREATE POLICY "Membros podem ver desafios da família"
  ON desafios_familia FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM familia_membros fm
      WHERE fm.familia_id = desafios_familia.familia_id
      AND fm.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Membros podem ver divisão da família"
  ON configuracao_divisao FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM familia_membros fm
      WHERE fm.familia_id = configuracao_divisao.familia_id
      AND fm.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Membros podem ver lista de desejos"
  ON lista_desejos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM familia_membros fm
      WHERE fm.familia_id = lista_desejos.familia_id
      AND fm.usuario_id = auth.uid()
    )
  );

-- ============================================
-- COMENTÁRIOS
-- ============================================

COMMENT ON TABLE desafios_familia IS 'Desafios de economia e organização familiar';
COMMENT ON TABLE configuracao_divisao IS 'Configuração de divisão de despesas por renda';
COMMENT ON TABLE lista_desejos IS 'Lista de desejos compartilhada da família';
COMMENT ON TABLE score_financeiro IS 'Score de saúde financeira (0-1000 pontos)';


