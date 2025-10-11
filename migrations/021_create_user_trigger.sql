-- ============================================
-- MIGRATION: Criar Trigger para Novos Usuários
-- Data: 2025-10-11
-- Descrição: Cria automaticamente família inicial quando um novo usuário se registra
-- ============================================

-- ============================================
-- PARTE 1: Function para processar novo usuário
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_familia_id UUID;
BEGIN
  -- 1. Criar família inicial para o usuário
  INSERT INTO public.familias (
    nome,
    admin_id
  ) VALUES (
    'Minha Família',
    NEW.id
  ) RETURNING id INTO v_familia_id;

  -- 2. Adicionar usuário como membro da família
  INSERT INTO public.familia_membros (
    familia_id,
    usuario_id,
    papel
  ) VALUES (
    v_familia_id,
    NEW.id,
    'admin'
  );

  -- 3. Criar registro de assinatura (plano gratuito por padrão)
  -- Verificar se metadata do usuário tem plano específico
  INSERT INTO public.user_subscriptions (
    user_id,
    plan,
    status
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'plan', 'free')::text,
    'active'
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro (o Supabase vai capturar)
    RAISE WARNING 'Erro ao criar setup inicial para usuário %: %', NEW.id, SQLERRM;
    -- Ainda retorna NEW para não bloquear a criação do usuário
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PARTE 2: Criar Trigger
-- ============================================

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PARTE 3: Comentários e Documentação
-- ============================================

COMMENT ON FUNCTION public.handle_new_user() IS
'Função chamada automaticamente quando um novo usuário se registra.
Cria:
1. Família inicial chamada "Minha Família"
2. Adiciona usuário como admin da família
3. Cria registro de assinatura na tabela user_subscriptions (plano do metadata ou "free")

IMPORTANTE: Esta função usa SECURITY DEFINER para ter permissões de criar
registros em tabelas protegidas por RLS.

Tabelas afetadas: familias, familia_membros, user_subscriptions';

-- ============================================
-- PARTE 4: Verificações de Segurança
-- ============================================

-- Garantir que a function pode ser executada pelo trigger
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

-- ============================================
-- PARTE 5: Function auxiliar para verificar setup
-- ============================================

CREATE OR REPLACE FUNCTION public.verificar_setup_usuario(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tem_familia BOOLEAN;
BEGIN
  -- Verificar se usuário já tem alguma família
  SELECT EXISTS(
    SELECT 1 FROM familia_membros
    WHERE usuario_id = user_id
  ) INTO v_tem_familia;

  RETURN NOT v_tem_familia;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.verificar_setup_usuario(UUID) IS
'Verifica se usuário precisa de setup inicial (primeira família).
Retorna TRUE se precisa de setup, FALSE se já tem família.';

-- ============================================
-- PARTE 6: Corrigir usuários existentes sem família
-- ============================================

-- Para usuários que já foram criados mas não têm família,
-- criar a família inicial
DO $$
DECLARE
  v_user RECORD;
  v_familia_id UUID;
BEGIN
  FOR v_user IN
    SELECT id, email, raw_user_meta_data
    FROM auth.users au
    WHERE NOT EXISTS (
      SELECT 1 FROM familia_membros fm
      WHERE fm.usuario_id = au.id
    )
  LOOP
    -- Criar família
    INSERT INTO familias (nome, admin_id)
    VALUES ('Minha Família', v_user.id)
    RETURNING id INTO v_familia_id;

    -- Adicionar como membro
    INSERT INTO familia_membros (familia_id, usuario_id, papel)
    VALUES (v_familia_id, v_user.id, 'admin');

    -- Criar assinatura se não existir
    INSERT INTO user_subscriptions (user_id, plan, status)
    VALUES (
      v_user.id,
      COALESCE(v_user.raw_user_meta_data->>'plan', 'free')::text,
      'active'
    )
    ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE 'Setup criado para usuário: %', v_user.email;
  END LOOP;
END $$;

-- ============================================
-- TESTE DA MIGRATION
-- ============================================

-- Para testar se funcionou:
-- SELECT
--   au.email,
--   f.nome as familia,
--   fm.papel,
--   a.plan
-- FROM auth.users au
-- LEFT JOIN familia_membros fm ON fm.usuario_id = au.id
-- LEFT JOIN familias f ON f.id = fm.familia_id
-- LEFT JOIN user_subscriptions a ON a.user_id = au.id
-- WHERE au.created_at > NOW() - INTERVAL '1 hour'
-- ORDER BY au.created_at DESC;
