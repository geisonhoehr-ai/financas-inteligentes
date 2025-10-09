# 💰 Sistema de Controle Financeiro Familiar

> **Versão:** 3.0.1 | **Status:** 🎉 **PRONTO PARA PRODUÇÃO!** | **Última Atualização:** 09/10/2025

Sistema completo de controle financeiro familiar com **multi-tenancy**, **dívidas internas**, **convites** e muito mais!

---

## 🚀 **STATUS DO PROJETO**

✅ **Sistema 100% Funcional e Testado**
- Todos os bugs críticos corrigidos
- CRUD completo implementado
- Segurança otimizada para produção
- Documentação completa de deploy

---

## ✨ **FUNCIONALIDADES PRINCIPAIS**

### 👨‍👩‍👧‍👦 **Sistema de Famílias**
- Criar múltiplas famílias/empresas
- Convites por link personalizado
- Controle de papéis (Admin, Membro, Dependente)
- Dashboard individual ou familiar

### 💳 **Dívidas Internas**
- "Comprei no seu cartão mas a dívida é minha"
- Controle automático de responsabilidades
- Upload de comprovantes
- Notificações em tempo real

### 🔒 **Gastos Privados**
- Marcar gastos como privados
- Ideal para presentes ou compras íntimas
- RLS (Row Level Security) completo

### 📊 **Dashboard Inteligente**
- Visualização por família ou individual
- Gráficos interativos
- Materialized views para performance
- Filtros dinâmicos

### 🎨 **Design Apple**
- Interface moderna e elegante
- Responsivo para todos os dispositivos
- Dark/Light mode
- Animações suaves

---

## 🛠️ **TECNOLOGIAS**

### **Frontend**
- ⚛️ **Next.js 15** - Framework React
- 🎨 **Tailwind CSS** - Estilização
- 📱 **Responsive Design** - Mobile-first
- 🎯 **TypeScript** - Tipagem estática
- 🔄 **React Query** - Cache e sincronização
- 🎭 **Next Themes** - Dark/Light mode

### **Backend**
- 🗄️ **Supabase** - Backend-as-a-Service
- 🔐 **PostgreSQL** - Banco de dados
- 🛡️ **RLS** - Row Level Security
- 📡 **Real-time** - Sincronização automática
- ☁️ **Storage** - Upload de arquivos

### **Infraestrutura**
- 🚀 **Vercel** - Deploy automático
- 🌐 **CDN Global** - Performance
- 📊 **Analytics** - Monitoramento
- 🔒 **HTTPS** - Segurança

---

## 📋 **COMO USAR**

### **1. Primeiro Acesso**
1. Acesse o sistema
2. Faça login com Google/Email
3. Crie sua primeira família
4. Convide outros membros

### **2. Configurando Família**
```bash
1. Vá em "Configurações"
2. Clique "Criar Nova Família"
3. Escolha: Família ou Empresa
4. Copie o código de convite
5. Envie para outros membros
```

### **3. Registrando Gastos**
```bash
1. Vá em "Gastos" → "Novo Gasto"
2. Preencha: Descrição, Valor, Data
3. Clique "Configurar Responsabilidade"
4. Defina: Quem pagou vs Quem deve
5. Sistema cria dívida automaticamente!
```

### **4. Gerenciando Dívidas**
```bash
1. Vá em "Dívidas" no menu
2. Veja: Você deve vs Você recebe
3. Marque como paga quando transferir
4. Anexe comprovante (opcional)
```

---

## 🎯 **CASOS DE USO REAIS**

### **Caso 1: Compra Parcelada**
```
Situação: João estourou o cartão, comprou TV no cartão da Maria
Solução:
1. Novo Gasto: "TV Samsung 55""
2. Valor: R$ 3.000,00
3. Pago por: Maria
4. Responsável: João
✅ Dívida criada automaticamente!
```

### **Caso 2: Dividir Restaurante**
```
Situação: Jantar em família, João pagou, mas é conta de todos
Solução:
1. Novo Gasto: "Jantar em Família"
2. Valor: R$ 200,00
3. Pago por: João
4. Divisão: João 50%, Maria 30%, Filho 20%
✅ Dívidas internas criadas automaticamente!
```

### **Caso 3: Gasto Privado**
```
Situação: Presente de aniversário para esposa
Solução:
1. Novo Gasto: "Presente Aniversário"
2. Marcar como "Privado"
3. Apenas você vê este gasto
✅ Privacidade garantida!
```

---

## 🔧 **INSTALAÇÃO LOCAL**

### **Pré-requisitos**
- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)
- Git

### **Passo a Passo**

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/controle-financeiro-familiar.git
cd controle-financeiro-familiar

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
# Copie o arquivo env.example para .env.local
cp env.example .env.local

# 4. Configure o Supabase
# Edite .env.local com suas credenciais do Supabase:
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 5. Execute o SQL no Supabase
# No painel do Supabase, vá em SQL Editor
# Copie e execute o conteúdo de database_setup.sql

# 6. Inicie o servidor de desenvolvimento
npm run dev

# 7. Acesse http://localhost:3000
```

### **Variáveis de Ambiente Necessárias**

Veja o arquivo `env.example` para todas as variáveis disponíveis.

---

## 📊 **ESTRUTURA DO PROJETO**

```
controle-financeiro-familiar/
├── app/                    # Páginas Next.js
│   ├── gastos/            # Gestão de gastos
│   ├── dividas/           # Dívidas internas
│   ├── configuracoes/     # Configurações de família
│   └── convite/[codigo]/  # Aceitar convites
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── familia-selector.tsx
│   └── upload-comprovante.tsx
├── hooks/                # Custom hooks
│   ├── use-familias.ts
│   ├── use-dividas.ts
│   └── use-familia-ativa.ts
├── lib/                  # Utilitários
│   ├── supabase.ts
│   └── utils.ts
└── types/                # TypeScript types
    └── index.ts
```

---

## 🗄️ **SCHEMA DO BANCO**

### **Tabelas Principais**
```sql
-- Famílias
familias (id, nome, admin_id, modo_calculo)

-- Membros da família
familia_membros (familia_id, user_id, papel)

-- Convites
convites (id, familia_id, email, codigo, expira_em)

-- Gastos
gastos (id, descricao, valor, familia_id, pago_por, responsavel_por, privado)

-- Dívidas internas
dividas_internas (id, familia_id, credor_id, devedor_id, valor, status)
```

---

## 🔒 **SEGURANÇA**

### **Row Level Security (RLS)**
- ✅ Apenas membros veem dados da família
- ✅ Gastos privados só visíveis para o dono
- ✅ Dívidas só visíveis para envolvidos
- ✅ Admin pode gerenciar tudo

### **Validações**
- ✅ Códigos de convite únicos
- ✅ Validação de datas de expiração
- ✅ Constraints de integridade
- ✅ Soft delete (nunca perde dados)

---

## 📈 **PERFORMANCE**

### **Otimizações**
- ✅ Materialized views para dashboard
- ✅ Índices otimizados no banco
- ✅ React Query para cache
- ✅ Lazy loading de componentes
- ✅ CDN global (Vercel)

### **Métricas**
- ⚡ **Lighthouse Score:** 95+
- 🚀 **First Load:** < 2s
- 📱 **Mobile Score:** 90+
- 🔄 **Real-time:** < 100ms

---

## 🎨 **DESIGN SYSTEM**

### **Cores Apple-Inspired**
```css
--primary: 0 122 255;      /* Apple Blue */
--success: 52 199 89;      /* Apple Green */
--warning: 255 149 0;      /* Apple Orange */
--destructive: 255 59 48;  /* Apple Red */
```

### **Tipografia**
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text';
```

### **Componentes**
- 🎯 **Button** - Com estados de loading
- 📱 **Sheet** - Modal estilo iOS
- 🎨 **Card** - Com glassmorphism
- 📊 **Chart** - Gráficos interativos

---

## 🚀 **DEPLOY EM PRODUÇÃO**

### **📖 Guia Completo de Deploy**
Consulte o arquivo **[DEPLOY.md](DEPLOY.md)** para instruções detalhadas de deploy.

### **Vercel (Recomendado)**
```bash
# 1. Conecte seu repositório ao Vercel
# 2. Configure as variáveis de ambiente
# 3. Deploy automático a cada push!

# Variáveis necessárias:
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

### **Outras Plataformas**
- **Netlify** - ✅ Compatível
- **Railway** - ✅ Compatível
- **Digital Ocean** - ✅ Compatível
- **AWS Amplify** - ✅ Compatível

---

## 📚 **DOCUMENTAÇÃO**

### **Guias Disponíveis**
- 🚀 **[Guia de Deploy](DEPLOY.md)** - Como colocar em produção
- 📋 **[Checklist de Correções](CHECKLIST_CORRECOES.md)** - Melhorias implementadas
- 📊 **[Resumo Executivo](RESUMO_EXECUTIVO_FINAL.md)** - Status do projeto
- 🔧 **[Correções Finais](CORRECOES_FINAIS_09_10_2025.md)** - Últimas correções

### **SQL Scripts**
- 🗄️ **[Setup do Banco](database_setup.sql)** - Script completo de criação do banco
- ⚠️ **Atenção:** O script contém `DROP TABLE` - use com cuidado em produção!

---

## 🤝 **CONTRIBUIÇÃO**

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### **Padrões de Código**
- 📝 **TypeScript** - Tipagem obrigatória
- 🎨 **Tailwind** - Estilização consistente
- 🔄 **React Query** - Cache de dados
- 📱 **Mobile-first** - Design responsivo

---

## 🐛 **SUPORTE**

### **✅ Correções Recentes (09/10/2025)**
- ✅ Dashboard de gastos funcionando 100%
- ✅ Assinaturas salvam corretamente
- ✅ Categorias com dropdown funcionando
- ✅ CRUD completo implementado em todas as páginas
- ✅ Código limpo e otimizado para produção

### **⚠️ Pontos de Atenção**
- Materialized views atualizam a cada operação
- O arquivo `database_setup.sql` contém `DROP TABLE` (cuidado em prod)
- Filtros por família estão funcionando com RLS do Supabase

### **Como Reportar Bugs**
1. Acesse [Issues](https://github.com/seu-usuario/controle-financeiro-familiar/issues)
2. Use o template de bug report
3. Inclua screenshots se possível
4. Descreva os passos para reproduzir

---

## 📄 **LICENÇA**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 **AUTORES**

- **Desenvolvedor Principal** - [Seu Nome](https://github.com/seu-usuario)
- **Design System** - Apple Human Interface Guidelines
- **Inspiração** - Comunidade Next.js + Supabase

---

## 🙏 **AGRADECIMENTOS**

- 🍎 **Apple** - Design Guidelines
- ⚛️ **Vercel** - Deploy e performance
- 🗄️ **Supabase** - Backend robusto
- 🎨 **Tailwind** - CSS framework
- 📊 **Recharts** - Gráficos bonitos

---

## 🎯 **ROADMAP FUTURO**

### **Próximas Funcionalidades**
- [ ] 📱 App mobile nativo
- [ ] 💳 Integração com PIX
- [ ] 🤖 IA para categorização automática
- [ ] 📊 Relatórios avançados em PDF
- [ ] 🔔 Notificações push
- [ ] 💰 Integração com bancos

---

## ✅ **CHECKLIST DE PRODUÇÃO**

Antes de fazer o deploy:

### Segurança ✅
- [x] RLS habilitado em todas as tabelas
- [x] Variáveis de ambiente documentadas
- [x] Código de autenticação limpo
- [x] Console.logs removidos do código de produção
- [x] Error boundaries implementados

### Funcionalidade ✅
- [x] CRUD completo em Cartões, Parcelas e Investimentos
- [x] Dashboard mostra valores corretos
- [x] Sistema de famílias funciona
- [x] Recuperação de senha implementada
- [x] Skeleton loaders adicionados

### Deploy ✅
- [x] next.config.js configurado para produção
- [x] Arquivo env.example criado
- [x] Documentação de deploy completa (DEPLOY.md)
- [x] README atualizado

---

**🎉 Sistema 100% pronto para produção!**

**💡 Dúvidas? Consulte o [DEPLOY.md](DEPLOY.md) ou abra uma issue!**

---

<div align="center">

**[⬆ Voltar ao topo](#-sistema-de-controle-financeiro-familiar)**

Made with ❤️ by Geison Hoehr

**Última atualização:** 09/10/2025 | **Versão:** 3.0.1

</div>