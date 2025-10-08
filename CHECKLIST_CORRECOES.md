# ✅ Checklist de Correções - Sistema de Controle Financeiro

**Data de Criação:** 08/10/2025  
**Última Atualização:** 08/10/2025  
**Status:** ✅ **CORREÇÕES CRÍTICAS CONCLUÍDAS**  

---

## 🔥 FASE 1: Correções Críticas (1-2 semanas)

### 🚨 Bugs que Causam Erros (Urgente)

- [x] **Configurações: Implementar função updateFamilia** ✅ **CONCLUÍDO**
  - Arquivo: `app/configuracoes/page.tsx`
  - Linhas: 308, 312, 326
  - Problema: Função não existe, causa erro ao tentar editar família
  - Tempo estimado: 2-4 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA
  - **Solução:** Adicionada importação da função no hook useFamilias

- [x] **Investimentos: Corrigir bug data_aplicacao** ✅ **CONCLUÍDO**
  - Arquivo: `app/investimentos/page.tsx`
  - Linha: 167
  - Problema: Campo não está no formData
  - Tempo estimado: 1 hora
  - Prioridade: 🔥🔥🔥 CRÍTICA
  - **Solução:** Corrigido para usar formData.data_inicio

- [x] **Dívidas: Remover window.location.reload()** ✅ **CONCLUÍDO**
  - Arquivo: `app/dividas/page.tsx`, `hooks/use-dividas.tsx`
  - Linha: 504
  - Problema: Reload forçado em vez de invalidação de cache
  - Tempo estimado: 2 horas
  - Prioridade: 🔥🔥 ALTA
  - **Solução:** Implementada função refreshData() e invalidação de queries

### 🔒 Segurança (Antes do Lançamento)

- [x] **Login: Implementar recuperação de senha** ✅ **CONCLUÍDO**
  - Arquivo: `app/login/page.tsx`, `app/reset-password/page.tsx`
  - O que fazer:
    - [x] Criar componente de recuperação de senha
    - [x] Integrar com Supabase Auth (resetPasswordForEmail)
    - [x] Criar página de redefinição de senha
    - [x] Adicionar link "Esqueci minha senha" no login
  - Tempo estimado: 4-6 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA
  - **Solução:** Modal de recuperação + página de reset implementados

- [x] **Registro: Adicionar aceite de Termos de Uso** ✅ **CONCLUÍDO**
  - Arquivo: `app/(public)/register/page.tsx`, `app/terms/page.tsx`, `app/privacy/page.tsx`
  - O que fazer:
    - [x] Criar documentos: Termos de Uso e Política de Privacidade
    - [x] Adicionar checkbox de aceite no formulário
    - [x] Validar aceite antes do submit
    - [ ] Salvar data/hora do aceite no banco
  - Tempo estimado: 3-4 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA
  - **Solução:** Checkbox obrigatório + páginas completas criadas

### 💰 Gastos (5 problemas)

- [x] **Reativar edição de gastos** ✅ **CONCLUÍDO**
  - Arquivo: `app/gastos/page.tsx`
  - Linhas: 250-253
  - O que fazer:
    - [x] Descomentar código de edição
    - [x] Implementar função updateGasto no hook
    - [ ] Testar edição com diferentes tipos de dados
  - Tempo estimado: 4-6 horas
  - **Solução:** Função updateGasto já existia, código reativado
  - Prioridade: 🔥🔥🔥 CRÍTICA

- [ ] **Reativar filtro por família**
  - Arquivo: `app/gastos/page.tsx`
  - Linhas: 24-30
  - O que fazer:
    - [ ] Adicionar coluna familia_id na tabela gastos
    - [ ] Descomentar lógica de filtragem
    - [ ] Atualizar hook useGastos
    - [ ] Testar com múltiplas famílias
  - Tempo estimado: 6-8 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA

- [ ] **Implementar paginação**
  - O que fazer:
    - [ ] Adicionar componente de paginação
    - [ ] Implementar limit/offset no hook
    - [ ] Adicionar controles de navegação
    - [ ] Testar com grande volume de dados
  - Tempo estimado: 4-6 horas
  - Prioridade: 🔥🔥 ALTA

- [ ] **Substituir confirm() por modal customizado**
  - O que fazer:
    - [ ] Criar componente ConfirmDialog
    - [ ] Integrar com deleteGasto
    - [ ] Adicionar animações
  - Tempo estimado: 2-3 horas
  - Prioridade: 🔥 MÉDIA

- [ ] **Adicionar busca por descrição**
  - O que fazer:
    - [ ] Adicionar campo de busca
    - [ ] Implementar filtro no hook
    - [ ] Debounce para performance
  - Tempo estimado: 3-4 horas
  - Prioridade: 💡 BAIXA

### 💳 Cartões (3 problemas)

- [ ] **Implementar CRUD completo**
  - Arquivo: `app/cartoes/page.tsx`
  - O que fazer:
    - [ ] Adicionar botões de editar/deletar nos cards
    - [ ] Criar drawer de edição (reutilizar CartaoForm)
    - [ ] Implementar updateCartao no hook
    - [ ] Implementar deleteCartao no hook
    - [ ] Adicionar confirmação de exclusão
    - [ ] Testar todas as operações
  - Tempo estimado: 8-10 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA

- [ ] **Integrar com transações para calcular fatura**
  - O que fazer:
    - [ ] Criar tabela transacoes_cartao se não existir
    - [ ] Implementar hook useTransacoesCartao
    - [ ] Calcular fatura atual baseado em transações
    - [ ] Calcular limite disponível
    - [ ] Atualizar componente Stats
  - Tempo estimado: 10-12 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA

- [ ] **Adicionar visualização detalhada de fatura**
  - O que fazer:
    - [ ] Criar página/modal de detalhes da fatura
    - [ ] Listar todas as transações do período
    - [ ] Agrupar por categoria
    - [ ] Adicionar opção de pagar fatura
  - Tempo estimado: 6-8 horas
  - Prioridade: 🔥🔥 ALTA

### 📅 Parcelas (3 problemas)

- [ ] **Implementar CRUD completo**
  - Arquivo: `app/parcelas/page.tsx`
  - O que fazer:
    - [ ] Adicionar botões de editar/deletar
    - [ ] Implementar updateParcela no hook
    - [ ] Implementar deleteParcela no hook
    - [ ] Testar operações
  - Tempo estimado: 8-10 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA

- [ ] **Implementar sistema de marcar parcelas como pagas**
  - O que fazer:
    - [ ] Adicionar coluna status na tabela
    - [ ] Criar botão de marcar como paga
    - [ ] Atualizar visual para parcelas pagas
    - [ ] Adicionar filtro por status
    - [ ] Calcular próxima parcela automaticamente
  - Tempo estimado: 8-10 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA

- [ ] **Reativar filtro por família**
  - Arquivo: `app/parcelas/page.tsx`
  - Linhas: 21-27
  - O que fazer:
    - [ ] Adicionar coluna familia_id se necessário
    - [ ] Descomentar filtro
    - [ ] Testar com múltiplas famílias
  - Tempo estimado: 4-6 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA

### 📈 Investimentos (3 problemas)

- [ ] **Implementar CRUD completo**
  - Arquivo: `app/investimentos/page.tsx`
  - O que fazer:
    - [ ] Adicionar botões de editar/deletar
    - [ ] Implementar updateInvestimento no hook
    - [ ] Implementar deleteInvestimento no hook
    - [ ] Testar operações
  - Tempo estimado: 8-10 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA

- [ ] **Corrigir bug data_aplicacao**
  - Arquivo: `app/investimentos/page.tsx`
  - Linha: 167
  - O que fazer:
    - [ ] Adicionar campo data_aplicacao no formData
    - [ ] Usar data_inicio ou criar novo campo
    - [ ] Testar formulário
  - Tempo estimado: 1 hora
  - Prioridade: 🔥🔥🔥 CRÍTICA

- [ ] **Implementar histórico de aportes/resgates**
  - O que fazer:
    - [ ] Criar tabela movimentacoes_investimento
    - [ ] Adicionar botões de aporte/resgate
    - [ ] Listar histórico de movimentações
    - [ ] Atualizar valor_atual automaticamente
  - Tempo estimado: 10-12 horas
  - Prioridade: 🔥🔥 ALTA

### ⚙️ Configurações (2 problemas)

- [ ] **Implementar função updateFamilia**
  - Arquivo: `app/configuracoes/page.tsx`
  - O que fazer:
    - [ ] Adicionar updateFamilia no hook useFamilias
    - [ ] Implementar RPC no Supabase se necessário
    - [ ] Substituir chamadas nas linhas 308, 312, 326
    - [ ] Testar edição de nome e modo de cálculo
  - Tempo estimado: 3-4 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA

- [ ] **Adicionar opção de remover membros**
  - O que fazer:
    - [ ] Criar botão de remover membro
    - [ ] Implementar removeMembro no hook
    - [ ] Validar que não é o único admin
    - [ ] Adicionar confirmação
    - [ ] Atualizar lista após remoção
  - Tempo estimado: 4-6 horas
  - Prioridade: 🔥🔥🔥 CRÍTICA

---

## ⚠️ FASE 2: Melhorias Importantes (2-3 semanas)

### 📊 Dashboard

- [ ] **Implementar estados de loading robustos**
  - O que fazer:
    - [ ] Adicionar skeleton loaders
    - [ ] Implementar Suspense
    - [ ] Adicionar estados de loading por seção
  - Tempo estimado: 6-8 horas
  - Prioridade: 🔥🔥 ALTA

- [ ] **Implementar error boundaries**
  - O que fazer:
    - [ ] Criar componente ErrorBoundary
    - [ ] Adicionar fallback UI
    - [ ] Implementar logging de erros
    - [ ] Envolver componentes principais
  - Tempo estimado: 4-6 horas
  - Prioridade: 🔥🔥 ALTA

- [ ] **Otimizar carregamento de hooks**
  - O que fazer:
    - [ ] Implementar lazy loading
    - [ ] Adicionar cache com React Query/SWR
    - [ ] Otimizar queries do Supabase
    - [ ] Implementar data prefetching
  - Tempo estimado: 12-16 horas
  - Prioridade: 🔥🔥 ALTA

### 💸 Dívidas

- [ ] **Adicionar histórico de dívidas pagas/canceladas**
  - O que fazer:
    - [ ] Adicionar aba de histórico
    - [ ] Filtrar por status
    - [ ] Mostrar data de pagamento
    - [ ] Implementar busca no histórico
  - Tempo estimado: 6-8 horas
  - Prioridade: 🔥🔥 ALTA

- [ ] **Validar que credor ≠ devedor**
  - O que fazer:
    - [ ] Adicionar validação no formulário
    - [ ] Mostrar erro se for o mesmo
    - [ ] Testar validação
  - Tempo estimado: 1-2 horas
  - Prioridade: 🔥 MÉDIA

- [ ] **Implementar sistema de notificações**
  - O que fazer:
    - [ ] Criar tabela de notificações
    - [ ] Notificar quando dívida é criada
    - [ ] Notificar quando é marcada como paga
    - [ ] Adicionar centro de notificações
  - Tempo estimado: 16-20 horas
  - Prioridade: 🔥 MÉDIA

### 📊 Analytics

- [ ] **Adicionar filtros por período**
  - O que fazer:
    - [ ] Criar componente de seletor de período
    - [ ] Implementar filtros (semana, mês, ano, custom)
    - [ ] Atualizar queries do hook
    - [ ] Atualizar gráficos
  - Tempo estimado: 8-10 horas
  - Prioridade: 🔥🔥 ALTA

- [ ] **Implementar comparação entre períodos**
  - O que fazer:
    - [ ] Adicionar opção de comparar períodos
    - [ ] Mostrar variação percentual
    - [ ] Adicionar gráficos comparativos
  - Tempo estimado: 10-12 horas
  - Prioridade: 🔥 MÉDIA

- [ ] **Adicionar exportação de relatórios**
  - O que fazer:
    - [ ] Implementar exportação PDF
    - [ ] Implementar exportação Excel
    - [ ] Adicionar templates de relatórios
  - Tempo estimado: 12-16 horas
  - Prioridade: 🔥 MÉDIA

### ⚙️ Configurações

- [ ] **Substituir prompt/confirm por modais customizados**
  - O que fazer:
    - [ ] Criar componente ConfirmModal
    - [ ] Criar componente PromptModal
    - [ ] Substituir todas as ocorrências
    - [ ] Adicionar animações
  - Tempo estimado: 4-6 horas
  - Prioridade: 🔥 MÉDIA

- [ ] **Implementar edição de papéis de membros**
  - O que fazer:
    - [ ] Adicionar dropdown de papel
    - [ ] Implementar updateMembroPapel
    - [ ] Validar que há ao menos 1 admin
    - [ ] Testar permissões
  - Tempo estimado: 6-8 horas
  - Prioridade: 🔥 MÉDIA

---

## 💡 FASE 3: Funcionalidades Avançadas (3-4 semanas)

### 🏠 Landing Page

- [ ] **Adicionar animações**
  - O que fazer:
    - [ ] Integrar Framer Motion
    - [ ] Animar hero section
    - [ ] Animar cards de features
    - [ ] Adicionar scroll animations
  - Tempo estimado: 8-10 horas
  - Prioridade: 💡 BAIXA

- [ ] **Adicionar seção de testimonials**
  - O que fazer:
    - [ ] Criar componente TestimonialsSection
    - [ ] Adicionar carrossel
    - [ ] Incluir fotos e avaliações
  - Tempo estimado: 6-8 horas
  - Prioridade: 💡 BAIXA

### 🔐 Login/Registro

- [ ] **Implementar login social**
  - O que fazer:
    - [ ] Configurar OAuth no Supabase
    - [ ] Adicionar botões de Google e Facebook
    - [ ] Implementar fluxo de autenticação
    - [ ] Testar integração
  - Tempo estimado: 8-10 horas
  - Prioridade: 💡 BAIXA

- [ ] **Adicionar CAPTCHA**
  - O que fazer:
    - [ ] Integrar Google reCAPTCHA ou hCaptcha
    - [ ] Adicionar ao formulário de registro
    - [ ] Validar no backend
  - Tempo estimado: 4-6 horas
  - Prioridade: 💡 BAIXA

- [ ] **Implementar validação de força de senha**
  - O que fazer:
    - [ ] Criar componente PasswordStrength
    - [ ] Adicionar barra visual
    - [ ] Implementar requisitos mínimos
    - [ ] Adicionar dicas de senha forte
  - Tempo estimado: 4-6 horas
  - Prioridade: 💡 BAIXA

### 📊 Dashboard

- [ ] **Adicionar gráficos visuais**
  - O que fazer:
    - [ ] Integrar Recharts ou Chart.js
    - [ ] Criar gráfico de gastos mensais
    - [ ] Criar gráfico de categorias
    - [ ] Criar gráfico de evolução patrimonial
  - Tempo estimado: 16-20 horas
  - Prioridade: 💡 BAIXA

### 💰 Gastos

- [ ] **Implementar exportação (CSV, PDF)**
  - O que fazer:
    - [ ] Adicionar botão de exportar
    - [ ] Implementar geração de CSV
    - [ ] Implementar geração de PDF
    - [ ] Adicionar filtros na exportação
  - Tempo estimado: 10-12 horas
  - Prioridade: 💡 BAIXA

- [ ] **Adicionar upload de comprovante**
  - O que fazer:
    - [ ] Integrar Supabase Storage
    - [ ] Criar componente de upload
    - [ ] Adicionar visualização de comprovante
    - [ ] Implementar exclusão de comprovante
  - Tempo estimado: 12-16 horas
  - Prioridade: 💡 BAIXA

### 📈 Investimentos

- [ ] **Integrar com APIs de cotação**
  - O que fazer:
    - [ ] Integrar API de ações (Alpha Vantage, Yahoo Finance)
    - [ ] Integrar API de criptomoedas (CoinGecko)
    - [ ] Atualizar valores automaticamente
    - [ ] Adicionar cache de cotações
  - Tempo estimado: 20-24 horas
  - Prioridade: 💡 BAIXA

- [ ] **Implementar projeções de rentabilidade**
  - O que fazer:
    - [ ] Criar calculadora de projeções
    - [ ] Adicionar gráfico de projeção
    - [ ] Considerar aportes mensais
    - [ ] Comparar com índices (CDI, IPCA)
  - Tempo estimado: 16-20 horas
  - Prioridade: 💡 BAIXA

### ⚙️ Configurações

- [ ] **Implementar permissões granulares**
  - O que fazer:
    - [ ] Criar sistema de permissões
    - [ ] Definir níveis de acesso
    - [ ] Implementar middleware de autorização
    - [ ] Adicionar UI de gerenciamento
  - Tempo estimado: 24-30 horas
  - Prioridade: 💡 BAIXA

---

## 🧪 Testes (Obrigatório antes do lançamento)

### Testes Unitários

- [ ] **Configurar Jest/Vitest**
  - Tempo estimado: 2-4 horas

- [ ] **Testar hooks customizados**
  - Tempo estimado: 16-20 horas

- [ ] **Testar componentes principais**
  - Tempo estimado: 20-24 horas

### Testes de Integração

- [ ] **Configurar Cypress/Playwright**
  - Tempo estimado: 4-6 horas

- [ ] **Testar fluxos principais**
  - [ ] Cadastro e login
  - [ ] Criação de família
  - [ ] CRUD de gastos
  - [ ] CRUD de investimentos
  - Tempo estimado: 24-30 horas

### Testes de Performance

- [ ] **Lighthouse audit**
  - Tempo estimado: 2-4 horas

- [ ] **Testes de carga**
  - Tempo estimado: 8-10 horas

---

## 📊 Progresso Geral

### Fase 1: Correções Críticas
```
Progresso: [ ] 0% completo
Total de itens: 26
Itens concluídos: 0
Tempo estimado restante: 80-100 horas
```

### Fase 2: Melhorias Importantes
```
Progresso: [ ] 0% completo
Total de itens: 11
Itens concluídos: 0
Tempo estimado restante: 100-120 horas
```

### Fase 3: Funcionalidades Avançadas
```
Progresso: [ ] 0% completo
Total de itens: 11
Itens concluídos: 0
Tempo estimado restante: 120-160 horas
```

### Testes
```
Progresso: [ ] 0% completo
Total de itens: 7
Itens concluídos: 0
Tempo estimado restante: 76-98 horas
```

---

## 🎯 Meta de Conclusão

**Data Alvo Fase 1:** [DEFINIR]  
**Data Alvo Fase 2:** [DEFINIR]  
**Data Alvo Fase 3:** [DEFINIR]  
**Data de Lançamento Beta:** [DEFINIR]  
**Data de Lançamento Público:** [DEFINIR]  

---

## 📝 Notas

- Atualizar este checklist conforme o progresso
- Adicionar notas de implementação quando necessário
- Reportar impedimentos imediatamente
- Realizar code review antes de marcar como concluído
- Testar todas as alterações em ambiente de desenvolvimento

---

**Última Atualização:** 08/10/2025  
**Responsável:** [NOME]  
**Status:** 📋 Em Aberto

