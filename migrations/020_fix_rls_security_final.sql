-- ============================================
-- MIGRATION: Correção de RLS e Segurança
-- Data: 2025-10-11
-- Descrição: Adiciona RLS e políticas para todas as tabelas sem proteção
-- ============================================

-- 1. CONQUISTAS (tabela global)
-- ============================================
ALTER TABLE IF EXISTS conquistas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos usuários podem ver conquistas" ON conquistas;
CREATE POLICY "Todos usuários podem ver conquistas"
ON conquistas FOR SELECT
TO authenticated
USING (ativo = true OR ativo IS NULL);

DROP POLICY IF EXISTS "Service role gerencia conquistas" ON conquistas;
CREATE POLICY "Service role gerencia conquistas"
ON conquistas FOR ALL
TO service_role
USING (true);

-- 2. FILHO_CONQUISTAS
-- ============================================
ALTER TABLE IF EXISTS filho_conquistas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver conquistas dos filhos" ON filho_conquistas;
CREATE POLICY "Ver conquistas dos filhos"
ON filho_conquistas FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM perfis_filhos pf
    JOIN familia_membros fm ON fm.familia_id = pf.familia_id
    WHERE pf.id = filho_conquistas.filho_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Pais atribuem conquistas" ON filho_conquistas;
CREATE POLICY "Pais atribuem conquistas"
ON filho_conquistas FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM perfis_filhos pf
    JOIN familia_membros fm ON fm.familia_id = pf.familia_id
    JOIN familias f ON f.id = pf.familia_id
    WHERE pf.id = filho_conquistas.filho_id
    AND fm.usuario_id = auth.uid()
    AND (f.admin_id = auth.uid() OR fm.papel IN ('pai', 'mae'))
  )
);

-- 3. DESAFIO_REGRAS
-- ============================================
ALTER TABLE IF EXISTS desafio_regras ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver regras dos desafios" ON desafio_regras;
CREATE POLICY "Ver regras dos desafios"
ON desafio_regras FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM desafios_familia df
    JOIN familia_membros fm ON fm.familia_id = df.familia_id
    WHERE df.id = desafio_regras.desafio_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Pais gerenciam regras" ON desafio_regras;
CREATE POLICY "Pais gerenciam regras"
ON desafio_regras FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM desafios_familia df
    JOIN familia_membros fm ON fm.familia_id = df.familia_id
    JOIN familias f ON f.id = df.familia_id
    WHERE df.id = desafio_regras.desafio_id
    AND fm.usuario_id = auth.uid()
    AND (f.admin_id = auth.uid() OR fm.papel IN ('pai', 'mae'))
  )
);

-- 4. DESAFIO_PROGRESSO
-- ============================================
ALTER TABLE IF EXISTS desafio_progresso ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver progresso dos desafios" ON desafio_progresso;
CREATE POLICY "Ver progresso dos desafios"
ON desafio_progresso FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM desafios_familia df
    JOIN familia_membros fm ON fm.familia_id = df.familia_id
    WHERE df.id = desafio_progresso.desafio_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Registrar progresso" ON desafio_progresso;
CREATE POLICY "Registrar progresso"
ON desafio_progresso FOR INSERT
TO authenticated
WITH CHECK (
  usuario_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM desafios_familia df
    JOIN familia_membros fm ON fm.familia_id = df.familia_id
    WHERE df.id = desafio_progresso.desafio_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Atualizar progresso" ON desafio_progresso;
CREATE POLICY "Atualizar progresso"
ON desafio_progresso FOR UPDATE
TO authenticated
USING (usuario_id = auth.uid());

-- 5. LISTA_DESEJOS_VOTACAO
-- ============================================
ALTER TABLE IF EXISTS lista_desejos_votacao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver votações" ON lista_desejos_votacao;
CREATE POLICY "Ver votações"
ON lista_desejos_votacao FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM lista_desejos ld
    JOIN familia_membros fm ON fm.familia_id = ld.familia_id
    WHERE ld.id = lista_desejos_votacao.desejo_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Votar em desejos" ON lista_desejos_votacao;
CREATE POLICY "Votar em desejos"
ON lista_desejos_votacao FOR INSERT
TO authenticated
WITH CHECK (
  usuario_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM lista_desejos ld
    JOIN familia_membros fm ON fm.familia_id = ld.familia_id
    WHERE ld.id = lista_desejos_votacao.desejo_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Atualizar votos" ON lista_desejos_votacao;
CREATE POLICY "Atualizar votos"
ON lista_desejos_votacao FOR UPDATE
TO authenticated
USING (usuario_id = auth.uid());

-- 6. ACERTO_CONTAS
-- ============================================
ALTER TABLE IF EXISTS acerto_contas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver acertos" ON acerto_contas;
CREATE POLICY "Ver acertos"
ON acerto_contas FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = acerto_contas.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Criar acertos" ON acerto_contas;
CREATE POLICY "Criar acertos"
ON acerto_contas FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = acerto_contas.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Atualizar acertos" ON acerto_contas;
CREATE POLICY "Atualizar acertos"
ON acerto_contas FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = acerto_contas.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

-- 7. LISTA_DESEJOS_CONTRIBUICOES
-- ============================================
ALTER TABLE IF EXISTS lista_desejos_contribuicoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver contribuições" ON lista_desejos_contribuicoes;
CREATE POLICY "Ver contribuições"
ON lista_desejos_contribuicoes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM lista_desejos ld
    JOIN familia_membros fm ON fm.familia_id = ld.familia_id
    WHERE ld.id = lista_desejos_contribuicoes.desejo_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Criar contribuições" ON lista_desejos_contribuicoes;
CREATE POLICY "Criar contribuições"
ON lista_desejos_contribuicoes FOR INSERT
TO authenticated
WITH CHECK (
  usuario_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM lista_desejos ld
    JOIN familia_membros fm ON fm.familia_id = ld.familia_id
    WHERE ld.id = lista_desejos_contribuicoes.desejo_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Atualizar contribuições" ON lista_desejos_contribuicoes;
CREATE POLICY "Atualizar contribuições"
ON lista_desejos_contribuicoes FOR UPDATE
TO authenticated
USING (usuario_id = auth.uid());

-- 8. SCORE_HISTORICO
-- ============================================
ALTER TABLE IF EXISTS score_historico ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver histórico score" ON score_historico;
CREATE POLICY "Ver histórico score"
ON score_historico FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM score_financeiro sf
    JOIN familia_membros fm ON fm.familia_id = sf.familia_id
    WHERE sf.id = score_historico.score_id
    AND fm.usuario_id = auth.uid()
  )
);

-- 9. POLÍTICAS PARA TABELAS COM RLS MAS SEM POLÍTICAS
-- ============================================

-- assinaturas_tags
DROP POLICY IF EXISTS "Gerenciar tags assinaturas" ON assinaturas_tags;
CREATE POLICY "Gerenciar tags assinaturas"
ON assinaturas_tags FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM assinaturas a
    JOIN familia_membros fm ON fm.familia_id = a.familia_id
    WHERE a.id = assinaturas_tags.assinatura_id
    AND fm.usuario_id = auth.uid()
  )
);

-- contas_fixas_tags
DROP POLICY IF EXISTS "Gerenciar tags contas" ON contas_fixas_tags;
CREATE POLICY "Gerenciar tags contas"
ON contas_fixas_tags FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM contas_fixas cf
    JOIN familia_membros fm ON fm.familia_id = cf.familia_id
    WHERE cf.id = contas_fixas_tags.conta_fixa_id
    AND fm.usuario_id = auth.uid()
  )
);

-- dividas (externa, não dividas_internas)
DROP POLICY IF EXISTS "Ver dívidas externas" ON dividas;
CREATE POLICY "Ver dívidas externas"
ON dividas FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = dividas.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Criar dívidas externas" ON dividas;
CREATE POLICY "Criar dívidas externas"
ON dividas FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = dividas.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Atualizar dívidas externas" ON dividas;
CREATE POLICY "Atualizar dívidas externas"
ON dividas FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = dividas.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Deletar dívidas externas" ON dividas;
CREATE POLICY "Deletar dívidas externas"
ON dividas FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = dividas.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

-- emprestimos
DROP POLICY IF EXISTS "Ver empréstimos" ON emprestimos;
CREATE POLICY "Ver empréstimos"
ON emprestimos FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = emprestimos.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Criar empréstimos" ON emprestimos;
CREATE POLICY "Criar empréstimos"
ON emprestimos FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = emprestimos.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Atualizar empréstimos" ON emprestimos;
CREATE POLICY "Atualizar empréstimos"
ON emprestimos FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = emprestimos.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Deletar empréstimos" ON emprestimos;
CREATE POLICY "Deletar empréstimos"
ON emprestimos FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = emprestimos.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

-- mesada_ajustes
DROP POLICY IF EXISTS "Ver ajustes mesada" ON mesada_ajustes;
CREATE POLICY "Ver ajustes mesada"
ON mesada_ajustes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM mesadas m
    JOIN perfis_filhos pf ON pf.id = m.filho_id
    JOIN familia_membros fm ON fm.familia_id = pf.familia_id
    WHERE m.id = mesada_ajustes.mesada_id
    AND fm.usuario_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Criar ajustes mesada" ON mesada_ajustes;
CREATE POLICY "Criar ajustes mesada"
ON mesada_ajustes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM mesadas m
    JOIN perfis_filhos pf ON pf.id = m.filho_id
    JOIN familia_membros fm ON fm.familia_id = pf.familia_id
    JOIN familias f ON f.id = pf.familia_id
    WHERE m.id = mesada_ajustes.mesada_id
    AND fm.usuario_id = auth.uid()
    AND (f.admin_id = auth.uid() OR fm.papel IN ('pai', 'mae'))
  )
);

DROP POLICY IF EXISTS "Atualizar ajustes mesada" ON mesada_ajustes;
CREATE POLICY "Atualizar ajustes mesada"
ON mesada_ajustes FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM mesadas m
    JOIN perfis_filhos pf ON pf.id = m.filho_id
    JOIN familia_membros fm ON fm.familia_id = pf.familia_id
    JOIN familias f ON f.id = pf.familia_id
    WHERE m.id = mesada_ajustes.mesada_id
    AND fm.usuario_id = auth.uid()
    AND (f.admin_id = auth.uid() OR fm.papel IN ('pai', 'mae'))
  )
);

-- score_financeiro
DROP POLICY IF EXISTS "Ver score família" ON score_financeiro;
CREATE POLICY "Ver score família"
ON score_financeiro FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = score_financeiro.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

-- categorias_personalizadas
DROP POLICY IF EXISTS "Gerenciar categorias personalizadas" ON categorias_personalizadas;
CREATE POLICY "Gerenciar categorias personalizadas"
ON categorias_personalizadas FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM familia_membros fm
    WHERE fm.familia_id = categorias_personalizadas.familia_id
    AND fm.usuario_id = auth.uid()
  )
);

-- 10. ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_filho_conquistas_filho_id ON filho_conquistas(filho_id);
CREATE INDEX IF NOT EXISTS idx_filho_conquistas_conquista_id ON filho_conquistas(conquista_id);
CREATE INDEX IF NOT EXISTS idx_desafio_regras_desafio_id ON desafio_regras(desafio_id);
CREATE INDEX IF NOT EXISTS idx_desafio_progresso_desafio_id ON desafio_progresso(desafio_id);
CREATE INDEX IF NOT EXISTS idx_desafio_progresso_usuario_id ON desafio_progresso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_lista_desejos_votacao_desejo_id ON lista_desejos_votacao(desejo_id);
CREATE INDEX IF NOT EXISTS idx_lista_desejos_votacao_usuario_id ON lista_desejos_votacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_acerto_contas_familia_id ON acerto_contas(familia_id);
CREATE INDEX IF NOT EXISTS idx_lista_desejos_contribuicoes_desejo_id ON lista_desejos_contribuicoes(desejo_id);
CREATE INDEX IF NOT EXISTS idx_score_historico_score_id ON score_historico(score_id);

-- 11. COMENTÁRIOS
-- ============================================

COMMENT ON TABLE conquistas IS 'Conquistas globais - RLS ativado';
COMMENT ON TABLE filho_conquistas IS 'Conquistas dos filhos - RLS ativado';
COMMENT ON TABLE desafio_regras IS 'Regras dos desafios - RLS ativado';
COMMENT ON TABLE desafio_progresso IS 'Progresso em desafios - RLS ativado';
COMMENT ON TABLE lista_desejos_votacao IS 'Votações - RLS ativado';
COMMENT ON TABLE acerto_contas IS 'Acertos de contas - RLS ativado';
COMMENT ON TABLE lista_desejos_contribuicoes IS 'Contribuições - RLS ativado';
COMMENT ON TABLE score_historico IS 'Histórico score - RLS ativado';

