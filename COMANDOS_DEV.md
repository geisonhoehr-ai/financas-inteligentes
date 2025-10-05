# 🚀 Comandos de Desenvolvimento

## 📋 Comandos Disponíveis

### 🔥 **Desenvolvimento (Recomendado)**
```bash
npm run dev
```

**O que faz:**
- ✅ Inicia servidor local na porta 3000
- ✅ Abre automaticamente no navegador
- ✅ **Hot Reload** - Atualiza automaticamente ao salvar
- ✅ Monitora mudanças em `index.html` e `config.json`
- ✅ Melhor performance que abrir direto o HTML

**Acesso:**
- URL: http://localhost:3000
- Pressione `Ctrl+C` para parar

---

### ▶️ **Start (Produção Local)**
```bash
npm start
```

**O que faz:**
- ✅ Inicia servidor local na porta 3000
- ✅ Abre automaticamente no navegador
- ❌ Sem hot reload (mais estável)

**Quando usar:**
- Testar versão "final" localmente
- Demonstrações
- Testes de performance

---

### 🔍 **Preview (Porta Alternativa)**
```bash
npm run preview
```

**O que faz:**
- ✅ Inicia servidor na porta 5000
- ✅ Útil se porta 3000 estiver ocupada

---

### 📦 **Build**
```bash
npm run build
```

**O que faz:**
- ✅ Valida que tudo está pronto para deploy
- ✅ Mostra mensagem de confirmação

---

## 🎯 Fluxo de Trabalho Recomendado

### 1. **Desenvolvimento Diário:**
```bash
# Abra o terminal no projeto e rode:
npm run dev

# O navegador abre automaticamente
# Edite index.html e veja mudanças instantâneas!
```

### 2. **Testar Antes de Commitar:**
```bash
npm start

# Teste todas as funcionalidades
# Se tudo ok, commit e push
```

### 3. **Deploy:**
```bash
npm run build

# Se ok, faça deploy na Vercel/Netlify
```

---

## 💡 Dicas de Performance

### Durante Desenvolvimento:
1. Use sempre `npm run dev`
2. Deixe o servidor rodando enquanto codifica
3. Abra DevTools (F12) para monitorar

### Hot Reload:
- Salve o arquivo → Página recarrega sozinha
- Muito mais rápido que F5 manual
- Preserva estado quando possível

### Cache:
- Se mudanças não aparecerem: `Ctrl+Shift+R` (hard reload)
- Limpe cache: `Ctrl+Shift+Del`

---

## 🔧 Configurações do Live Server

Arquivo: `package.json`

```json
{
  "scripts": {
    "dev": "live-server --port=3000 --host=localhost --open=/index.html --watch=index.html,config.json"
  }
}
```

**Parâmetros:**
- `--port=3000` - Porta do servidor
- `--host=localhost` - Host local
- `--open=/index.html` - Arquivo inicial
- `--watch=...` - Arquivos para monitorar

**Customizar:**
- Mudar porta: altere `3000` para outra
- Adicionar arquivos: adicione em `--watch`

---

## 🐛 Resolução de Problemas

### Erro: "Porta já em uso"
```bash
# Use porta alternativa:
npm run preview

# Ou mate processo na porta 3000:
# Windows: netstat -ano | findstr :3000
# Depois: taskkill /PID NUMERO /F
```

### Erro: "live-server não encontrado"
```bash
# Reinstale dependências:
npm install

# Ou instale globalmente:
npm install -g live-server
```

### Mudanças não aparecem
```bash
# 1. Hard reload: Ctrl+Shift+R
# 2. Limpe cache do navegador
# 3. Restart do servidor: Ctrl+C e npm run dev
```

---

## 🚀 Performance vs HTML Direto

### Abrindo HTML Direto (file://):
- ❌ CORS pode bloquear recursos
- ❌ LocalStorage pode ter problemas
- ❌ Sem hot reload
- ❌ Mais lento
- ❌ Alguns features podem não funcionar

### Com npm run dev (http://localhost):
- ✅ Sem problemas de CORS
- ✅ LocalStorage funciona perfeitamente
- ✅ Hot reload automático
- ✅ Mais rápido
- ✅ Ambiente real de produção
- ✅ Melhor para debug

---

## 📊 Comparação de Comandos

| Comando | Porta | Hot Reload | Quando Usar |
|---------|-------|------------|-------------|
| `npm run dev` | 3000 | ✅ Sim | Desenvolvimento |
| `npm start` | 3000 | ❌ Não | Testes finais |
| `npm run preview` | 5000 | ✅ Sim | Porta alternativa |
| `npm run build` | - | - | Antes do deploy |

---

## 🎉 Pronto para Começar!

```bash
# Comando mais usado (memorize este):
npm run dev
```

**E é só isso!** 🚀

Agora você tem um ambiente de desenvolvimento profissional com hot reload e melhor performance!

