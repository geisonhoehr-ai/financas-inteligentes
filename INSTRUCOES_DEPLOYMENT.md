# Instruções para Deploy - Correções Implementadas

## ⚠️ AÇÕES NECESSÁRIAS ANTES DO DEPLOY

### 1. Aplicar Migration SQL no Supabase (OBRIGATÓRIO)

Para que a funcionalidade de "Pago" funcione, você precisa executar a migration SQL:

1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Abra o arquivo `migrations/add_pago_field.sql`
5. Copie todo o conteúdo
6. Cole no SQL Editor do Supabase
7. Clique em **RUN** ou pressione `Ctrl + Enter`
8. Verifique se apareceu "Success" sem erros

**Sem esta migration, os campos "pago" não funcionarão!**

---

## 2. Corrigir URL Principal no Vercel

### Problema
- ❌ `https://financas-inteligentes.vercel.app/` não funciona
- ✅ `https://suas-financas-inteligentes-git-master-geisonhoehr.vercel.app/` funciona

### Solução
1. Acesse https://vercel.com/dashboard
2. Encontre o projeto `financas-inteligentes`
3. Verifique:
   - Se o último deploy foi bem-sucedido
   - Se está apontando para o branch `master`
   - Se há algum erro no build
4. Se necessário:
   - Clique em **Redeploy** no último deployment
   - Ou faça um novo commit para forçar rebuild
5. Aguarde o deploy completar (2-3 minutos)
6. Teste a URL principal novamente

**Isso não é problema de código, apenas configuração do Vercel.**

---

## 3. Deploy do Código

### Via Git (Recomendado)

```bash
# Verificar status
git status

# Adicionar todos os arquivos modificados
git add .

# Commit com mensagem descritiva
git commit -m "fix: correções nas páginas de assinaturas, dívidas, investimentos, ferramentas e adição de tag pago"

# Push para o repositório
git push origin master
```

O Vercel detectará automaticamente e fará o deploy.

### Via Vercel CLI (Alternativa)

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 4. Testes Pós-Deploy

### Checklist de Testes Obrigatórios

#### Assinaturas
- [ ] Criar nova assinatura ATIVA
- [ ] Criar nova assinatura INATIVA
- [ ] Editar assinatura existente
- [ ] Verificar se dia de vencimento aparece corretamente
- [ ] Verificar se badge de status (Ativa/Inativa) aparece
- [ ] Verificar se gasto mensal no card só soma as ativas

#### Dívidas
- [ ] Criar dívida selecionando membro da família
- [ ] Criar dívida digitando nome livre (opção "outro")
- [ ] Verificar se validação funciona (nome obrigatório)
- [ ] Marcar dívida como paga
- [ ] Cancelar dívida

#### Investimentos
- [ ] Criar novo investimento
- [ ] Editar investimento existente
- [ ] Excluir investimento (deve ir para lixeira)
- [ ] Verificar cálculo de rentabilidade

#### Ferramentas (Dev)
- [ ] Verificar se nome da página mudou para "Dev"
- [ ] Criar nova ferramenta
- [ ] Editar ferramenta existente
- [ ] Excluir ferramenta

#### Gastos
- [ ] Criar gasto SEM marcar como pago
- [ ] Criar gasto MARCANDO como pago
- [ ] Verificar se badge "✓ Pago" aparece
- [ ] Verificar se background fica verde quando pago
- [ ] Verificar se valor fica com line-through quando pago
- [ ] Editar gasto e marcar como pago

#### Contas Fixas
- [ ] Criar conta fixa
- [ ] Verificar visualização de conta paga vs não paga
- [ ] Editar conta fixa

---

## 5. Monitoramento

### Logs a Verificar

1. **Console do navegador** (F12):
   - Não deve ter erros em vermelho
   - Avisos amarelos são aceitáveis

2. **Vercel Dashboard**:
   - Verificar logs de build
   - Verificar logs de runtime

3. **Supabase Dashboard**:
   - Verificar queries no Query Performance
   - Verificar se não há erros nos logs

---

## 6. Rollback (Se Necessário)

Se algo der errado após o deploy:

### Via Vercel Dashboard
1. Acesse o projeto no Vercel
2. Vá em **Deployments**
3. Encontre o deployment anterior que funcionava
4. Clique nos 3 pontos (...)
5. Selecione **Promote to Production**

### Via Git
```bash
# Voltar para o commit anterior
git revert HEAD

# Push
git push origin master
```

---

## Resumo das Alterações

### ✅ Arquivos Modificados
- `app/assinaturas/page.tsx` - Campo status e visualização melhorada
- `app/dividas/page.tsx` - Opção de nome livre
- `app/investimentos/page.tsx` - Não modificado (hook alterado)
- `app/ferramentas/page.tsx` - Nome mudado para "Dev"
- `app/gastos/page.tsx` - Tag "Pago" adicionada
- `app/contas-fixas/page.tsx` - Tag "Pago" adicionada
- `hooks/use-investimentos.tsx` - Insert/Update direto
- `hooks/use-ferramentas.tsx` - Insert/Update direto

### ✅ Arquivos Criados
- `migrations/add_pago_field.sql` - Migration para campo "pago"
- `RELATORIO_CORRECOES_10_10_2025.md` - Documentação completa
- `INSTRUCOES_DEPLOYMENT.md` - Este arquivo

### ⚠️ Nenhum Arquivo Foi Deletado

---

## Suporte

Se encontrar algum problema:

1. Verifique os logs do console (F12)
2. Verifique os logs do Vercel
3. Verifique se a migration SQL foi aplicada
4. Verifique se não há erros de TypeScript: `npm run build`
5. Limpe cache e cookies do navegador

---

## Status Final

✅ **TODAS AS CORREÇÕES IMPLEMENTADAS**
✅ **CÓDIGO SEM ERROS DE LINTER**
✅ **PRONTO PARA PRODUÇÃO**

⚠️ **LEMBRE-SE DE APLICAR A MIGRATION SQL!**

---

*Última atualização: 10/10/2025*

