-- Sistema de Mesada Digital com Gamificação
-- Sistema completo de educação financeira para crianças/adolescentes

-- Tabela de Perfis de Filhos
CREATE TABLE IF NOT EXISTS perfis_filhos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  data_nascimento DATE,
  idade INTEGER,
  avatar VARCHAR(10) DEFAULT '👦', -- Emoji como avatar
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Se filho tiver conta própria
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  responsavel_id UUID NOT NULL REFERENCES auth.users(id), -- Pai/Mãe responsável
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Mesadas
CREATE TABLE IF NOT EXISTS mesadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filho_id UUID NOT NULL REFERENCES perfis_filhos(id) ON DELETE CASCADE,
  valor_base DECIMAL(10, 2) NOT NULL, -- Valor mensal da mesada
  periodicidade VARCHAR(20) DEFAULT 'mensal', -- mensal, quinzenal, semanal
  dia_pagamento INTEGER DEFAULT 1, -- Dia do mês que paga
  proximo_pagamento DATE,
  saldo_atual DECIMAL(10, 2) DEFAULT 0, -- Carteira digital do filho
  pontos_acumulados INTEGER DEFAULT 0, -- Sistema de pontos
  nivel INTEGER DEFAULT 1, -- Gamificação: nível do filho
  experiencia INTEGER DEFAULT 0, -- XP para subir de nível
  meta_economia DECIMAL(10, 2), -- Meta de economia mensal
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(filho_id)
);

-- Tabela de Tarefas/Responsabilidades
CREATE TABLE IF NOT EXISTS tarefas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(50), -- casa, estudo, comportamento, higiene
  icone VARCHAR(10) DEFAULT '✅',
  valor_recompensa DECIMAL(10, 2) DEFAULT 0, -- Quanto ganha ao completar
  pontos INTEGER DEFAULT 10, -- Pontos de XP
  filho_id UUID NOT NULL REFERENCES perfis_filhos(id) ON DELETE CASCADE,
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  criado_por UUID NOT NULL REFERENCES auth.users(id), -- Pai/Mãe que criou
  recorrente BOOLEAN DEFAULT false,
  frequencia VARCHAR(20), -- diaria, semanal, mensal
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Conclusão de Tarefas
CREATE TABLE IF NOT EXISTS tarefas_concluidas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tarefa_id UUID NOT NULL REFERENCES tarefas(id) ON DELETE CASCADE,
  filho_id UUID NOT NULL REFERENCES perfis_filhos(id) ON DELETE CASCADE,
  data_conclusao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aprovado_por UUID REFERENCES auth.users(id), -- Pai/Mãe que aprovou
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  valor_pago DECIMAL(10, 2), -- Quanto foi pago
  pontos_ganhos INTEGER, -- Quantos pontos ganhou
  observacoes TEXT
);

-- Tabela de Ajustes na Mesada (bônus e penalidades)
CREATE TABLE IF NOT EXISTS mesada_ajustes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mesada_id UUID NOT NULL REFERENCES mesadas(id) ON DELETE CASCADE,
  filho_id UUID NOT NULL REFERENCES perfis_filhos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL, -- bonus, penalidade, tarefa, presente
  motivo TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL, -- Positivo para bônus, negativo para penalidade
  pontos INTEGER DEFAULT 0, -- Pontos ganhos ou perdidos
  aplicado_por UUID NOT NULL REFERENCES auth.users(id), -- Pai/Mãe que aplicou
  data_aplicacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aprovado BOOLEAN DEFAULT true
);

-- Tabela de Gastos dos Filhos
CREATE TABLE IF NOT EXISTS gastos_filhos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filho_id UUID NOT NULL REFERENCES perfis_filhos(id) ON DELETE CASCADE,
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(50),
  data DATE DEFAULT CURRENT_DATE,
  requer_aprovacao BOOLEAN DEFAULT false, -- Gastos grandes precisam aprovação dos pais
  aprovado BOOLEAN, -- null = pendente, true = aprovado, false = negado
  aprovado_por UUID REFERENCES auth.users(id),
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Conquistas/Badges
CREATE TABLE IF NOT EXISTS conquistas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone VARCHAR(10) DEFAULT '🏆',
  criterio TEXT, -- Como conquistar
  pontos INTEGER DEFAULT 50,
  categoria VARCHAR(50), -- economia, responsabilidade, estudo
  ativo BOOLEAN DEFAULT true
);

-- Tabela de Conquistas dos Filhos
CREATE TABLE IF NOT EXISTS filho_conquistas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filho_id UUID NOT NULL REFERENCES perfis_filhos(id) ON DELETE CASCADE,
  conquista_id UUID NOT NULL REFERENCES conquistas(id) ON DELETE CASCADE,
  data_conquista TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(filho_id, conquista_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_perfis_filhos_familia ON perfis_filhos(familia_id);
CREATE INDEX IF NOT EXISTS idx_mesadas_filho ON mesadas(filho_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_filho ON tarefas(filho_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_concluidas_filho ON tarefas_concluidas(filho_id);
CREATE INDEX IF NOT EXISTS idx_mesada_ajustes_filho ON mesada_ajustes(filho_id);
CREATE INDEX IF NOT EXISTS idx_gastos_filhos_filho ON gastos_filhos(filho_id);

-- Trigger para atualizar saldo quando há ajuste
CREATE OR REPLACE FUNCTION atualizar_saldo_mesada()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE mesadas
  SET 
    saldo_atual = saldo_atual + NEW.valor,
    pontos_acumulados = pontos_acumulados + NEW.pontos,
    updated_at = NOW()
  WHERE id = NEW.mesada_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_saldo_mesada
  AFTER INSERT ON mesada_ajustes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_saldo_mesada();

-- Trigger para descontar do saldo quando filho gasta
CREATE OR REPLACE FUNCTION descontar_gasto_filho()
RETURNS TRIGGER AS $$
DECLARE
  v_mesada_id UUID;
BEGIN
  -- Buscar mesada do filho
  SELECT id INTO v_mesada_id
  FROM mesadas
  WHERE filho_id = NEW.filho_id;

  -- Se gasto foi aprovado, descontar do saldo
  IF NEW.aprovado = true AND v_mesada_id IS NOT NULL THEN
    UPDATE mesadas
    SET 
      saldo_atual = saldo_atual - NEW.valor,
      updated_at = NOW()
    WHERE id = v_mesada_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_descontar_gasto_filho
  AFTER INSERT OR UPDATE ON gastos_filhos
  FOR EACH ROW
  EXECUTE FUNCTION descontar_gasto_filho();

-- Função para calcular nível do filho baseado em XP
CREATE OR REPLACE FUNCTION calcular_nivel(p_experiencia INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Fórmula: Nível = raiz quadrada(XP / 100)
  RETURN GREATEST(1, FLOOR(SQRT(p_experiencia / 100.0))::INTEGER);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar nível automaticamente
CREATE OR REPLACE FUNCTION atualizar_nivel_filho()
RETURNS TRIGGER AS $$
BEGIN
  NEW.nivel = calcular_nivel(NEW.experiencia);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_nivel
  BEFORE UPDATE ON mesadas
  FOR EACH ROW
  WHEN (OLD.experiencia != NEW.experiencia)
  EXECUTE FUNCTION atualizar_nivel_filho();

-- Função para verificar conquistas automaticamente
CREATE OR REPLACE FUNCTION verificar_conquistas(p_filho_id UUID)
RETURNS void AS $$
DECLARE
  v_mesada RECORD;
  v_total_economizado DECIMAL;
  v_meses_consecutivos INTEGER;
BEGIN
  -- Buscar dados da mesada
  SELECT * INTO v_mesada
  FROM mesadas
  WHERE filho_id = p_filho_id;

  -- Conquista: Primeira Economia (economizou 10% da mesada)
  SELECT SUM(valor_base - saldo_atual) INTO v_total_economizado
  FROM mesadas
  WHERE filho_id = p_filho_id;

  IF v_total_economizado >= v_mesada.valor_base * 0.1 THEN
    INSERT INTO filho_conquistas (filho_id, conquista_id)
    SELECT p_filho_id, id
    FROM conquistas
    WHERE nome = 'Primeira Economia'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Mais conquistas podem ser adicionadas aqui
END;
$$ LANGUAGE plpgsql;

-- View para dashboard dos pais
CREATE OR REPLACE VIEW vw_mesada_dashboard_pais AS
SELECT 
  pf.id as filho_id,
  pf.nome,
  pf.avatar,
  pf.idade,
  m.valor_base,
  m.saldo_atual,
  m.pontos_acumulados,
  m.nivel,
  m.experiencia,
  m.proximo_pagamento,
  COUNT(DISTINCT tc.id) as tarefas_concluidas_mes,
  COUNT(DISTINCT gf.id) as gastos_mes,
  COALESCE(SUM(gf.valor), 0) as total_gasto_mes,
  COUNT(DISTINCT fc.conquista_id) as total_conquistas
FROM perfis_filhos pf
LEFT JOIN mesadas m ON pf.id = m.filho_id
LEFT JOIN tarefas_concluidas tc ON pf.id = tc.filho_id 
  AND EXTRACT(MONTH FROM tc.data_conclusao) = EXTRACT(MONTH FROM CURRENT_DATE)
LEFT JOIN gastos_filhos gf ON pf.id = gf.filho_id
  AND EXTRACT(MONTH FROM gf.data) = EXTRACT(MONTH FROM CURRENT_DATE)
LEFT JOIN filho_conquistas fc ON pf.id = fc.filho_id
WHERE pf.ativo = true
GROUP BY pf.id, pf.nome, pf.avatar, pf.idade, m.valor_base, m.saldo_atual, 
         m.pontos_acumulados, m.nivel, m.experiencia, m.proximo_pagamento;

-- Inserir conquistas padrão
INSERT INTO conquistas (nome, descricao, icone, criterio, pontos, categoria) VALUES
('Primeira Economia', 'Economizou pela primeira vez!', '💰', 'Economize 10% da mesada', 50, 'economia'),
('Poupador Iniciante', 'Economizou R$ 100', '🏦', 'Tenha R$ 100 economizados', 100, 'economia'),
('Mestre da Economia', 'Economizou 50% da mesada', '🎯', 'Economize metade da mesada', 200, 'economia'),
('Responsável', 'Completou 10 tarefas', '⭐', 'Complete 10 tarefas', 100, 'responsabilidade'),
('Super Responsável', 'Completou 50 tarefas', '🌟', 'Complete 50 tarefas', 300, 'responsabilidade'),
('Estudioso', 'Tirou notas boas', '📚', 'Mantenha boas notas', 150, 'estudo'),
('Organizador', 'Organizou seus gastos', '📊', 'Registre 20 gastos', 75, 'organizacao')
ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE perfis_filhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas_concluidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesada_ajustes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos_filhos ENABLE ROW LEVEL SECURITY;

-- Policies (Pais podem ver/editar tudo dos filhos)
CREATE POLICY "Responsáveis podem ver perfis dos filhos"
  ON perfis_filhos FOR SELECT
  USING (
    responsavel_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM familias f
      INNER JOIN familia_membros fm ON f.id = fm.familia_id
      WHERE f.id = perfis_filhos.familia_id
      AND fm.usuario_id = auth.uid()
      AND fm.papel IN ('admin', 'pai', 'mae')
    )
  );

CREATE POLICY "Responsáveis podem criar perfis de filhos"
  ON perfis_filhos FOR INSERT
  WITH CHECK (responsavel_id = auth.uid());

CREATE POLICY "Responsáveis podem atualizar perfis dos filhos"
  ON perfis_filhos FOR UPDATE
  USING (responsavel_id = auth.uid());

-- Policies para mesadas
CREATE POLICY "Pais podem ver mesadas dos filhos"
  ON mesadas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfis_filhos pf
      WHERE pf.id = mesadas.filho_id
      AND pf.responsavel_id = auth.uid()
    )
  );

CREATE POLICY "Pais podem criar mesadas"
  ON mesadas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfis_filhos pf
      WHERE pf.id = mesadas.filho_id
      AND pf.responsavel_id = auth.uid()
    )
  );

CREATE POLICY "Pais podem atualizar mesadas"
  ON mesadas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfis_filhos pf
      WHERE pf.id = mesadas.filho_id
      AND pf.responsavel_id = auth.uid()
    )
  );

-- Comentários
COMMENT ON TABLE perfis_filhos IS 'Perfis dos filhos para sistema de mesada';
COMMENT ON TABLE mesadas IS 'Configuração de mesada para cada filho';
COMMENT ON TABLE tarefas IS 'Tarefas que filhos podem fazer para ganhar dinheiro';
COMMENT ON TABLE mesada_ajustes IS 'Bônus e penalidades aplicadas pelos pais';
COMMENT ON COLUMN mesadas.pontos_acumulados IS 'Pontos de gamificação (não é dinheiro)';
COMMENT ON COLUMN mesadas.nivel IS 'Nível do filho no sistema (1-10+)';
COMMENT ON COLUMN mesadas.saldo_atual IS 'Saldo disponível na carteira digital';


