-- ============================================
-- CONFIGURAR SUPABASE STORAGE PARA COMPROVANTES
-- ============================================
-- Execute este script no Supabase SQL Editor
-- ============================================

-- PASSO 1: Criar bucket para comprovantes
-- ============================================
-- NOTA: Execute isto manualmente no painel do Supabase Storage:
-- 1. Vá em Storage → Create Bucket
-- 2. Nome: "comprovantes"
-- 3. Public: false (privado)
-- 4. File size limit: 5 MB
-- 5. Allowed MIME types: image/jpeg, image/png, image/webp, application/pdf

-- PASSO 2: Configurar políticas de acesso (RLS)
-- ============================================

-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Usuário pode fazer upload de comprovantes" ON storage.objects;
DROP POLICY IF EXISTS "Ver comprovantes de dívidas envolvidas" ON storage.objects;
DROP POLICY IF EXISTS "Deletar comprovantes próprios" ON storage.objects;

-- Política: Usuário pode fazer upload de seus próprios comprovantes
CREATE POLICY "Usuário pode fazer upload de comprovantes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'comprovantes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política: Usuário pode ver comprovantes de dívidas que está envolvido
CREATE POLICY "Ver comprovantes de dívidas envolvidas"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'comprovantes' AND
  (
    -- Comprovantes próprios
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Comprovantes de dívidas onde é credor ou devedor
    EXISTS (
      SELECT 1 FROM dividas_internas
      WHERE comprovante_url = storage.objects.name
        AND (credor_id = auth.uid() OR devedor_id = auth.uid())
        AND deleted_at IS NULL
    )
  )
);

-- Política: Usuário pode deletar seus próprios comprovantes
CREATE POLICY "Deletar comprovantes próprios"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'comprovantes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- PASSO 3: Criar função para gerar URL de upload
-- ============================================
CREATE OR REPLACE FUNCTION gerar_path_comprovante(
  p_divida_id UUID
)
RETURNS TEXT AS $$
DECLARE
  v_usuario_id UUID;
  v_timestamp TEXT;
  v_random TEXT;
BEGIN
  -- Pegar ID do usuário atual
  v_usuario_id := auth.uid();

  -- Gerar timestamp
  v_timestamp := to_char(NOW(), 'YYYYMMDD_HH24MISS');

  -- Gerar string aleatória
  v_random := substr(md5(random()::text), 1, 8);

  -- Retornar path: usuario_id/divida_id_timestamp_random.jpg
  RETURN v_usuario_id || '/' || p_divida_id || '_' || v_timestamp || '_' || v_random;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 4: Função para validar e salvar comprovante
-- ============================================
CREATE OR REPLACE FUNCTION salvar_comprovante_divida(
  p_divida_id UUID,
  p_comprovante_url TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_divida RECORD;
BEGIN
  -- Buscar dívida
  SELECT * INTO v_divida
  FROM dividas_internas
  WHERE id = p_divida_id
    AND deleted_at IS NULL;

  -- Verificar se dívida existe
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dívida não encontrada';
  END IF;

  -- Verificar se usuário é credor ou devedor
  IF v_divida.credor_id != auth.uid() AND v_divida.devedor_id != auth.uid() THEN
    RAISE EXCEPTION 'Você não tem permissão para adicionar comprovante a esta dívida';
  END IF;

  -- Atualizar comprovante
  UPDATE dividas_internas
  SET
    comprovante_url = p_comprovante_url,
    updated_at = NOW()
  WHERE id = p_divida_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 5: Função para obter URL pública do comprovante
-- ============================================
CREATE OR REPLACE FUNCTION obter_url_comprovante(
  p_comprovante_url TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_url TEXT;
BEGIN
  -- Se for NULL, retornar NULL
  IF p_comprovante_url IS NULL THEN
    RETURN NULL;
  END IF;

  -- Gerar URL pública temporária (válida por 1 hora)
  -- NOTA: Isto deve ser feito no frontend usando supabase.storage.from('comprovantes').createSignedUrl()
  -- Esta função é apenas um placeholder para documentação

  RETURN p_comprovante_url;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INSTRUÇÕES PARA CRIAR O BUCKET MANUALMENTE
-- ============================================

/*
IMPORTANTE: Execute os seguintes passos manualmente no Supabase Dashboard:

1. Acesse: https://supabase.com/dashboard/project/SEU_PROJECT_ID/storage/buckets

2. Clique em "New Bucket"

3. Configure:
   - Name: comprovantes
   - Public: OFF (desmarcar)
   - File size limit: 5 MB
   - Allowed MIME types:
     - image/jpeg
     - image/png
     - image/webp
     - application/pdf

4. Clique em "Create bucket"

5. Após criar, execute este SQL para aplicar as policies.

VERIFICAÇÃO:
Para verificar se o bucket foi criado corretamente:
*/

SELECT * FROM storage.buckets WHERE name = 'comprovantes';

-- Deve retornar 1 linha com:
-- - id: comprovantes
-- - public: false
-- - file_size_limit: 5242880 (5MB em bytes)

COMMENT ON FUNCTION gerar_path_comprovante(UUID) IS 'Gera path único para upload de comprovante';
COMMENT ON FUNCTION salvar_comprovante_divida(UUID, TEXT) IS 'Salva URL do comprovante na dívida após validação';
COMMENT ON FUNCTION obter_url_comprovante(TEXT) IS 'Obtém URL pública do comprovante';
