# 🚀 EXECUTAR MIGRAÇÃO UUID

## Passo 1: Executar a migração SQL no Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard/project/sfemmeczjhleyqeegwhs)
2. Vá para **SQL Editor**
3. Cole o conteúdo do arquivo `MIGRACAO_UUID_COMPLETA.sql`
4. Execute o script

## Passo 2: Verificar se a migração foi bem-sucedida

Execute esta query no SQL Editor para verificar:

```sql
-- Verificar estrutura da tabela users
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Verificar usuários sincronizados
SELECT id, nome, email, tipo, ativo, created_at
FROM public.users
ORDER BY created_at DESC;

-- Verificar trigger
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users';
```

## Passo 3: Regenerar tipos TypeScript

Após executar a migração, execute:

```bash
npx supabase login
npx supabase gen types typescript --project-id sfemmeczjhleyqeegwhs > types/database.types.ts
```

## Passo 4: Testar o login

1. Execute `npm run dev`
2. Acesse `/login`
3. Teste o login com: `geisonhoehr@gmail.com`
4. Verifique se o redirecionamento funciona

## ✅ Verificações de Sucesso

- [ ] Tabela `users` tem coluna `id` como UUID
- [ ] Trigger `on_auth_user_created` está ativo
- [ ] Usuários do auth.users foram sincronizados
- [ ] Tipos TypeScript foram regenerados
- [ ] Login funciona e redireciona corretamente
