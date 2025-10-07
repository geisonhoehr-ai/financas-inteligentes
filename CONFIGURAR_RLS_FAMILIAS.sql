-- ============================================
-- CONFIGURAR RLS PARA TABELA FAMILIAS
-- ============================================

-- Habilitar RLS
ALTER TABLE public.familias ENABLE ROW LEVEL SECURITY;

-- Política para INSERT
CREATE POLICY "Usuários podem criar famílias" ON public.familias
  FOR INSERT
  WITH CHECK (true);

-- Política para SELECT
CREATE POLICY "Usuários podem ver famílias que são membros" ON public.familias
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = id
      AND fm.usuario_id = auth.uid()
      AND fm.aprovado = true
    )
  );

-- Política para UPDATE
CREATE POLICY "Apenas admin pode atualizar família" ON public.familias
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = id
      AND fm.usuario_id = auth.uid()
      AND fm.papel = 'admin'
      AND fm.aprovado = true
    )
  );

-- Política para DELETE
CREATE POLICY "Apenas admin pode deletar família" ON public.familias
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = id
      AND fm.usuario_id = auth.uid()
      AND fm.papel = 'admin'
      AND fm.aprovado = true
    )
  );

-- ============================================
-- CONFIGURAR RLS PARA TABELA FAMILIA_MEMBROS
-- ============================================

-- Habilitar RLS
ALTER TABLE public.familia_membros ENABLE ROW LEVEL SECURITY;

-- Política para INSERT
CREATE POLICY "Usuários podem se tornar membros" ON public.familia_membros
  FOR INSERT
  WITH CHECK (
    usuario_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = familia_id
      AND fm.usuario_id = auth.uid()
      AND fm.papel = 'admin'
      AND fm.aprovado = true
    )
  );

-- Política para SELECT
CREATE POLICY "Usuários podem ver membros das famílias que participam" ON public.familia_membros
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = familia_id
      AND fm.usuario_id = auth.uid()
      AND fm.aprovado = true
    )
  );

-- Política para UPDATE
CREATE POLICY "Apenas admin pode atualizar membros" ON public.familia_membros
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = familia_id
      AND fm.usuario_id = auth.uid()
      AND fm.papel = 'admin'
      AND fm.aprovado = true
    )
  );

-- Política para DELETE
CREATE POLICY "Apenas admin pode remover membros" ON public.familia_membros
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.familia_membros fm
      WHERE fm.familia_id = familia_id
      AND fm.usuario_id = auth.uid()
      AND fm.papel = 'admin'
      AND fm.aprovado = true
    )
  );

-- ============================================
-- VERIFICAR CONFIGURAÇÃO
-- ============================================

-- Listar políticas da tabela familias
SELECT * FROM pg_policies WHERE tablename = 'familias';

-- Listar políticas da tabela familia_membros
SELECT * FROM pg_policies WHERE tablename = 'familia_membros';
