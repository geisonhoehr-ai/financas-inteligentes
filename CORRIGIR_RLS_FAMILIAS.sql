-- ============================================
-- CORRIGIR RLS PARA TABELA FAMILIAS
-- ============================================

-- Primeiro, remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Usuários podem criar famílias" ON public.familias;
DROP POLICY IF EXISTS "Usuários podem ver famílias que são membros" ON public.familias;
DROP POLICY IF EXISTS "Apenas admin pode atualizar família" ON public.familias;
DROP POLICY IF EXISTS "Apenas admin pode deletar família" ON public.familias;

-- Garantir que RLS está habilitado
ALTER TABLE public.familias ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- CORRIGIR RLS PARA TABELA FAMILIA_MEMBROS
-- ============================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem se tornar membros" ON public.familia_membros;
DROP POLICY IF EXISTS "Usuários podem ver membros das famílias que participam" ON public.familia_membros;
DROP POLICY IF EXISTS "Apenas admin pode atualizar membros" ON public.familia_membros;
DROP POLICY IF EXISTS "Apenas admin pode remover membros" ON public.familia_membros;

-- Garantir que RLS está habilitado
ALTER TABLE public.familia_membros ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- VERIFICAR CONFIGURAÇÃO
-- ============================================

-- Listar políticas da tabela familias
SELECT * FROM pg_policies WHERE tablename = 'familias';

-- Listar políticas da tabela familia_membros
SELECT * FROM pg_policies WHERE tablename = 'familia_membros';
