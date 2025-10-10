# 🔧 **Instalar Stripe CLI - Guia Rápido**

## 📥 **Opção 1: Instalação Manual (RECOMENDADO)**

### **Passo 1: Baixar o Instalador**
1. Acesse: https://github.com/stripe/stripe-cli/releases/latest
2. Procure por: **`stripe_X.X.X_windows_x86_64.msi`** (exemplo: `stripe_1.21.8_windows_x86_64.msi`)
3. Clique para baixar o arquivo `.msi`

### **Passo 2: Instalar**
1. Localize o arquivo baixado (geralmente em `Downloads`)
2. **Dê duplo clique** no arquivo `.msi`
3. Siga o assistente de instalação
4. Clique em **"Next" → "Next" → "Install"**
5. Aguarde a instalação concluir
6. Clique em **"Finish"**

### **Passo 3: Verificar Instalação**
Abra um **novo terminal PowerShell** e execute:
```powershell
stripe --version
```

Se aparecer a versão (exemplo: `stripe version 1.21.8`), está instalado! ✅

---

## 🚀 **Opção 2: Usar NPX (Alternativa Rápida)**

Se a instalação manual não funcionar, você pode usar o Stripe CLI via NPX:

```bash
npx stripe login
npx stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## ⚡ **Próximos Passos (Após Instalar):**

### **1. Fazer Login no Stripe CLI:**
```bash
stripe login
```
- Uma janela do navegador vai abrir
- Faça login na sua conta Stripe
- Autorize o acesso

### **2. Configurar o Webhook Secret:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
- Este comando vai gerar um **webhook signing secret** que começa com `whsec_`
- **COPIE** esse valor e adicione ao `.env.local`:
  ```env
  STRIPE_WEBHOOK_SECRET=whsec_SEU_VALOR_AQUI
  ```

### **3. Manter o Stripe Listen Rodando:**
- Deixe este comando rodando em um terminal separado
- Ele vai encaminhar os eventos do Stripe para seu servidor local
- Toda vez que houver um pagamento, ele vai aparecer no terminal

---

## 🎯 **Resumo:**
1. ✅ Baixar `.msi` do GitHub
2. ✅ Instalar clicando duas vezes
3. ✅ Verificar com `stripe --version`
4. ✅ Fazer login com `stripe login`
5. ✅ Iniciar escuta com `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
6. ✅ Copiar `whsec_` para `.env.local`

---

## 📌 **Links Úteis:**
- **Download:** https://github.com/stripe/stripe-cli/releases/latest
- **Documentação:** https://docs.stripe.com/stripe-cli
- **Webhooks Locais:** https://docs.stripe.com/webhooks/test

---

## ⚠️ **Importante:**
- O Stripe CLI substitui a necessidade de configurar webhooks no Dashboard **para desenvolvimento local**
- Para **produção**, você ainda precisará configurar o webhook no Dashboard do Stripe

