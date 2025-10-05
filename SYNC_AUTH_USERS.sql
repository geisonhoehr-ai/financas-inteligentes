-- ============================================
-- SINCRONIZAR auth.users COM public.users
-- ============================================
-- Este script garante que todo usuário do Supabase Auth
-- tenha um registro correspondente na tabela public.users
-- ============================================

-- PASSO 1: Criar função para sincronizar usuário
-- ============================================
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

-- PASSO 2: Criar trigger para sincronizar automaticamente
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_to_public();

-- PASSO 3: Sincronizar usuários existentes
-- ============================================
-- Inserir todos os usuários que existem em auth.users mas não em public.users
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
AND au.email IS NOT NULL;

-- PASSO 4: Verificar sincronização
-- ============================================
SELECT
  'auth.users' as tabela,
  COUNT(*) as total,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as com_email
FROM auth.users
UNION ALL
SELECT
  'public.users',
  COUNT(*),
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END)
FROM public.users;

-- PASSO 5: Mostrar usuários sincronizados
-- ============================================
SELECT
  u.id,
  u.nome,
  u.email,
  u.tipo,
  u.ativo,
  u.created_at
FROM public.users u
ORDER BY u.created_at DESC;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ SINCRONIZAÇÃO CONCLUÍDA!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 O que foi feito:';
  RAISE NOTICE '   - Função sync_user_to_public() criada';
  RAISE NOTICE '   - Trigger automático configurado';
  RAISE NOTICE '   - Usuários existentes sincronizados';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Agora:';
  RAISE NOTICE '   - Todo novo login criará usuário em public.users';
  RAISE NOTICE '   - Faça login com: geisonhoehr@gmail.com / 123456';
  RAISE NOTICE '';
END $$;
