-- ============================================
-- POLÍTICAS RLS SIMPLIFICADAS - APENAS TABELAS EXISTENTES
-- ============================================
-- Execute LINHA POR LINHA ou em pequenos blocos
-- Verifique cada seção antes de executar a próxima

-- ============================================
-- PASSO 1: HABILITAR RLS (Execute primeiro)
-- ============================================

-- Tabelas principais
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE familias ENABLE ROW LEVEL SECURITY;
ALTER TABLE familia_membros ENABLE ROW LEVEL SECURITY;

-- Tabelas secundárias
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras_parceladas ENABLE ROW LEVEL SECURITY;
ALTER TABLE investimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_fixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gasolina ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASSO 2: GASTOS (Execute após Passo 1)
-- ============================================

-- Ver próprios gastos
CREATE POLICY "usuarios_veem_proprios_gastos"
  ON gastos FOR SELECT
  USING (auth.uid() = usuario_id AND deletado = false);

-- Criar gastos
CREATE POLICY "usuarios_criam_gastos"
  ON gastos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Atualizar gastos
CREATE POLICY "usuarios_atualizam_gastos"
  ON gastos FOR UPDATE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- ============================================
-- PASSO 3: CATEGORIAS
-- ============================================

-- Ver categorias do sistema
CREATE POLICY "todos_veem_categorias_sistema"
  ON categorias FOR SELECT
  USING (sistema = true AND deletado = false);

-- Ver próprias categorias
CREATE POLICY "usuarios_veem_proprias_categorias"
  ON categorias FOR SELECT
  USING (usuario_id = auth.uid() AND deletado = false);

-- Criar categorias
CREATE POLICY "usuarios_criam_categorias"
  ON categorias FOR INSERT
  WITH CHECK (auth.uid() = usuario_id AND sistema = false);

-- Atualizar categorias próprias
CREATE POLICY "usuarios_atualizam_categorias"
  ON categorias FOR UPDATE
  USING (auth.uid() = usuario_id AND sistema = false);

-- ============================================
-- PASSO 4: FAMÍLIAS
-- ============================================

-- Ver famílias onde é membro
CREATE POLICY "usuarios_veem_suas_familias"
  ON familias FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM familia_membros
      WHERE familia_membros.usuario_id = auth.uid()
      AND familia_membros.familia_id = familias.id
      AND familia_membros.aprovado = true
    )
  );

-- Criar famílias
CREATE POLICY "usuarios_criam_familias"
  ON familias FOR INSERT
  WITH CHECK (auth.uid() = admin_id);

-- Atualizar famílias (apenas admin)
CREATE POLICY "admins_atualizam_familias"
  ON familias FOR UPDATE
  USING (auth.uid() = admin_id);

-- ============================================
-- PASSO 5: FAMILIA_MEMBROS
-- ============================================

-- Ver membros de suas famílias
CREATE POLICY "usuarios_veem_membros_familias"
  ON familia_membros FOR SELECT
  USING (
    usuario_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM familia_membros fm
      WHERE fm.usuario_id = auth.uid()
      AND fm.familia_id = familia_membros.familia_id
      AND fm.aprovado = true
    )
  );

-- Admins adicionam membros
CREATE POLICY "admins_adicionam_membros"
  ON familia_membros FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM familias
      WHERE familias.id = familia_id
      AND familias.admin_id = auth.uid()
    )
  );

-- ============================================
-- PASSO 6: OUTRAS TABELAS (PADRÃO FAMÍLIA)
-- ============================================

-- METAS
CREATE POLICY "usuarios_veem_metas_familia" ON metas FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = metas.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_criam_metas" ON metas FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = metas.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_atualizam_metas" ON metas FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = metas.familia_id
    AND familia_membros.aprovado = true
  ));

-- CARTÕES
CREATE POLICY "usuarios_veem_cartoes_familia" ON cartoes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = cartoes.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_criam_cartoes" ON cartoes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = cartoes.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_atualizam_cartoes" ON cartoes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = cartoes.familia_id
    AND familia_membros.aprovado = true
  ));

-- INVESTIMENTOS
CREATE POLICY "usuarios_veem_investimentos_familia" ON investimentos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = investimentos.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_criam_investimentos" ON investimentos FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = investimentos.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_atualizam_investimentos" ON investimentos FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = investimentos.familia_id
    AND familia_membros.aprovado = true
  ));

-- PARCELAS
CREATE POLICY "usuarios_veem_parcelas_familia" ON compras_parceladas FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = compras_parceladas.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_criam_parcelas" ON compras_parceladas FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = compras_parceladas.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_atualizam_parcelas" ON compras_parceladas FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = compras_parceladas.familia_id
    AND familia_membros.aprovado = true
  ));

-- TAGS
CREATE POLICY "usuarios_veem_tags_familia" ON tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = tags.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_criam_tags" ON tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = tags.familia_id
    AND familia_membros.aprovado = true
  ));

CREATE POLICY "usuarios_atualizam_tags" ON tags FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM familia_membros
    WHERE familia_membros.usuario_id = auth.uid()
    AND familia_membros.familia_id = tags.familia_id
    AND familia_membros.aprovado = true
  ));

-- ============================================
-- PASSO 7: VERIFICAR (Execute por último)
-- ============================================

SELECT
  tablename,
  policyname,
  cmd,
  CASE
    WHEN cmd = 'SELECT' THEN 'Leitura'
    WHEN cmd = 'INSERT' THEN 'Criação'
    WHEN cmd = 'UPDATE' THEN 'Atualização'
    WHEN cmd = 'DELETE' THEN 'Exclusão'
    ELSE cmd
  END as operacao
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('gastos', 'categorias', 'familias', 'familia_membros', 'metas', 'cartoes', 'investimentos', 'compras_parceladas', 'tags')
ORDER BY tablename, cmd;

-- ============================================
-- INSTRUÇÕES IMPORTANTES
-- ============================================
--
-- 1. Execute os passos NA ORDEM
-- 2. Se algum erro ocorrer, anote qual passo/linha
-- 3. Após aplicar, teste:
--    - Faça login com seu usuário
--    - Tente criar um gasto
--    - Tente ver gastos
--    - Tente criar uma família
--
-- 4. Se houver erros de permissão:
--    - Verifique os logs do Supabase
--    - Rode a query de verificação (PASSO 7)
--
-- 5. Para remover uma política (se necessário):
--    DROP POLICY "nome_da_politica" ON nome_tabela;
