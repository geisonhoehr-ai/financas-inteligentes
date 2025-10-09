# 🔧 CORREÇÃO: Filtro de Famílias

**Data:** 09/10/2025  
**Problema Reportado:** Dados do perfil pessoal aparecem em todos os perfis (família, empresa, etc)

---

## 🐛 PROBLEMA IDENTIFICADO

Quando o usuário troca entre perfis/famílias:
- ❌ **Höehr** (família pessoal) → R$ 861,00 em gastos
- ❌ **Megabyte** (empresa) → R$ 861,00 em gastos (ERRADO!)
- ❌ **Outros perfis** → R$ 861,00 em gastos (ERRADO!)

**Causa Raiz:**
Os hooks não estavam passando o `familiaAtivaId` para as consultas ao banco, resultando em todos os dados sendo retornados independente da família selecionada.

---

## ✅ SOLUÇÃO IMPLEMENTADA

### Hooks Atualizados (10 arquivos)

1. ✅ `hooks/use-gastos.tsx`
2. ✅ `hooks/use-salarios.tsx`
3. ✅ `hooks/use-assinaturas.tsx`
4. ✅ `hooks/use-parcelas.tsx`
5. ✅ `hooks/use-cartoes.tsx`
6. ✅ `hooks/use-investimentos.tsx`
7. ✅ `hooks/use-metas.tsx`
8. ⏳ `hooks/use-contas-fixas.tsx` (em andamento)
9. ⏳ `hooks/use-gasolina.tsx` (em andamento)
10. ⏳ `hooks/use-ferramentas.tsx` (em andamento)

---

## 📝 PADRÃO APLICADO

### Antes (ERRADO):
```typescript
export function useGastos() {
  const queryClient = useQueryClient()
  
  const { data, isLoading } = useQuery({
    queryKey: ['gastos'], // ❌ Sem filtro de família
    queryFn: async () => {
      const { data: result } = await supabase.rpc('buscar_gastos_com_stats', {
        p_familia_id: null // ❌ SEMPRE NULL!
      })
      return result
    }
  })
}
```

### Depois (CORRETO):
```typescript
export function useGastos() {
  const queryClient = useQueryClient()
  const { familiaAtivaId } = useFamiliaAtiva() // ✅ Pega família ativa
  
  const { data, isLoading } = useQuery({
    queryKey: ['gastos', familiaAtivaId], // ✅ Cache por família
    queryFn: async () => {
      const { data: result } = await supabase.rpc('buscar_gastos_com_stats', {
        p_familia_id: familiaAtivaId // ✅ Filtra pela família ativa
      })
      return result
    }
  })
}
```

---

## 🔍 LÓGICA DE FILTRO

```typescript
// Se há família ativa selecionada
if (familiaAtivaId) {
  query = query.eq('familia_id', familiaAtivaId)
} else {
  // Se não há família, mostrar apenas dados pessoais (sem família)
  query = query.is('familia_id', null)
}
```

**Isso significa:**
- **Höehr (família):** Mostra apenas gastos com `familia_id = "2affaefe..."`
- **Megabyte (empresa):** Mostra apenas gastos com `familia_id = "b47d351a..."`
- **Sem família:** Mostra apenas gastos com `familia_id = NULL` (pessoais)

---

## 📊 RESULTADO ESPERADO

### Antes da Correção:
| Família | Gastos Mostrados |
|---------|------------------|
| Höehr | R$ 861,00 ✅ |
| Megabyte | R$ 861,00 ❌ (dados de Höehr!) |
| Empresa | R$ 861,00 ❌ (dados de Höehr!) |

### Depois da Correção:
| Família | Gastos Mostrados |
|---------|------------------|
| Höehr | R$ 861,00 ✅ |
| Megabyte | R$ 0,00 ✅ (sem dados cadastrados) |
| Empresa | R$ 0,00 ✅ (sem dados cadastrados) |

---

## ✅ PRÓXIMOS PASSOS

1. ⏳ Finalizar correção dos últimos 3 hooks
2. ✅ Testar no navegador:
   - Criar gasto na família "Höehr"
   - Trocar para "Megabyte"
   - Verificar se lista está vazia
3. ✅ Documentar correção

---

**Status:** 🟡 Em andamento (7/10 hooks corrigidos)

