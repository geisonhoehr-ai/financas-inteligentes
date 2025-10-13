# Auditoria de Formulários e Hooks

## Status da Auditoria: EM ANDAMENTO

### ✅ Formulários Verificados e OK

#### 1. Salários ✅
- **Hook:** `hooks/use-salarios.tsx`
- **Método:** INSERT/UPDATE direto no Supabase
- **RLS:** ✅ Corrigida via `FIX_RLS_COMPLETE.sql`
- **Status:** Funcionando após correção da coluna `user_id` → `usuario_id`

#### 2. Gastos ✅
- **Hook:** `hooks/use-gastos.tsx`
- **Método:** Usa RPC `buscar_gastos_com_stats` (apenas SELECT)
- **INSERT/UPDATE:** Direto no Supabase
- **RLS:** ✅ Corrigida via `FIX_RLS_COMPLETE.sql`
- **Status:** Funcionando

#### 3. Assinaturas ✅
- **Hook:** `hooks/use-assinaturas.tsx`
- **Método:** INSERT/UPDATE direto no Supabase
- **RLS:** ✅ Corrigida via `FIX_RLS_COMPLETE.sql`
- **Status:** Funcionando

---

### ⚠️ Formulários que Precisam de Atenção

#### 4. Contas Fixas ⚠️
- **Hook:** `hooks/use-contas-fixas.tsx`
- **Método:** Usa RPC functions exclusivamente
  - `criar_conta_fixa()`
  - `atualizar_conta_fixa()`
  - `deletar_conta_fixa()`
  - `refresh_dashboard_views()`
- **Problema:** Funções RPC estavam duplicadas
- **Solução:** Script `FIX_RPC_FUNCTIONS.sql` criado
- **Status:** ⚠️ REQUER execução do script no Supabase

---

### 🔍 Formulários a Verificar

#### 5. Parcelas 🔍
- **Hook:** `hooks/use-parcelas.tsx`
- **Usa RPC:** Sim
- **Status:** PRECISA VERIFICAR

#### 6. Cartões 🔍
- **Hook:** `hooks/use-cartoes.tsx`
- **Usa RPC:** Sim
- **Status:** PRECISA VERIFICAR

#### 7. Gasolina 🔍
- **Hook:** `hooks/use-gasolina.tsx`
- **Usa RPC:** Sim
- **Status:** PRECISA VERIFICAR

#### 8. Investimentos 🔍
- **Hook:** `hooks/use-investimentos.tsx`
- **Método:** A VERIFICAR
- **RLS:** ✅ Corrigida via `FIX_RLS_COMPLETE.sql`
- **Status:** PRECISA VERIFICAR

#### 9. Metas 🔍
- **Hook:** `hooks/use-metas.tsx`
- **Método:** A VERIFICAR
- **RLS:** ✅ Corrigida via `FIX_RLS_COMPLETE.sql`
- **Status:** PRECISA VERIFICAR

#### 10. Categorias 🔍
- **Hook:** `hooks/use-categorias.tsx`
- **Método:** A VERIFICAR
- **RLS:** ✅ Corrigida via `FIX_RLS_COMPLETE.sql`
- **Status:** PRECISA VERIFICAR

#### 11. Ferramentas 🔍
- **Hook:** `hooks/use-ferramentas.tsx`
- **Método:** A VERIFICAR
- **RLS:** ✅ Corrigida via `FIX_RLS_COMPLETE.sql`
- **Status:** PRECISA VERIFICAR

#### 12. Mesada 🔍
- **Hook:** `hooks/use-mesada.tsx`
- **Usa RPC:** Sim
- **Status:** PRECISA VERIFICAR

#### 13. Dívidas 🔍
- **Hook:** `hooks/use-dividas.tsx`
- **Usa RPC:** Sim
- **Status:** PRECISA VERIFICAR

---

## 📝 Ações Necessárias

### URGENTE:
1. ✅ Executar `supabase/FIX_RLS_COMPLETE.sql` - JÁ EXECUTADO
2. ⚠️ Executar `supabase/FIX_RPC_FUNCTIONS.sql` - AGUARDANDO EXECUÇÃO
3. 🔍 Verificar hooks que usam RPC para garantir que funções existem

### RECOMENDADO:
- Padronizar todos os hooks para usar INSERT/UPDATE direto (sem RPC)
- RPC functions são mais complexas de manter e podem causar problemas
- INSERT/UPDATE direto é mais simples e depende apenas de RLS

---

## 🎯 Próximos Passos

1. Executar `FIX_RPC_FUNCTIONS.sql` no Supabase
2. Testar formulário de Contas Fixas
3. Auditar demais hooks que usam RPC
4. Criar scripts de correção se necessário
5. Testar TODOS os formulários após correções

---

## 💡 Lições Aprendidas

1. **Preferir INSERT/UPDATE direto:** Menos complexidade, mais fácil manutenção
2. **RLS bem configurado:** Permite uso direto sem RPC
3. **Padronização:** Usar sempre `usuario_id`, nunca `user_id`
4. **Testar após migrations:** Sempre testar formulários após mudanças no banco
