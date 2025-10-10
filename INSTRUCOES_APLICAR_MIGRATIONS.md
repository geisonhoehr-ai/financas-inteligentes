# 🚀 Instruções para Aplicar Migrations - Passo a Passo

## Sistema Financeiro Familiar v3.0

---

## ⚠️ IMPORTANTE: LEIA ANTES DE COMEÇAR

**Antes de aplicar qualquer migration, você PRECISA verificar o que já está aplicado!**

Aplicar migrations duplicadas pode causar erros ou corromper dados.

---

## 📋 PASSO 1: VERIFICAR O QUE JÁ EXISTE (OBRIGATÓRIO!)

### 1.1 - Abrir Supabase Dashboard
```
1. Acesse: https://supabase.com
2. Faça login na sua conta
3. Selecione seu projeto
4. Vá em: SQL Editor (no menu lateral)
```

### 1.2 - Executar Script de Verificação
```sql
-- Cole este comando no SQL Editor e clique em RUN:

SELECT
  'tags' as tabela,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'tags'
  ) THEN '✅ JÁ EXISTE' ELSE '❌ NÃO EXISTE' END as status
UNION ALL
SELECT 'orcamentos', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orcamentos') THEN '✅ JÁ EXISTE' ELSE '❌ NÃO EXISTE' END
UNION ALL
SELECT 'mesadas', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mesadas') THEN '✅ JÁ EXISTE' ELSE '❌ NÃO EXISTE' END
UNION ALL
SELECT 'desafios_familia', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'desafios_familia') THEN '✅ JÁ EXISTE' ELSE '❌ NÃO EXISTE' END;
```

### 1.3 - Interpretar Resultado

**CENÁRIO A: Todas com ❌ NÃO EXISTE**
```
✅ Nenhuma migration foi aplicada
✅ Você precisa aplicar TODAS as 6 migrations
✅ Siga para PASSO 2
```

**CENÁRIO B: Algumas com ✅ JÁ EXISTE**
```
⚠️ Migrations foram PARCIALMENTE aplicadas
⚠️ Use o script completo de verificação (Passo 1.4)
⚠️ Aplique APENAS as migrations faltantes
```

**CENÁRIO C: Todas com ✅ JÁ EXISTE**
```
🎉 Todas migrations já foram aplicadas!
✅ Seu banco está completo
✅ Pule para PASSO 4 (melhorias_performance.sql)
```

### 1.4 - Script Completo de Verificação (Opcional)

Se você quer ver TUDO que existe no banco:

```sql
-- Copie e cole o arquivo:
-- migrations/verificar_migrations_aplicadas.sql

-- Esse script mostra:
-- - Todas as 26 tabelas
-- - Todas as 5 views
-- - Todas as 17 functions
-- - Status de cada migration
-- - O que falta aplicar
```

---

## 📦 PASSO 2: FAZER BACKUP (RECOMENDADO!)

### 2.1 - Backup via Dashboard Supabase

```
1. Supabase Dashboard → Settings
2. Database → Backups
3. Clicar em "Create Backup"
4. Aguardar conclusão
```

### 2.2 - Ou Backup via pgAdmin (Se tiver)

```bash
pg_dump -h seu-host -U postgres -d postgres > backup_antes_migrations.sql
```

---

## 🔧 PASSO 3: APLICAR MIGRATIONS NA ORDEM CORRETA

### ⚠️ ORDEM OBRIGATÓRIA (NÃO PULE NENHUMA!)

```
1. add_pago_field.sql                      ← PRIMEIRO
2. create_tags_system.sql                  ← Segundo
3. create_orcamento_familiar.sql           ← Terceiro
4. create_sistema_mesada.sql               ← Quarto
5. create_funcionalidades_avancadas.sql    ← Quinto
6. melhorias_performance.sql               ← ÚLTIMO
```

---

### MIGRATION 1: add_pago_field.sql

**O que faz:**
- Adiciona campo `pago` em gastos, contas_fixas, parcelas, salarios
- Adiciona campo `data_pagamento` nessas tabelas

**Como aplicar:**

```sql
-- 1. Abrir arquivo: migrations/add_pago_field.sql
-- 2. Copiar TODO o conteúdo
-- 3. Colar no Supabase SQL Editor
-- 4. Clicar em RUN

-- 5. Verificar sucesso:
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'gastos' AND column_name = 'pago';

-- Deve retornar: "pago"
```

**Tempo:** ~10 segundos

**Resultado Esperado:**
```
✅ Query executed successfully
✅ 8 campos adicionados
✅ 4 índices criados
```

---

### MIGRATION 2: create_tags_system.sql

**O que faz:**
- Cria sistema completo de tags personalizadas
- 5 tabelas (tags, gastos_tags, parcelas_tags, etc)
- 1 view (vw_tags_com_stats)
- 3 functions (buscar_gastos_por_tag, etc)

**Como aplicar:**

```sql
-- 1. Abrir: migrations/create_tags_system.sql
-- 2. Copiar TODO o conteúdo
-- 3. Colar no Supabase SQL Editor
-- 4. Clicar em RUN

-- 5. Verificar:
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('tags', 'gastos_tags');

-- Deve retornar 2 linhas
```

**Tempo:** ~30 segundos

**Resultado Esperado:**
```
✅ 5 tabelas criadas
✅ 1 view criada
✅ 3 functions criadas
✅ 8 índices criados
✅ 8 policies criadas
```

---

### MIGRATION 3: create_orcamento_familiar.sql

**O que faz:**
- Cria sistema de orçamento familiar
- 3 tabelas (orcamentos, orcamento_categorias, orcamento_tags)
- 1 view (vw_orcamento_consolidado)
- 4 functions

**Como aplicar:**

```sql
-- 1. Abrir: migrations/create_orcamento_familiar.sql
-- 2. Copiar TODO
-- 3. Colar no SQL Editor
-- 4. RUN

-- 5. Verificar:
SELECT table_name
FROM information_schema.tables
WHERE table_name LIKE 'orcamento%';

-- Deve retornar 3 linhas
```

**Tempo:** ~30 segundos

**Resultado Esperado:**
```
✅ 3 tabelas criadas
✅ 1 view criada
✅ 4 functions criadas
✅ 5 índices criados
✅ 12 policies criadas
```

---

### MIGRATION 4: create_sistema_mesada.sql

**O que faz:**
- Sistema completo de mesada digital
- 8 tabelas (perfis_filhos, mesadas, tarefas, conquistas, etc)
- 1 view (vw_mesada_dashboard_pais)
- 5 functions

**Como aplicar:**

```sql
-- 1. Abrir: migrations/create_sistema_mesada.sql
-- 2. Copiar TODO
-- 3. Colar no SQL Editor
-- 4. RUN

-- 5. Verificar:
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('mesadas', 'perfis_filhos', 'conquistas');

-- Deve retornar 3 linhas
```

**Tempo:** ~40 segundos

**Resultado Esperado:**
```
✅ 8 tabelas criadas
✅ 1 view criada
✅ 5 functions criadas
✅ 6 índices criados
✅ 8 policies criadas
✅ 7 conquistas inseridas
```

**Verificar conquistas:**
```sql
SELECT COUNT(*) FROM conquistas;
-- Deve retornar: 7
```

---

### MIGRATION 5: create_funcionalidades_avancadas.sql

**O que faz:**
- Modo economia, divisão, lista desejos, score
- 10 tabelas
- 2 views
- 3 functions

**Como aplicar:**

```sql
-- 1. Abrir: migrations/create_funcionalidades_avancadas.sql
-- 2. Copiar TODO
-- 3. Colar no SQL Editor
-- 4. RUN

-- 5. Verificar:
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('desafios_familia', 'lista_desejos', 'score_financeiro');

-- Deve retornar 3 linhas
```

**Tempo:** ~40 segundos

**Resultado Esperado:**
```
✅ 10 tabelas criadas
✅ 2 views criadas
✅ 3 functions criadas
✅ 5 índices criados
✅ 3 policies criadas
```

---

### MIGRATION 6: melhorias_performance.sql

**O que faz:**
- Otimizações de performance
- Índices compostos
- Soft delete em tags
- View otimizada

**Como aplicar:**

```sql
-- 1. Abrir: migrations/melhorias_performance.sql
-- 2. Copiar TODO
-- 3. Colar no SQL Editor
-- 4. RUN

-- 5. Verificar:
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'tags' AND column_name = 'deletado';

-- Deve retornar: "deletado"
```

**Tempo:** ~30 segundos

**Resultado Esperado:**
```
✅ 3 campos soft delete adicionados
✅ 1 view otimizada
✅ 8 índices novos criados
✅ 2 functions de soft delete
✅ 1 constraint adicionado
✅ ANALYZE executado
```

---

## ✅ PASSO 4: VERIFICAR SE TUDO DEU CERTO

### 4.1 - Verificação Rápida

```sql
-- Cole e execute:
SELECT
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('tags', 'orcamentos', 'mesadas', 'desafios_familia')) as tabelas_principais,
  (SELECT COUNT(*) FROM information_schema.views WHERE table_name LIKE 'vw_%') as views,
  (SELECT COUNT(*) FROM conquistas) as conquistas;

-- Resultado esperado:
-- tabelas_principais: 4
-- views: 4 ou 5
-- conquistas: 7
```

### 4.2 - Verificação Completa (Opcional)

```sql
-- Execute o arquivo completo:
-- migrations/verificar_migrations_aplicadas.sql

-- Vai mostrar tudo que foi criado
```

---

## 🎯 PASSO 5: TESTAR O SISTEMA

### 5.1 - Testar no Frontend

```bash
# No terminal:
npm run dev

# Abrir: http://localhost:3000
```

### 5.2 - Checklist de Testes

- [ ] Dashboard carrega sem erros
- [ ] Consegue criar uma tag
- [ ] Consegue criar um gasto com tag
- [ ] Consegue criar orçamento
- [ ] Consegue criar perfil de filho (mesada)
- [ ] Calendário mostra eventos
- [ ] Nenhum erro no console

---

## 🐛 ERROS COMUNS E SOLUÇÕES

### Erro 1: "relation already exists"

**Causa:** Tabela já foi criada antes

**Solução:**
```
✅ Isso é normal! A migration usa IF NOT EXISTS
✅ Continue normalmente
✅ Verifique a próxima migration
```

### Erro 2: "column already exists"

**Causa:** Campo já foi adicionado

**Solução:**
```
✅ Isso é normal! A migration usa IF NOT EXISTS
✅ Continue normalmente
```

### Erro 3: "foreign key constraint"

**Causa:** Tentou criar tabela antes da tabela referenciada

**Solução:**
```
❌ Você pulou uma migration ou aplicou fora de ordem!
✅ Volte e aplique na ordem correta:
   1. add_pago_field.sql
   2. create_tags_system.sql
   3. create_orcamento_familiar.sql
   ... (ordem exata acima)
```

### Erro 4: "function does not exist"

**Causa:** Migration anterior não foi aplicada

**Solução:**
```
✅ Execute o script de verificação
✅ Aplique migrations faltantes
```

### Erro 5: "permission denied"

**Causa:** Usuário sem permissões

**Solução:**
```
✅ Certifique-se de estar logado como admin no Supabase
✅ Verifique as policies RLS
```

---

## 📊 RESULTADO FINAL ESPERADO

Após aplicar TODAS as 6 migrations:

### Tabelas: 26+ tabelas criadas
```
✅ Sistema de Tags (5 tabelas)
✅ Sistema de Orçamento (3 tabelas)
✅ Sistema de Mesada (8 tabelas)
✅ Funcionalidades Avançadas (10 tabelas)
✅ Campos adicionados em tabelas existentes (8 campos)
```

### Views: 4-5 views
```
✅ vw_tags_com_stats
✅ vw_orcamento_consolidado
✅ vw_mesada_dashboard_pais
✅ vw_desafios_ativos
✅ vw_desejos_com_votos
```

### Functions: 17+ functions
```
✅ Functions de tags (3)
✅ Functions de orçamento (4)
✅ Functions de mesada (5)
✅ Functions de funcionalidades (3)
✅ Functions de soft delete (2)
```

### Índices: 35+ índices
### Policies: 35+ RLS policies
### Triggers: 8 triggers
### Dados: 7 conquistas inseridas

---

## 🚀 PRÓXIMO PASSO: DEPLOY

Depois de aplicar todas migrations e verificar:

```bash
# 1. Build
npm run build

# 2. Commit
git add .
git commit -m "feat: todas migrations aplicadas - sistema v3.0.1"

# 3. Push
git push origin master

# 4. Vercel fará deploy automaticamente
```

---

## 📞 PRECISA DE AJUDA?

### Se algo deu errado:

1. **Pare!** Não continue aplicando migrations
2. **Leia a mensagem de erro** com atenção
3. **Verifique** qual migration causou o erro
4. **Consulte** a seção "Erros Comuns" acima
5. **Execute** o script de verificação para ver o estado atual
6. **Se necessário**, faça restore do backup

### Documentação Completa:

- `VERIFICACAO_MIGRATIONS.md` - Explicação de cada migration
- `migrations/verificar_migrations_aplicadas.sql` - Script de verificação
- `ANALISE_COMPLETA_BUGS_MELHORIAS.md` - Análise técnica completa

---

## ✅ CHECKLIST FINAL

Antes de fazer deploy:

- [ ] Executei script de verificação inicial
- [ ] Fiz backup do banco de dados
- [ ] Apliquei migrations NA ORDEM CORRETA
- [ ] Todas as 6 migrations foram aplicadas
- [ ] Executei script de verificação final
- [ ] Testei sistema localmente (npm run dev)
- [ ] Não há erros no console
- [ ] Sistema funciona perfeitamente
- [ ] Pronto para deploy! 🚀

---

## 🎉 PARABÉNS!

Se você chegou até aqui e tudo funcionou:

**SEU SISTEMA ESTÁ COMPLETO E PRONTO PARA PRODUÇÃO!** 🏆

Você tem agora:
- ✅ Sistema de Tags personalizadas
- ✅ Orçamento familiar inteligente
- ✅ Mesada digital gamificada
- ✅ Modo economia e desafios
- ✅ Lista de desejos familiar
- ✅ Score de saúde financeira
- ✅ Performance otimizada
- ✅ Tudo documentado

**É o melhor sistema de controle financeiro familiar do Brasil!** 🇧🇷

---

*Documento criado em 10/10/2025*
*Sistema Financeiro Familiar v3.0.1*
