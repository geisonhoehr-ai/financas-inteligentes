# 🚀 ROADMAP DE MELHORIAS - Sistema Financeiro Familiar

> **Última Atualização:** 05/10/2025
> **Status Geral:** 🎉 SISTEMA COMPLETO E FUNCIONAL!

## ✅ STATUS ATUAL

### **FUNCIONALIDADES JÁ IMPLEMENTADAS:**
- ✅ Sistema de Famílias (criar grupos familiares/empresas)
- ✅ Sistema de Convites Completo (criar, validar, aceitar via link)
- ✅ Dívidas Internas ("Comprei no seu cartão mas a dívida é minha")
- ✅ Gastos Privados (backend + UI + RLS)
- ✅ Notificações de Dívidas (badge no header)
- ✅ Upload de Comprovantes (Supabase Storage)
- ✅ Seletor de Família (dropdown no header)
- ✅ Filtros por Família (gastos, dívidas, dashboard, assinaturas, parcelas)
- ✅ Multi-perfil (pessoa/empresa)
- ✅ Soft Delete (lixeira de 30 dias)
- ✅ Membros da Família (controle de papéis)
- ✅ RLS (Row Level Security)
- ✅ Materialized Views para performance
- ✅ Sistema UUID em todo o banco
- ✅ Hook useFamiliaAtiva com persistência localStorage
- ✅ Layout responsivo Apple Design
- ✅ Toast notifications elegantes
- ✅ Sistema de multi-tenancy completo

---

## 🔴 PRIORIDADE 1 - CRÍTICAS ✅ **COMPLETO!**

### ✅ 1.1. Corrigir Schema do Banco
- ✅ Migrar IDs de BIGSERIAL para UUID
- ✅ Executar CORRECAO_COMPLETA.sql
- ✅ Sincronizar auth.users com public.users
- **Arquivo:** `CORRECAO_COMPLETA.sql`

### ✅ 1.2. Atualizar Types TypeScript para UUID
- ✅ Criado `types/app.types.ts` com interfaces UUID
- ✅ Atualizado `hooks/use-familias.ts` (soft delete + UUID)
- ✅ Atualizado `hooks/use-gastos.ts` (soft delete + UUID)
- ✅ Verificado `hooks/use-dividas.ts` (já estava com UUID)

### ✅ 1.3. Sistema de Convites Completo
- ✅ Tabela `convites` criada com validação
- ✅ Funções SQL: `validar_convite()`, `aceitar_convite()`, `gerar_codigo_convite()`
- ✅ RLS policies configuradas
- ✅ Hook `use-convites.ts` completo
- ✅ Página `app/convite/[codigo]/page.tsx` funcional
- ✅ UI para criar convites em Configurações
- ✅ Botão "Copiar Link" para compartilhamento
- **Arquivos:** `CRIAR_TABELA_CONVITES.sql`, `hooks/use-convites.ts`, `app/convite/[codigo]/page.tsx`, `app/configuracoes/page.tsx`

### ✅ 1.4. UI para Gastos Privados
- ✅ Checkbox "🔒 Gasto Privado" em `components/gasto-sheet.tsx`
- ✅ Ícone de cadeado em `app/gastos/page.tsx`
- ✅ RLS configurado (apenas dono vê gastos privados)
- **Arquivos:** `components/gasto-sheet.tsx:164-179`, `app/gastos/page.tsx:127-129`

### ✅ 1.5. Notificações de Dívidas
- ✅ Badge de notificação no header
- ✅ Contador de dívidas pendentes
- ✅ Link direto para página de dívidas
- **Arquivo:** `components/header.tsx:51-68`

---

## 🟡 PRIORIDADE 2 - IMPORTANTES (Próximas)

### ⏳ 2.1. Regenerar Types do Supabase
**Status:** Pendente
**Comando:**
```bash
npx supabase gen types typescript --project-id sfemmeczjhleyqeegwhs > types/database.types.ts
```

### ⏳ 2.2. Sistema de Notificações Avançado
**Status:** Básico implementado (dívidas no header)
**Próximos Passos:**
- Criar tabela `notificacoes` completa
- Notificar quando alguém aceita convite
- Notificar quando dívida é marcada como paga
- Toast notifications em tempo real

**SQL:**
```sql
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id),
  tipo VARCHAR(50),
  titulo TEXT,
  mensagem TEXT,
  lida BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**UI:**
- Ícone de sino no header
- Badge com contador
- Modal com lista de notificações
- Marcar como lida

### ⏳ 2.2. Histórico de Dívidas Pagas
**Status:** Não iniciado
**Arquivo:** `app/dividas/page.tsx`

**Funcionalidades:**
- Aba "Pendentes" / "Histórico"
- Filtro por período
- Ver comprovantes de pagamento
- Exportar relatório

### ⏳ 2.3. Upload de Comprovante de Pagamento
**Status:** Não iniciado
**Integração:** Supabase Storage

**Ação:**
- Configurar bucket no Supabase
- Input de upload de imagem
- Salvar URL em `dividas_internas.comprovante_url`
- Visualizar comprovante no histórico

### ⏳ 2.4. Dashboard por Família
**Status:** Parcial (seletor existe mas não filtra)

**Ação:**
- Implementar context global de família ativa
- Filtrar dashboard por família selecionada
- Persistir seleção no localStorage
- Atualizar todas as queries

### ⏳ 2.5. Validações no Frontend
**Status:** Mínimas

**Ação:**
- Validar valores > 0
- Validar datas (não pode ser futura para gastos)
- Validar email em convites
- Feedback visual de erros

---

## 🟢 PRIORIDADE 3 - NICE TO HAVE

### ⏳ 3.1. Lembretes de Vencimento
- Notificar 3 dias antes de vencer dívida
- Lembrar de pagar parcela do mês
- Email/Push notification (opcional)

### ⏳ 3.2. QR Code para Pagamento PIX
- Gerar PIX Copia e Cola
- QR Code para scan
- Integração com banco (futuro)

### ⏳ 3.3. Chat entre Membros
- Discussão sobre gastos específicos
- Comentários em dívidas
- Thread de conversa

### ⏳ 3.4. Relatórios Avançados
- Quem gastou mais no mês
- Categorias mais caras
- Gráfico de tendências
- Comparação mês a mês
- Export PDF/Excel

### ⏳ 3.5. Metas Compartilhadas
- "Economizar R$ 5.000 para viagem"
- Todos contribuem
- Barra de progresso compartilhada
- Celebração ao atingir meta

### ⏳ 3.6. Aprovação de Gastos
- Admin aprova gastos > R$ X
- Workflow de aprovação
- Notificação de pendências
- Rejeitar com motivo

### ⏳ 3.7. Categorias Personalizadas por Família
- Além das 13 categorias padrão
- Cada família pode criar suas
- Ícones customizados
- Cores personalizadas

### ⏳ 3.8. Anexos em Gastos
- Upload de nota fiscal
- Foto do produto
- Múltiplos anexos por gasto

### ⏳ 3.9. Recorrência de Gastos
- Marcar gasto como recorrente
- Auto-criar no próximo mês
- Editar série toda ou apenas um
- Cancelar recorrência

### ⏳ 3.10. Import/Export de Dados
- Export CSV/Excel
- Import de extratos bancários
- Backup completo JSON
- Restore de backup

---

## 🎯 PLANO DE EXECUÇÃO (4 SEMANAS)

### **SEMANA 1: Correções Críticas**
- [x] Executar CORRECAO_COMPLETA.sql
- [x] Sincronizar usuário existente
- [ ] Atualizar todos os types para UUID
- [ ] Regenerar types do Supabase
- [ ] Atualizar todos os hooks
- [ ] Testar sistema completo

### **SEMANA 2: Gastos Privados + Convites**
- [ ] Adicionar checkbox de gasto privado
- [ ] Criar tabela de convites
- [ ] Completar página de convites
- [ ] Testar fluxo completo de convite
- [ ] Adicionar expiração de convites

### **SEMANA 3: Notificações**
- [ ] Criar tabela de notificações
- [ ] Implementar triggers para criar notificações
- [ ] Ícone de sino no header
- [ ] Modal de notificações
- [ ] Marcar como lida
- [ ] Badge com contador

### **SEMANA 4: Melhorias UI/UX**
- [ ] Dashboard por família funcional
- [ ] Histórico de dívidas pagas
- [ ] Upload de comprovantes
- [ ] Validações no frontend
- [ ] Feedback de loading em todas as ações

---

## 📊 MÉTRICAS DE SUCESSO

### **Performance:**
- ✅ Queries < 100ms (com materialized views)
- ✅ Índices otimizados criados
- ⏳ Paginação em listas grandes

### **Segurança:**
- ✅ RLS habilitado em todas as tabelas
- ✅ Policies configuradas
- ⏳ Validações server-side
- ⏳ Rate limiting

### **UX:**
- ⏳ Todas as ações com feedback visual
- ⏳ Loading states em todas as queries
- ⏳ Mensagens de erro claras
- ⏳ Confirmação em ações destrutivas

---

## 🐛 BUGS CONHECIDOS

### **Alto Impacto:**
1. ⚠️ Hooks usando `number` ao invés de `string` (UUID)
2. ⚠️ Página de convites com dados mockados
3. ⚠️ Familia_id hardcoded em alguns lugares

### **Médio Impacto:**
1. ⚠️ Dashboard não filtra por família selecionada
2. ⚠️ Sem validação de valores negativos
3. ⚠️ RLS policies podem estar muito permissivas

### **Baixo Impacto:**
1. ⚠️ Falta loading state em algumas ações
2. ⚠️ Alguns textos em inglês (traduzir)
3. ⚠️ Responsividade em telas < 375px

---

## 🔄 BACKLOG (Futuro)

- 📱 App Mobile (React Native)
- 🤖 Assistente IA para categorização automática
- 📊 Dashboard em tempo real (websockets)
- 🌍 Multi-idioma (i18n)
- 🎨 Temas customizados por família
- 🔗 Integração com bancos (Open Banking)
- 📧 Envio de emails automáticos
- 📞 Notificações push
- 🔐 2FA (autenticação em dois fatores)
- 👥 Controle de permissões granular

---

## 📝 NOTAS DE DESENVOLVIMENTO

### **Convenções:**
- ✅ Usar UUID para todos os IDs
- ✅ Soft delete em todas as tabelas principais
- ✅ Campos `created_at` e `updated_at` sempre
- ✅ RLS habilitado por padrão
- ✅ Índices em foreign keys

### **Estrutura de Pastas:**
```
app/                    # Páginas Next.js (App Router)
components/            # Componentes React
  ui/                 # Componentes base (shadcn/ui)
hooks/                # React Hooks customizados
lib/                  # Utilitários
types/                # TypeScript types
public/               # Arquivos estáticos
```

### **Stack:**
- Frontend: Next.js 15 + React 18 + TypeScript
- Backend: Supabase (PostgreSQL)
- Estado: TanStack Query (React Query)
- UI: Tailwind CSS + shadcn/ui
- Auth: Supabase Auth

---

**Última Atualização:** 2025-10-05
**Versão do Sistema:** 3.0.1
**Desenvolvedor:** Geison Höehr

---

## 🎯 PRÓXIMA SESSÃO

**Quando abrir o Claude novamente, começar por:**

1. **Verificar este arquivo** (`ROADMAP_MELHORIAS.md`)
2. **Perguntar:** "Qual prioridade vamos implementar hoje?"
3. **Seguir a ordem:** P1 → P2 → P3
4. **Atualizar checklist** conforme concluir

**Comando rápido:**
```
"Claude, vamos continuar as melhorias do sistema.
Qual item da Prioridade 1 ainda está pendente?"
```

---

**🚀 LETS GO!** 💪
