# 🚀 GUIA DE TESTE RÁPIDO - SISTEMA FINANCEIRO

## 📋 INFORMAÇÕES DO TESTE

**URL do Sistema:** http://localhost:3000
**Status:** ✅ Servidor rodando

**Credenciais de Teste:**
- **Email:** geisonhoehr@gmail.com
- **Senha:** 123456

---

## ⚡ ROTEIRO DE TESTE RÁPIDO (15-20 minutos)

Siga este roteiro para testar as principais funcionalidades do sistema.

---

### 1️⃣ LOGIN (2 min)

1. Abra http://localhost:3000
2. Clique em **"Login"** ou acesse http://localhost:3000/login
3. Digite:
   - Email: `geisonhoehr@gmail.com`
   - Senha: `123456`
4. Clique em **"Fazer Login"**

**✅ O que verificar:**
- [ ] Formulário aparece corretamente
- [ ] Login é bem-sucedido
- [ ] Redirecionamento para /dashboard ocorre
- [ ] Toast de sucesso aparece

---

### 2️⃣ DASHBOARD (2 min)

Você deve estar em http://localhost:3000/dashboard

**✅ O que verificar:**
- [ ] Seu nome (geison) aparece no header
- [ ] 5 cards de estatísticas carregam:
  - Saldo do Mês
  - Gastos do Mês
  - Investimentos
  - Cartões (quantidade)
  - Metas (quantidade)
- [ ] Seção "Ações Rápidas" com 4 botões
- [ ] Widget "Insights Inteligentes" aparece
- [ ] "Gastos Recentes" listados
- [ ] "Investimentos" listados
- [ ] Card "Seu Plano" aparece

---

### 3️⃣ TESTE CRUD DE GASTOS (5 min)

Acesse http://localhost:3000/gastos

#### CREATE (Criar Gasto)
1. Clique no botão **"Novo Gasto"** (canto superior direito)
2. Drawer deve abrir
3. Preencha:
   - Descrição: `Mercado Teste`
   - Valor: `150.00`
   - Data: (deixe a data de hoje)
   - Categoria: (selecione qualquer uma, ex: Alimentação)
   - Tipo de Pagamento: (deixe Dinheiro)
   - ✅ Marque "Marcar como pago" (opcional)
4. Clique em **"Adicionar"**

**✅ O que verificar:**
- [ ] Drawer abre corretamente
- [ ] Todos os campos funcionam
- [ ] Dropdown de categorias carrega
- [ ] Botão "Adicionar" funciona
- [ ] Toast "Gasto adicionado com sucesso!" aparece
- [ ] Drawer fecha automaticamente
- [ ] Novo gasto aparece na lista
- [ ] Cards de stats atualizam (Total do Mês aumenta)

#### READ (Ver Gasto)
**✅ O que verificar:**
- [ ] O gasto "Mercado Teste" aparece na lista
- [ ] Valor R$ 150,00 está correto
- [ ] Data está correta
- [ ] Categoria está correta
- [ ] Se marcou como pago, badge "✓ Pago" aparece
- [ ] Ícone de categoria aparece

#### UPDATE (Editar Gasto)
1. Localize o gasto "Mercado Teste"
2. Clique no ícone de **lápis (editar)**
3. Drawer de edição abre
4. Altere:
   - Valor: `200.00`
   - Descrição: `Mercado Teste Editado`
5. Clique em **"Atualizar"**

**✅ O que verificar:**
- [ ] Drawer abre com dados preenchidos
- [ ] Alterações são salvas
- [ ] Toast "Gasto atualizado com sucesso!" aparece
- [ ] Lista atualiza automaticamente
- [ ] Stats atualizam

#### DELETE (Deletar Gasto)
1. Localize o gasto "Mercado Teste Editado"
2. Clique no ícone de **lixeira (deletar)**
3. Confirme a exclusão

**✅ O que verificar:**
- [ ] Dialog de confirmação aparece
- [ ] Ao confirmar, gasto some da lista
- [ ] Toast "Gasto movido para lixeira" aparece
- [ ] Stats atualizam (Total do Mês diminui)

---

### 4️⃣ TESTE CRUD DE CATEGORIAS (3 min)

Acesse http://localhost:3000/categorias

#### CREATE (Criar Categoria)
1. Clique em **"Nova Categoria"**
2. Preencha:
   - Nome: `Categoria Teste`
   - Ícone: `🎮` (clique em um emoji ou digite)
   - Cor: (escolha qualquer cor)
   - Tipo: `Gasto`
3. Clique em **"Criar"**

**✅ O que verificar:**
- [ ] Drawer abre
- [ ] Emojis sugeridos são clicáveis
- [ ] Color picker funciona
- [ ] Categoria é criada
- [ ] Aparece na lista
- [ ] Stats atualizam

#### UPDATE & DELETE
1. Edite a "Categoria Teste"
2. Delete a "Categoria Teste"

**✅ O que verificar:**
- [ ] Edição funciona
- [ ] Deleção funciona
- [ ] Categorias do sistema NÃO podem ser deletadas

---

### 5️⃣ TESTE ORÇAMENTO (4 min)

Acesse http://localhost:3000/orcamento

#### Criar Orçamento (se não existir)
1. Clique em **"Criar Orçamento do Mês"**
2. Preencha:
   - Nome: `Orçamento Familiar`
   - Valor Total: `5000.00`
3. Clique em **"Criar Orçamento"**

**✅ O que verificar:**
- [ ] Drawer abre
- [ ] Orçamento é criado
- [ ] 3 cards aparecem: Orçamento Total, Disponível, Itens

#### Adicionar Categoria ao Orçamento
1. Clique em **"Adicionar Categoria"**
2. Selecione uma categoria (ex: Alimentação)
3. Valor Planejado: `1000.00`
4. Clique em **"Adicionar"**

**✅ O que verificar:**
- [ ] Categoria é adicionada
- [ ] Card da categoria aparece
- [ ] Barra de progresso aparece
- [ ] Percentual usado é calculado
- [ ] Valor restante é exibido

---

### 6️⃣ TESTE CARTÕES (2 min)

Acesse http://localhost:3000/cartoes

1. Clique em **"Novo Cartão"**
2. Preencha:
   - Nome: `Nubank Teste`
   - Tipo: `Crédito`
   - Bandeira: `Mastercard`
   - Limite: `5000.00`
   - Dia Vencimento: `10`
   - Dia Fechamento: `5`
3. Clique em **"Adicionar"**

**✅ O que verificar:**
- [ ] Cartão é criado
- [ ] Aparece na lista
- [ ] Stats atualizam
- [ ] Editar funciona
- [ ] Deletar funciona

---

### 7️⃣ TESTE INVESTIMENTOS (2 min)

Acesse http://localhost:3000/investimentos

1. Clique em **"Novo Investimento"**
2. Preencha:
   - Nome: `Tesouro IPCA+ Teste`
   - Tipo: `Tesouro Direto`
   - Valor Inicial: `1000.00`
   - Valor Atual: `1050.00`
   - Data de Início: (qualquer data)
3. Clique em **"Adicionar"**

**✅ O que verificar:**
- [ ] Investimento é criado
- [ ] Rentabilidade é calculada automaticamente (5%)
- [ ] Stats atualizam
- [ ] Editar funciona
- [ ] Deletar funciona

---

### 8️⃣ TESTE LIXEIRA (2 min)

Acesse http://localhost:3000/lixeira

**✅ O que verificar:**
- [ ] Itens deletados aparecem aqui
- [ ] Botão "Restaurar" funciona
- [ ] Item volta para lista original
- [ ] Botão "Deletar Permanentemente" funciona

---

### 9️⃣ TESTE RESPONSIVIDADE (2 min)

1. Pressione **F12** para abrir DevTools
2. Clique no ícone de **dispositivo móvel** (Toggle device toolbar)
3. Teste diferentes tamanhos:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Desktop (1920x1080)

**✅ O que verificar em cada tamanho:**
- [ ] Layout se adapta
- [ ] Sidebar vira menu em mobile
- [ ] Botões são acessíveis
- [ ] Formulários são usáveis
- [ ] Tabelas rolam horizontalmente se necessário

---

### 🔟 TESTE TEMA CLARO/ESCURO (1 min)

1. Procure o botão de alternar tema (geralmente no header ou sidebar)
2. Clique para alternar entre claro e escuro

**✅ O que verificar:**
- [ ] Tema alterna corretamente
- [ ] Todas as cores se adaptam
- [ ] Textos são legíveis em ambos os temas
- [ ] Preferência é salva (recarregue a página)

---

## 🎯 CHECKLIST FINAL

### Funcionalidades Testadas
- [ ] Login
- [ ] Dashboard
- [ ] CRUD de Gastos (Create, Read, Update, Delete)
- [ ] CRUD de Categorias
- [ ] Orçamento
- [ ] Cartões
- [ ] Investimentos
- [ ] Lixeira (Restore)
- [ ] Responsividade
- [ ] Tema Claro/Escuro

### Performance
- [ ] Páginas carregam rápido (< 3s)
- [ ] Sem erros no console (F12 > Console)
- [ ] Loading states aparecem
- [ ] Navegação é fluida

---

## 🐛 BUGS ENCONTRADOS

Liste aqui qualquer bug encontrado:

```
1.
2.
3.
```

---

## 💡 OBSERVAÇÕES E SUGESTÕES

```


```

---

## ✅ PÁGINAS ADICIONAIS PARA TESTAR (Se tiver tempo)

Se quiser testar mais funcionalidades:

- [ ] /parcelas - Parcelas
- [ ] /salarios - Salários
- [ ] /tags - Tags
- [ ] /metas - Metas
- [ ] /dividas - Dívidas
- [ ] /assinaturas - Assinaturas
- [ ] /contas-fixas - Contas Fixas
- [ ] /gasolina - Gasolina
- [ ] /mesada - Mesada
- [ ] /relatorios - Relatórios
- [ ] /analytics - Analytics
- [ ] /configuracoes - Configurações
- [ ] /profile - Perfil

**Cada uma dessas páginas tem CRUD similar ao que você testou!**

---

## 📊 RESULTADO FINAL

**Status Geral:** [ ] ✅ Tudo OK  |  [ ] ⚠️ Problemas Menores  |  [ ] ❌ Problemas Graves

**Taxa de Sucesso:** ____%

**Pronto para Produção?** [ ] Sim  |  [ ] Não

---

**Testado em:** ___/___/_____
**Navegador:** Chrome / Edge / Firefox / Safari
**Tempo Total de Teste:** ___ minutos

---

## 🎉 PARABÉNS!

Se todos os testes passaram, seu sistema está funcionando perfeitamente!

**Próximos passos:**
1. Deploy em produção (Vercel recomendado)
2. Configurar domínio personalizado
3. Configurar Stripe em modo produção
4. Monitorar erros com Sentry (opcional)

---

**Sistema desenvolvido com Next.js 15, React 18, TypeScript, Tailwind CSS e Supabase**
**Versão:** 3.0.1
