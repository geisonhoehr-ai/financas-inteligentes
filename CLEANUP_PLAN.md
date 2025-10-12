# 🧹 PLANO DE LIMPEZA DO PROJETO

## 📊 Situação Atual
- **66 arquivos .md** (documentação)
- **20 arquivos .sql** (scripts)
- **Muito duplicado e obsoleto!**

---

## ✅ DOCUMENTAÇÃO PARA **MANTER**

### 📖 Essencial (5 arquivos)
1. **README.md** - Documentação principal do projeto
2. **PERFIL_PESSOAL_VS_FAMILIA.md** - Como funciona perfil vs família
3. **PADRONIZACAO_COLUNAS.md** - Padrão de colunas do banco
4. **RESOLUCAO_COMPLETA.md** - Histórico de correções importantes
5. **MIGRATIONS_APLICADAS_SUCESSO.md** - Migrations aplicadas

### 🚀 Deploy (3 arquivos)
6. **DEPLOY.md** - Instruções de deploy
7. **GUIA_STRIPE.md** - Configuração do Stripe
8. **GUIA_PWA.md** - Configuração PWA

---

## ❌ DOCUMENTAÇÃO PARA **REMOVER** (58 arquivos)

### 🗑️ Relatórios Temporários (27 arquivos)
- RELATORIO_VERIFICACAO_PAGINAS.md
- LEIA-ME_VERIFICACAO.md
- RESUMO_VERIFICACAO_EXECUTIVO.md
- RELATORIO_CORRECOES_IMPLEMENTADAS.md
- CHECKLIST_CORRECOES.md
- RELATORIO_LIMPEZA_SISTEMA.md
- RESUMO_FINAL_VERIFICACAO.md
- VERIFICACAO_COMPLETA_FINAL.md
- RESUMO_CORRECOES.md
- VALIDACAO_VISUAL_TESTES.md
- TESTE_COMPLETO_TODAS_PAGINAS.md
- RESUMO_EXECUTIVO_FINAL.md
- CORRECOES_FINAIS_09_10_2025.md
- RELATORIO_CORRECOES_10_10_2025.md
- CORRECOES_APLICADAS_10_10_2025.md
- RESUMO_CORRECOES_BUILD_10_10_2025.md
- CORRECAO_PAGINAS_FAMILIA_10_10_2025.md
- RELATORIO_VERIFICACAO_COMPLETA_PAGINAS.md
- RELATORIO_PRONTIDAO_PRODUCAO.md
- RELATORIO-FINAL.md
- test-system.md
- CHECKLIST-TESTES.md
- GUIA-TESTE-RAPIDO.md
- VERIFICACAO_MIGRATIONS.md
- CORRECAO_REGISTRO_USUARIOS.md
- CORRECOES_SISTEMA_PERFIL_CONVITE.md
- README_CORRECOES.md

### 📚 Duplicados (18 arquivos)
- LEIA_PRIMEIRO.md
- LEIA_PRIMEIRO_NOVAS_FUNCIONALIDADES.md
- LEIA_ME_PRIMEIRO.md
- GUIA_RAPIDO_NOVAS_FUNCIONALIDADES.md
- GUIA_RAPIDO_NOVAS_FUNCIONALIDADES_v3.md
- DEPLOY_INSTRUCOES_COMPLETAS.md
- INSTRUCOES_DEPLOYMENT.md
- INSTRUCOES_APLICAR_MIGRATIONS.md
- DEPLOY_PRODUCAO.md
- README_DEPLOY.md
- CHECKLIST_FINAL_DEPLOY.md
- GUIA_TESTE_STRIPE.md
- CONFIGURAR_WEBHOOK.md
- INSTALAR_STRIPE_CLI.md
- SISTEMA_COMPLETO_RESUMO.md
- RESUMO_COMPLETO_FINAL.md
- RESUMO_FINAL_IMPLEMENTACOES_COMPLETO.md
- CORRECAO_FILTRO_FAMILIAS.md

### 📝 Temporários/Obsoletos (13 arquivos)
- NOVAS_FUNCIONALIDADES_IMPLEMENTADAS.md
- NOVAS_FEATURES.md
- SISTEMA_INTELIGENTE_IMPLEMENTADO.md
- REVOLUCAO_SISTEMA_FAMILIAR_COMPLETO.md
- SISTEMA_MESADA_DIGITAL_COMPLETO.md
- DOCUMENTACAO_COMERCIAL_COMPLETA.md
- AVALIACAO_MERCADO_SISTEMA.md
- GUIA_TECNICO_COMPLETO_SISTEMA.md
- GUIA_DIVIDAS_PIX.md
- ANALISE_COMPLETA_BUGS_MELHORIAS.md
- RESPONSIVIDADE.md
- SEGURANCA_CREDENCIAIS.md
- DETECCAO_GENERO.md (implementação removida)

---

## ✅ SCRIPTS SQL PARA **MANTER** (5 arquivos)

### 📁 supabase/migrations/
1. **002_gamification.sql** - Migration de gamificação
2. **003_create_salarios_table.sql** - Migration da tabela salarios

### 📁 supabase/ (úteis)
3. **FIX_ALL_RECURSION_SAFE.sql** - Script final que funcionou
4. **MIGRATE_SALARIES_FIXED.sql** - Migration de dados executada
5. **REMOVE_OBSOLETE_TABLES.sql** - Para limpeza do banco

---

## ❌ SCRIPTS SQL PARA **REMOVER** (15 arquivos)

### 🗑️ Tentativas Antigas de Fix (11 arquivos)
- check_table_columns.sql
- audit_all_user_columns.sql
- FIX_SALARIOS_TABLE.sql (já aplicado)
- FIX_INFINITE_RECURSION.sql (obsoleto)
- FIX_ALL_RECURSION_AGGRESSIVE.sql (obsoleto)
- FIX_REMAINING_RECURSION.sql (obsoleto)
- FIX_LAST_POLICY.sql (obsoleto)
- FIX_FINAL_RECURSION.sql (não usado)
- FIX_FAMILIA_MEMBROS_COMPLETE.sql (não usado)
- FIX_ALL_RECURSION_FINAL.sql (não usado)
- FIX_ALL_RECURSION_FINAL_V2.sql (não usado)

### 🔍 Debug/Temporários (4 arquivos)
- CHECK_SALARIOS_TABLE.sql
- DEBUG_SALARIOS.sql
- MIGRATE_SALARIES_TO_SALARIOS.sql (versão antiga)
- IDENTIFY_OBSOLETE_TABLES.sql

---

## 📊 RESUMO

| Categoria | Manter | Remover |
|-----------|--------|---------|
| Documentação (.md) | 8 | 58 |
| Scripts SQL | 5 | 15 |
| **TOTAL** | **13** | **73** |

**Redução: 85% de arquivos removidos!** 🎉

---

## 🚀 PRÓXIMO PASSO

Execute o script: `scripts/cleanup-project.sh` (vou criar)
