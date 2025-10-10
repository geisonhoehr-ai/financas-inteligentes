# 🧪 Guia de Teste do Stripe

**Data:** 09/10/2025  
**Status:** ✅ **PRONTO PARA TESTE**

---

## 🚀 TESTE RÁPIDO (5 minutos)

### 1️⃣ Configure as Variáveis

Crie/edite `.env.local`:
```env
# Stripe - Test Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua-chave-aqui
STRIPE_SECRET_KEY=sk_test_sua-chave-secreta-aqui
STRIPE_WEBHOOK_SECRET=whsec_seu-webhook-secret-aqui
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_seu-price-id-aqui

# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 2️⃣ Execute o SQL no Supabase

No **SQL Editor** do Supabase, execute:
```sql
-- Copie TODO o conteúdo de database_subscriptions.sql
-- e cole aqui, depois clique em "Run"
```

### 3️⃣ Inicie o Servidor

```bash
npm run dev
```

### 4️⃣ Teste o Checkout

**Opção A - Página de Teste:**
```
http://localhost:3000/teste-stripe.html
```

**Opção B - Página Real:**
```
http://localhost:3000/pricing
```

### 5️⃣ Use Cartão de Teste

```
Número: 4242 4242 4242 4242
Data: 12/25
CVV: 123
CEP: 12345-678
Nome: Qualquer nome
```

---

## 🎯 FLUXO COMPLETO DE TESTE

### 1. Usuário Clica "Assinar Pro"
- ✅ Botão mostra loading
- ✅ Chama `/api/checkout`
- ✅ Cria sessão no Stripe

### 2. Redireciona para Stripe
- ✅ Página segura do Stripe
- ✅ Formulário de pagamento
- ✅ Usuário preenche cartão

### 3. Stripe Processa Pagamento
- ✅ Valida cartão
- ✅ Cria assinatura
- ✅ Envia webhook

### 4. Webhook Atualiza Banco
- ✅ Recebe evento do Stripe
- ✅ Valida assinatura
- ✅ Atualiza `user_subscriptions`
- ✅ Usuário vira Pro

### 5. Usuário Retorna
- ✅ Página de sucesso
- ✅ Pode acessar recursos Pro
- ✅ Portal de cobrança disponível

---

## 🔍 VERIFICAÇÕES IMPORTANTES

### ✅ Checkout Funcionando
```bash
# Console do navegador não deve mostrar erros
# Botão deve redirecionar para Stripe
# URL deve ser: https://checkout.stripe.com/...
```

### ✅ Webhook Funcionando
```bash
# No Stripe Dashboard → Developers → Webhooks
# Deve mostrar eventos "Delivered" (verde)
# Não deve ter erros
```

### ✅ Banco Atualizado
```sql
-- No Supabase SQL Editor:
SELECT * FROM user_subscriptions WHERE plan = 'pro';
-- Deve retornar o usuário que fez o teste
```

### ✅ Usuário é Pro
```bash
# No app, usuário deve ver:
# - "Plano Pro" no perfil
# - Recursos ilimitados
# - Botão "Gerenciar Cobrança"
```

---

## 🐛 PROBLEMAS COMUNS

### ❌ "Erro ao iniciar checkout"

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Verifique `.env.local`
2. Reinicie o servidor (`npm run dev`)
3. Confirme que as chaves estão corretas

### ❌ "Cliente não encontrado"

**Causa:** Usuário não está logado

**Solução:**
1. Faça login primeiro
2. Ou teste pela página `/pricing` (que tem autenticação)

### ❌ "Webhook Error"

**Causa:** Webhook não configurado ou secret errado

**Solução:**
1. Configure webhook no Stripe
2. URL: `http://localhost:3000/api/webhooks/stripe`
3. Eventos: `checkout.session.completed`, `customer.subscription.*`
4. Copie o signing secret correto

### ❌ Pagamento aceito mas usuário não fica Pro

**Causa:** Webhook não está funcionando

**Solução:**
1. Verifique logs do webhook no Stripe
2. Execute o SQL da tabela `user_subscriptions`
3. Teste o webhook manualmente

---

## 🎮 CARTÕES DE TESTE

### ✅ Pagamentos Bem-Sucedidos
```
4242 4242 4242 4242 - Sempre aprovado
4000 0000 0000 0005 - Sempre aprovado
```

### ❌ Pagamentos que Falham
```
4000 0000 0000 0002 - Sempre recusado
4000 0000 0000 9995 - Sempre recusado
```

### 🔐 3D Secure (Autenticação)
```
4000 0027 6000 3184 - Requer autenticação
4000 0000 0000 3220 - Requer autenticação
```

### 💳 Dados de Teste
```
Data: Qualquer data futura (ex: 12/25)
CVV: Qualquer 3 dígitos (ex: 123)
CEP: Qualquer CEP (ex: 12345-678)
Nome: Qualquer nome
```

---

## 📊 MONITORAMENTO

### Stripe Dashboard
1. **Customers** - Ver clientes criados
2. **Subscriptions** - Ver assinaturas ativas
3. **Payments** - Ver pagamentos processados
4. **Webhooks** - Ver status dos webhooks

### Supabase Dashboard
1. **Table Editor** - Ver `user_subscriptions`
2. **SQL Editor** - Consultar dados
3. **Logs** - Ver erros de API

### Console do Navegador
- Ver erros JavaScript
- Ver requisições de API
- Debug de problemas

---

## 🚀 TESTE EM PRODUÇÃO

### 1. Deploy na Vercel
```bash
# Push para GitHub
git add .
git commit -m "Stripe implementado"
git push

# Deploy automático na Vercel
```

### 2. Configure Variáveis de Produção
```bash
# No Vercel Dashboard:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
```

### 3. Atualize Webhook URL
```bash
# No Stripe Dashboard:
# De: http://localhost:3000/api/webhooks/stripe
# Para: https://seu-dominio.vercel.app/api/webhooks/stripe
```

### 4. Teste com Cartão Real
```bash
# Use seu próprio cartão
# Ou cartão de teste em Live Mode
# Cuidado: pode ser cobrado!
```

---

## ✅ CHECKLIST DE TESTE

### Desenvolvimento
- [ ] Variáveis configuradas
- [ ] SQL executado
- [ ] Servidor rodando
- [ ] Checkout redireciona
- [ ] Webhook funciona
- [ ] Banco atualiza
- [ ] Usuário fica Pro

### Produção
- [ ] Deploy feito
- [ ] Variáveis de produção
- [ ] Webhook URL atualizada
- [ ] Teste com cartão real
- [ ] Monitoramento ativo

---

## 🎯 PRÓXIMOS PASSOS

1. **Teste local** com cartão 4242
2. **Valide webhooks** no Stripe Dashboard
3. **Deploy em produção** na Vercel
4. **Configure Live Mode** no Stripe
5. **Teste com cartão real**
6. **Monitore pagamentos**

---

## 📞 SUPORTE

### Se algo não funcionar:
1. Verifique console do navegador
2. Veja logs do Stripe Dashboard
3. Confirme variáveis de ambiente
4. Teste webhook manualmente
5. Execute SQL da tabela

### Links úteis:
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
- [Checkout Documentation](https://stripe.com/docs/checkout)

---

**Desenvolvido com ❤️ por Geison Hoehr**  
**Data:** 09/10/2025  
**Status:** ✅ **PRONTO PARA TESTE**
