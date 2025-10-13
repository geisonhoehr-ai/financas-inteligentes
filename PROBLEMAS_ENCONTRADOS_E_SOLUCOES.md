# Problemas Encontrados e Soluções

## Data: 2025-10-13

### 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

#### 1. Tabela `salarios` com coluna incorreta
**Problema:** A tabela `salarios` foi criada com a coluna `user_id` mas o código usa `usuario_id`
- **Arquivo:** `supabase/migrations/003_create_salarios_table.sql`
- **Hook afetado:** `hooks/use-salarios.tsx`
- **Impacto:** Formulários de salários não salvam dados no banco
- **Sintoma:** Página de salários fica em carregamento infinito

**Solução:** Script SQL `FIX_RLS_COMPLETE.sql` renomeia `user_id` → `usuario_id`

---

#### 2. Políticas RLS (Row Level Security) incorretas
**Problema:** Políticas RLS estão usando nomes de colunas errados ou incompletas
- **Tabelas afetadas:** salarios, gastos, assinaturas, investimentos, contas_fixas, metas, categorias, cartoes, gasolina, ferramentas
- **Impacto:** Usuários não conseguem inserir ou ver seus próprios dados
- **Sintoma:** Drawers/formulários não salvam, dados não aparecem mesmo após inserção

**Solução:** Script SQL `FIX_RLS_COMPLETE.sql` recria todas as políticas RLS:
- SELECT: `auth.uid() = usuario_id`
- INSERT: `WITH CHECK (auth.uid() = usuario_id)`
- UPDATE: `USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id)`
- DELETE: `USING (auth.uid() = usuario_id)`

---

#### 3. Cache do Sidebar no Mobile ✅ CORRIGIDO
**Problema:** No mobile, aparece primeiro o sidebar antigo, depois do refresh aparece o novo
- **Arquivo:** `components/sidebar.tsx`
- **Causa:** Service Worker (`public/sw.js`) estava usando estratégia Cache First para todos os arquivos
- **Impacto:** UX ruim, usuário vê versão antiga do sidebar

**Soluções aplicadas:**
1. ✅ Incrementada versão do cache no Service Worker (`v3.0.1` → `v3.0.2`)
2. ✅ Mudada estratégia de cache para **Network First** em HTML/JS/CSS
3. ✅ Adicionados headers `Cache-Control` no `next.config.js`
4. ✅ Mantido Cache First apenas para imagens e assets estáticos

**Arquivos modificados:**
- `public/sw.js` - Nova estratégia de cache
- `next.config.js` - Headers de cache otimizados

---

### 📋 CHECKLIST DE CORREÇÃO

#### Etapa 1: Corrigir Banco de Dados (URGENTE)
- [ ] Executar script `supabase/FIX_RLS_COMPLETE.sql` no Supabase SQL Editor
- [ ] Verificar que todas as policies foram criadas corretamente
- [ ] Testar inserção de dados em cada tabela via Supabase Dashboard

#### Etapa 2: Testar Formulários
Após executar o script SQL, testar cada formulário:
- [ ] **Salários** ([/salarios](app/salarios/page.tsx:14-333))
  - Adicionar novo salário
  - Editar salário existente
  - Deletar salário
- [ ] **Gastos** ([/gastos](app/gastos/page.tsx:18-443))
  - Adicionar novo gasto
  - Editar gasto existente
  - Marcar como pago
  - Deletar gasto
- [ ] **Assinaturas** (/assinaturas)
- [ ] **Investimentos** (/investimentos)
- [ ] **Contas Fixas** (/contas-fixas)
- [ ] **Metas** (/metas)
- [ ] **Cartões** (/cartoes)
- [ ] **Gasolina** (/gasolina)
- [ ] **Ferramentas** (/ferramentas)

#### Etapa 3: Corrigir Cache do Sidebar Mobile
- [ ] Verificar se existe importação antiga de sidebar
- [ ] Limpar cache do build: `npm run build`
- [ ] Testar no mobile após novo deploy
- [ ] Se persistir, adicionar cache busting no componente

---

### 🔧 ARQUIVOS PRINCIPAIS ANALISADOS

1. **Hooks com mutações:**
   - `hooks/use-salarios.tsx` - CREATE/UPDATE/DELETE salários
   - `hooks/use-gastos.tsx` - CREATE/UPDATE/DELETE gastos

2. **Páginas com formulários:**
   - `app/salarios/page.tsx` - Formulário de salários (linha 209-333)
   - `app/gastos/page.tsx` - Formulário de gastos (linha 230-443)

3. **Componentes de Layout:**
   - `components/sidebar.tsx` - Sidebar com navegação agrupada

4. **Migrações SQL:**
   - `supabase/migrations/003_create_salarios_table.sql` - **PROBLEMA AQUI**
   - `supabase/FIX_RLS_COMPLETE.sql` - **SOLUÇÃO**

---

### 🎯 PRÓXIMOS PASSOS

1. **IMEDIATO:** Executar `FIX_RLS_COMPLETE.sql` no Supabase
2. **TESTAR:** Todos os formulários de inserção de dados
3. **INVESTIGAR:** Cache do sidebar mobile
4. **DEPLOY:** Após confirmação que tudo funciona
5. **MONITORAR:** Logs de erro no console do navegador e Supabase

---

### 💡 DICAS PARA EVITAR PROBLEMAS FUTUROS

1. **Padronização de Nomes:**
   - Sempre usar `usuario_id` (não `user_id`)
   - Sempre usar `familia_id` (não `family_id`)

2. **Testar RLS:**
   - Sempre testar políticas RLS após criar tabelas
   - Usar `auth.uid()` para comparar com `usuario_id`

3. **Logs:**
   - Manter logs de erro detalhados nos hooks
   - Verificar console do navegador após cada operação

4. **Cache:**
   - Incrementar versão do Service Worker após mudanças no código
   - Usar Network First para HTML/JS/CSS em PWAs
   - Limpar cache após mudanças significativas

---

## 📝 RESUMO DAS CORREÇÕES APLICADAS

### Arquivos Criados:
- ✅ `supabase/FIX_RLS_COMPLETE.sql` - Script SQL para corrigir todas as RLS

### Arquivos Modificados:
- ✅ `public/sw.js` - Estratégia de cache melhorada (Network First)
- ✅ `next.config.js` - Headers Cache-Control otimizados
- ✅ `PROBLEMAS_ENCONTRADOS_E_SOLUCOES.md` - Documentação completa

### Próximas Ações Necessárias:
1. **URGENTE:** Executar `supabase/FIX_RLS_COMPLETE.sql` no Supabase SQL Editor
2. **DEPLOY:** Fazer novo deploy na Vercel (mudanças no sw.js e next.config.js)
3. **TESTE:** Após deploy, testar todos os formulários
4. **MOBILE:** No mobile, limpar dados/cache do navegador para forçar atualização do SW

### Como Testar se Funcionou:
1. Abrir console do navegador (F12)
2. Tentar adicionar um salário/gasto
3. Verificar se não há erros relacionados a RLS
4. Confirmar que dados aparecem na tabela após inserção
5. No mobile, verificar se sidebar novo aparece imediatamente
