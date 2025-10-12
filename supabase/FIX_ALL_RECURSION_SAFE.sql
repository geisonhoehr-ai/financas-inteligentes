-- ============================================
-- CORREÇÃO SEGURA - REMOVER RECURSÕES
-- ============================================
-- Remove apenas políticas de tabelas que existem
-- Data: 12/10/2025

-- ============================================
-- PRIMEIRO: VERIFICAR QUAIS TABELAS EXISTEM
-- ============================================
SELECT
  tablename,
  COUNT(*) as policies_with_recursion
FROM pg_policies
WHERE schemaname = 'public'
  AND (qual LIKE '%familia_membros%' OR with_check LIKE '%familia_membros%')
GROUP BY tablename
ORDER BY tablename;

-- ============================================
-- 1. ASSINATURAS
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'assinaturas') THEN
    DROP POLICY IF EXISTS "Permitir insert próprio" ON public.assinaturas;

    CREATE POLICY "Usuários inserem próprias assinaturas"
      ON public.assinaturas FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);

    RAISE NOTICE 'Assinaturas: Política corrigida';
  END IF;
END $$;

-- ============================================
-- 2. CARTÕES
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cartoes') THEN
    DROP POLICY IF EXISTS "Permitir insert próprio" ON public.cartoes;

    CREATE POLICY "Usuários inserem próprios cartões"
      ON public.cartoes FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);

    RAISE NOTICE 'Cartões: Política corrigida';
  END IF;
END $$;

-- ============================================
-- 3. COMPRAS PARCELADAS
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'compras_parceladas') THEN
    DROP POLICY IF EXISTS "usuarios_atualizam_parcelas" ON public.compras_parceladas;
    DROP POLICY IF EXISTS "Permitir select próprio" ON public.compras_parceladas;
    DROP POLICY IF EXISTS "Permitir insert próprio" ON public.compras_parceladas;
    DROP POLICY IF EXISTS "usuarios_veem_parcelas_familia" ON public.compras_parceladas;
    DROP POLICY IF EXISTS "usuarios_criam_parcelas" ON public.compras_parceladas;

    CREATE POLICY "Usuários veem próprias parcelas"
      ON public.compras_parceladas FOR SELECT
      USING (auth.uid() = usuario_id);

    CREATE POLICY "Usuários inserem próprias parcelas"
      ON public.compras_parceladas FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);

    CREATE POLICY "Usuários atualizam próprias parcelas"
      ON public.compras_parceladas FOR UPDATE
      USING (auth.uid() = usuario_id);

    CREATE POLICY "Usuários deletam próprias parcelas"
      ON public.compras_parceladas FOR DELETE
      USING (auth.uid() = usuario_id);

    RAISE NOTICE 'Compras Parceladas: Políticas corrigidas';
  END IF;
END $$;

-- ============================================
-- 4. CONTAS FIXAS
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contas_fixas') THEN
    DROP POLICY IF EXISTS "Permitir insert próprio" ON public.contas_fixas;

    CREATE POLICY "Usuários inserem próprias contas fixas"
      ON public.contas_fixas FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);

    RAISE NOTICE 'Contas Fixas: Política corrigida';
  END IF;
END $$;

-- ============================================
-- 5. FERRAMENTAS
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ferramentas') THEN
    DROP POLICY IF EXISTS "Permitir insert próprio" ON public.ferramentas;

    CREATE POLICY "Usuários inserem próprias ferramentas"
      ON public.ferramentas FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);

    RAISE NOTICE 'Ferramentas: Política corrigida';
  END IF;
END $$;

-- ============================================
-- 6. GASOLINA
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gasolina') THEN
    DROP POLICY IF EXISTS "Permitir insert próprio" ON public.gasolina;

    CREATE POLICY "Usuários inserem própria gasolina"
      ON public.gasolina FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);

    RAISE NOTICE 'Gasolina: Política corrigida';
  END IF;
END $$;

-- ============================================
-- 7. INVESTIMENTOS
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'investimentos') THEN
    DROP POLICY IF EXISTS "Permitir insert próprio" ON public.investimentos;

    CREATE POLICY "Usuários inserem próprios investimentos"
      ON public.investimentos FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);

    RAISE NOTICE 'Investimentos: Política corrigida';
  END IF;
END $$;

-- ============================================
-- 8. METAS
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'metas') THEN
    DROP POLICY IF EXISTS "Permitir insert próprio" ON public.metas;

    CREATE POLICY "Usuários inserem próprias metas"
      ON public.metas FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);

    RAISE NOTICE 'Metas: Política corrigida';
  END IF;
END $$;

-- ============================================
-- 9. SALARIES
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'salaries') THEN
    DROP POLICY IF EXISTS "Permitir select próprio" ON public.salaries;

    CREATE POLICY "Usuários veem próprios salários"
      ON public.salaries FOR SELECT
      USING (auth.uid() = usuario_id);

    RAISE NOTICE 'Salaries: Política corrigida';
  END IF;
END $$;

-- ============================================
-- 10. FAMÍLIAS (APENAS REMOVE POLÍTICAS)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'familias') THEN
    DROP POLICY IF EXISTS "Permitir visualização de família" ON public.familias;
    DROP POLICY IF EXISTS "usuarios_veem_suas_familias" ON public.familias;

    RAISE NOTICE 'Familias: Políticas recursivas removidas (não recriadas - estrutura desconhecida)';
  END IF;
END $$;

-- ============================================
-- 11. CONVITES (APENAS REMOVE POLÍTICAS)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'convites') THEN
    DROP POLICY IF EXISTS "Permitir visualização de convite" ON public.convites;

    RAISE NOTICE 'Convites: Política recursiva removida (não recriada - estrutura desconhecida)';
  END IF;
END $$;

-- ============================================
-- VALIDAÇÃO FINAL
-- ============================================

-- Verificar se ainda existem políticas com familia_membros
SELECT
  COUNT(*) as total_policies_with_recursion,
  CASE
    WHEN COUNT(*) = 0 THEN '✅ SUCESSO! Nenhuma recursão encontrada'
    ELSE '⚠️ ATENÇÃO! Ainda existem ' || COUNT(*) || ' políticas com recursão'
  END as status,
  STRING_AGG(DISTINCT tablename, ', ') as affected_tables
FROM pg_policies
WHERE schemaname = 'public'
  AND (qual LIKE '%familia_membros%' OR with_check LIKE '%familia_membros%');

-- Contar políticas corrigidas
SELECT
  tablename,
  COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'assinaturas',
    'cartoes',
    'compras_parceladas',
    'contas_fixas',
    'ferramentas',
    'gasolina',
    'investimentos',
    'metas',
    'salaries'
  )
GROUP BY tablename
ORDER BY tablename;
