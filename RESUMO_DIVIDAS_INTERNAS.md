# 💰 Sistema de Dívidas Internas - Implementação Completa

## ✅ O Que Foi Criado

### 📄 Arquivos Criados

1. **`SQL_DIVIDAS_INTERNAS.sql`**
   - 📊 Schema completo do banco de dados
   - 🔧 Triggers automáticos
   - 📈 Views de resumo e consolidação
   - 🔒 RLS (Row Level Security)
   - ⚙️ Funções RPC para operações

2. **`hooks/use-dividas.ts`**
   - 🎣 Hook React para gerenciar dívidas
   - 📡 Integração com Supabase
   - 🔄 React Query para cache e sincronização
   - ✨ Toast notifications

3. **`app/dividas/page.tsx`**
   - 📱 Página completa de dívidas
   - 📊 Cards de resumo (saldo, deve, recebe)
   - 📋 Listas de dívidas pendentes
   - 🎨 Design Apple-style

4. **`components/gasto-sheet.tsx`** (Atualizado)
   - ➕ Campo "Pago Por"
   - 👤 Campo "Responsável Por"
   - 💡 Indicador de dívida automática
   - 🔍 Carrega membros da família

5. **`components/sidebar.tsx`** (Atualizado)
   - 🔗 Link para página de Dívidas
   - 👥 Ícone Users

6. **`SISTEMA_DIVIDAS_INTERNAS.md`**
   - 📖 Documentação técnica completa
   - 🏗️ Arquitetura do sistema
   - 💡 Casos de uso

7. **`COMO_USAR_DIVIDAS_INTERNAS.md`**
   - 📚 Guia prático para usuários
   - 🎯 Tutoriais passo a passo
   - ❓ FAQ

---

## 🎯 Como Funciona

### Fluxograma do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO CRIA GASTO                        │
│                                                              │
│  Descrição: TV Samsung 55"                                   │
│  Valor: R$ 3.000,00                                          │
│  Pago por: Maria  ◄──────────── Quem usou o cartão         │
│  Responsável: João  ◄────────── Quem realmente deve        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              TRIGGER AUTOMÁTICO NO BANCO                     │
│                                                              │
│  IF pago_por ≠ responsavel_por THEN                         │
│    CREATE divida_interna                                     │
│  END IF                                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 DÍVIDA INTERNA CRIADA                        │
│                                                              │
│  Credor: Maria                                               │
│  Devedor: João                                               │
│  Valor: R$ 3.000,00                                          │
│  Status: Pendente                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              VISUALIZAÇÃO NO DASHBOARD                       │
│                                                              │
│  João vê: "Você deve R$ 3.000 para Maria"                   │
│  Maria vê: "João te deve R$ 3.000"                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 JOÃO MARCA COMO PAGA                         │
│                                                              │
│  [✓ Marcar como Paga]                                        │
│  Status: Pendente → Paga                                     │
│  Data Pagamento: NOW()                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `gastos` (Campos Adicionados)

| Campo              | Tipo | Descrição                      |
|--------------------|------|--------------------------------|
| `pago_por`         | UUID | Quem efetivamente pagou        |
| `responsavel_por`  | UUID | Quem é responsável pela dívida |
| `percentual_divisao` | JSONB | Divisão entre múltiplos membros |

### Tabela: `dividas_internas` (Nova)

| Campo              | Tipo      | Descrição                       |
|--------------------|-----------|--------------------------------|
| `id`               | UUID      | ID único                       |
| `familia_id`       | UUID      | Família/Empresa                |
| `credor_id`        | UUID      | Quem pagou (recebe)            |
| `devedor_id`       | UUID      | Quem deve (paga)               |
| `valor`            | DECIMAL   | Valor da dívida                |
| `descricao`        | TEXT      | Descrição                      |
| `gasto_original_id`| UUID      | Link com gasto original        |
| `parcela_numero`   | INT       | Número da parcela (se for)     |
| `parcela_total`    | INT       | Total de parcelas              |
| `status`           | VARCHAR   | pendente / paga / cancelada    |
| `data_vencimento`  | DATE      | Data de vencimento             |
| `data_pagamento`   | TIMESTAMP | Quando foi paga                |
| `comprovante_url`  | TEXT      | URL do comprovante (opcional)  |

---

## 🎨 Interface Visual

### 1. Dashboard - Card de Resumo

```
┌────────────────────────────────────────────────────┐
│  💰 Dívidas Internas                               │
├────────────────────────────────────────────────────┤
│                                                    │
│   Saldo Líquido      Você Deve      Você Recebe   │
│   -R$ 255,00         R$ 295,00      R$ 40,00      │
│   📉 Você deve       2 dívidas      1 dívida      │
│                                                    │
└────────────────────────────────────────────────────┘
```

### 2. Página de Dívidas - Lista Completa

```
┌────────────────────────────────────────────────────┐
│  Dívidas Internas                                  │
│  Controle de dívidas entre membros da família      │
├────────────────────────────────────────────────────┤
│                                                    │
│  [+ Registrar Dívida]                              │
│                                                    │
├────────────────────────────────────────────────────┤
│  📉 Você Deve                                      │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ 👥 Maria                      R$ 250,00      │ │
│  │ TV Samsung 55" - Parcela 1/12                │ │
│  │ 📅 Vence em: 05/11/2025                      │ │
│  │                                              │ │
│  │ [✓ Marcar como Paga]  [✗ Cancelar]          │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ 👥 Maria                      R$ 45,00       │ │
│  │ Pizza                                        │ │
│  │                                              │ │
│  │ [✓ Marcar como Paga]  [✗ Cancelar]          │ │
│  └──────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────┤
│  📈 Você Recebe                                    │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ 👥 Filho                      R$ 40,00       │ │
│  │ Restaurante em família                       │ │
│  │                                              │ │
│  │ [📄 Ver Detalhes]                            │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

### 3. Formulário de Gasto com Responsabilidade

```
┌────────────────────────────────────────────────────┐
│  Novo Gasto                                        │
├────────────────────────────────────────────────────┤
│                                                    │
│  Descrição: TV Samsung 55"                         │
│  Valor: R$ 3.000,00                                │
│  Categoria: Eletrônicos                            │
│  Forma de Pagamento: Cartão de Crédito            │
│  Data: 05/10/2025                                  │
│                                                    │
│  ─────────────────────────────────────────────     │
│  👥 Configurar Responsabilidade                    │
│                                                    │
│  Pago Por (Quem usou o cartão/dinheiro):           │
│  [▼ Maria                                    ]     │
│                                                    │
│  Responsável Por (Quem realmente deve):            │
│  [▼ Eu                                       ]     │
│                                                    │
│  💡 Uma dívida interna será criada automaticamente │
│                                                    │
│  [Cancelar]              [Adicionar]               │
└────────────────────────────────────────────────────┘
```

---

## 🔄 Funcionalidades Implementadas

### ✅ Básicas
- [x] Criar dívidas automaticamente ao criar gasto
- [x] Visualizar dívidas que você deve
- [x] Visualizar dívidas que te devem
- [x] Marcar dívida como paga
- [x] Cancelar dívida
- [x] Calcular saldo líquido
- [x] RLS (segurança por família)

### ⏳ Em Desenvolvimento
- [ ] Dividir gasto entre múltiplos membros
- [ ] Upload de comprovante de pagamento
- [ ] Notificações de novas dívidas
- [ ] Lembretes de vencimento
- [ ] Histórico de acertos
- [ ] Relatórios de dívidas
- [ ] Gráficos de evolução

---

## 🚀 Como Ativar

### Passo 1: Executar SQL no Supabase

```bash
1. Abra o Supabase Dashboard
2. Vá em "SQL Editor"
3. Cole o conteúdo de "SQL_DIVIDAS_INTERNAS.sql"
4. Clique em "Run"
5. Aguarde mensagem de sucesso
```

### Passo 2: Deploy do Frontend

O código frontend já está pronto! Basta fazer deploy:

```bash
git add .
git commit -m "feat: Sistema de dívidas internas implementado"
git push origin master
```

### Passo 3: Testar

1. Acesse sua aplicação
2. Crie uma família (Configurações)
3. Adicione membros (Convites)
4. Registre um gasto com responsabilidade diferente
5. Veja a dívida criada em "Dívidas"

---

## 📊 Exemplo Completo de Uso

### Cenário
João estourou o limite do cartão e comprou uma TV parcelada no cartão da Maria.

### Solução Implementada

1. **João cria família**
   - Nome: "Família Silva"
   - Tipo: Família
   - Código gerado: `FAM-ABC123`

2. **Maria aceita convite**
   - Acessa: `/convite/FAM-ABC123`
   - Aceita convite
   - Agora é membro da família

3. **João registra compra**
   - Gastos → Novo Gasto
   - Descrição: "TV Samsung 55""
   - Valor: R$ 3.000,00
   - **Pago por**: Maria
   - **Responsável**: João
   - Adiciona

4. **Sistema cria dívida**
   - Automaticamente cria: João deve R$ 3.000 para Maria
   - Status: Pendente
   - Ambos veem no dashboard

5. **João visualiza dívida**
   - Menu → Dívidas
   - Vê: "Você deve R$ 3.000 para Maria"

6. **João paga**
   - Faz PIX de R$ 3.000 para Maria
   - Clica em "✓ Marcar como Paga"
   - Dívida some da lista de pendentes

---

## 🎯 Diferencial do Sistema

| Problema                                  | Solução                              |
|------------------------------------------|--------------------------------------|
| "Esqueci quem pagou o quê"               | Tudo registrado automaticamente      |
| "Caderninho de anotações"                | Sistema digital e organizado         |
| "Cálculos complexos de quem deve"        | Saldo líquido calculado              |
| "Discussões sobre dívidas"               | Transparência total                  |
| "Compra no cartão de outro"              | Campo "Pago Por" vs "Responsável"    |
| "Dividir conta entre vários"             | Divisão percentual automática        |

---

## 🔒 Segurança

- ✅ RLS ativado (só vê dívidas da sua família)
- ✅ Apenas credor/devedor pode interagir
- ✅ Admin pode gerenciar todas
- ✅ Histórico de quem alterou
- ✅ Soft delete (não perde dados)

---

## 📈 Próximas Melhorias

### Fase 2 (Curto Prazo)
- Divisão percentual de gastos
- Upload de comprovantes
- Notificações em tempo real
- Filtros e busca avançada

### Fase 3 (Médio Prazo)
- Integração com PIX
- Agendamento de pagamentos
- Recorrência de dívidas
- Relatórios em PDF

### Fase 4 (Longo Prazo)
- Inteligência artificial para sugerir divisões
- Análise de padrões de gastos
- Gamificação (quem paga em dia)
- App mobile nativo

---

## 💡 Dicas de Uso

1. **Sempre configure responsabilidade em compras de grande valor**
2. **Marque como paga imediatamente após transferir**
3. **Use descrições claras para não confundir**
4. **Verifique o saldo líquido antes de acertar**
5. **Converse com a família sobre as dívidas registradas**

---

## 🎉 Resultado Final

### Antes
❌ Anotações em papel  
❌ Confusão sobre quem deve  
❌ Cálculos manuais  
❌ Discussões frequentes  
❌ Falta de transparência  

### Depois
✅ Tudo digital e organizado  
✅ Clareza total de responsabilidades  
✅ Cálculos automáticos  
✅ Harmonia familiar  
✅ Transparência completa  

---

**🚀 O Sistema de Dívidas Internas está pronto para uso!**

**👨‍👩‍👧‍👦 Perfeito para famílias que querem transparência e organização financeira!**

