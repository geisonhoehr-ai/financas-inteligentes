# 💰 GUIA: Como Registrar Pagamentos de Dívidas via PIX

## 📋 Cenário: Alguém me deve dinheiro e pagou no PIX

### 🎯 Fluxo Completo

---

## PASSO 1: Registrar a Dívida (se ainda não registrou)

### Quando usar:
- Você emprestou dinheiro para alguém da família
- Alguém deve uma parte de uma compra que você fez
- Você pagou por alguém e quer registrar

### Como fazer:
1. Acesse **"Dívidas"** no menu lateral
2. Clique em **"Registrar Dívida"**
3. Preencha:
   - **Descrição:** Ex: "Empréstimo João"
   - **Valor:** Ex: R$ 500,00
   - **Quem deve:** Selecione o membro da família
   - **Data de vencimento:** Quando deve pagar
4. Clique em **"Registrar"**

---

## PASSO 2: Quando a Pessoa Pagar via PIX

### Você tem 2 opções:

### ✅ OPÇÃO 1: Marcar como Paga SEM Comprovante
**Use quando:** Confia na pessoa, não precisa de comprovante

1. Na lista de **"Você Recebe"** → encontre a dívida
2. Clique no botão **✓ (check/marcar como paga)**
3. Pronto! A dívida será marcada como quitada

### ✅ OPÇÃO 2: Marcar como Paga COM Comprovante PIX
**Use quando:** Quer guardar print do pagamento

1. Na lista de **"Você Recebe"** → encontre a dívida
2. Clique no botão **📤 (Upload)**
3. Selecione o **print do PIX** (screenshot do comprovante)
4. Sistema envia para Supabase Storage
5. Clique em **"Marcar como Paga"**
6. Pronto! Dívida quitada + comprovante salvo

---

## 📊 O Que Acontece no Sistema

### Antes do Pagamento:
```
Card "Você Recebe": R$ 500,00
Saldo Líquido: +R$ 500,00 (verde)
Lista: "João te deve R$ 500,00" (pendente)
```

### Depois do Pagamento:
```
Card "Você Recebe": R$ 0,00
Saldo Líquido: R$ 0,00 (neutro)
Lista: Dívida desaparece ou vai para "Quitadas"
```

---

## 🎯 EXEMPLO PRÁTICO

### Situação: João te deve R$ 300,00 e pagou via PIX

**1. Registrar a dívida (se ainda não fez):**
```
Dívidas → Registrar Dívida
- Descrição: "Empréstimo João"
- Valor: R$ 300,00
- Devedor: João (selecionar da lista de membros)
- Vencimento: hoje
→ Registrar
```

**2. João fez o PIX:**
```
Opção A - Sem comprovante:
- Vá em "Você Recebe"
- Encontre "João - R$ 300,00"
- Clique no ✓ verde
- Confirmar
→ Pronto! Quitado

Opção B - Com comprovante (recomendado):
- Vá em "Você Recebe"
- Encontre "João - R$ 300,00"
- Clique no 📤 (upload)
- Selecione screenshot do PIX
- Upload automático
- Clique em "Marcar como Paga"
→ Pronto! Quitado + comprovante salvo
```

---

## 🔄 OUTRAS SITUAÇÕES

### Se VOCÊ deve e pagou via PIX:
1. Vá em **"Você Deve"**
2. Encontre a dívida
3. Clique em **📤 Upload**
4. Anexe print do comprovante PIX
5. Marcar como paga
6. Outro membro verá o comprovante

### Se pagou PARCIAL:
⚠️ **Atualmente não suportado**
- Sistema marca dívida como 100% paga ou pendente
- Futura feature: pagamentos parciais

---

## 💡 DICAS

### Para ter controle melhor:
1. ✅ **SEMPRE anexe comprovante PIX**
   - Evita confusão
   - Histórico de pagamentos
   - Prova em caso de discussão

2. ✅ **Registre IMEDIATAMENTE**
   - Quando emprestar: registre na hora
   - Quando receber: marque como pago na hora

3. ✅ **Use descrições claras**
   - ❌ "Empréstimo"
   - ✅ "Empréstimo João - Feira 08/10"

---

## 🏦 FLUXO VISUAL

```
┌─────────────────────────────────────┐
│  VOCÊ EMPRESTA R$ 500 PARA JOÃO     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Dívidas → Registrar Dívida         │
│  Devedor: João                       │
│  Valor: R$ 500,00                    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Card "Você Recebe": R$ 500,00      │
│  Lista: João te deve R$ 500,00      │
└──────────────┬──────────────────────┘
               ↓
       JOÃO FAZ PIX DE R$ 500
               ↓
┌─────────────────────────────────────┐
│  Você abre notificação PIX          │
│  Tira screenshot do comprovante     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Dívidas → "Você Recebe"            │
│  Clica 📤 ao lado da dívida do João │
│  Upload do print do PIX             │
│  Marcar como Paga                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  ✅ DÍVIDA QUITADA!                 │
│  Card "Você Recebe": R$ 0,00        │
│  Comprovante salvo no sistema       │
└─────────────────────────────────────┘
```

---

## 🚀 RESUMO RÁPIDO

| Situação | Ação |
|----------|------|
| Emprestei dinheiro | Dívidas → Registrar → Devedor = pessoa |
| Recebi PIX do devedor | Dívidas → Você Recebe → Upload → Marcar paga |
| Devo e paguei PIX | Dívidas → Você Deve → Upload → Marcar paga |
| Ver histórico | Dívidas → Ver comprovantes salvos |

---

**Pronto para usar!** 💪

Sistema de dívidas internas 100% funcional com suporte a comprovantes PIX!

