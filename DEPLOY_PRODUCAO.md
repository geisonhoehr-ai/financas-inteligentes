# 🚀 GUIA DE DEPLOY PARA PRODUÇÃO

## 📋 CHECKLIST PRÉ-DEPLOY

### ✅ 1. SEGURANÇA (CRÍTICO)

- [ ] **Rotacionar credenciais expostas** (siga [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md))
  - [ ] Novas chaves Supabase geradas
  - [ ] Novas chaves Stripe geradas
  - [ ] `.env.local` com credenciais novas
  - [ ] `.env.local` adicionado ao `.gitignore` ✅

- [ ] **Aplicar políticas RLS** (execute [APLICAR_RLS.sql](APLICAR_RLS.sql))
  - [ ] Passo 1: Habilitar RLS executado
  - [ ] Passo 2-6: Políticas aplicadas
  - [ ] Passo 7: Verificação OK
  - [ ] Testado com usuário real

- [ ] **Configurar variáveis de ambiente no Vercel/hosting**
  ```bash
  # Não usar .env.local em produção!
  # Configurar no painel do Vercel:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET
  NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
  NEXT_PUBLIC_APP_URL
  ```

### ✅ 2. BANCO DE DADOS

- [ ] **Backup do banco de dados**
  ```sql
  -- No Supabase Dashboard:
  -- Settings > Database > Backup
  -- OU usar pg_dump se tiver acesso direto
  ```

- [ ] **RLS ativado e testado**
- [ ] **Índices criados nas colunas mais consultadas**
  ```sql
  -- Exemplo de índices úteis:
  CREATE INDEX IF NOT EXISTS idx_gastos_usuario_data
    ON gastos(usuario_id, data DESC) WHERE deletado = false;

  CREATE INDEX IF NOT EXISTS idx_gastos_familia_data
    ON gastos(familia_id, data DESC) WHERE deletado = false;

  CREATE INDEX IF NOT EXISTS idx_familia_membros_usuario
    ON familia_membros(usuario_id) WHERE aprovado = true AND deletado = false;
  ```

- [ ] **Constraints e validações no banco**
  ```sql
  -- Exemplo: Garantir valores positivos
  ALTER TABLE gastos ADD CONSTRAINT gastos_valor_positivo
    CHECK (valor > 0);

  ALTER TABLE metas ADD CONSTRAINT metas_valor_positivo
    CHECK (valor_objetivo > 0 AND valor_atual >= 0);
  ```

### ✅ 3. CÓDIGO

- [ ] **Build local sem erros**
  ```bash
  npm run build
  ```

- [ ] **Lint sem erros críticos**
  ```bash
  npm run lint
  ```

- [ ] **Testes básicos passando** (se implementados)
  ```bash
  npm test
  ```

- [ ] **Remover console.logs desnecessários**
  ```bash
  # Buscar console.logs no código:
  grep -r "console.log" app/ components/ hooks/ lib/ --exclude-dir=node_modules
  ```

- [ ] **Performance otimizada**
  - [ ] Imagens otimizadas (usar next/image)
  - [ ] Bundle size aceitável (< 300kb gzipped)
  - [ ] Code splitting implementado

### ✅ 4. INTEGRAÇÕES EXTERNAS

- [ ] **Stripe configurado**
  - [ ] Webhook endpoint configurado
  - [ ] Produtos/preços criados
  - [ ] Testado em modo test

- [ ] **Supabase configurado**
  - [ ] Auth configurado (Email, OAuth se usar)
  - [ ] Storage configurado (se usar upload de imagens)
  - [ ] Edge Functions configuradas (se usar)

### ✅ 5. PWA

- [ ] **Manifest.json configurado**
- [ ] **Service Worker funcionando**
- [ ] **Ícones e splash screens corretos**
- [ ] **Testado instalação em iOS e Android**

## 🚀 PROCESSO DE DEPLOY

### OPÇÃO 1: Deploy no Vercel (Recomendado)

#### 1. Criar conta no Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login
```

#### 2. Preparar projeto
```bash
# Certificar que está no diretório do projeto
cd controle-financeiro-familiar-main

# Fazer commit de todas as mudanças
git add .
git commit -m "feat: Preparar para produção com RLS e validações"
git push origin main
```

#### 3. Deploy
```bash
# Deploy de preview
vercel

# Deploy de produção (após testar preview)
vercel --prod
```

#### 4. Configurar variáveis de ambiente
```bash
# Via CLI:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... repetir para todas as variáveis

# OU via Dashboard:
# https://vercel.com/[seu-projeto]/settings/environment-variables
```

#### 5. Configurar domínio customizado (opcional)
```bash
# Via Dashboard Vercel:
# Settings > Domains > Add Domain
```

### OPÇÃO 2: Deploy em outro hosting

#### Docker (se necessário)
```dockerfile
# Criar Dockerfile na raiz:
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

## 📊 PÓS-DEPLOY

### 1. Verificações Imediatas

- [ ] **Aplicação carrega sem erros**
- [ ] **Login funciona**
- [ ] **Criar gasto funciona**
- [ ] **Ver gastos funciona**
- [ ] **RLS está bloqueando acessos não autorizados**

### 2. Monitoramento

- [ ] **Configurar Sentry ou similar**
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```

- [ ] **Configurar Web Vitals no Google Analytics**

- [ ] **Monitorar logs do Supabase**
  - Dashboard > Logs > Database Logs
  - Verificar erros de RLS

- [ ] **Monitorar performance do Vercel**
  - Analytics > Speed Insights
  - Verificar Web Vitals

### 3. Testes em Produção

#### Teste de Usuário
```
1. Registrar novo usuário
2. Criar família
3. Adicionar gasto
4. Editar gasto
5. Deletar gasto (soft delete)
6. Verificar lixeira
7. Criar categoria
8. Criar meta
9. Adicionar cartão
10. Testar em mobile
```

#### Teste de Segurança
```sql
-- No Supabase SQL Editor (com usuário normal logado):

-- Tentar ver gastos de outro usuário (deve falhar):
SELECT * FROM gastos WHERE usuario_id != auth.uid();

-- Tentar atualizar gasto de outro usuário (deve falhar):
UPDATE gastos SET valor = 999999
WHERE usuario_id != auth.uid();

-- Tentar ver famílias onde não é membro (deve retornar vazio):
SELECT * FROM familias
WHERE id NOT IN (
  SELECT familia_id FROM familia_membros
  WHERE usuario_id = auth.uid()
);
```

## 🔧 TROUBLESHOOTING

### Erro: "Failed to load resource: 401 Unauthorized"
**Causa**: Credenciais do Supabase incorretas
**Solução**: Verificar variáveis de ambiente

### Erro: "permission denied for table..."
**Causa**: RLS bloqueando acesso
**Solução**: Verificar políticas RLS no Supabase

### Erro: "Build failed"
**Causa**: Erro de TypeScript ou ESLint
**Solução**: Rodar `npm run build` localmente e corrigir erros

### App lento
**Causa**: Queries não otimizadas
**Solução**:
- Adicionar índices no banco
- Implementar paginação
- Usar React Query com cache

### Usuários vendo dados de outros
**Causa**: RLS não configurado corretamente
**Solução**: Verificar e refazer políticas RLS

## 📞 SUPORTE

### Documentação útil:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Stripe: https://stripe.com/docs

### Logs importantes:
- Vercel: https://vercel.com/[projeto]/logs
- Supabase: Dashboard > Logs
- Browser Console: F12 > Console

## 🎉 SUCESSO!

Se chegou aqui e todos os checkboxes estão marcados, parabéns!
Seu app está pronto para receber usuários reais.

**Próximos passos recomendados:**
1. Divulgar o app
2. Coletar feedback dos usuários
3. Monitorar métricas
4. Iterar baseado no feedback
5. Adicionar novos recursos

---

**Versão do Sistema**: 3.0.1
**Data**: Janeiro 2025
**Autor**: Geison Hoehr
