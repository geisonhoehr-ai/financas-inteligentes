# 🔍 Verificação de Migrations - Sistema Completo

## Data: 10/10/2025

---

## 📋 STATUS DAS MIGRATIONS

### ✅ Migrations Disponíveis no Sistema:

```bash
migrations/
├── add_pago_field.sql                      ✅ Existe
├── create_tags_system.sql                  ✅ Existe
├── create_orcamento_familiar.sql           ✅ Existe
├── create_sistema_mesada.sql               ✅ Existe
├── create_funcionalidades_avancadas.sql    ✅ Existe
└── melhorias_performance.sql               ✅ Existe (Criado hoje)
```

---

## 🗄️ TABELAS QUE CADA MIGRATION CRIA

### 1. `create_tags_system.sql` ✅

**Tabelas:**
- `tags` - Tags personalizadas
- `gastos_tags` - Relação gastos ↔ tags
- `parcelas_tags` - Relação parcelas ↔ tags
- `contas_fixas_tags` - Relação contas fixas ↔ tags
- `assinaturas_tags` - Relação assinaturas ↔ tags

**Views:**
- `vw_tags_com_stats` - Tags com estatísticas

**Functions:**
- `buscar_gastos_por_tag()` - Buscar gastos por tag
- `estatisticas_por_tag()` - Estatísticas por tag
- `update_tags_updated_at()` - Trigger function

**Índices:** 8 índices
**Policies:** 8 RLS policies

---

### 2. `create_orcamento_familiar.sql` ✅

**Tabelas:**
- `orcamentos` - Orçamentos mensais
- `orcamento_categorias` - Orçamento por categoria
- `orcamento_tags` - Orçamento por tag

**Views:**
- `vw_orcamento_consolidado` - Orçamento consolidado

**Functions:**
- `buscar_orcamento_atual()` - Orçamento do mês
- `calcular_execucao_orcamento_categoria()` - Execução categoria
- `calcular_execucao_orcamento_tag()` - Execução tag
- `update_orcamentos_updated_at()` - Trigger function

**Índices:** 5 índices
**Policies:** 12 RLS policies

---

### 3. `create_sistema_mesada.sql` ✅

**Tabelas:**
- `perfis_filhos` - Perfis dos filhos
- `mesadas` - Configuração de mesadas
- `tarefas` - Tarefas para os filhos
- `tarefas_concluidas` - Histórico de tarefas
- `mesada_ajustes` - Bônus e penalidades
- `gastos_filhos` - Gastos dos filhos
- `conquistas` - Badges/conquistas
- `filho_conquistas` - Conquistas obtidas

**Views:**
- `vw_mesada_dashboard_pais` - Dashboard para pais

**Functions:**
- `atualizar_saldo_mesada()` - Trigger para saldo
- `descontar_gasto_filho()` - Trigger para gastos
- `calcular_nivel()` - Calcular nível por XP
- `atualizar_nivel_filho()` - Trigger para nível
- `verificar_conquistas()` - Verificar conquistas

**Índices:** 6 índices
**Policies:** 8 RLS policies
**Dados:** 7 conquistas pré-definidas

---

### 4. `create_funcionalidades_avancadas.sql` ✅

**Tabelas:**
- `desafios_familia` - Desafios de economia
- `desafio_regras` - Regras dos desafios
- `desafio_progresso` - Progresso diário
- `configuracao_divisao` - Divisão de despesas
- `acerto_contas` - Acertos entre membros
- `lista_desejos` - Lista de desejos familiar
- `lista_desejos_votacao` - Votação de desejos
- `lista_desejos_contribuicoes` - Contribuições
- `score_financeiro` - Score de saúde financeira
- `score_historico` - Histórico do score

**Views:**
- `vw_desafios_ativos` - Desafios ativos com progresso
- `vw_desejos_com_votos` - Desejos com votação

**Functions:**
- `calcular_percentual_contribuicao()` - Trigger
- `atualizar_valor_desejo()` - Trigger
- `calcular_score_financeiro()` - Calcular score

**Índices:** 5 índices
**Policies:** 3 RLS policies

---

### 5. `add_pago_field.sql` ✅

**Campos Adicionados:**
- `gastos.pago` - BOOLEAN
- `gastos.data_pagamento` - TIMESTAMP
- `contas_fixas.pago` - BOOLEAN
- `contas_fixas.data_pagamento` - TIMESTAMP
- `parcelas.pago` - BOOLEAN
- `parcelas.data_pagamento` - TIMESTAMP
- `salarios.pago` - BOOLEAN
- `salarios.data_pagamento` - TIMESTAMP

**Índices:** 4 índices

---

### 6. `melhorias_performance.sql` ✅ (Criado Hoje)

**Melhorias:**
- Índice composto em gastos (mês/ano/família)
- Trigger de nível no INSERT
- Validação de datas em desafios
- View otimizada de orçamento
- Soft delete em tags
- 8 índices adicionais
- Functions de soft delete/restore

---

## 📊 RESUMO TOTAL

### Tabelas Criadas: 28 tabelas
1. tags
2. gastos_tags
3. parcelas_tags
4. contas_fixas_tags
5. assinaturas_tags
6. orcamentos
7. orcamento_categorias
8. orcamento_tags
9. perfis_filhos
10. mesadas
11. tarefas
12. tarefas_concluidas
13. mesada_ajustes
14. gastos_filhos
15. conquistas
16. filho_conquistas
17. desafios_familia
18. desafio_regras
19. desafio_progresso
20. configuracao_divisao
21. acerto_contas
22. lista_desejos
23. lista_desejos_votacao
24. lista_desejos_contribuicoes
25. score_financeiro
26. score_historico

**Campos Adicionados em Tabelas Existentes:** 8 campos (pago/data_pagamento)
**Campos de Soft Delete:** 3 campos em tags

### Views Criadas: 4 views
1. vw_tags_com_stats
2. vw_orcamento_consolidado
3. vw_mesada_dashboard_pais
4. vw_desafios_ativos
5. vw_desejos_com_votos

### Functions Criadas: 15 functions
1. update_tags_updated_at()
2. buscar_gastos_por_tag()
3. estatisticas_por_tag()
4. update_orcamentos_updated_at()
5. buscar_orcamento_atual()
6. calcular_execucao_orcamento_categoria()
7. calcular_execucao_orcamento_tag()
8. atualizar_saldo_mesada()
9. descontar_gasto_filho()
10. calcular_nivel()
11. atualizar_nivel_filho()
12. verificar_conquistas()
13. calcular_percentual_contribuicao()
14. atualizar_valor_desejo()
15. calcular_score_financeiro()
16. soft_delete_tag()
17. restaurar_tag()

### Triggers Criados: 8 triggers
1. trigger_update_tags_updated_at
2. trigger_update_orcamentos_updated_at
3. trigger_atualizar_saldo_mesada
4. trigger_descontar_gasto_filho
5. trigger_atualizar_nivel (UPDATE)
6. trigger_atualizar_nivel_insert (INSERT - novo)
7. trigger_calcular_percentual
8. trigger_atualizar_valor_desejo

### Índices Criados: ~35 índices

### RLS Policies Criadas: ~35 policies

---

## ✅ CHECKLIST DE VERIFICAÇÃO NO SUPABASE

### ANTES DE APLICAR:

```sql
-- Verificar se migrations já foram aplicadas:

-- 1. Verificar se tabelas existem:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'tags',
    'orcamentos',
    'mesadas',
    'desafios_familia'
  );

-- 2. Verificar se campos 'pago' existem:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'gastos'
  AND column_name = 'pago';

-- 3. Verificar se views existem:
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name LIKE 'vw_%';

-- 4. Verificar se functions existem:
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION';
```

---

## 🚀 ORDEM DE EXECUÇÃO DAS MIGRATIONS

### ⚠️ IMPORTANTE: Executar nesta ordem exata!

```sql
-- ORDEM CORRETA:
1. add_pago_field.sql                      ← PRIMEIRO (altera tabelas existentes)
2. create_tags_system.sql                  ← Depois (cria tags)
3. create_orcamento_familiar.sql           ← Depois (usa tags)
4. create_sistema_mesada.sql               ← Depois (independente)
5. create_funcionalidades_avancadas.sql    ← Depois (usa outras tabelas)
6. melhorias_performance.sql               ← POR ÚLTIMO (otimizações)
```

### Por que esta ordem?

1. **add_pago_field.sql primeiro:**
   - Altera tabelas existentes (gastos, contas_fixas, etc)
   - Precisa ser feito antes de outras migrations usarem

2. **create_tags_system.sql depois:**
   - Cria sistema de tags
   - Outras tabelas podem referenciar tags

3. **create_orcamento_familiar.sql:**
   - Usa tags (foreign key)
   - Depende de tags existir

4. **create_sistema_mesada.sql:**
   - Independente, pode ser depois

5. **create_funcionalidades_avancadas.sql:**
   - Pode usar tabelas anteriores
   - Deve ser quase por último

6. **melhorias_performance.sql POR ÚLTIMO:**
   - Otimiza tabelas existentes
   - Altera views criadas antes
   - Adiciona índices em tabelas criadas

---

## 📝 SCRIPT COMPLETO DE VERIFICAÇÃO

```sql
-- ============================================
-- SCRIPT DE VERIFICAÇÃO COMPLETA
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Verificar todas as tabelas criadas
SELECT
  'Tabelas' as tipo,
  COUNT(*) as total,
  STRING_AGG(table_name, ', ' ORDER BY table_name) as lista
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'tags', 'gastos_tags', 'parcelas_tags', 'contas_fixas_tags', 'assinaturas_tags',
    'orcamentos', 'orcamento_categorias', 'orcamento_tags',
    'perfis_filhos', 'mesadas', 'tarefas', 'tarefas_concluidas',
    'mesada_ajustes', 'gastos_filhos', 'conquistas', 'filho_conquistas',
    'desafios_familia', 'desafio_regras', 'desafio_progresso',
    'configuracao_divisao', 'acerto_contas',
    'lista_desejos', 'lista_desejos_votacao', 'lista_desejos_contribuicoes',
    'score_financeiro', 'score_historico'
  );

-- 2. Verificar views criadas
SELECT
  'Views' as tipo,
  COUNT(*) as total,
  STRING_AGG(table_name, ', ' ORDER BY table_name) as lista
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name LIKE 'vw_%';

-- 3. Verificar functions criadas
SELECT
  'Functions' as tipo,
  COUNT(*) as total,
  STRING_AGG(routine_name, ', ' ORDER BY routine_name) as lista
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
  AND routine_name IN (
    'buscar_gastos_por_tag',
    'estatisticas_por_tag',
    'buscar_orcamento_atual',
    'calcular_execucao_orcamento_categoria',
    'calcular_execucao_orcamento_tag',
    'calcular_nivel',
    'atualizar_nivel_filho',
    'verificar_conquistas',
    'calcular_score_financeiro',
    'soft_delete_tag',
    'restaurar_tag'
  );

-- 4. Verificar campos 'pago' adicionados
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'pago'
  AND table_name IN ('gastos', 'contas_fixas', 'parcelas', 'salarios');

-- 5. Verificar soft delete em tags
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'tags'
  AND column_name IN ('deletado', 'deletado_em', 'deletado_por');

-- 6. Verificar índices importantes
SELECT
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 7. Verificar RLS policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Tabelas: 26 encontradas
-- Views: 4-5 encontradas
-- Functions: 15+ encontradas
-- Campos pago: 4 encontrados
-- Soft delete: 3 campos em tags
-- Índices: 35+ encontrados
-- Policies: 35+ encontradas
```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: "relation already exists"
**Causa:** Migration já foi aplicada
**Solução:** Pular essa migration ou usar `IF NOT EXISTS`

### Problema 2: "column already exists"
**Causa:** Campo já foi adicionado
**Solução:** Migration `add_pago_field.sql` usa `IF NOT EXISTS`

### Problema 3: "foreign key violation"
**Causa:** Ordem errada das migrations
**Solução:** Seguir ordem exata descrita acima

### Problema 4: "function does not exist"
**Causa:** Migration de functions não foi aplicada
**Solução:** Aplicar migration correspondente

### Problema 5: "permission denied"
**Causa:** RLS ativo mas policies não criadas
**Solução:** Verificar se todas policies foram criadas

---

## 🎯 CHECKLIST FINAL

### Antes de Aplicar Migrations:
- [ ] Fazer backup do banco de dados
- [ ] Verificar se alguma migration já foi aplicada
- [ ] Ler todas as migrations
- [ ] Confirmar ordem de execução

### Durante Aplicação:
- [ ] Aplicar na ordem correta
- [ ] Verificar sucesso de cada uma
- [ ] Ler mensagens de erro
- [ ] Anotar problemas

### Depois de Aplicar:
- [ ] Executar script de verificação
- [ ] Confirmar 26 tabelas criadas
- [ ] Confirmar 4-5 views criadas
- [ ] Confirmar 15+ functions criadas
- [ ] Testar hooks no frontend
- [ ] Verificar se dados salvam corretamente

---

## 📊 STATUS FINAL

### Migrations Disponíveis: ✅ 6 arquivos
- add_pago_field.sql
- create_tags_system.sql
- create_orcamento_familiar.sql
- create_sistema_mesada.sql
- create_funcionalidades_avancadas.sql
- melhorias_performance.sql

### Total de Objetos a Criar:
- **26 Tabelas**
- **8 Campos em tabelas existentes**
- **4-5 Views**
- **15+ Functions**
- **8 Triggers**
- **35+ Índices**
- **35+ RLS Policies**

### Tempo Estimado: 5-10 minutos
### Risco: Baixo (todas migrations usam IF NOT EXISTS)

---

## ✅ PRÓXIMA AÇÃO

**Execute o script de verificação no Supabase para ver o que já existe:**

```sql
-- Cole no Supabase SQL Editor:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('tags', 'orcamentos', 'mesadas', 'desafios_familia');
```

**Se retornar 0 linhas:** Nenhuma migration foi aplicada ainda
**Se retornar 4 linhas:** Todas as migrations principais já foram aplicadas

---

*Documento gerado em 10/10/2025*
*Sistema v3.0.1 - Verificação Completa de Migrations*
