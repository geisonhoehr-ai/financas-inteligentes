# 🚀 Guia de Deploy para Produção

## 📋 Pré-requisitos

Antes de fazer o deploy, certifique-se de que você tem:

- ✅ Conta no [Supabase](https://supabase.com)
- ✅ Conta no [Vercel](https://vercel.com) (recomendado) ou outro provedor
- ✅ Repositório Git (GitHub, GitLab ou Bitbucket)
- ✅ Node.js 18+ instalado localmente para testes

---

## 🗄️ Passo 1: Configurar Supabase

### 1.1 Criar Projeto

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Clique em **"New Project"**
3. Preencha:
   - **Name:** controle-financeiro
   - **Database Password:** (senha forte - guarde em local seguro!)
   - **Region:** Brazil (South America)
4. Aguarde ~2 minutos para o projeto ser criado

### 1.2 Executar Script SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Copie TODO o conteúdo do arquivo `database_setup.sql`
4. Cole no editor e clique em **"Run"**
5. Verifique se todas as tabelas foram criadas sem erros

### 1.3 Configurar Autenticação

1. Vá em **Authentication** → **Providers**
2. Habilite **Email** provider
3. Configurações recomendadas:
   - ✅ Enable email confirmations (produção)
   - ✅ Enable double opt-in (produção)
   - ✅ Secure email change (produção)
   - ⚠️ Para desenvolvimento, você pode desabilitar confirmação de email

### 1.4 Copiar Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (exemplo: `https://abc123.supabase.co`)
   - **anon/public** key (chave pública - pode ser exposta)
   - ⚠️ **NUNCA** compartilhe a **service_role** key

---

## 🌐 Passo 2: Deploy na Vercel (Recomendado)

### 2.1 Preparar Repositório

```bash
# Certifique-se de que está na branch principal
git checkout master

# Commit todas as mudanças
git add .
git commit -m "Preparando para deploy em produção"

# Push para o repositório remoto
git push origin master
```

### 2.2 Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Importe seu repositório do GitHub/GitLab/Bitbucket
4. Configurações:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (padrão)
   - **Output Directory:** .next (padrão)

### 2.3 Configurar Variáveis de Ambiente

1. Na seção **Environment Variables**, adicione:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

2. Aplique para **Production**, **Preview** e **Development**
3. Clique em **"Deploy"**

### 2.4 Aguardar Deploy

- ⏱️ Tempo médio: 2-5 minutos
- ✅ Você receberá uma URL: `https://seu-projeto.vercel.app`
- 🔄 Deploys automáticos a cada push na branch master

---

## 🔧 Passo 3: Configurar Domínio Personalizado (Opcional)

### 3.1 No Vercel

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `financas.seudominio.com`)
3. Configure DNS conforme instruções do Vercel

### 3.2 Atualizar Variáveis

```env
NEXT_PUBLIC_APP_URL=https://financas.seudominio.com
```

---

## 🔐 Passo 4: Configurar Segurança

### 4.1 No Supabase

1. **Authentication** → **URL Configuration**
   - Adicione sua URL de produção em **Site URL**
   - Adicione em **Redirect URLs:**
     - `https://seu-dominio.vercel.app/**`
     - `https://seu-dominio.vercel.app/auth/callback`

2. **Database** → **Roles & Permissions**
   - Verifique que RLS está habilitado em todas as tabelas

### 4.2 Headers de Segurança

O Next.js já inclui headers seguros por padrão:
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security

---

## 📊 Passo 5: Monitoramento

### 5.1 Vercel Analytics

1. Vá em **Analytics** no painel Vercel
2. Ative **Web Analytics** (gratuito)
3. Monitore:
   - Performance
   - Tempo de carregamento
   - Core Web Vitals

### 5.2 Supabase Logs

1. **Logs** → **API Logs**
   - Monitore requisições
   - Identifique erros
   - Verifique performance

---

## ✅ Checklist de Produção

Antes de lançar oficialmente:

### Segurança
- [ ] RLS habilitado em todas as tabelas
- [ ] Variáveis de ambiente configuradas
- [ ] URLs de redirect configuradas no Supabase
- [ ] HTTPS habilitado (automático na Vercel)
- [ ] Chaves de API não expostas no código

### Funcionalidade
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Recuperação de senha funciona
- [ ] Todas as páginas carregam sem erro
- [ ] Gastos salvam corretamente
- [ ] Dashboard mostra dados corretos
- [ ] Sistema de famílias funciona
- [ ] Upload de comprovantes funciona (se habilitado)

### Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Imagens otimizadas

### UX
- [ ] Responsivo em mobile
- [ ] Dark mode funciona
- [ ] Loading states implementados
- [ ] Mensagens de erro claras
- [ ] Feedback visual em ações

---

## 🐛 Troubleshooting

### Erro: "Invalid API Key"

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Verifique no Vercel: Settings → Environment Variables
2. Confirme que as variáveis estão corretas
3. Redeploy: Deployments → ⋯ → Redeploy

### Erro: "Database connection failed"

**Causa:** URL do Supabase incorreta

**Solução:**
1. Verifique a URL no Supabase: Settings → API
2. Deve começar com `https://`
3. Atualize a variável `NEXT_PUBLIC_SUPABASE_URL`

### Erro: "Row Level Security policy violation"

**Causa:** Policies do RLS não configuradas

**Solução:**
1. Execute novamente o script `database_setup.sql`
2. Verifique no Supabase: Database → Policies
3. Certifique-se de que todas as tabelas têm policies

### Build falha na Vercel

**Causa:** Erros de TypeScript ou dependências faltando

**Solução:**
```bash
# Teste localmente primeiro
npm run build

# Se funcionar localmente mas falhar na Vercel:
# 1. Limpe o cache da Vercel
# 2. Verifique se package-lock.json está commitado
# 3. Verifique Node.js version (deve ser 18+)
```

---

## 🔄 Deploy de Atualizações

### Desenvolvimento → Produção

```bash
# 1. Teste localmente
npm run dev
# Teste todas as funcionalidades

# 2. Build local
npm run build
npm run start
# Teste a versão de produção localmente

# 3. Commit e push
git add .
git commit -m "feat: nova funcionalidade XYZ"
git push origin master

# 4. Vercel deploy automático
# Aguarde 2-5 minutos
# Verifique em https://seu-projeto.vercel.app
```

### Rollback de Emergência

Se algo der errado:

1. Vá em **Vercel** → **Deployments**
2. Encontre o último deploy funcional
3. Clique em **⋯** → **Promote to Production**
4. Confirme o rollback

---

## 📈 Próximos Passos

Após o deploy inicial:

1. **Monitoramento:**
   - Configure alertas no Vercel
   - Configure alertas no Supabase
   - Use Google Analytics (opcional)

2. **Backup:**
   - Configure backups automáticos no Supabase
   - Exporte dados periodicamente

3. **Performance:**
   - Ative Vercel Edge Functions se necessário
   - Configure CDN para assets estáticos
   - Otimize queries do banco

4. **Melhorias:**
   - Implemente cache com Redis (opcional)
   - Configure rate limiting
   - Adicione testes automatizados

---

## 📞 Suporte

### Problemas com Deploy?

1. **Vercel:**
   - [Documentação](https://vercel.com/docs)
   - [Discord](https://discord.gg/vercel)

2. **Supabase:**
   - [Documentação](https://supabase.com/docs)
   - [Discord](https://discord.supabase.com)

3. **Next.js:**
   - [Documentação](https://nextjs.org/docs)
   - [GitHub Issues](https://github.com/vercel/next.js/issues)

---

## ✅ Deploy Concluído!

Se tudo funcionou corretamente, você agora tem:

- ✅ Sistema rodando em produção
- ✅ HTTPS habilitado
- ✅ Banco de dados configurado
- ✅ Autenticação funcionando
- ✅ Deploys automáticos configurados

**🎉 Parabéns! Seu sistema está no ar!**

---

**Última atualização:** 09/10/2025  
**Versão do Sistema:** 3.0.1

