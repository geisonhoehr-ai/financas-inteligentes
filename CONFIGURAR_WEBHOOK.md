# 🔗 Configurar Webhook do Stripe

## 🎯 **Passo a Passo:**

### 1️⃣ **Acesse o Stripe Dashboard:**
- Vá em [dashboard.stripe.com](https://dashboard.stripe.com)
- **Developers** → **Webhooks**

### 2️⃣ **Adicione Endpoint:**
- Clique em **"Add endpoint"**
- **Endpoint URL:** `http://localhost:3000/api/webhooks/stripe`
- **Description:** "Webhook de assinaturas"

### 3️⃣ **Selecione Eventos:**
Escolha estes eventos:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### 4️⃣ **Copie o Signing Secret:**
- Após criar, copie o **Signing Secret** (começa com `whsec_...`)

### 5️⃣ **Atualize .env.local:**
```env
STRIPE_WEBHOOK_SECRET=whsec_seu-webhook-secret-aqui
```

### 6️⃣ **Reinicie o servidor:**
```bash
npm run dev
```

## 🧪 **Teste:**
1. Faça outro pagamento de teste
2. Verifique se o usuário fica Pro automaticamente
3. Confirme no Supabase que o plano foi atualizado

## 🎯 **Resultado Esperado:**
- ✅ Usuário paga no Stripe
- ✅ Webhook recebe evento
- ✅ Sistema atualiza plano para Pro
- ✅ Usuário tem acesso a recursos ilimitados
