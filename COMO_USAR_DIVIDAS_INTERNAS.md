# 🎯 Como Usar o Sistema de Dívidas Internas

## 📖 Cenário Real

**Problema**: Você estourou o limite do cartão e fez uma compra parcelada no cartão da sua esposa. A dívida é sua, mas está no cartão dela.

**Solução**: Sistema de Dívidas Internas! 🎉

---

## 🚀 Passo a Passo

### 1. Criar uma Família

Antes de usar dívidas internas, você precisa ter uma família criada:

1. Vá em **Configurações** no menu lateral
2. Clique em **"Criar Nova Família"**
3. Escolha o tipo: **Família** ou **Empresa**
4. Dê um nome (ex: "Família Silva")
5. Clique em **"Criar Família"**

### 2. Adicionar sua Esposa à Família

1. Em **Configurações**, encontre sua família
2. Copie o **Código de Convite** (ex: `FAM-ABC123`)
3. Envie o código para sua esposa
4. Ela acessa: `https://seu-app.vercel.app/convite/FAM-ABC123`
5. Ela faz login e aceita o convite
6. Pronto! Agora vocês são uma família no sistema 👨‍👩‍👧‍👦

### 3. Registrar a Compra Parcelada

**Cenário**: Comprou uma TV de R$ 3.000,00 em 12x no cartão dela, mas a dívida é sua.

#### Opção A: Registrar o Gasto Completo

1. Vá em **Gastos** → **"Novo Gasto"**
2. Preencha:
   - **Descrição**: TV Samsung 55"
   - **Valor**: R$ 3.000,00
   - **Categoria**: Eletrônicos
   - **Forma de Pagamento**: Cartão de Crédito
   - **Data**: Data da compra
3. Clique em **"Configurar Responsabilidade"** ⬇️
4. **Pago Por**: Maria (sua esposa)
5. **Responsável Por**: Você
6. Clique em **"Adicionar"**

✅ **Resultado**: Uma dívida interna de R$ 3.000,00 é criada automaticamente!

#### Opção B: Registrar Parcelas Mensais

Para cada parcela de R$ 250,00:

1. **Novo Gasto** → **"TV Samsung 55" - Parcela 1/12**
2. **Valor**: R$ 250,00
3. **Pago Por**: Maria
4. **Responsável Por**: Você
5. Repetir para cada parcela

✅ **Resultado**: 12 dívidas de R$ 250,00 criadas!

### 4. Visualizar Suas Dívidas

1. Vá em **Dívidas** no menu lateral
2. Você verá:
   - **Saldo Líquido**: Quanto você deve no total
   - **Você Deve**: Lista de todas as dívidas que você tem
   - **Você Recebe**: Lista de dívidas que outros têm com você

**Exemplo de visualização**:
```
┌─────────────────────────────────────┐
│ Você Deve                           │
├─────────────────────────────────────┤
│ Maria: R$ 250,00                    │
│ Ref: TV Samsung 55" - Parcela 1/12  │
│ Vence em: 05/11/2025                │
│                                     │
│ [✓ Marcar como Paga]  [✗ Cancelar] │
└─────────────────────────────────────┘
```

### 5. Marcar Dívida como Paga

Quando você pagar (PIX, transferência, dinheiro):

1. Encontre a dívida na lista **"Você Deve"**
2. Clique no botão **✓ verde**
3. Confirme o pagamento
4. A dívida some da lista de pendentes

---

## 💡 Casos de Uso Avançados

### Caso 1: Dividir Conta do Restaurante

**Cenário**: Jantar em família, você pagou R$ 200,00, mas é conta de todos.

1. Registre o gasto normalmente
2. **Pago Por**: Você
3. Clique em **"Dividir entre membros"** (em desenvolvimento)
4. Defina:
   - Você: 50% (R$ 100)
   - Maria: 30% (R$ 60)
   - Filho: 20% (R$ 40)

✅ **Resultado**: Maria deve R$ 60, Filho deve R$ 40

### Caso 2: Reembolso de Farmácia

**Cenário**: Sua esposa comprou remédios para você na farmácia.

1. **Novo Gasto** → **"Remédios"**
2. **Valor**: R$ 85,00
3. **Pago Por**: Maria
4. **Responsável Por**: Você
5. Quando você pagar de volta, marque como paga

### Caso 3: Mesada dos Filhos

**Cenário**: Seu filho pegou dinheiro emprestado para o cinema.

1. Vá em **Dívidas** → **"Registrar Dívida"** (manual)
2. **Credor**: Você
3. **Devedor**: Filho
4. **Valor**: R$ 40,00
5. **Descrição**: "Empréstimo para cinema"

---

## 📊 Entendendo o Saldo Líquido

O sistema calcula automaticamente o saldo entre todas as pessoas:

**Exemplo**:
- Você deve R$ 250 para Maria
- Maria deve R$ 100 para você
- **Saldo**: Você deve R$ 150 (líquido)

O sistema **otimiza** os pagamentos para minimizar transferências!

---

## 🎨 Recursos Visuais

### Dashboard Principal
No dashboard, você verá um card com:
```
┌─────────────────────────────┐
│ Dívidas Internas            │
├─────────────────────────────┤
│ Você deve: R$ 255,00        │
│ Você recebe: R$ 40,00       │
│ Saldo: -R$ 215,00           │
└─────────────────────────────┘
```

### Notificações
- Quando alguém registra uma dívida com você
- Lembretes de dívidas próximas do vencimento
- Confirmação quando alguém marca dívida como paga

---

## 🔒 Segurança e Privacidade

### Quem Pode Ver?
- Apenas membros da **mesma família** veem as dívidas daquela família
- Membros de outras famílias **não** têm acesso

### Quem Pode Fazer O Quê?
- **Credor**: Pode ver, editar, cancelar a dívida
- **Devedor**: Pode ver, marcar como paga
- **Admin da Família**: Pode gerenciar todas as dívidas
- **Outros membros**: Não veem dívidas entre outros

---

## 🛠️ Configuração no Banco de Dados

### Executar SQL
Para ativar o sistema, execute este arquivo SQL no Supabase:

1. Acesse o Supabase → **SQL Editor**
2. Abra o arquivo `SQL_DIVIDAS_INTERNAS.sql`
3. Clique em **"Run"**
4. Aguarde a confirmação de sucesso

### O que é criado?
- ✅ Campos `pago_por` e `responsavel_por` em `gastos`
- ✅ Tabela `dividas_internas`
- ✅ Triggers automáticos para criar dívidas
- ✅ Views de resumo e consolidação
- ✅ Funções RPC para operações
- ✅ Políticas RLS de segurança

---

## 🎯 Fluxo Completo de Exemplo

### Situação Real
João e Maria são casados. João estourou o cartão e comprou uma TV parcelada no cartão da Maria.

**Passo 1**: João cria a família "Silva"
```
Família: Silva
Tipo: Família
Admin: João
```

**Passo 2**: Maria aceita o convite
```
Código: FAM-ABC123
Maria entra na família
```

**Passo 3**: João registra a compra
```
Gasto: TV Samsung 55"
Valor: R$ 3.000,00 (12x R$ 250,00)
Pago por: Maria
Responsável: João
```

**Passo 4**: Sistema cria dívida automaticamente
```
Dívida Criada:
- Credor: Maria
- Devedor: João
- Valor: R$ 3.000,00
- Status: Pendente
```

**Passo 5**: João visualiza no dashboard
```
Dashboard > Dívidas
Você deve: R$ 3.000,00 para Maria
```

**Passo 6**: João paga a parcela mensal
```
Todo mês: João marca R$ 250 como pago
Saldo atualiza automaticamente
```

---

## 📱 Acesso Rápido

- **Ver suas dívidas**: Menu → Dívidas
- **Registrar gasto com responsabilidade**: Gastos → Novo Gasto → Configurar Responsabilidade
- **Marcar como paga**: Dívidas → Botão ✓ verde
- **Ver resumo**: Dashboard (card de dívidas)

---

## 🆘 Perguntas Frequentes

### 1. Posso deletar uma dívida?
Sim! Apenas o credor ou admin da família pode deletar/cancelar.

### 2. E se eu errei ao criar a dívida?
O credor pode cancelar a dívida e criar uma nova corretamente.

### 3. Posso ter dívidas em múltiplas famílias?
Sim! Se você faz parte da "Família" e também da "Empresa", as dívidas são separadas.

### 4. Como acertar dívidas complexas?
O sistema calcula o **saldo líquido** automaticamente, mostrando quanto realmente precisa ser transferido.

### 5. Posso anexar comprovante de pagamento?
Sim! (Funcionalidade em desenvolvimento)

---

## 🎉 Benefícios

✅ **Transparência**: Todos sabem quem deve o quê
✅ **Organização**: Não precisa anotar em papel
✅ **Automático**: Dívidas criadas automaticamente
✅ **Justo**: Divisão clara de responsabilidades
✅ **Prático**: Marcar como pago é só um clique
✅ **Familiar**: Perfeito para famílias e empresas

---

## 🔮 Próximos Recursos (Em Desenvolvimento)

- [ ] Divisão percentual automática de gastos
- [ ] Notificações push de novas dívidas
- [ ] Integração com PIX para pagamentos
- [ ] Histórico completo de acertos
- [ ] Gráficos de dívidas ao longo do tempo
- [ ] Recorrência de dívidas (ex: mesada)
- [ ] Export de relatório de dívidas (PDF)

---

**🎯 Pronto! Agora você pode controlar as dívidas internas da sua família de forma organizada e transparente!**

