-- ============================================
-- FIX: Corrigir problemas de RLS e salários
-- Script inteligente que verifica existência de tabelas
-- ============================================

-- 1. Corrigir nome da coluna user_id para usuario_id na tabela salarios
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'salarios'
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.salarios RENAME COLUMN user_id TO usuario_id;
        RAISE NOTICE '✓ Coluna user_id renomeada para usuario_id na tabela salarios';
    END IF;
END $$;

-- 2. Recriar políticas RLS para salarios
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'salarios') THEN
        DROP POLICY IF EXISTS "Usuários veem próprios salários" ON public.salarios;
        CREATE POLICY "Usuários veem próprios salários"
          ON public.salarios FOR SELECT
          USING (auth.uid() = usuario_id);

        DROP POLICY IF EXISTS "Usuários criam próprios salários" ON public.salarios;
        CREATE POLICY "Usuários criam próprios salários"
          ON public.salarios FOR INSERT
          WITH CHECK (auth.uid() = usuario_id);

        DROP POLICY IF EXISTS "Usuários atualizam próprios salários" ON public.salarios;
        CREATE POLICY "Usuários atualizam próprios salários"
          ON public.salarios FOR UPDATE
          USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

        DROP POLICY IF EXISTS "Usuários deletam próprios salários" ON public.salarios;
        CREATE POLICY "Usuários deletam próprios salários"
          ON public.salarios FOR DELETE
          USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para salarios';
    END IF;
END $$;

-- 3. Corrigir RLS para gastos
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gastos') THEN
        ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Usuários podem ver próprios gastos" ON public.gastos;
        DROP POLICY IF EXISTS "Usuários podem ver gastos da família" ON public.gastos;
        DROP POLICY IF EXISTS "Usuários podem inserir gastos" ON public.gastos;
        DROP POLICY IF EXISTS "Usuários podem atualizar próprios gastos" ON public.gastos;
        DROP POLICY IF EXISTS "Usuários podem deletar próprios gastos" ON public.gastos;

        CREATE POLICY "Usuários podem ver próprios gastos"
          ON public.gastos FOR SELECT USING (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem inserir gastos"
          ON public.gastos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem atualizar próprios gastos"
          ON public.gastos FOR UPDATE USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem deletar próprios gastos"
          ON public.gastos FOR DELETE USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para gastos';
    END IF;
END $$;

-- 4. Corrigir RLS para assinaturas
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assinaturas') THEN
        ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Usuários podem ver próprias assinaturas" ON public.assinaturas;
        DROP POLICY IF EXISTS "Usuários podem inserir assinaturas" ON public.assinaturas;
        DROP POLICY IF EXISTS "Usuários podem atualizar próprias assinaturas" ON public.assinaturas;
        DROP POLICY IF EXISTS "Usuários podem deletar próprias assinaturas" ON public.assinaturas;

        CREATE POLICY "Usuários podem ver próprias assinaturas"
          ON public.assinaturas FOR SELECT USING (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem inserir assinaturas"
          ON public.assinaturas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem atualizar próprias assinaturas"
          ON public.assinaturas FOR UPDATE USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem deletar próprias assinaturas"
          ON public.assinaturas FOR DELETE USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para assinaturas';
    END IF;
END $$;

-- 5. Corrigir RLS para investimentos
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'investimentos') THEN
        ALTER TABLE public.investimentos ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Usuários podem ver próprios investimentos" ON public.investimentos;
        DROP POLICY IF EXISTS "Usuários podem inserir investimentos" ON public.investimentos;
        DROP POLICY IF EXISTS "Usuários podem atualizar próprios investimentos" ON public.investimentos;
        DROP POLICY IF EXISTS "Usuários podem deletar próprios investimentos" ON public.investimentos;

        CREATE POLICY "Usuários podem ver próprios investimentos"
          ON public.investimentos FOR SELECT USING (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem inserir investimentos"
          ON public.investimentos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem atualizar próprios investimentos"
          ON public.investimentos FOR UPDATE USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem deletar próprios investimentos"
          ON public.investimentos FOR DELETE USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para investimentos';
    END IF;
END $$;

-- 6. Corrigir RLS para contas_fixas
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contas_fixas') THEN
        ALTER TABLE public.contas_fixas ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Usuários podem ver próprias contas fixas" ON public.contas_fixas;
        DROP POLICY IF EXISTS "Usuários podem inserir contas fixas" ON public.contas_fixas;
        DROP POLICY IF EXISTS "Usuários podem atualizar próprias contas fixas" ON public.contas_fixas;
        DROP POLICY IF EXISTS "Usuários podem deletar próprias contas fixas" ON public.contas_fixas;

        CREATE POLICY "Usuários podem ver próprias contas fixas"
          ON public.contas_fixas FOR SELECT USING (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem inserir contas fixas"
          ON public.contas_fixas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem atualizar próprias contas fixas"
          ON public.contas_fixas FOR UPDATE USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem deletar próprias contas fixas"
          ON public.contas_fixas FOR DELETE USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para contas_fixas';
    END IF;
END $$;

-- 7. Corrigir RLS para metas
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'metas') THEN
        ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Usuários podem ver próprias metas" ON public.metas;
        DROP POLICY IF EXISTS "Usuários podem inserir metas" ON public.metas;
        DROP POLICY IF EXISTS "Usuários podem atualizar próprias metas" ON public.metas;
        DROP POLICY IF EXISTS "Usuários podem deletar próprias metas" ON public.metas;

        CREATE POLICY "Usuários podem ver próprias metas"
          ON public.metas FOR SELECT USING (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem inserir metas"
          ON public.metas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem atualizar próprias metas"
          ON public.metas FOR UPDATE USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem deletar próprias metas"
          ON public.metas FOR DELETE USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para metas';
    END IF;
END $$;

-- 8. Corrigir RLS para categorias
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categorias') THEN
        ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Usuários podem ver próprias categorias" ON public.categorias;
        DROP POLICY IF EXISTS "Usuários podem inserir categorias" ON public.categorias;
        DROP POLICY IF EXISTS "Usuários podem atualizar próprias categorias" ON public.categorias;
        DROP POLICY IF EXISTS "Usuários podem deletar próprias categorias" ON public.categorias;

        CREATE POLICY "Usuários podem ver próprias categorias"
          ON public.categorias FOR SELECT USING (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem inserir categorias"
          ON public.categorias FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem atualizar próprias categorias"
          ON public.categorias FOR UPDATE USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem deletar próprias categorias"
          ON public.categorias FOR DELETE USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para categorias';
    END IF;
END $$;

-- 9. Corrigir RLS para cartoes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cartoes') THEN
        ALTER TABLE public.cartoes ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Usuários podem ver próprios cartões" ON public.cartoes;
        DROP POLICY IF EXISTS "Usuários podem inserir cartões" ON public.cartoes;
        DROP POLICY IF EXISTS "Usuários podem atualizar próprios cartões" ON public.cartoes;
        DROP POLICY IF EXISTS "Usuários podem deletar próprios cartões" ON public.cartoes;

        CREATE POLICY "Usuários podem ver próprios cartões"
          ON public.cartoes FOR SELECT USING (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem inserir cartões"
          ON public.cartoes FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem atualizar próprios cartões"
          ON public.cartoes FOR UPDATE USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem deletar próprios cartões"
          ON public.cartoes FOR DELETE USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para cartoes';
    END IF;
END $$;

-- 10. Corrigir RLS para gasolina
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gasolina') THEN
        ALTER TABLE public.gasolina ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Usuários podem ver próprios registros de gasolina" ON public.gasolina;
        DROP POLICY IF EXISTS "Usuários podem inserir registros de gasolina" ON public.gasolina;
        DROP POLICY IF EXISTS "Usuários podem atualizar próprios registros de gasolina" ON public.gasolina;
        DROP POLICY IF EXISTS "Usuários podem deletar próprios registros de gasolina" ON public.gasolina;

        CREATE POLICY "Usuários podem ver próprios registros de gasolina"
          ON public.gasolina FOR SELECT USING (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem inserir registros de gasolina"
          ON public.gasolina FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem atualizar próprios registros de gasolina"
          ON public.gasolina FOR UPDATE USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem deletar próprios registros de gasolina"
          ON public.gasolina FOR DELETE USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para gasolina';
    END IF;
END $$;

-- 11. Corrigir RLS para ferramentas
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ferramentas') THEN
        ALTER TABLE public.ferramentas ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Usuários podem ver próprias ferramentas" ON public.ferramentas;
        DROP POLICY IF EXISTS "Usuários podem inserir ferramentas" ON public.ferramentas;
        DROP POLICY IF EXISTS "Usuários podem atualizar próprias ferramentas" ON public.ferramentas;
        DROP POLICY IF EXISTS "Usuários podem deletar próprias ferramentas" ON public.ferramentas;

        CREATE POLICY "Usuários podem ver próprias ferramentas"
          ON public.ferramentas FOR SELECT USING (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem inserir ferramentas"
          ON public.ferramentas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem atualizar próprias ferramentas"
          ON public.ferramentas FOR UPDATE USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
        CREATE POLICY "Usuários podem deletar próprias ferramentas"
          ON public.ferramentas FOR DELETE USING (auth.uid() = usuario_id);

        RAISE NOTICE '✓ Políticas RLS atualizadas para ferramentas';
    END IF;
END $$;

-- 12. Atualizar índice da tabela salarios
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'salarios') THEN
        DROP INDEX IF EXISTS idx_salarios_user_id;
        CREATE INDEX IF NOT EXISTS idx_salarios_usuario_id ON public.salarios(usuario_id);
        RAISE NOTICE '✓ Índice atualizado para salarios';
    END IF;
END $$;

-- 13. Garantir permissões
DO $$
DECLARE
    tabelas text[] := ARRAY['salarios', 'gastos', 'assinaturas', 'investimentos', 'contas_fixas',
                            'metas', 'categorias', 'cartoes', 'gasolina', 'ferramentas'];
    tabela text;
BEGIN
    FOREACH tabela IN ARRAY tabelas
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tabela) THEN
            EXECUTE format('GRANT ALL ON public.%I TO authenticated', tabela);
        END IF;
    END LOOP;
    RAISE NOTICE '✓ Permissões atualizadas';
END $$;

-- Mensagem final
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓✓✓ Script executado com sucesso!';
  RAISE NOTICE 'Todas as políticas RLS foram atualizadas.';
  RAISE NOTICE '========================================';
END $$;
