# 🔍 Relatório de Auditoria - Sistema de Autenticação

**Data:** 2025-10-06
**Status:** ⚠️ Problemas Críticos Encontrados

---

## ❌ PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **INCOMPATIBILIDADE DE TIPOS - Tabela `users`**

**Problema:**
- **Banco de dados:** Tabela `users` usa `BIGSERIAL` (número auto-incrementado)
- **Supabase Auth:** Sistema de autenticação usa `UUID` (string)
- **Resultado:** IDs incompatíveis entre `auth.users` e `public.users`

**Evidências:**
```typescript
// database.types.ts - Gerado do banco
users: {
  Row: {
    id: number  // ❌ BIGSERIAL
    nome: string
    // ...
  }
}

// lib/auth.ts - Código esperando UUID
const { data } = await supabase.auth.signUp({...})
// data.user.id é UUID (string)

// Tentando inserir na tabela users
await supabase.from('users').insert({
  id: data.user.id,  // ❌ UUID sendo inserido em campo BIGINT
  // ...
})
```

**Arquivos Afetados:**
- `types/database.types.ts` (linha 14)
- `database_setup.sql` (linha 31)
- `lib/auth.ts` (linhas 42-51)
- `SYNC_AUTH_USERS.sql` (todo o arquivo)

---

### 2. **CLIENTES SUPABASE MÚLTIPLOS E DESCONEXOS**

**Problema:**
- Cliente do navegador (`createClient`) não compartilha sessão com servidor
- Middleware usa `createServerClient` que lê cookies diferentes
- Após login, cookies não são sincronizados corretamente

**Evidências:**
```typescript
// lib/supabase.ts - Cliente do navegador
export const supabase = createClient<Database>(url, key, {
  auth: {
    persistSession: true,  // Persiste em localStorage
    autoRefreshToken: true,
  },
})

// middleware.ts - Cliente do servidor
const supabase = createServerClient(url, key, {
  cookies: {
    get(name) { return req.cookies.get(name)?.value }  // Lê de cookies HTTP
    // ...
  }
})
```

**Resultado:**
- Login bem-sucedido salva sessão em `localStorage`
- Middleware não encontra sessão em cookies HTTP
- Usuário fica preso na tela de login

---

### 3. **FALTA DE SINCRONIZAÇÃO auth.users ↔ public.users**

**Problema:**
- Script `SYNC_AUTH_USERS.sql` existe mas não foi executado
- Trigger de sincronização automática não está ativo
- Código tenta criar usuário manualmente com ID incompatível

**Evidências:**
```sql
-- SYNC_AUTH_USERS.sql (linha 10-40)
CREATE OR REPLACE FUNCTION sync_user_to_public()
-- ❌ Esta função espera UUID mas tabela users usa BIGSERIAL
```

---

### 4. **MIDDLEWARE COM LÓGICA INCONSISTENTE**

**Problema Atual:**
```typescript
// middleware.ts
if (!session && !isPublicPath) {
  redirectUrl.pathname = '/login'
  return NextResponse.redirect(redirectUrl)
}

// Mas a sessão nunca é encontrada porque:
// 1. Cliente browser salva em localStorage
// 2. Middleware lê de cookies HTTP
// 3. Cookies não são criados corretamente após login
```

---

## 📊 ANÁLISE DO FLUXO ATUAL

### Fluxo de Login (Atual - Com Problemas)

```
1. Usuário preenche email/senha
   ↓
2. lib/auth.ts chama supabase.auth.signInWithPassword()
   ✅ Autentica no Supabase Auth (auth.users)
   ✅ Cria sessão em localStorage
   ❌ NÃO cria cookies HTTP adequadamente
   ↓
3. Código tenta inserir em public.users
   ❌ FALHA: UUID vs BIGSERIAL incompatível
   ↓
4. window.location.href = '/'
   ↓
5. Middleware executa
   ❌ Não encontra sessão em cookies
   ↓
6. Redireciona de volta para /login
   ❌ LOOP INFINITO
```

---

## 🔧 ESTRUTURA ATUAL DO BANCO

### Tabela `users` (Atual - Incorreta)
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,  -- ❌ Deveria ser UUID
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    -- ...
);
```

### Como Deveria Ser:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,  -- ✅ Referência a auth.users
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    -- ...
);
```

---

## 📁 ARQUIVOS DO SISTEMA

### Arquivos de Autenticação
- ✅ `lib/auth.ts` - Funções de login/signup
- ✅ `lib/supabase.ts` - Cliente Supabase (browser)
- ✅ `components/auth-provider.tsx` - Context React
- ✅ `app/login/page.tsx` - Página de login
- ✅ `middleware.ts` - Proteção de rotas
- ⚠️ `types/database.types.ts` - Tipos incorretos (id: number)

### Scripts SQL
- ❌ `database_setup.sql` - Cria tabela users com BIGSERIAL
- ⚠️ `SYNC_AUTH_USERS.sql` - Script correto mas não executado
- ⚠️ `MELHORIAS_*.sql` - Vários scripts de migração

---

## 🎯 CAUSA RAIZ

**O problema principal é:**

1. **Schema do banco está errado** - Tabela `users` foi criada com `BIGSERIAL` ao invés de `UUID`
2. **Tipos TypeScript foram gerados do schema errado** - `id: number` ao invés de `id: string`
3. **Código de autenticação espera UUID** - Mas banco aceita apenas numbers
4. **Sincronização não funciona** - Script de sync existe mas não resolve o problema de tipos

---

## ✅ SOLUÇÕES PROPOSTAS

### Opção 1: CORREÇÃO COMPLETA (Recomendada)

1. **Migrar tabela users para UUID:**
```sql
-- Backup dos dados
CREATE TABLE users_backup AS SELECT * FROM users;

-- Recriar tabela com UUID
DROP TABLE users CASCADE;
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    tipo VARCHAR(20) DEFAULT 'pessoa',
    cor VARCHAR(7) NOT NULL DEFAULT '#007AFF',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Executar SYNC_AUTH_USERS.sql
-- Criar trigger automático
```

2. **Regenerar tipos TypeScript:**
```bash
npx supabase gen types typescript --project-id sfemmeczjhleyqeegwhs > types/database.types.ts
```

3. **Configurar cookies adequadamente:**
```typescript
// lib/supabase.ts - Adicionar storage para cookies
export const supabase = createClient(url, key, {
  auth: {
    storage: customStorage,  // Storage que salva em cookies
    persistSession: true,
  },
})
```

### Opção 2: WORKAROUND TEMPORÁRIO

1. **Criar mapeamento UUID → BIGSERIAL:**
```sql
CREATE TABLE user_auth_mapping (
    auth_id UUID PRIMARY KEY,
    user_id BIGINT REFERENCES users(id)
);
```

2. **Modificar código de autenticação:**
```typescript
// Após login, criar mapeamento
const { data } = await supabase.auth.signInWithPassword(...)
await supabase.from('user_auth_mapping').upsert({
    auth_id: data.user.id,
    user_id: legacy_id
})
```

⚠️ **Não recomendado** - Adiciona complexidade desnecessária

---

## 🚨 AÇÕES IMEDIATAS NECESSÁRIAS

1. ✅ Decidir entre Opção 1 (correção completa) ou Opção 2 (workaround)
2. ⚠️ Executar migração do banco de dados
3. ⚠️ Regenerar tipos TypeScript
4. ⚠️ Configurar storage de cookies adequadamente
5. ⚠️ Testar fluxo completo de login/logout

---

## 📝 NOTAS ADICIONAIS

- O script `SYNC_AUTH_USERS.sql` mostra que o desenvolvedor anterior identificou o problema
- A solução correta está parcialmente documentada mas não foi implementada
- Múltiplos scripts SQL sugerem várias tentativas de correção
- Sistema está em estado inconsistente entre código e banco de dados

---

**Próximos Passos:**
1. Confirmar com usuário qual abordagem seguir
2. Executar migração escolhida
3. Testar autenticação completa
4. Documentar solução final
