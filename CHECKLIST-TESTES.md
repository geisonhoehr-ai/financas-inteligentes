# ✅ CHECKLIST DE TESTES - SISTEMA FINANCEIRO FAMILIAR

## 🎯 COMO USAR ESTE CHECKLIST

Marque com ✅ cada item testado que funciona corretamente.
Marque com ❌ itens que apresentam problemas.
Anote observações quando necessário.

---

## 1. LANDING PAGE (/)

### Elementos Visuais
- [ ] Logo e nome do sistema aparecem
- [ ] Hero section carrega corretamente
- [ ] Features section exibe as funcionalidades
- [ ] Pricing section mostra os planos
- [ ] Footer com links aparece

### Botões e Links
- [ ] Botão "Começar Agora" funciona
- [ ] Botão "Login" redireciona para /login
- [ ] Botão "Ver Planos" leva para seção de preços
- [ ] Links do footer funcionam
- [ ] Link "Pricing" funciona
- [ ] Link "Privacy" funciona
- [ ] Link "Terms" funciona

**Observações:**
```

```

---

## 2. AUTENTICAÇÃO

### 2.1 Página de Login (/login)

#### Elementos
- [ ] Formulário de login aparece
- [ ] Campo de email funciona
- [ ] Campo de senha funciona
- [ ] Botão "Fazer Login" visível

#### Funcionalidades
- [ ] Login com credenciais válidas funciona
- [ ] Mensagem de erro para credenciais inválidas
- [ ] Link "Esqueci minha senha" abre modal
- [ ] Link "Criar conta" redireciona para /register
- [ ] Link "Voltar para página inicial" funciona

#### Modal de Recuperação de Senha
- [ ] Modal abre ao clicar "Esqueci minha senha"
- [ ] Campo de email no modal funciona
- [ ] Botão "Enviar Email" funciona
- [ ] Botão "Cancelar" fecha o modal
- [ ] Toast de sucesso aparece após envio

**Observações:**
```

```

### 2.2 Página de Registro (/register)

#### Elementos
- [ ] Formulário de registro aparece
- [ ] Campo de nome funciona
- [ ] Campo de email funciona
- [ ] Campo de senha funciona
- [ ] Campo de confirmação de senha funciona

#### Funcionalidades
- [ ] Registro com dados válidos funciona
- [ ] Validação de email inválido
- [ ] Validação de senhas não coincidentes
- [ ] Validação de senha fraca
- [ ] Redirecionamento após registro bem-sucedido
- [ ] Link "Já tenho conta" redireciona para /login

**Observações:**
```

```

### 2.3 Reset de Senha (/reset-password)

- [ ] Página carrega após clicar no link do email
- [ ] Campo de nova senha funciona
- [ ] Campo de confirmação funciona
- [ ] Botão "Redefinir Senha" funciona
- [ ] Redirecionamento após sucesso

**Observações:**
```

```

---

## 3. DASHBOARD (/dashboard)

### Elementos Visuais
- [ ] Header com nome do usuário aparece
- [ ] Nome da família ativa é exibido
- [ ] Cards de estatísticas carregam
- [ ] Card "Saldo do Mês" exibe valor
- [ ] Card "Gastos do Mês" exibe valor
- [ ] Card "Investimentos" exibe valor
- [ ] Card "Cartões" exibe quantidade
- [ ] Card "Metas" exibe quantidade

### Ações Rápidas
- [ ] Botão "Adicionar Gasto" visível
- [ ] Botão "Adicionar Investimento" visível
- [ ] Botão "Adicionar Meta" visível
- [ ] Botão "Adicionar Cartão" visível
- [ ] Todos os botões redirecionam corretamente

### Widgets
- [ ] Widget de Insights Inteligentes aparece
- [ ] Gastos Recentes listados
- [ ] Investimentos listados
- [ ] Card de Plano aparece
- [ ] Botão "Upgrade" funciona (se não for Pro)

**Observações:**
```

```

---

## 4. GASTOS (/gastos)

### Visualização
- [ ] Página carrega sem erros
- [ ] Cards de estatísticas aparecem
  - [ ] Total do Mês
  - [ ] Gastos Hoje
  - [ ] Total de Gastos
- [ ] Lista de gastos é exibida
- [ ] Cada gasto mostra: descrição, valor, data, categoria

### CRUD - CREATE (Criar)
- [ ] Botão "Novo Gasto" abre drawer
- [ ] Drawer de novo gasto aparece
- [ ] Campo "Descrição" funciona
- [ ] Campo "Valor" funciona
- [ ] Campo "Data" funciona
- [ ] Dropdown "Categoria" funciona
- [ ] Dropdown "Tipo de Pagamento" funciona
- [ ] Checkbox "Gasto privado" funciona
- [ ] Checkbox "Marcar como pago" funciona
- [ ] Seletor de Tags funciona
- [ ] Botão "Cancelar" fecha drawer
- [ ] Botão "Adicionar" cria o gasto
- [ ] Toast de sucesso aparece
- [ ] Lista atualiza automaticamente
- [ ] Stats atualizam automaticamente

### CRUD - UPDATE (Editar)
- [ ] Botão de editar (lápis) aparece em cada gasto
- [ ] Clicar em editar abre drawer
- [ ] Drawer carrega dados do gasto
- [ ] Todos os campos são editáveis
- [ ] Botão "Atualizar" salva alterações
- [ ] Toast de sucesso aparece
- [ ] Lista atualiza automaticamente

### CRUD - DELETE (Deletar)
- [ ] Botão de deletar (lixeira) aparece
- [ ] Clicar em deletar mostra confirmação
- [ ] Confirmar deleta o gasto (soft delete)
- [ ] Toast "movido para lixeira" aparece
- [ ] Gasto some da lista
- [ ] Stats atualizam

### Recursos Especiais
- [ ] Ícone de cadeado aparece em gastos privados
- [ ] Badge "Pago" aparece em gastos pagos
- [ ] Gastos pagos têm visual diferente (verde)
- [ ] Formato de moeda correto (R$)
- [ ] Data formatada corretamente

**Observações:**
```

```

---

## 5. CATEGORIAS (/categorias)

### Visualização
- [ ] Página carrega sem erros
- [ ] Cards de estatísticas aparecem
  - [ ] Categorias de Gastos
  - [ ] Categorias de Parcelas
  - [ ] Total de Categorias
- [ ] Seção "Categorias de Gastos" aparece
- [ ] Seção "Categorias de Parcelas" aparece
- [ ] Cada categoria mostra: ícone, nome, badge "Sistema"

### CRUD - CREATE (Criar)
- [ ] Botão "Nova Categoria" abre drawer
- [ ] Campo "Nome da Categoria" funciona
- [ ] Campo "Ícone" funciona
- [ ] Emojis sugeridos são clicáveis
- [ ] Campo "Cor" (color picker) funciona
- [ ] Dropdown "Tipo" funciona (Gasto/Parcela/Receita)
- [ ] Botão "Cancelar" fecha drawer
- [ ] Botão "Criar" cria categoria
- [ ] Toast de sucesso aparece
- [ ] Lista atualiza

### CRUD - UPDATE (Editar)
- [ ] Botão de editar aparece
- [ ] Drawer de editar abre com dados
- [ ] Campos são editáveis
- [ ] Botão "Atualizar" salva
- [ ] Lista atualiza

### CRUD - DELETE (Deletar)
- [ ] Botão de deletar aparece
- [ ] Botão NÃO aparece em categorias do sistema
- [ ] Confirmação de exclusão aparece
- [ ] Categoria é deletada
- [ ] Toast de sucesso aparece

**Observações:**
```

```

---

## 6. ORÇAMENTO (/orcamento)

### Tela Inicial (Sem Orçamento)
- [ ] Card vazio aparece quando não há orçamento
- [ ] Botão "Criar Orçamento do Mês" funciona
- [ ] Guia de Ajuda aparece

### Criar Orçamento
- [ ] Drawer de criar orçamento abre
- [ ] Campo "Nome do Orçamento" funciona
- [ ] Campo "Valor Total" funciona
- [ ] Campo "Descrição" funciona
- [ ] Botão "Criar Orçamento" funciona
- [ ] Toast de sucesso aparece
- [ ] Orçamento aparece na tela

### Visualização do Orçamento
- [ ] Card "Orçamento Total" exibe valor
- [ ] Card "Disponível" exibe valor restante
- [ ] Card "Itens" mostra quantidade
- [ ] Botão "Adicionar Categoria" funciona
- [ ] Botão "Adicionar Tag" funciona

### Adicionar Categoria ao Orçamento
- [ ] Drawer abre
- [ ] Dropdown de categorias funciona
- [ ] Campo "Valor Planejado" funciona
- [ ] Botão "Adicionar" funciona
- [ ] Categoria aparece na lista
- [ ] Barra de progresso aparece
- [ ] Percentual usado é calculado
- [ ] Cores mudam conforme uso (verde/amarelo/laranja/vermelho)

### Adicionar Tag ao Orçamento
- [ ] Drawer abre
- [ ] Tags são exibidas como botões
- [ ] Seleção de tag funciona
- [ ] Campo "Valor Planejado" funciona
- [ ] Botão "Adicionar" funciona
- [ ] Tag aparece na lista com cor personalizada

**Observações:**
```

```

---

## 7. CARTÕES (/cartoes)

### Visualização
- [ ] Stats cards carregam:
  - [ ] Fatura Atual
  - [ ] Limite Disponível
  - [ ] Cartões Ativos
  - [ ] Próximo Vencimento

### CRUD - CREATE
- [ ] Botão "Novo Cartão" abre drawer
- [ ] Campo "Nome do Cartão" funciona
- [ ] Dropdown "Tipo" funciona (Crédito/Débito/Ambos)
- [ ] Dropdown "Bandeira" funciona
- [ ] Campo "Limite" funciona
- [ ] Campo "Dia do Vencimento" funciona (1-31)
- [ ] Campo "Dia do Fechamento" funciona (1-31)
- [ ] Campo "Final do Cartão" funciona (4 dígitos)
- [ ] Dropdown "Status" funciona
- [ ] Campo "Observações" funciona
- [ ] Botão "Adicionar" cria cartão
- [ ] Toast de sucesso

### CRUD - UPDATE
- [ ] Botão de editar abre drawer
- [ ] Dados carregam corretamente
- [ ] Botão "Atualizar" salva

### CRUD - DELETE
- [ ] Botão de deletar funciona
- [ ] Confirmação aparece
- [ ] Cartão é movido para lixeira

**Observações:**
```

```

---

## 8. INVESTIMENTOS (/investimentos)

### Visualização
- [ ] Stats cards carregam:
  - [ ] Total Investido
  - [ ] Rentabilidade (%)
  - [ ] Investimentos Ativos
  - [ ] Rendimento Total

### CRUD - CREATE
- [ ] Botão "Novo Investimento" abre drawer
- [ ] Campo "Nome do Investimento" funciona
- [ ] Dropdown "Tipo" funciona (Ação/FII/Tesouro/etc)
- [ ] Campo "Instituição" funciona
- [ ] Campo "Valor Inicial" funciona
- [ ] Campo "Valor Atual" funciona
- [ ] Campo "Rentabilidade (%)" funciona
- [ ] Cálculo automático valor atual ↔ rentabilidade funciona
- [ ] Dropdown "Status" funciona
- [ ] Campo "Data de Início" funciona
- [ ] Campo "Data de Vencimento" funciona
- [ ] Campo "Observações" funciona
- [ ] Botão "Adicionar" cria investimento

### CRUD - UPDATE & DELETE
- [ ] Editar funciona
- [ ] Deletar funciona

**Observações:**
```

```

---

## 9. METAS (/metas)

### Visualização
- [ ] Lista de metas aparece
- [ ] Cada meta mostra: nome, valor, progresso

### CRUD Completo
- [ ] Criar meta funciona
- [ ] Editar meta funciona
- [ ] Deletar meta funciona
- [ ] Barra de progresso atualiza
- [ ] Percentual de conclusão correto

**Observações:**
```

```

---

## 10. OUTRAS PÁGINAS

### Parcelas (/parcelas)
- [ ] Página carrega
- [ ] CRUD funciona

### Salários (/salarios)
- [ ] Página carrega
- [ ] CRUD funciona

### Tags (/tags)
- [ ] Página carrega
- [ ] CRUD funciona
- [ ] Seletor de cor funciona
- [ ] Seletor de ícone funciona

### Dívidas (/dividas)
- [ ] Página carrega
- [ ] CRUD funciona

### Assinaturas (/assinaturas)
- [ ] Página carrega
- [ ] CRUD funciona

### Contas Fixas (/contas-fixas)
- [ ] Página carrega
- [ ] CRUD funciona

### Gasolina (/gasolina)
- [ ] Página carrega
- [ ] CRUD funciona

### Mesada (/mesada)
- [ ] Página carrega
- [ ] CRUD funciona

### Análise de Tags (/analise-tags)
- [ ] Página carrega
- [ ] Gráficos aparecem

### Modo Economia (/modo-economia)
- [ ] Página carrega
- [ ] Toggle funciona

### Ferramentas (/ferramentas)
- [ ] Página carrega
- [ ] Ferramentas listadas

### Relatórios (/relatorios)
- [ ] Página carrega
- [ ] Gráficos aparecem
- [ ] Filtros funcionam

### Analytics (/analytics)
- [ ] Página carrega
- [ ] Gráficos interativos

### Calendário (/calendario)
- [ ] Página carrega
- [ ] Calendário renderiza
- [ ] Eventos aparecem

### Configurações (/configuracoes)
- [ ] Página carrega
- [ ] Configurações de usuário
- [ ] Configurações da família
- [ ] Tema dark/light funciona

### Perfil (/profile)
- [ ] Página carrega
- [ ] Dados do usuário aparecem
- [ ] Editar perfil funciona

### Lixeira (/lixeira)
- [ ] Página carrega
- [ ] Itens deletados aparecem
- [ ] Botão "Restaurar" funciona
- [ ] Botão "Deletar Permanentemente" funciona

**Observações:**
```

```

---

## 11. SISTEMA DE FAMÍLIA

### Funcionalidades
- [ ] Criar nova família funciona
- [ ] Trocar família ativa funciona
- [ ] Gerar código de convite funciona
- [ ] Aceitar convite funciona
- [ ] Listar membros funciona
- [ ] Remover membro funciona (admin)
- [ ] Sair da família funciona

**Observações:**
```

```

---

## 12. NOTIFICAÇÕES

- [ ] Centro de notificações abre
- [ ] Notificações aparecem
- [ ] Marcar como lida funciona
- [ ] Badge de contador funciona
- [ ] Notificações de orçamento aparecem

**Observações:**
```

```

---

## 13. RESPONSIVIDADE

### Desktop (1920x1080)
- [ ] Layout correto
- [ ] Sidebar visível
- [ ] Todos os elementos acessíveis

### Tablet (768x1024)
- [ ] Layout adaptado
- [ ] Sidebar colapsável
- [ ] Drawers funcionam bem

### Mobile (375x667)
- [ ] Layout mobile correto
- [ ] Sidebar vira menu hamburguer
- [ ] Formulários responsivos
- [ ] Tabelas rolam horizontalmente
- [ ] Botões acessíveis
- [ ] Drawers ocupam tela inteira

**Observações:**
```

```

---

## 14. PERFORMANCE

- [ ] Páginas carregam rapidamente (< 3s)
- [ ] Navegação entre páginas é suave
- [ ] Loading states aparecem
- [ ] Skeletons aparecem durante carregamento
- [ ] Sem travamentos ou lags
- [ ] Sem erros no console do navegador
- [ ] Sem warnings no console

**Observações:**
```

```

---

## 15. TEMAS

- [ ] Tema claro funciona
- [ ] Tema escuro funciona
- [ ] Toggle de tema funciona
- [ ] Preferência é salva
- [ ] Todas as páginas suportam ambos os temas
- [ ] Cores são legíveis em ambos os temas

**Observações:**
```

```

---

## 16. STRIPE/PAGAMENTOS (se aplicável)

- [ ] Página de pricing carrega
- [ ] Botão "Assinar" funciona
- [ ] Redirecionamento para checkout Stripe
- [ ] Página de sucesso aparece após pagamento
- [ ] Plano é atualizado após pagamento

**Observações:**
```

```

---

## 17. PWA

- [ ] Prompt de instalação aparece
- [ ] App pode ser instalado
- [ ] Funciona offline (básico)
- [ ] Ícone correto no device

**Observações:**
```

```

---

## 📊 RESUMO DOS TESTES

### Estatísticas
- Total de itens testados: _____
- Itens funcionando: _____
- Itens com problemas: _____
- Taxa de sucesso: _____%

### Bugs Encontrados
```
1.
2.
3.
```

### Melhorias Sugeridas
```
1.
2.
3.
```

### Conclusão Final
```


```

---

**Data do Teste:** ___/___/_____
**Testado por:** __________________
**Versão:** 3.0.1
**Navegador:** _____________
**Sistema Operacional:** _____________
