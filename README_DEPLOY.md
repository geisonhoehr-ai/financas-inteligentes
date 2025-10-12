# 💰 Sistema de Controle Financeiro Familiar v3.0

> Sistema completo de controle financeiro com Next.js 15, Supabase e Stripe - **PRONTO PARA PRODUÇÃO** ✅

## 🎯 O QUE FOI FEITO

Este sistema passou por uma **auditoria completa de segurança e qualidade** e está pronto para produção com as seguintes melhorias implementadas:

### ✅ Segurança Implementada
- **RLS (Row Level Security)** configurado em todas as tabelas
- Políticas de acesso granulares por usuário e família
- Validações robustas em todos os formulários
- Sistema de sanitização de dados
- Proteção contra SQL Injection, XSS e CSRF

### ✅ Qualidade de Código
- Sistema de logging e monitoramento implementado
- Tratamento de erros padronizado
- Validações client-side e server-side
- TypeScript com tipos bem definidos

### ✅ Documentação Completa
- [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md) - Como rotacionar credenciais
- [APLICAR_RLS.sql](APLICAR_RLS.sql) - Script de segurança do banco
- [DEPLOY_PRODUCAO.md](DEPLOY_PRODUCAO.md) - Guia completo de deploy
- Este README com instruções claras

## 🚀 INÍCIO RÁPIDO

### 1. Pré-requisitos
```bash
- Node.js 18+ instalado
- Conta no Supabase (https://supabase.com)
- Conta no Stripe (opcional, para pagamentos)
```

### 2. Clonar e Instalar
```bash
git clone <seu-repo>
cd controle-financeiro-familiar-main
npm install
```

### 3. Configurar Ambiente
```bash
# Copiar exemplo
cp .env.example .env.local

# Editar .env.local com suas credenciais
# NUNCA commite este arquivo!
```

### 4. **IMPORTANTE: Rotacionar Credenciais**
🔴 **SE O REPOSITÓRIO FOI EXPOSTO PUBLICAMENTE:**
1. Leia **[SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md)** IMEDIATAMENTE
2. Rotacione TODAS as chaves do Supabase e Stripe
3. Atualize `.env.local` com novas chaves

### 5. Configurar Supabase

#### a) Criar projeto no Supabase
1. Acesse https://supabase.com/dashboard
2. Crie novo projeto
3. Anote as credenciais

#### b) Aplicar Segurança (RLS)
1. Acesse SQL Editor no Supabase
2. Abra o arquivo [APLICAR_RLS.sql](APLICAR_RLS.sql)
3. Execute **PASSO POR PASSO** (não tudo de uma vez!)
4. Verifique com a query do PASSO 7

#### c) Executar migrations do banco
```sql
-- Execute as migrations na pasta supabase/migrations
-- se existirem, ou use o schema fornecido
```

### 6. Rodar Localmente
```bash
npm run dev
```

Acesse: http://localhost:3000

### 7. Testar Sistema
```
1. Registrar novo usuário
2. Criar família
3. Adicionar gasto
4. Editar gasto
5. Deletar gasto (verificar soft delete)
6. Verificar que NÃO consegue ver dados de outros usuários
```

## 📦 ESTRUTURA DO PROJETO

```
controle-financeiro-familiar-main/
├── app/                      # Next.js App Router
│   ├── (public)/            # Rotas públicas
│   ├── gastos/              # Página de gastos
│   ├── categorias/          # Página de categorias
│   ├── metas/               # Página de metas
│   └── ...                  # Outras páginas
├── components/              # Componentes React
│   ├── ui/                  # Componentes UI (shadcn)
│   ├── auth-provider.tsx    # Contexto de autenticação
│   └── ...
├── hooks/                   # React Hooks customizados
│   ├── use-gastos.tsx       # Hook para gastos
│   ├── use-categorias.tsx   # Hook para categorias
│   └── ...
├── lib/                     # Utilitários
│   ├── supabase/            # Cliente Supabase
│   ├── validations.ts       # Validações robustas ✨
│   ├── logger.ts            # Sistema de logging ✨
│   ├── toast.ts             # Toasts/notificações
│   └── utils.ts             # Funções auxiliares
├── types/                   # TypeScript types
├── public/                  # Assets estáticos
├── .env.example             # Template de variáveis ✨
├── .gitignore               # Arquivos ignorados (inclui .env.local) ✨
├── APLICAR_RLS.sql          # Script de segurança ✨
├── SEGURANCA_CREDENCIAIS.md # Guia de segurança ✨
├── DEPLOY_PRODUCAO.md       # Guia de deploy ✨
└── README_DEPLOY.md         # Este arquivo ✨
```

✨ = Arquivos novos criados na auditoria de segurança

## 🔒 SEGURANÇA

### RLS (Row Level Security) Implementado
- ✅ Usuários só veem seus próprios dados
- ✅ Membros de família veem dados compartilhados
- ✅ Admins controlam suas famílias
- ✅ Soft delete implementado
- ✅ Proteção contra acessos não autorizados

### Validações Implementadas
```typescript
// Exemplo de uso das validações:
import { gastoValidation } from '@/lib/validations'

const result = gastoValidation.validate({
  descricao: "Mercado",
  valor: 150.00,
  data: "2025-01-15",
  categoria_id: "uuid"
})

if (!result.valid) {
  console.error(result.errors)
}
```

### Logging Implementado
```typescript
// Exemplo de uso do logger:
import { logger, logSupabaseError } from '@/lib/logger'

logger.info('Operação iniciada')
logger.error('Erro ao salvar', error)
logSupabaseError('insert gasto', error, { userId })
```

## 🛠️ TECNOLOGIAS

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Estado**: React Query, Zustand
- **Pagamentos**: Stripe (opcional)
- **Deploy**: Vercel (recomendado)

## 📱 FUNCIONALIDADES

### Core
- ✅ Autenticação (Email + recuperação de senha)
- ✅ Sistema de famílias multi-usuário
- ✅ Gastos com soft delete
- ✅ Categorias (sistema + customizadas)
- ✅ Tags para organização
- ✅ Dashboard com gráficos

### Financeiro
- ✅ Metas financeiras
- ✅ Cartões de crédito
- ✅ Compras parceladas
- ✅ Investimentos
- ✅ Orçamentos
- ✅ Contas fixas
- ✅ Salários
- ✅ Lixeira

### Extra
- ✅ PWA (instalar como app)
- ✅ Dark mode
- ✅ Responsivo
- ✅ Notificações
- ✅ Relatórios

## 🚀 DEPLOY PARA PRODUÇÃO

### CHECKLIST ANTES DE FAZER DEPLOY

1. **Segurança** (OBRIGATÓRIO)
   - [ ] Rotacionar credenciais se foram expostas
   - [ ] RLS aplicado e testado
   - [ ] Variáveis de ambiente configuradas no host

2. **Testes** (Recomendado)
   - [ ] Build local sem erros (`npm run build`)
   - [ ] Testado criação/edição/exclusão
   - [ ] Testado acesso multi-usuário

3. **Performance** (Recomendado)
   - [ ] Imagens otimizadas
   - [ ] Bundle size OK
   - [ ] Índices no banco criados

### Deploy no Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel --prod

# 4. Configurar variáveis de ambiente no dashboard:
# https://vercel.com/[projeto]/settings/environment-variables
```

**Veja guia completo:** [DEPLOY_PRODUCAO.md](DEPLOY_PRODUCAO.md)

## 📊 MONITORAMENTO

### Logs Importantes
- **Supabase**: Dashboard > Logs > Database Logs
- **Vercel**: Dashboard > Logs
- **Browser**: Console (F12)

### Métricas
- **Performance**: Vercel Analytics
- **Erros**: Sentry (recomendado)
- **Usuários**: Google Analytics (opcional)

## 🐛 TROUBLESHOOTING

### "Failed to load resource: 401"
- Verificar credenciais do Supabase
- Verificar se variáveis estão corretas

### "permission denied for table..."
- RLS bloqueando acesso
- Verificar políticas no Supabase

### "Build failed"
- Rodar `npm run build` localmente
- Corrigir erros de TypeScript/ESLint

### App lento
- Adicionar índices no banco (ver DEPLOY_PRODUCAO.md)
- Implementar paginação
- Verificar queries N+1

## 📞 SUPORTE

- **Bugs**: Abra uma issue no GitHub
- **Dúvidas**: Consulte a documentação
- **Deploy**: Veja DEPLOY_PRODUCAO.md

## 📄 LICENÇA

MIT License - veja LICENSE para detalhes

## 👨‍💻 AUTOR

**Geison Hoehr**
- Sistema desenvolvido com Next.js 15 e Supabase
- Auditoria de segurança e preparação para produção: Janeiro 2025

---

## ⚡ PRÓXIMOS PASSOS

1. **Agora**: Siga [DEPLOY_PRODUCAO.md](DEPLOY_PRODUCAO.md)
2. **Depois**: Configure monitoramento (Sentry)
3. **Futuro**: Adicione testes automatizados
4. **Evolução**: Colete feedback dos usuários

**Status**: ✅ PRONTO PARA PRODUÇÃO

**Versão**: 3.0.1
**Última atualização**: Janeiro 2025
