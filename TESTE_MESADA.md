# Teste da Funcionalidade de Mesada Digital

## Problema Identificado
Você relatou que não consegue adicionar filhos na mesada digital.

## Debug Implementado
Adicionei logs de debug em duas partes:
1. **Página de Mesada** (`app/mesada/page.tsx`) - Linha 356-384
2. **Hook useMesada** (`hooks/use-mesada.tsx`) - Linha 137-174

## Como Testar

### 1. Acesse a aplicação
- Abra http://localhost:3000
- Faça login com: `geisonhoehr@gmail.com` / `123456`

### 2. Selecione uma Família
- **IMPORTANTE**: Você deve selecionar uma família primeiro
- Use o seletor de família no header
- Se não tiver família, crie uma em Configurações

### 3. Acesse a Mesada Digital
- Vá para: http://localhost:3000/mesada
- Clique no botão "Adicionar Filho"

### 4. Preencha o Formulário
- Nome: Digite qualquer nome (ex: "João")
- Idade: Digite uma idade (ex: 10)
- Avatar: Selecione um emoji
- Data de nascimento: Opcional

### 5. Verifique o Console
- Abra as Ferramentas de Desenvolvedor (F12)
- Vá para a aba Console
- Clique em "Adicionar Filho"
- Observe os logs de debug

## Logs Esperados

```
=== DEBUG ADD FILHO ===
familiaAtivaId: [ID_DA_FAMILIA]
formData: {nome: "João", idade: "10", ...}

=== DEBUG CREATE FILHO MUTATION ===
User data: {user: {...}}
Dados para inserir: {...}
```

## Possíveis Problemas

### 1. Família não selecionada
- **Sintoma**: Alert "Por favor, selecione uma família primeiro"
- **Solução**: Selecione uma família no header

### 2. Usuário não autenticado
- **Sintoma**: "Usuário não autenticado"
- **Solução**: Faça login novamente

### 3. Erro de RLS (Row Level Security)
- **Sintoma**: Erro de permissão no console
- **Solução**: Verificar se as políticas RLS estão corretas

### 4. Tabela não existe
- **Sintoma**: "relation does not exist"
- **Solução**: Aplicar migrações do banco

## Próximos Passos

1. Execute o teste conforme descrito acima
2. Copie os logs do console
3. Me informe qual erro específico está aparecendo
4. Com base no erro, posso implementar a correção

## Arquivos Modificados

- `app/mesada/page.tsx` - Adicionado debug no formulário
- `hooks/use-mesada.tsx` - Adicionado debug na mutation
- `debug-mesada.js` - Script de teste (opcional)
