# 🎨 Estrutura Visual do Projeto

## 📐 Layout Geral

```
┌────────────────────────────────────────────────────────────────┐
│  Header                                    [☀️/🌙]             │
├──────────┬─────────────────────────────────────────────────────┤
│          │                                                     │
│ Sidebar  │  Main Content Area                                 │
│          │                                                     │
│ ☰ Menu   │  ┌───────────────────────────────────────────┐    │
│          │  │                                           │    │
│ 📊 Dash  │  │         Page Content                      │    │
│ 💸 Gasto │  │                                           │    │
│ 🗑️ Lixei │  │                                           │    │
│          │  └───────────────────────────────────────────┘    │
│          │                                                     │
│          │                                                     │
│          │                                                     │
└──────────┴─────────────────────────────────────────────────────┘
```

---

## 🏠 Dashboard (/)

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard Financeiro                                   │
│  Última atualização: 04/10/2025 às 14:30               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ 📈 Receitas  │  │ 📉 Despesas  │  │ 💰 Saldo     │ │
│  │              │  │              │  │              │ │
│  │ R$ 5.000,00  │  │ R$ 3.200,00  │  │ R$ 1.800,00  │ │
│  │   (verde)    │  │   (vermelho) │  │   (verde)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  Detalhamento de Despesas                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────┐ │
│  │ Gastos     │ │ Parcelas   │ │ Gasolina   │ │ Ass │ │
│  │ R$ 1.200   │ │ R$ 800     │ │ R$ 300     │ │ ... │ │
│  └────────────┘ └────────────┘ └────────────┘ └─────┘ │
│                                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐         │
│  │ Contas     │ │ Ferramentas│ │ Empréstimos│         │
│  │ R$ 600     │ │ R$ 200     │ │ R$ 100     │         │
│  └────────────┘ └────────────┘ └────────────┘         │
└─────────────────────────────────────────────────────────┘
```

**Componentes:**
- `app/page.tsx` (página)
- `components/ui/card.tsx` (cards)
- `hooks/use-dashboard.ts` (dados)

---

## 💸 Gastos (/gastos)

```
┌─────────────────────────────────────────────────────────┐
│  Gastos Variáveis                   [+ Novo Gasto]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Mercado            [Alimentação]                  │ │
│  │ PIX • 01/10/2025                 R$ 250,00    🗑️ │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Uber               [Transporte]                   │ │
│  │ Débito • 30/09/2025              R$ 45,00     🗑️ │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Netflix            [Lazer]                        │ │
│  │ Crédito • 28/09/2025             R$ 49,90     🗑️ │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Componentes:**
- `app/gastos/page.tsx` (página)
- `components/gasto-dialog.tsx` (modal)
- `hooks/use-gastos.ts` (CRUD)

---

## ➕ Modal: Novo Gasto

```
        ┌─────────────────────────────┐
        │  Novo Gasto                 │
        ├─────────────────────────────┤
        │                             │
        │  Descrição                  │
        │  [________________]          │
        │                             │
        │  Valor                      │
        │  [________________]          │
        │                             │
        │  Categoria                  │
        │  [▼ Alimentação    ]        │
        │                             │
        │  Tipo de Pagamento          │
        │  [▼ PIX            ]        │
        │                             │
        │  Data                       │
        │  [2025-10-04       ]        │
        │                             │
        │  [Cancelar]  [Salvar]       │
        └─────────────────────────────┘
```

**Componente:**
- `components/gasto-dialog.tsx`

---

## 🗑️ Lixeira (/lixeira)

```
┌─────────────────────────────────────────────────────────┐
│  🗑️ Lixeira                          [Atualizar]       │
│  Itens deletados nos últimos 30 dias                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ [Gasto] Deletado em 04/10/2025 às 10:30          │ │
│  │                                                   │ │
│  │ Mercado                                           │ │
│  │ Valor: R$ 250,00                                  │ │
│  │                           [↺ Restaurar] [🗑️ Del] │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ [Parcela] Deletado em 02/10/2025 às 15:45        │ │
│  │                                                   │ │
│  │ iPhone 15                                         │ │
│  │ Valor: R$ 500,00                                  │ │
│  │                           [↺ Restaurar] [🗑️ Del] │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Ou se vazio:**

```
┌─────────────────────────────────────────────────────────┐
│  🗑️ Lixeira                          [Atualizar]       │
│  Itens deletados nos últimos 30 dias                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│                        🎉                               │
│                                                         │
│                Nenhum item na lixeira                   │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Componentes:**
- `app/lixeira/page.tsx` (página)
- `hooks/use-lixeira.ts` (lógica)

---

## 📱 Responsivo (Mobile)

```
┌──────────────────┐
│ ☰  Financeiro ☀️│
├──────────────────┤
│                  │
│ 📊 Dashboard     │
│                  │
│ ┌──────────────┐ │
│ │ Receitas     │ │
│ │ R$ 5.000     │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │ Despesas     │ │
│ │ R$ 3.200     │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │ Saldo        │ │
│ │ R$ 1.800     │ │
│ └──────────────┘ │
│                  │
│ Detalhamento     │
│                  │
│ ┌──────────────┐ │
│ │ Gastos       │ │
│ │ R$ 1.200     │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │ Parcelas     │ │
│ │ R$ 800       │ │
│ └──────────────┘ │
│                  │
└──────────────────┘
```

**Responsividade:**
- Desktop: Grid 3 colunas
- Tablet: Grid 2 colunas
- Mobile: Grid 1 coluna
- Sidebar: Drawer no mobile

---

## 🎨 Temas

### Dark Mode (Padrão)

```
Cores:
- Background:      #0a0a0a (preto)
- Foreground:      #fafafa (branco)
- Card:            #1a1a1a (cinza escuro)
- Primary:         #3b82f6 (azul)
- Green:           #10b981 (verde)
- Red:             #ef4444 (vermelho)
- Border:          #27272a (cinza)
```

### Light Mode

```
Cores:
- Background:      #ffffff (branco)
- Foreground:      #0a0a0a (preto)
- Card:            #f9fafb (cinza claro)
- Primary:         #3b82f6 (azul)
- Green:           #10b981 (verde)
- Red:             #ef4444 (vermelho)
- Border:          #e5e7eb (cinza claro)
```

---

## 🔄 Estados

### Loading

```
┌─────────────────────────────────┐
│                                 │
│         ⟳ (spinner)             │
│                                 │
│    Carregando dados...          │
│                                 │
└─────────────────────────────────┘
```

### Vazio

```
┌─────────────────────────────────┐
│                                 │
│         📭                      │
│                                 │
│  Nenhum gasto cadastrado.       │
│  Clique em "Novo Gasto" para    │
│  adicionar.                     │
│                                 │
└─────────────────────────────────┘
```

### Erro

```
┌─────────────────────────────────┐
│                                 │
│         ⚠️                      │
│                                 │
│  Erro ao carregar dados.        │
│  Verifique sua conexão.         │
│                                 │
│      [Tentar Novamente]         │
│                                 │
└─────────────────────────────────┘
```

---

## 🗂️ Hierarquia de Componentes

```
App
├── QueryProvider
│   └── ThemeProvider
│       ├── Header
│       │   └── ThemeToggle
│       ├── Sidebar
│       │   └── NavLinks
│       └── Main
│           ├── DashboardPage
│           │   ├── StatsCards
│           │   └── DetailCards
│           ├── GastosPage
│           │   ├── GastoList
│           │   │   └── GastoCard
│           │   └── GastoDialog
│           └── LixeiraPage
│               └── DeletedItemCard
```

---

## 📏 Dimensões

### Desktop (>1024px)

```
Header:         100% x 64px
Sidebar:        256px x 100%
Main Content:   Restante x 100%
Card:           100% x auto
Modal:          600px x auto
```

### Tablet (768-1024px)

```
Header:         100% x 64px
Sidebar:        Drawer (overlay)
Main Content:   100% x 100%
Cards:          50% (2 colunas)
```

### Mobile (<768px)

```
Header:         100% x 56px
Sidebar:        Drawer (overlay)
Main Content:   100% x 100%
Cards:          100% (1 coluna)
```

---

## 🎯 Interações

### Hover Effects

```
Card:
  Normal:    background-color: card
  Hover:     background-color: card + shadow-lg

Button:
  Normal:    background-color: primary
  Hover:     background-color: primary/90 + scale(1.02)

Link:
  Normal:    color: foreground
  Hover:     color: primary + underline
```

### Click/Tap Areas

```
Mínimo:        44x44px (mobile)
Recomendado:   48x48px
Botões:        Altura 40px (default)
Icons:         20x20px clickable area
```

### Transições

```
Padrão:        200ms ease-out
Hover:         150ms ease-in
Modal:         300ms ease-in-out
Page:          0ms (instant)
```

---

## 🌈 Acessibilidade

```
✅ Contraste WCAG AA: 4.5:1 (texto)
✅ Contraste WCAG AA: 3:1 (UI)
✅ Focus visible em todos elementos interativos
✅ Keyboard navigation completa
✅ Screen reader friendly
✅ Semantic HTML
```

---

## 📊 Fluxo de Dados

```
User Action
    ↓
Component Event
    ↓
Hook (use-gastos.ts)
    ↓
React Query Mutation
    ↓
Supabase Client
    ↓
Database (UPDATE/INSERT)
    ↓
React Query Invalidation
    ↓
Component Re-render
    ↓
UI Update
```

---

**Dica:** Use este guia como referência ao implementar novos componentes! 🎨
