-- ============================================
-- MIGRAÇÃO COMPLETA: BIGSERIAL → UUID
-- ============================================
-- Este script corrige TODOS os problemas de autenticação
-- Data: 2025-10-06
-- ============================================

-- PASSO 1: Backup de segurança
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔄 ============================================';
  RAISE NOTICE '🔄 INICIANDO MIGRAÇÃO PARA UUID';
  RAISE NOTICE '🔄 ============================================';
  RAISE NOTICE '';
END $$;

-- Criar backup da tabela users atual
DROP TABLE IF EXISTS users_backup_bigserial CASCADE;
CREATE TABLE users_backup_bigserial AS SELECT * FROM users;

-- PASSO 2: Recriar tabela users com UUID
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '📦 Recriando tabela users com UUID...';
END $$;

-- Drop da tabela antiga (CASCADE remove todas as FKs)
DROP TABLE IF EXISTS users CASCADE;

-- Criar tabela users com estrutura correta
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tipo VARCHAR(20) DEFAULT 'pessoa',
    cor VARCHAR(7) NOT NULL DEFAULT '#007AFF',
    ativo BOOLEAN DEFAULT TRUE,
    foto_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_ativo ON users(ativo);
CREATE INDEX idx_users_tipo ON users(tipo);

COMMENT ON TABLE users IS 'Usuários do sistema - sincronizado com auth.users';
COMMENT ON COLUMN users.id IS 'UUID - mesmo ID do auth.users do Supabase';

-- PASSO 3: Função de sincronização automática
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '⚙️ Criando função de sincronização...';
END $$;

CREATE OR REPLACE FUNCTION sync_user_to_public()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir ou atualizar usuário na tabela public.users
  INSERT INTO public.users (
    id,
    nome,
    email,
    tipo,
    cor,
    ativo,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    'pessoa',
    '#007AFF',
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nome = COALESCE(EXCLUDED.nome, users.nome),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 4: Criar trigger automático
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '🔗 Criando trigger automático...';
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_to_public();

-- PASSO 5: Sincronizar usuários existentes do auth.users
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '👥 Sincronizando usuários existentes...';
END $$;

INSERT INTO public.users (
  id,
  nome,
  email,
  tipo,
  cor,
  ativo,
  created_at,
  updated_at
)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1)) as nome,
  au.email,
  'pessoa' as tipo,
  '#007AFF' as cor,
  TRUE as ativo,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
WHERE au.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- PASSO 6: Atualizar função de updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- PASSO 7: Habilitar Row Level Security (RLS)
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '🔒 Configurando segurança (RLS)...';
END $$;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver seus próprios dados
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Usuários podem atualizar seus próprios dados
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Service role pode fazer tudo (para triggers)
DROP POLICY IF EXISTS "Service role can do everything" ON users;
CREATE POLICY "Service role can do everything" ON users
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- PASSO 8: Verificação final
-- ============================================
DO $$
DECLARE
  auth_count INTEGER;
  public_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';

  -- Contar usuários
  SELECT COUNT(*) INTO auth_count FROM auth.users WHERE email IS NOT NULL;
  SELECT COUNT(*) INTO public_count FROM public.users;

  RAISE NOTICE '📊 Estatísticas:';
  RAISE NOTICE '   - auth.users: % usuários', auth_count;
  RAISE NOTICE '   - public.users: % usuários', public_count;
  RAISE NOTICE '';

  IF auth_count = public_count THEN
    RAISE NOTICE '✅ Sincronização: OK (% = %)', auth_count, public_count;
  ELSE
    RAISE WARNING '⚠️ Sincronização: Diferença encontrada (auth: %, public: %)', auth_count, public_count;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '🎯 Próximos passos:';
  RAISE NOTICE '   1. Regenerar tipos TypeScript no frontend';
  RAISE NOTICE '   2. Testar login com: geisonhoehr@gmail.com';
  RAISE NOTICE '   3. Verificar que o redirecionamento funciona';
  RAISE NOTICE '';
END $$;

-- Mostrar usuários sincronizados
SELECT
  u.id,
  u.nome,
  u.email,
  u.tipo,
  u.ativo,
  u.created_at
FROM public.users u
ORDER BY u.created_at DESC;
