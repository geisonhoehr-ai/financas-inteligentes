# 📋 PADRONIZAÇÃO DE COLUNAS - ANÁLISE COMPLETA

## 🔍 DESCOBERTAS DA AUDITORIA

Baseado na auditoria completa das políticas RLS, identifiquei **DOIS PADRÕES DIFERENTES** sendo usados no banco de dados:

### ✅ PADRÃO 1: `usuario_id` (UUID da tabela auth.users)
**Usado por TODAS as tabelas existentes:**
- ✅ `alertas_inteligentes`
- ✅ `assinaturas`
- ✅ `cartao_transacoes`
- ✅ `cartoes`
- ✅ `categorias`
- ✅ `compras_parceladas`
- ✅ `contas_fixas`
- ✅ `ferramentas`
- ✅ `gasolina`
- ✅ `gastos`
- ✅ `investimentos`
- ✅ `metas`
- ✅ `orcamentos`
- ✅ `patrimonio`
- ✅ `salaries`
- ✅ `tags`

**Exemplo de política:**
```sql
USING (auth.uid() = usuario_id)
```

### ⚠️ PADRÃO 2: `user_id` (UUID da tabela auth.users)
**Usado APENAS pela tabela:**
- ⚠️ `salarios` (tabela nova criada pela migration 003)

**Exemplo de política:**
```sql
USING (auth.uid() = user_id)
```

### 🎯 PADRÃO 3: `responsavel_id` (para relações pai-filho)
**Usado por:**
- ✅ `perfis_filhos` - Relaciona filho com responsável
- ✅ `gastos_filhos` - Usa `perfis_filhos.responsavel_id`

---

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. **Inconsistência na tabela `salarios`**
A tabela `salarios` foi criada com `user_id`, mas TODAS as outras tabelas usam `usuario_id`.

**Políticas afetadas:**
```sql
-- TABELA: salarios (INCORRETO - usa user_id)
"Usuários atualizam próprios salários" USING (auth.uid() = user_id)
"Usuários criam próprios salários" WITH CHECK (auth.uid() = user_id)
"Usuários deletam próprios salários" USING (auth.uid() = user_id)
"Usuários veem próprios salários" USING (auth.uid() = user_id)

-- TABELA: salaries (CORRETO - usa usuario_id)
"Usuários podem atualizar seus próprios salários" USING (usuario_id = auth.uid())
"Usuários podem inserir seus próprios salários" WITH CHECK (usuario_id = auth.uid())
"Usuários podem ver seus próprios salários" USING (usuario_id = auth.uid())
```

### 2. **Duplicação de tabelas**
Existem DUAS tabelas de salários:
- `salaries` (antiga - usa `usuario_id`) ✅
- `salarios` (nova - usa `user_id`) ⚠️

---

## ✅ SOLUÇÃO PROPOSTA

### Opção A: RENOMEAR coluna na tabela `salarios`
```sql
-- Renomear user_id para usuario_id na tabela salarios
ALTER TABLE public.salarios RENAME COLUMN user_id TO usuario_id;

-- Atualizar políticas para usar usuario_id
-- (Script completo fornecido separadamente)
```

### Opção B: DELETAR tabela `salarios` duplicada
```sql
-- Se a tabela salaries já existe e funciona, remover a duplicata
DROP TABLE IF EXISTS public.salarios CASCADE;
```

---

## 📊 PADRÃO OFICIAL DEFINIDO

**A partir de agora, TODAS as tabelas devem seguir:**

### 🎯 Coluna de Usuário Principal
```sql
usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
```

### 🎯 Coluna de Família (quando aplicável)
```sql
familia_id UUID REFERENCES public.familias(id) ON DELETE CASCADE
```

### 🎯 Coluna de Responsável (para sistemas pai-filho)
```sql
responsavel_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
```

### 🎯 Políticas RLS Padrão
```sql
-- SELECT
CREATE POLICY "Usuários veem próprios dados"
  ON public.nome_tabela FOR SELECT
  USING (auth.uid() = usuario_id);

-- INSERT
CREATE POLICY "Usuários criam próprios dados"
  ON public.nome_tabela FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- UPDATE
CREATE POLICY "Usuários atualizam próprios dados"
  ON public.nome_tabela FOR UPDATE
  USING (auth.uid() = usuario_id);

-- DELETE
CREATE POLICY "Usuários deletam próprios dados"
  ON public.nome_tabela FOR DELETE
  USING (auth.uid() = usuario_id);
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Decidir:** Renomear coluna OU deletar tabela duplicada
2. ⏭️ **Executar:** Script de correção SQL
3. ⏭️ **Validar:** Todas as políticas RLS funcionando
4. ⏭️ **Atualizar:** Tipos TypeScript se necessário
5. ⏭️ **Documentar:** Este padrão para futuras tabelas

---

## 📝 TABELAS QUE SEGUEM O PADRÃO CORRETO

### ✅ Totalmente Corretas (usando `usuario_id`)
- alertas_inteligentes
- assinaturas
- cartao_transacoes
- cartoes
- categorias
- compras_parceladas
- contas_fixas
- ferramentas
- gasolina
- gastos
- investimentos
- metas
- orcamentos
- patrimonio
- salaries (antiga)
- tags

### ⚠️ Precisa Correção
- **salarios** (nova) - Usa `user_id` ao invés de `usuario_id`

### ✅ Padrão Especial (correto)
- **perfis_filhos** - Usa `responsavel_id` (correto para o contexto)
- **familia_membros** - Usa `usuario_id` (correto)

---

**Data da Auditoria:** 12/10/2025
**Total de Políticas Analisadas:** 196 políticas RLS
**Total de Tabelas Analisadas:** 35+ tabelas
