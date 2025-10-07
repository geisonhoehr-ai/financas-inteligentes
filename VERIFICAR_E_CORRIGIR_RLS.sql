-- ============================================
-- VERIFICAR E CORRIGIR RLS PARA TODAS AS TABELAS
-- ============================================

-- Função auxiliar para habilitar RLS e criar políticas básicas
CREATE OR REPLACE FUNCTION setup_rls_policies(tabela text) RETURNS void AS $$
BEGIN
  -- Habilitar RLS
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tabela);

  -- Remover políticas existentes
  FOR r IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = tabela
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, tabela);
  END LOOP;

  -- Criar políticas básicas
  -- SELECT: usuário pode ver seus próprios registros
  EXECUTE format(
    'CREATE POLICY "Permitir select próprio" ON %I FOR SELECT USING (usuario_id = auth.uid())',
    tabela
  );

  -- INSERT: usuário pode inserir registros para si mesmo
  EXECUTE format(
    'CREATE POLICY "Permitir insert próprio" ON %I FOR INSERT WITH CHECK (usuario_id = auth.uid())',
    tabela
  );

  -- UPDATE: usuário pode atualizar seus próprios registros
  EXECUTE format(
    'CREATE POLICY "Permitir update próprio" ON %I FOR UPDATE USING (usuario_id = auth.uid())',
    tabela
  );

  -- DELETE: usuário pode deletar seus próprios registros
  EXECUTE format(
    'CREATE POLICY "Permitir delete próprio" ON %I FOR DELETE USING (usuario_id = auth.uid())',
    tabela
  );
END;
$$ LANGUAGE plpgsql;

-- Lista de tabelas principais
DO $$
DECLARE
  tabelas text[] := ARRAY[
    'gastos',
    'assinaturas',
    'cartoes',
    'contas_fixas',
    'dividas_internas',
    'ferramentas',
    'gasolina',
    'investimentos',
    'metas',
    'compras_parceladas'
  ];
  t text;
BEGIN
  FOREACH t IN ARRAY tabelas
  LOOP
    PERFORM setup_rls_policies(t);
    RAISE NOTICE 'Configurado RLS para tabela %', t;
  END LOOP;
END $$;

-- ============================================
-- POLÍTICAS ESPECIAIS PARA TABELAS ESPECÍFICAS
-- ============================================

-- Tabela: familias
ALTER TABLE public.familias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir criação de família" ON public.familias;
DROP POLICY IF EXISTS "Permitir visualização de família" ON public.familias;
DROP POLICY IF EXISTS "Permitir atualização de família" ON public.familias;
DROP POLICY IF EXISTS "Permitir deleção de família" ON public.familias;

-- Política para INSERT - Permitir qualquer usuário autenticado criar família
CREATE POLICY "Permitir criação de família" ON public.familias
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Política para SELECT - Usuário pode ver famílias onde é membro ou admin
CREATE POLICY "Permitir visualização de família" ON public.familias
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = id
      AND fm.usuario_id = auth.uid()
    )
    OR admin_id = auth.uid()
  );

-- Política para UPDATE - Apenas admin pode atualizar
CREATE POLICY "Permitir atualização de família" ON public.familias
  FOR UPDATE USING (admin_id = auth.uid());

-- Política para DELETE - Apenas admin pode deletar
CREATE POLICY "Permitir deleção de família" ON public.familias
  FOR DELETE USING (admin_id = auth.uid());

-- Tabela: familia_membros
ALTER TABLE public.familia_membros ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir adição de membros" ON public.familia_membros;
DROP POLICY IF EXISTS "Permitir visualização de membros" ON public.familia_membros;
DROP POLICY IF EXISTS "Permitir atualização de membros" ON public.familia_membros;
DROP POLICY IF EXISTS "Permitir remoção de membros" ON public.familia_membros;

-- Política para INSERT - Permitir admin adicionar membros ou usuário aceitar convite
CREATE POLICY "Permitir adição de membros" ON public.familia_membros
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.familias f
      WHERE f.id = familia_id
      AND f.admin_id = auth.uid()
    )
    OR usuario_id = auth.uid()
  );

-- Política para SELECT - Permitir ver membros se for membro ou admin
CREATE POLICY "Permitir visualização de membros" ON public.familia_membros
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = familia_id
      AND fm.usuario_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.familias f
      WHERE f.id = familia_id
      AND f.admin_id = auth.uid()
    )
  );

-- Política para UPDATE - Apenas admin pode atualizar
CREATE POLICY "Permitir atualização de membros" ON public.familia_membros
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.familias f
      WHERE f.id = familia_id
      AND f.admin_id = auth.uid()
    )
  );

-- Política para DELETE - Apenas admin pode remover
CREATE POLICY "Permitir remoção de membros" ON public.familia_membros
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.familias f
      WHERE f.id = familia_id
      AND f.admin_id = auth.uid()
    )
  );

-- Tabela: convites
ALTER TABLE public.convites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir criação de convite" ON public.convites;
DROP POLICY IF EXISTS "Permitir visualização de convite" ON public.convites;
DROP POLICY IF EXISTS "Permitir atualização de convite" ON public.convites;
DROP POLICY IF EXISTS "Permitir deleção de convite" ON public.convites;

-- Política para INSERT - Apenas admin pode criar convites
CREATE POLICY "Permitir criação de convite" ON public.convites
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.familias f
      WHERE f.id = familia_id
      AND f.admin_id = auth.uid()
    )
  );

-- Política para SELECT - Permitir ver convites da família ou próprios
CREATE POLICY "Permitir visualização de convite" ON public.convites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = familia_id
      AND fm.usuario_id = auth.uid()
    )
    OR criado_por = auth.uid()
  );

-- Política para UPDATE - Apenas admin pode atualizar
CREATE POLICY "Permitir atualização de convite" ON public.convites
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.familias f
      WHERE f.id = familia_id
      AND f.admin_id = auth.uid()
    )
  );

-- Política para DELETE - Apenas admin pode deletar
CREATE POLICY "Permitir deleção de convite" ON public.convites
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.familias f
      WHERE f.id = familia_id
      AND f.admin_id = auth.uid()
    )
  );

-- Tabela: dividas_internas
ALTER TABLE public.dividas_internas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir criação de dívida" ON public.dividas_internas;
DROP POLICY IF EXISTS "Permitir visualização de dívida" ON public.dividas_internas;
DROP POLICY IF EXISTS "Permitir atualização de dívida" ON public.dividas_internas;
DROP POLICY IF EXISTS "Permitir deleção de dívida" ON public.dividas_internas;

-- Política para INSERT - Usuário pode criar dívida se for membro da família
CREATE POLICY "Permitir criação de dívida" ON public.dividas_internas
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = familia_id
      AND fm.usuario_id = auth.uid()
      AND fm.aprovado = true
    )
  );

-- Política para SELECT - Usuário pode ver dívidas da família
CREATE POLICY "Permitir visualização de dívida" ON public.dividas_internas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = familia_id
      AND fm.usuario_id = auth.uid()
      AND fm.aprovado = true
    )
  );

-- Política para UPDATE - Usuário pode atualizar se for credor ou devedor
CREATE POLICY "Permitir atualização de dívida" ON public.dividas_internas
  FOR UPDATE USING (
    credor_id = auth.uid() OR devedor_id = auth.uid()
  );

-- Política para DELETE - Apenas admin pode deletar
CREATE POLICY "Permitir deleção de dívida" ON public.dividas_internas
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.familias f
      WHERE f.id = familia_id
      AND f.admin_id = auth.uid()
    )
  );

-- ============================================
-- VERIFICAR CONFIGURAÇÃO
-- ============================================

-- Listar todas as políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
