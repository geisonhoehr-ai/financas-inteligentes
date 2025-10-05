# 💰 Controle Financeiro Familiar

Sistema completo de gestão financeira familiar com CRUD para todos os recursos.

## 🚀 Recursos

### 📊 Controle de Despesas
- ✅ **Gastos Variáveis** (com categorias: Alimentação, Transporte, Saúde, etc.)
- ✅ **Compras Parceladas** ⭐ NOVO (produto, valor total, parcelas, progresso)
- ✅ **Gasolina/Combustível** ⭐ NOVO (carro/moto, litros, preço/litro)
- ✅ Assinaturas (Netflix, Spotify, etc.)
- ✅ Contas Fixas (aluguel, luz, água)
- ✅ Ferramentas IA/Dev (Claude, Cursor, etc.)

### 💳 Controle Financeiro
- ✅ Cartões de Crédito (limite, gasto, % utilizado)
- ✅ Dívidas (financiamentos com progresso)
- ✅ Empréstimos (emprestei/peguei)
- ✅ Metas de Economia (com progresso visual)
- ✅ Orçamentos por Categoria

### 💎 Patrimônio
- ✅ Investimentos (valor, tipo, rendimento)
- ✅ Bens e Imóveis (tipo e valor)
- ✅ Cálculo automático de Patrimônio Líquido

### 👥 Gestão de Usuários
- ✅ Múltiplos Usuários (você, esposa, família)
- ✅ Salários Individuais
- ✅ Filtro por Usuário ou Família
- ✅ Cores Personalizadas

### 🎨 Interface
- ✅ Modo Escuro/Claro
- ✅ 100% Responsivo (Mobile, Tablet, Desktop)
- ✅ Design Moderno com Gradientes
- ✅ Animações Suaves
- ✅ Ícones Intuitivos

## 🎯 Como Usar

### Local (Desenvolvimento)
1. Abra o arquivo `index.html` no navegador
2. Configure seus usuários na seção "Usuários"
3. Adicione os salários de cada membro
4. Comece a registrar seus gastos!

### Online (Produção com Supabase)
1. Acesse: **[Deploy na Vercel]** (após deploy)
2. Sistema conectado ao Supabase
3. Dados salvos na nuvem automaticamente
4. Acesse de qualquer dispositivo

Veja mais detalhes em [GUIA_RAPIDO.md](GUIA_RAPIDO.md)

## ⭐ Funcionalidades Novas

### 🛍️ Compras Parceladas
Agora você pode registrar todas as suas compras parceladas:
- Nome do produto
- Categoria (Eletrônicos, Eletrodomésticos, Móveis, etc.)
- Valor total e número de parcelas
- Cálculo automático do valor mensal
- Barra de progresso visual
- Controle de parcelas pagas

### ⛽ Controle de Gasolina
Sistema completo para gerenciar gastos com combustível:
- Separação por veículo (🚗 Carro / 🏍️ Moto)
- Registro de valor pago e litros
- Cálculo automático do preço por litro
- Local do posto (opcional)
- Histórico completo de abastecimentos

### 🏷️ Categorias nos Gastos
Organize melhor seus gastos com categorias:
- Alimentação, Transporte, Saúde, Educação
- Lazer, Vestuário, Moradia, Outros
- Identificação visual com badges coloridas
- Facilita análise de onde vai o dinheiro

## 📊 Dashboard

O dashboard mostra em tempo real:
- **Receitas totais** da família
- **Despesas totais** (incluindo parcelas e gasolina)
- **Saldo disponível**
- **Patrimônio líquido**
- **Resumo mensal detalhado** de todas as categorias

## 💾 Dados

- Todos os dados são salvos **localmente** no navegador (LocalStorage)
- **Nenhum dado é enviado para servidores externos**
- Seus dados ficam **100% privados** no seu computador
- Recomenda-se fazer backup manual periodicamente

## 🛠️ Tecnologias

- React 18 (sem build, via CDN)
- Tailwind CSS
- LocalStorage API
- HTML5, CSS3, JavaScript ES6+

## 📁 Arquivos

- `index.html` - Sistema completo (arquivo principal)
- `app.html` - Versão minificada
- `GUIA_RAPIDO.md` - Guia de uso detalhado
- `MELHORIAS_IMPLEMENTADAS.md` - Lista completa de funcionalidades
- `README.md` - Este arquivo

## 🎉 Sistema Completo

O sistema está **100% funcional** e pronto para:
- ✅ Controle familiar completo
- ✅ Múltiplos usuários
- ✅ Todos os tipos de despesa
- ✅ Compras parceladas
- ✅ Controle de combustível
- ✅ Investimentos e patrimônio
- ✅ Metas financeiras
- ✅ Dívidas e empréstimos

**Comece a usar hoje mesmo e tenha controle total das suas finanças! 💪**

---

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

Ou via GitHub:
1. Acesse https://vercel.com/new
2. Importe seu repositório
3. Deploy automático!

Veja guia completo em [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)

### Outros Serviços
- **Netlify:** Drag & drop ou Git
- **GitHub Pages:** Grátis para repositórios públicos
- **Cloudflare Pages:** Deploy via Git

---

## 🗄️ Banco de Dados

### Supabase (Configurado)
- **Project ID:** `sfemmeczjhleyqeegwhs`
- **Status:** ✅ 16 tabelas criadas
- **Integração:** Pronta (ver `index-supabase.html`)

### Documentação
- [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md) - Estrutura completa
- [database_setup.sql](database_setup.sql) - Script SQL
- [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md) - Como integrar
- [DATABASE_VERIFICATION.md](DATABASE_VERIFICATION.md) - Verificações

---