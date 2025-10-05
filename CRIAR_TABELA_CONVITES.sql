-- ============================================
-- CRIAR TABELA DE CONVITES
-- ============================================
-- Sistema de convites para compartilhar famílias
-- Execute este script no Supabase SQL Editor
-- ============================================

-- Criar tabela de convites
DROP TABLE IF EXISTS convites CASCADE;
CREATE TABLE convites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  codigo VARCHAR(20) UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  criado_por UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  max_usos INTEGER DEFAULT NULL, -- NULL = ilimitado
  usos_atual INTEGER DEFAULT 0,
  validade TIMESTAMP, -- NULL = sem validade
  ativo BOOLEAN DEFAULT TRUE,
  deletado BOOLEAN DEFAULT FALSE,
  deletado_em TIMESTAMP,
  deletado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT max_usos_positivo CHECK (max_usos IS NULL OR max_usos > 0),
  CONSTRAINT usos_nao_negativo CHECK (usos_atual >= 0),
  CONSTRAINT codigo_unico CHECK (LENGTH(TRIM(codigo)) >= 6)
);

-- Índices para performance
CREATE INDEX idx_convites_familia ON convites(familia_id) WHERE deletado = FALSE;
CREATE INDEX idx_convites_codigo ON convites(codigo) WHERE ativo = TRUE AND deletado = FALSE;
CREATE INDEX idx_convites_criado_por ON convites(criado_por) WHERE deletado = FALSE;
CREATE INDEX idx_convites_validade ON convites(validade) WHERE ativo = TRUE AND deletado = FALSE;

-- Comentários para documentação
COMMENT ON TABLE convites IS 'Convites para ingresso em famílias';
COMMENT ON COLUMN convites.codigo IS 'Código único do convite (8 caracteres)';
COMMENT ON COLUMN convites.max_usos IS 'Máximo de usos permitidos (NULL = ilimitado)';
COMMENT ON COLUMN convites.usos_atual IS 'Quantidade atual de usos do convite';
COMMENT ON COLUMN convites.validade IS 'Data de validade do convite (NULL = sem validade)';

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para gerar código único de convite
CREATE OR REPLACE FUNCTION gerar_codigo_convite()
RETURNS TEXT AS $$
DECLARE
  novo_codigo TEXT;
  codigo_existe BOOLEAN;
BEGIN
  LOOP
    -- Gerar código aleatório de 8 caracteres (apenas letras e números)
    novo_codigo := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));

    -- Verificar se código já existe
    SELECT EXISTS(SELECT 1 FROM convites WHERE codigo = novo_codigo) INTO codigo_existe;

    -- Se não existe, retornar
    IF NOT codigo_existe THEN
      RETURN novo_codigo;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Função para validar convite
CREATE OR REPLACE FUNCTION validar_convite(p_codigo TEXT)
RETURNS TABLE (
  valido BOOLEAN,
  mensagem TEXT,
  convite_id UUID,
  familia_id UUID,
  familia_nome TEXT
) AS $$
DECLARE
  v_convite RECORD;
BEGIN
  -- Buscar convite
  SELECT c.*, f.nome as familia_nome
  INTO v_convite
  FROM convites c
  JOIN familias f ON f.id = c.familia_id
  WHERE c.codigo = p_codigo
    AND c.deletado = FALSE
    AND f.deletado = FALSE;

  -- Convite não encontrado
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'Convite não encontrado ou inválido'::TEXT, NULL::UUID, NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Convite inativo
  IF NOT v_convite.ativo THEN
    RETURN QUERY SELECT FALSE, 'Convite desativado'::TEXT, NULL::UUID, NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Convite expirado
  IF v_convite.validade IS NOT NULL AND v_convite.validade < NOW() THEN
    RETURN QUERY SELECT FALSE, 'Convite expirado'::TEXT, NULL::UUID, NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Convite com usos esgotados
  IF v_convite.max_usos IS NOT NULL AND v_convite.usos_atual >= v_convite.max_usos THEN
    RETURN QUERY SELECT FALSE, 'Convite sem usos disponíveis'::TEXT, NULL::UUID, NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Convite válido
  RETURN QUERY SELECT
    TRUE,
    'Convite válido'::TEXT,
    v_convite.id,
    v_convite.familia_id,
    v_convite.familia_nome;
END;
$$ LANGUAGE plpgsql;

-- Função para aceitar convite e entrar na família
CREATE OR REPLACE FUNCTION aceitar_convite(
  p_codigo TEXT,
  p_usuario_id UUID
)
RETURNS TABLE (
  sucesso BOOLEAN,
  mensagem TEXT,
  familia_id UUID
) AS $$
DECLARE
  v_validacao RECORD;
  v_ja_membro BOOLEAN;
BEGIN
  -- Validar convite
  SELECT * INTO v_validacao FROM validar_convite(p_codigo);

  -- Se inválido, retornar erro
  IF NOT v_validacao.valido THEN
    RETURN QUERY SELECT FALSE, v_validacao.mensagem, NULL::UUID;
    RETURN;
  END IF;

  -- Verificar se usuário já é membro
  SELECT EXISTS(
    SELECT 1 FROM familia_membros
    WHERE familia_id = v_validacao.familia_id
      AND usuario_id = p_usuario_id
      AND deletado = FALSE
  ) INTO v_ja_membro;

  IF v_ja_membro THEN
    RETURN QUERY SELECT FALSE, 'Você já é membro desta família'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Adicionar usuário à família
  INSERT INTO familia_membros (familia_id, usuario_id, papel, created_at, updated_at)
  VALUES (v_validacao.familia_id, p_usuario_id, 'membro', NOW(), NOW());

  -- Incrementar contador de usos
  UPDATE convites
  SET usos_atual = usos_atual + 1,
      updated_at = NOW()
  WHERE id = v_validacao.convite_id;

  -- Retornar sucesso
  RETURN QUERY SELECT TRUE, 'Convite aceito com sucesso!'::TEXT, v_validacao.familia_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER convites_updated_at
BEFORE UPDATE ON convites
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE convites ENABLE ROW LEVEL SECURITY;

-- Política: Usuário pode ver convites de suas famílias
CREATE POLICY "Usuário pode ver convites de suas famílias"
ON convites FOR SELECT
USING (
  familia_id IN (
    SELECT familia_id FROM familia_membros
    WHERE usuario_id = auth.uid()
      AND deletado = FALSE
  )
);

-- Política: Admin ou criador pode criar convites
CREATE POLICY "Admin pode criar convites"
ON convites FOR INSERT
WITH CHECK (
  -- Usuário é admin da família
  familia_id IN (
    SELECT id FROM familias
    WHERE admin_id = auth.uid()
      AND deletado = FALSE
  )
  OR
  -- Ou é membro com permissão
  familia_id IN (
    SELECT familia_id FROM familia_membros
    WHERE usuario_id = auth.uid()
      AND papel IN ('admin', 'editor')
      AND deletado = FALSE
  )
);

-- Política: Criador ou admin pode atualizar convite
CREATE POLICY "Criador pode atualizar convite"
ON convites FOR UPDATE
USING (
  criado_por = auth.uid()
  OR
  familia_id IN (
    SELECT id FROM familias
    WHERE admin_id = auth.uid()
      AND deletado = FALSE
  )
);

-- Política: Criador ou admin pode deletar convite
CREATE POLICY "Criador pode deletar convite"
ON convites FOR DELETE
USING (
  criado_por = auth.uid()
  OR
  familia_id IN (
    SELECT id FROM familias
    WHERE admin_id = auth.uid()
      AND deletado = FALSE
  )
);

-- ============================================
-- DADOS INICIAIS (Opcional)
-- ============================================

-- Você pode adicionar convites de teste aqui se desejar
-- Exemplo:
-- INSERT INTO convites (familia_id, criado_por, max_usos, validade)
-- SELECT id, admin_id, 10, NOW() + INTERVAL '30 days'
-- FROM familias
-- WHERE nome = 'Minha Família'
-- LIMIT 1;

COMMENT ON FUNCTION gerar_codigo_convite() IS 'Gera código único de 8 caracteres para convite';
COMMENT ON FUNCTION validar_convite(TEXT) IS 'Valida se um convite pode ser usado';
COMMENT ON FUNCTION aceitar_convite(TEXT, UUID) IS 'Aceita um convite e adiciona usuário à família';
