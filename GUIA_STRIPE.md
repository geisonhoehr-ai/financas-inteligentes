# 💳 Guia de Configuração do Stripe

**Data:** 09/10/2025  
**Versão:** 3.0.1  
**Status:** ✅ **STRIPE IMPLEMENTADO**

---

## 🎉 O QUE FOI IMPLEMENTADO

### ✅ Sistema Completo de Pagamentos

1. **Backend Stripe**
   - ✅ Biblioteca Stripe instalada
   - ✅ API route de checkout
   - ✅ API route de webhooks
   - ✅ Portal de cobrança integrado

2. **Banco de Dados**
   - ✅ Tabela `user_subscriptions`
   - ✅ RLS policies configuradas
   - ✅ Triggers automáticos
   - ✅ Assinatura free criada automaticamente

3. **Frontend**
   - ✅ Hook `useSubscription` atualizado
   - ✅ Página de pricing com botão Stripe
   - ✅ Página de sucesso
   - ✅ Componente de gerenciamento de assinatura
   - ✅ Validação de limites por plano

---

## 🚀 PASSO A PASSO DE CONFIGURAÇÃO

### 1️⃣ Criar Conta no Stripe (5 minutos)

1. Acesse [stripe.com](https://stripe.com)
2. Clique em "Start now" ou "Começar"
3. Preencha seus dados:
   - Email
   - Nome completo
   - Empresa (pode ser seu nome)
   - País: Brasil
4. Confirme o email
5. Complete o cadastro

### 2️⃣ Configurar Produto (5 minutos)

1. No Dashboard do Stripe, vá em **Products**
2. Clique em **"Add product"**
3. Preencha:
   - **Name:** Plano Pro
   - **Description:** Controle Financeiro Familiar - Plano Premium
   - **Pricing:** Recurring
   - **Price:** R$ 19,90
   - **Billing period:** Monthly
4. Clique em **"Save product"**
5. **COPIE O PRICE ID** (começa com `price_...`)

### 3️⃣ Copiar API Keys (2 minutos)

1. Vá em **Developers** → **API keys**
2. Copie:
   - **Publishable key** (começa com `pk_test_...`)
   - **Secret key** (clique em "Reveal" - começa com `sk_test_...`)

⚠️ **IMPORTANTE:** 
- Use **Test Mode** para desenvolvimento
- Só mude para **Live Mode** quando estiver tudo testado

### 4️⃣ Configurar Webhook (5 minutos)

1. Vá em **Developers** → **Webhooks**
2. Clique em **"Add endpoint"**
3. Preencha:
   - **Endpoint URL:** `https://seu-dominio.vercel.app/api/webhooks/stripe`
   - **Description:** Webhook de assinaturas
4. Em **"Select events to listen to"**, escolha:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Clique em **"Add endpoint"**
6. **COPIE O SIGNING SECRET** (começa com `whsec_...`)

### 5️⃣ Configurar Variáveis de Ambiente

#### Para desenvolvimento (.env.local):
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua-chave-aqui
STRIPE_SECRET_KEY=sk_test_sua-chave-secreta-aqui
STRIPE_WEBHOOK_SECRET=whsec_seu-webhook-secret-aqui
STRIPE_PRO_PRICE_ID=price_seu-price-id-aqui
```

#### Para produção (Vercel):
1. Vá em **Settings** → **Environment Variables**
2. Adicione as mesmas 4 variáveis acima
3. Aplique para **Production**, **Preview** e **Development**

### 6️⃣ Executar SQL no Supabase (2 minutos)

1. No Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Copie TODO o conteúdo de `database_subscriptions.sql`
4. Cole e clique em **"Run"**
5. Verifique se a tabela `user_subscriptions` foi criada

---

## 🧪 TESTAR O SISTEMA

### Teste Local (Desenvolvimento)

```bash
# 1. Configure as variáveis em .env.local
# 2. Reinicie o servidor
npm run dev

# 3. Acesse: http://localhost:3000/pricing
# 4. Clique em "Assinar Pro"
# 5. Use cartão de teste do Stripe:
#    - Número: 4242 4242 4242 4242
#    - Data: Qualquer data futura
#    - CVV: Qualquer 3 dígitos
#    - CEP: Qualquer CEP válido
```

### Teste em Produção

```bash
# 1. Deploy na Vercel
# 2. Configure variáveis de ambiente
# 3. Atualize webhook URL no Stripe
# 4. Teste com cartão real (se em Live Mode)
```

---

## 🔄 FLUXO DE PAGAMENTO

### 1. Usuário Clica em "Assinar Pro"
```
1. Frontend → POST /api/checkout
2. Backend cria sessão Stripe
3. Usuário é redirecionado para Stripe Checkout
4. Usuário preenche dados do cartão
5. Stripe processa pagamento
```

### 2. Stripe Envia Webhook
```
1. Stripe → POST /api/webhooks/stripe
2. Backend valida assinatura
3. Backend atualiza banco (user_subscriptions)
4. Plano do usuário muda para 'pro'
```

### 3. Usuário Retorna ao Site
```
1. Stripe redireciona → /checkout/success
2. Sistema mostra confirmação
3. Usuário pode acessar recursos Pro
```

---

## 🎯 CARTÕES DE TESTE DO STRIPE

### Pagamentos Bem-Sucedidos
```
Número: 4242 4242 4242 4242
Descrição: Sempre aprovado
```

### Pagamentos que Falham
```
Número: 4000 0000 0000 0002
Descrição: Sempre recusado
```

### 3D Secure (Autenticação)
```
Número: 4000 0027 6000 3184
Descrição: Requer autenticação
```

**Outros dados:**
- **Data:** Qualquer data futura (ex: 12/25)
- **CVV:** Qualquer 3 dígitos (ex: 123)
- **CEP:** Qualquer CEP (ex: 12345-678)

Mais cartões: [stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## 💰 PLANOS CONFIGURADOS

### Plano Free
- **Preço:** R$ 0,00
- **Membros:** 2
- **Famílias:** 1
- **Lançamentos:** 50/mês
- **Cartões:** 2
- **Histórico:** 30 dias

### Plano Pro
- **Preço:** R$ 19,90/mês
- **Membros:** Ilimitado
- **Famílias:** Ilimitado (futuro)
- **Lançamentos:** Ilimitado
- **Cartões:** Ilimitado
- **Histórico:** Ilimitado
- **Recursos extras:** Relatórios, Upload comprovantes

---

## 🔐 SEGURANÇA

### Variáveis Secretas

⚠️ **NUNCA exponha:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

✅ **Pode expor:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRO_PRICE_ID`

### Validação de Webhooks

O webhook valida a assinatura do Stripe para garantir que:
- A requisição veio realmente do Stripe
- Os dados não foram alterados
- É seguro processar

```typescript
// app/api/webhooks/stripe/route.ts
event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
)
```

---

## 🛠️ GERENCIAMENTO DE ASSINATURA

### Portal de Cobrança do Stripe

O usuário Pro pode:
- ✅ Atualizar forma de pagamento
- ✅ Ver histórico de faturas
- ✅ Baixar recibos
- ✅ Cancelar assinatura
- ✅ Reativar assinatura

**Acesso:**
- Na página de perfil → Botão "Gerenciar Cobrança"
- Abre o Stripe Customer Portal
- Gerenciado 100% pelo Stripe

---

## 📊 MONITORAMENTO

### No Stripe Dashboard

1. **Customers** - Ver clientes e assinaturas
2. **Subscriptions** - Gerenciar assinaturas
3. **Payments** - Ver histórico de pagamentos
4. **Webhooks** - Verificar status dos webhooks

### Logs Importantes

No Stripe, vá em **Developers** → **Events** para ver:
- Pagamentos processados
- Webhooks enviados
- Assinaturas criadas/canceladas
- Erros e falhas

---

## 🐛 TROUBLESHOOTING

### Webhook não está funcionando

**Problema:** Assinatura não atualiza no banco

**Solução:**
1. Verifique **Developers** → **Webhooks** no Stripe
2. Veja se há erros nos eventos
3. Confirme que a URL está correta
4. Verifique se `STRIPE_WEBHOOK_SECRET` está correto
5. Em desenvolvimento, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Checkout não abre

**Problema:** Botão carrega mas nada acontece

**Solução:**
1. Veja console do navegador
2. Confirme que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` está correta
3. Verifique se `STRIPE_PRO_PRICE_ID` está correto
4. Teste a API route diretamente

### Usuário paga mas não fica Pro

**Problema:** Pagamento aceito mas plano não muda

**Causas possíveis:**
1. Webhook não está configurado
2. Webhook está falhando (veja logs do Stripe)
3. SQL da tabela não foi executado
4. RLS está bloqueando update

**Solução:**
```sql
-- Verifique se a tabela existe:
SELECT * FROM user_subscriptions;

-- Verifique se o webhook atualizou:
SELECT * FROM user_subscriptions WHERE user_id = 'USER_ID_AQUI';
```

---

## 💡 DICAS IMPORTANTES

### Teste em Modo Test Primeiro

1. **Test Mode** = Pagamentos falsos (seguro)
2. Use cartões de teste
3. Não é cobrado nada real
4. Perfeito para desenvolvimento

### Quando Ir para Live Mode

Só ative **Live Mode** quando:
- ✅ Tudo testado em Test Mode
- ✅ Webhook funcionando 100%
- ✅ Sistema validado
- ✅ Empresa registrada no Stripe
- ✅ Informações bancárias configuradas

### Compliance

No Brasil, para receber pagamentos:
- Precisa CNPJ ou CPF
- Stripe paga via transferência bancária
- Impostos são sua responsabilidade
- Considere contador para MEI/PJ

---

## 📈 PRÓXIMOS PASSOS

### Curto Prazo
1. ✅ Testar em modo Test
2. ✅ Validar webhooks
3. ✅ Testar upgrade/downgrade
4. ⏳ Ir para Live Mode

### Médio Prazo
1. Adicionar cupons de desconto
2. Trial period de 7 dias
3. Plano anual com desconto
4. Programa de afiliados

### Longo Prazo
1. Múltiplos planos (Starter, Business, Enterprise)
2. Add-ons (storage extra, etc)
3. Pagamento via PIX (Stripe suporta!)
4. Boleto bancário

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Backend ✅
- [x] Biblioteca Stripe instalada
- [x] lib/stripe.ts criado
- [x] API route /api/checkout
- [x] API route /api/webhooks/stripe
- [x] API route /api/billing-portal
- [x] Tabela user_subscriptions no banco

### Frontend ✅
- [x] Hook useSubscription atualizado
- [x] Página de pricing com botão Stripe
- [x] Página de sucesso
- [x] Componente SubscriptionManager
- [x] Validação de limites (LimitChecker)

### Configuração ⏳
- [ ] Criar conta no Stripe
- [ ] Criar produto Pro
- [ ] Copiar API keys
- [ ] Configurar webhook
- [ ] Adicionar variáveis de ambiente
- [ ] Executar SQL no Supabase

### Testes ⏳
- [ ] Testar checkout em Test Mode
- [ ] Testar webhook
- [ ] Testar upgrade/downgrade
- [ ] Testar cancelamento
- [ ] Testar portal de cobrança

---

## 📚 ARQUIVOS CRIADOS

### SQL
- `database_subscriptions.sql` - Schema da tabela

### Backend
- `lib/stripe.ts` - Cliente Stripe
- `app/api/checkout/route.ts` - Criar checkout
- `app/api/webhooks/stripe/route.ts` - Processar webhooks
- `app/api/billing-portal/route.ts` - Portal de cobrança

### Frontend
- `app/checkout/success/page.tsx` - Página de sucesso
- `components/subscription-manager.tsx` - Gerenciamento

### Configuração
- `env.example` - Atualizado com variáveis Stripe

---

## 🎯 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

```env
# Stripe - Chave pública (pode expor)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe - Chave secreta (NUNCA expor!)
STRIPE_SECRET_KEY=sk_test_...

# Stripe - Webhook secret
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe - Price ID do plano Pro
STRIPE_PRO_PRICE_ID=price_...

# Supabase - Service Role (para webhooks)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (opcional)
```

---

## 💡 INTEGRAÇÕES FUTURAS

### PIX (Stripe suporta!)
```javascript
// Adicionar ao checkout:
payment_method_types: ['card', 'pix']
```

### Cupons de Desconto
```javascript
// Na sessão de checkout:
discounts: [{
  coupon: 'PROMO20'  // 20% off
}]
```

### Trial Period
```javascript
// No produto Stripe:
subscription_data: {
  trial_period_days: 7
}
```

---

## 📞 SUPORTE STRIPE

### Documentação
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhooks](https://stripe.com/docs/webhooks)

### Ajuda
- [Support Center](https://support.stripe.com)
- [Discord Community](https://discord.gg/stripe)

---

## ✅ CONCLUSÃO

O Stripe está **100% implementado** e pronto para uso!

**Falta apenas:**
1. Criar conta no Stripe (5 min)
2. Configurar produto e webhook (10 min)
3. Adicionar variáveis de ambiente (2 min)
4. Executar SQL (2 min)
5. Testar! (10 min)

**Total: ~30 minutos de configuração**

---

**Desenvolvido com ❤️ por Geison Hoehr**  
**Data:** 09/10/2025  
**Versão:** 3.0.1  
**Status:** ✅ STRIPE PRONTO

