# 🐛 Debug: Bônus e Penalidades Não Salvando

## 📋 Problema Relatado
Bônus e penalidades dos filhos não estão salvando.

## 🔍 Análise do Sistema

### 1. Fluxo Esperado
```
1. Usuário clica no botão +/- no card do filho
2. Drawer de ajuste abre
3. Usuário seleciona: Bônus ou Penalidade
4. Preenche: Motivo, Valor, Pontos
5. Clica em "Aplicar"
6. Ajuste é salvo na tabela mesada_ajustes
7. TRIGGER atualiza automaticamente:
   - saldo_atual += valor
   - pontos_acumulados += pontos
8. UI é atualizada automaticamente
```

### 2. Verificação da Trigger
A trigger `atualizar_saldo_mesada()` existe e deveria:
```sql
UPDATE mesadas
SET 
  saldo_atual = saldo_atual + NEW.valor,
  pontos_acumulados = pontos_acumulados + NEW.pontos,
  updated_at = NOW()
WHERE id = NEW.mesada_id;
```

## 🛠️ Debug Implementado

### Logs Adicionados

#### 1. No Componente (app/mesada/page.tsx)
```typescript
console.log('=== DEBUG AJUSTE ===')
console.log('filhoId:', filhoId)
console.log('mesadaId:', mesadaId)
console.log('formData:', formData)
console.log('tipo:', tipo)
console.log('Dados do ajuste a serem enviados:', ajusteData)
```

#### 2. No Hook (hooks/use-mesada.tsx)
```typescript
console.log('=== DEBUG APLICAR AJUSTE MUTATION ===')
console.log('Ajuste recebido:', ajuste)
console.log('Dados a serem inseridos:', insertData)
console.log('Ajuste inserido com sucesso:', data)
```

## 🧪 Como Testar Agora

### Pré-requisitos
1. **Filho deve ter mesada configurada**
   - Se o filho não tiver mesada, você verá um alerta
   - Configure a mesada antes de aplicar ajustes

### Passos do Teste

1. **Acesse a mesada**
   ```
   http://localhost:3000/mesada
   ```

2. **Verifique se o filho tem mesada configurada**
   - O card do filho deve mostrar: Saldo, Pontos, Nível
   - Se não mostrar, clique em "Configurar Mesada"

3. **Aplique um ajuste**
   - Clique no botão "+/-" no card do filho
   - Selecione "Bônus" ou "Penalidade"
   - Preencha os campos
   - Clique em "Aplicar"

4. **Abra o Console (F12)**
   - Observe os logs de debug
   - Procure por erros

## 🔴 Possíveis Problemas

### 1. Filho Sem Mesada Configurada
**Sintoma**: Alert "Filho ou mesada não identificados"
**Solução**: Configure a mesada primeiro

### 2. Trigger Não Executada
**Sintoma**: Ajuste salvo mas saldo não atualiza
**Solução**: Verificar se trigger existe no banco

### 3. Erro de RLS
**Sintoma**: Erro de permissão no console
**Solução**: Verificar políticas RLS da tabela mesada_ajustes

### 4. Query Não Atualizada
**Sintoma**: Dados salvos mas UI não atualiza
**Solução**: Invalidação de query já corrigida

## 📊 Verificações a Fazer

### No Console do Navegador
```
=== DEBUG AJUSTE ===
filhoId: [UUID]
mesadaId: [UUID] ← DEVE TER VALOR
formData: {...}
tipo: 'bonus' ou 'penalidade'

=== DEBUG APLICAR AJUSTE MUTATION ===
Ajuste recebido: {...}
Dados a serem inseridos: {...}
Ajuste inserido com sucesso: {...}
```

### Erros Comuns
```
❌ mesadaId: undefined → Filho sem mesada configurada
❌ "relation does not exist" → Tabela não criada
❌ "permission denied" → Problema de RLS
❌ "null value in column" → Campo obrigatório faltando
```

## 🔧 Próximos Passos

1. **Execute o teste** conforme descrito
2. **Copie os logs** do console
3. **Me informe**:
   - Os logs apareceram?
   - Qual erro específico apareceu?
   - O saldo atualizou?
   - Os pontos atualizaram?

## 📝 Informações Importantes

### Tabela: mesada_ajustes
```sql
- mesada_id: UUID (referência à mesada)
- filho_id: UUID (referência ao filho)
- tipo: 'bonus' | 'penalidade' | 'tarefa' | 'presente'
- motivo: TEXT (descrição)
- valor: DECIMAL (pode ser negativo)
- pontos: INTEGER (pode ser negativo)
- aplicado_por: UUID (quem aplicou)
```

### Cálculo de Valores
```typescript
// Bônus
valor: +10.00 → saldo += 10.00
pontos: +50 → pontos += 50

// Penalidade
valor: -10.00 → saldo -= 10.00
pontos: -50 → pontos -= 50
```

---

**Teste agora e me informe os resultados! 🎯**
