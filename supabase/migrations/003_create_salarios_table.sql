-- ============================================
-- TABELA DE SALÁRIOS
-- ============================================

CREATE TABLE IF NOT EXISTS public.salarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome_pessoa TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  dia_recebimento INTEGER NOT NULL CHECK (dia_recebimento >= 1 AND dia_recebimento <= 31),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_salarios_user_id ON public.salarios(user_id);
CREATE INDEX IF NOT EXISTS idx_salarios_ativo ON public.salarios(ativo);

-- RLS
ALTER TABLE public.salarios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (simplificadas para evitar recursão)
DROP POLICY IF EXISTS "Usuários veem próprios salários" ON public.salarios;
CREATE POLICY "Usuários veem próprios salários"
  ON public.salarios
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários criam próprios salários" ON public.salarios;
CREATE POLICY "Usuários criam próprios salários"
  ON public.salarios
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários atualizam próprios salários" ON public.salarios;
CREATE POLICY "Usuários atualizam próprios salários"
  ON public.salarios
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários deletam próprios salários" ON public.salarios;
CREATE POLICY "Usuários deletam próprios salários"
  ON public.salarios
  FOR DELETE
  USING (auth.uid() = user_id);

-- Comentários
COMMENT ON TABLE public.salarios IS 'Tabela para armazenar salários dos usuários';
COMMENT ON COLUMN public.salarios.user_id IS 'ID do usuário dono do salário';
COMMENT ON COLUMN public.salarios.nome_pessoa IS 'Nome da pessoa que recebe o salário';
COMMENT ON COLUMN public.salarios.valor IS 'Valor do salário';
COMMENT ON COLUMN public.salarios.dia_recebimento IS 'Dia do mês em que o salário é recebido (1-31)';
COMMENT ON COLUMN public.salarios.ativo IS 'Se o salário ainda está ativo';
