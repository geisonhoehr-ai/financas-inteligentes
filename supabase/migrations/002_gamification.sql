-- ============================================
-- TABELA DE GAMIFICAÇÃO
-- ============================================
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_gamification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- XP e Nível
  xp_total INTEGER DEFAULT 0,

  -- Conquistas
  conquistas TEXT[] DEFAULT '{}',

  -- Estatísticas
  dias_registrando INTEGER DEFAULT 0,
  dias_sem_delivery INTEGER DEFAULT 0,
  economia_do_mes DECIMAL(10,2) DEFAULT 0,

  -- Streak
  ultimo_registro_dia DATE,
  streak_atual INTEGER DEFAULT 0,
  maior_streak INTEGER DEFAULT 0,

  -- Timestamps
  ultima_atividade TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_gamification_user_id
  ON user_gamification(user_id);

CREATE INDEX IF NOT EXISTS idx_user_gamification_xp
  ON user_gamification(xp_total DESC);

-- RLS
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários veem própria gamificação"
  ON user_gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários atualizam própria gamificação"
  ON user_gamification FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sistema cria gamificação"
  ON user_gamification FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_gamification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_gamification_updated_at
  BEFORE UPDATE ON user_gamification
  FOR EACH ROW
  EXECUTE FUNCTION update_user_gamification_updated_at();

-- ============================================
-- FUNÇÃO PARA ATUALIZAR STREAK
-- ============================================

CREATE OR REPLACE FUNCTION atualizar_streak_usuario(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_ultimo_registro DATE;
  v_hoje DATE := CURRENT_DATE;
  v_streak_atual INTEGER;
BEGIN
  SELECT ultimo_registro_dia, streak_atual
  INTO v_ultimo_registro, v_streak_atual
  FROM user_gamification
  WHERE user_id = p_user_id;

  -- Se nunca registrou antes
  IF v_ultimo_registro IS NULL THEN
    UPDATE user_gamification
    SET
      ultimo_registro_dia = v_hoje,
      streak_atual = 1,
      maior_streak = 1,
      dias_registrando = 1
    WHERE user_id = p_user_id;
    RETURN;
  END IF;

  -- Se já registrou hoje, não faz nada
  IF v_ultimo_registro = v_hoje THEN
    RETURN;
  END IF;

  -- Se registrou ontem, incrementa streak
  IF v_ultimo_registro = v_hoje - 1 THEN
    UPDATE user_gamification
    SET
      ultimo_registro_dia = v_hoje,
      streak_atual = streak_atual + 1,
      maior_streak = GREATEST(maior_streak, streak_atual + 1),
      dias_registrando = dias_registrando + 1
    WHERE user_id = p_user_id;
  ELSE
    -- Streak quebrado, reinicia
    UPDATE user_gamification
    SET
      ultimo_registro_dia = v_hoje,
      streak_atual = 1,
      dias_registrando = dias_registrando + 1
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEW DE RANKING
-- ============================================

CREATE OR REPLACE VIEW vw_ranking_gamification AS
SELECT
  ug.user_id,
  ug.xp_total,
  ug.streak_atual,
  ug.maior_streak,
  ug.dias_registrando,
  ug.conquistas,
  RANK() OVER (ORDER BY ug.xp_total DESC) as posicao
FROM user_gamification ug
ORDER BY ug.xp_total DESC;

-- Permitir leitura do ranking
GRANT SELECT ON vw_ranking_gamification TO authenticated;
