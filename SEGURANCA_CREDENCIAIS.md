# 🔐 AÇÃO URGENTE: Rotacionar Credenciais

## ⚠️ PROBLEMA IDENTIFICADO

As credenciais do Supabase e Stripe foram expostas no repositório Git. É **CRÍTICO** rotacionar todas as chaves imediatamente.

## 🚨 AÇÕES IMEDIATAS NECESSÁRIAS

### 1. Rotacionar Chaves do Supabase

#### a) Criar Novo Projeto ou Resetar Chaves
1. Acesse: https://app.supabase.com/project/sfemmeczjhleyqeegwhs/settings/api
2. **OPÇÃO A (Recomendado)**: Criar novo projeto
   - Backup do banco de dados atual
   - Criar novo projeto
   - Restaurar backup
   - Atualizar todas as referências

3. **OPÇÃO B**: Reset das chaves (se disponível)
   - Procurar opção "Reset API Keys"
   - Seguir instruções do Supabase

#### b) Atualizar .env.local
```bash
# Copie .env.example para .env.local
cp .env.example .env.local

# Edite .env.local com as NOVAS credenciais
```

### 2. Rotacionar Chaves do Stripe

1. Acesse: https://dashboard.stripe.com/apikeys
2. Clique em "Reveal test key" e depois "Roll key"
3. Gerar novas:
   - Publishable key
   - Secret key
   - Webhook secret (se já configurado)
4. Atualizar .env.local

### 3. Limpar Histórico Git (Opcional mas Recomendado)

```bash
# ⚠️ ATENÇÃO: Isso reescreve o histórico do Git
# Faça backup antes!

# Opção 1: Usar BFG Repo-Cleaner
java -jar bfg.jar --delete-files .env.local

# Opção 2: git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Depois:
git push origin --force --all
```

### 4. Verificar Acessos Suspeitos

1. **Supabase**: Verifique logs de acesso
   - https://app.supabase.com/project/sfemmeczjhleyqeegwhs/logs

2. **Stripe**: Verifique transações
   - https://dashboard.stripe.com/test/payments

3. Procure por:
   - Acessos de IPs desconhecidos
   - Transações não autorizadas
   - Mudanças inesperadas no banco

## ✅ CHECKLIST DE SEGURANÇA

- [ ] Novas chaves do Supabase geradas
- [ ] Novas chaves do Stripe geradas
- [ ] .env.local atualizado com novas credenciais
- [ ] .env.local adicionado ao .gitignore (já feito ✅)
- [ ] Histórico Git limpo (opcional)
- [ ] Logs verificados por acessos suspeitos
- [ ] Deploy atualizado com novas credenciais
- [ ] Equipe notificada sobre a troca

## 📝 BOAS PRÁTICAS PARA O FUTURO

1. **NUNCA** commite arquivos .env*
2. Use `.env.example` como template
3. Configure secrets no CI/CD (Vercel, GitHub Actions)
4. Rotacione chaves periodicamente (a cada 3-6 meses)
5. Use diferentes chaves para dev/staging/production
6. Ative 2FA em todas as contas de serviço
7. Monitore logs de acesso regularmente

## 🆘 EM CASO DE DÚVIDAS

Se precisar de ajuda, entre em contato imediatamente. Segurança não pode esperar!
