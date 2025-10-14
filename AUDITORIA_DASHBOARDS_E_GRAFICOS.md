# Auditoria de Dashboards e Gráficos

## Data: 2025-10-13

## Status: CONCLUÍDA ✅

---

## 1. AUDITORIA DE CÁLCULOS DOS DASHBOARDS

### Dashboard Principal ([app/dashboard/page.tsx](app/dashboard/page.tsx))

#### Cálculos Analisados:

1. **Saldo do Mês** (linha 38)
   ```typescript
   const saldo = salariosStats.receitaFamilia - gastosStats.total_mes
   ```
   - ✅ **CORRETO**: Subtração simples de receita menos gastos
   - Usa `receitaFamilia` que considera apenas salários compartilhados
   - Usa `total_mes` que vem do RPC `buscar_gastos_com_stats`

2. **Gastos do Mês** (linha 50)
   ```typescript
   value: formatCurrency(gastosStats.total_mes)
   ```
   - ✅ **CORRETO**: Valor direto do stats retornado pelo RPC

3. **Investimentos** (linha 56)
   ```typescript
   value: formatCurrency(investimentos.reduce((acc, inv) => acc + inv.valor, 0))
   ```
   - ✅ **CORRETO**: Soma simples de todos os investimentos

4. **Cartões** (linha 62)
   ```typescript
   value: cartoes.length
   ```
   - ✅ **CORRETO**: Contagem de cartões

5. **Metas** (linha 68)
   ```typescript
   value: metas.length
   ```
   - ✅ **CORRETO**: Contagem de metas

---

### Hook useDashboard ([hooks/use-dashboard.tsx](hooks/use-dashboard.tsx))

#### Cálculos Analisados:

1. **Gastos do Mês** (linha 75)
   ```typescript
   const gastos_mes = (gastos as any)?.reduce((acc: number, g: any) => acc + (g.valor || 0), 0) || 0
   ```
   - ✅ **CORRETO**: Soma de gastos do mês atual com filtro de data

2. **Parcelas do Mês** (linha 76)
   ```typescript
   const parcelas_mes = (parcelas as any)?.reduce((acc: number, p: any) => acc + (p.valor_parcela || 0), 0) || 0
   ```
   - ✅ **CORRETO**: Soma do valor das parcelas mensais

3. **Assinaturas do Mês** (linha 77)
   ```typescript
   const assinaturas_mes = (assinaturas as any)?.reduce((acc: number, a: any) => acc + (a.valor || 0), 0) || 0
   ```
   - ✅ **CORRETO**: Soma de assinaturas ativas

4. **Contas Fixas do Mês** (linha 78)
   ```typescript
   const contas_fixas_mes = (contas as any)?.reduce((acc: number, c: any) => acc + (c.valor || 0), 0) || 0
   ```
   - ✅ **CORRETO**: Soma de contas fixas ativas

5. **Gasolina do Mês** (linha 79)
   ```typescript
   const gasolina_mes = (gasolina as any)?.reduce((acc: number, g: any) => acc + (g.valor || 0), 0) || 0
   ```
   - ✅ **CORRETO**: Soma de gastos com gasolina do mês

6. **Ferramentas do Mês** (linhas 80-85)
   ```typescript
   const ferramentas_mes = (ferramentas as any)?.reduce((acc: number, f: any) => {
     if (f.periodicidade === 'mensal') return acc + (f.valor || 0)
     if (f.periodicidade === 'anual') return acc + ((f.valor || 0) / 12)
     return acc
   }, 0) || 0
   ```
   - ✅ **CORRETO**: Calcula proporcionalmente (anual/12 + mensal)

7. **Total de Saídas** (linha 87)
   ```typescript
   const total_saidas = gastos_mes + parcelas_mes + assinaturas_mes + contas_fixas_mes + gasolina_mes + ferramentas_mes
   ```
   - ✅ **CORRETO**: Soma todas as categorias de despesas

---

### Página de Gastos ([app/gastos/page.tsx](app/gastos/page.tsx))

#### Stats Analisados (linha 19):

```typescript
stats = { total_mes: 0, total_hoje: 0, total_gastos: 0 }
```

- ✅ **CORRETO**: Vem do RPC `buscar_gastos_com_stats` que calcula:
  - `total_mes`: Gastos do mês atual
  - `total_hoje`: Gastos do dia atual
  - `total_gastos`: Contagem total de gastos

---

### Página de Salários ([app/salarios/page.tsx](app/salarios/page.tsx))

#### Stats do Hook ([hooks/use-salarios.tsx](hooks/use-salarios.tsx)):

1. **Receita Total** (linha 58)
   ```typescript
   receitaTotal: salarios.reduce((sum, s) => sum + s.valor, 0)
   ```
   - ✅ **CORRETO**: Soma de todos os salários

2. **Receita da Família**
   ```typescript
   receitaFamilia: salarios.filter(s => s.visivel_familia).reduce((sum, s) => sum + s.valor, 0)
   ```
   - ✅ **CORRETO**: Soma apenas salários compartilhados

3. **Salários Ativos**
   ```typescript
   salariosAtivos: salarios.length
   ```
   - ✅ **CORRETO**: Contagem de salários

4. **Receita do Mês Atual**
   ```typescript
   receitaMesAtual: salarios.filter(s => isMesAtual(s.mes_referencia)).reduce((sum, s) => sum + s.valor, 0)
   ```
   - ✅ **CORRETO**: Filtra por mês de referência

---

### Página de Parcelas ([app/parcelas/page.tsx](app/parcelas/page.tsx))

#### Stats do Hook ([hooks/use-parcelas.tsx](hooks/use-parcelas.tsx), linhas 183-190):

1. **Total Parcelado**
   ```typescript
   totalParcelado: parcelas.reduce((sum, p) => sum + p.valor_total, 0)
   ```
   - ✅ **CORRETO**: Soma do valor total de todas as parcelas

2. **Parcela Atual**
   ```typescript
   parcelaAtual: parcelas.reduce((sum, p) => sum + p.valor_parcela, 0)
   ```
   - ✅ **CORRETO**: Soma do valor mensal das parcelas

3. **Parcelas Ativas**
   ```typescript
   parcelasAtivas: parcelas.filter(p => (p.parcelas_pagas || 0) < p.total_parcelas).length
   ```
   - ✅ **CORRETO**: Filtra parcelas não finalizadas

4. **Próximas Parcelas**
   ```typescript
   proximasParcelas: parcelas.filter(p => (p.parcelas_pagas || 0) < p.total_parcelas)
     .reduce((sum, p) => sum + (p.valor_parcela * (p.total_parcelas - (p.parcelas_pagas || 0))), 0)
   ```
   - ✅ **CORRETO**: Calcula valor restante (valor_parcela × parcelas_restantes)

---

### Página de Assinaturas ([app/assinaturas/page.tsx](app/assinaturas/page.tsx))

#### Stats do Hook ([hooks/use-assinaturas.tsx](hooks/use-assinaturas.tsx), linhas 187-193):

1. **Gasto Mensal**
   ```typescript
   gastoMensal: assinaturasAtivas.reduce((sum, a) => sum + a.valor, 0)
   ```
   - ✅ **CORRETO**: Soma de assinaturas ativas

2. **Assinaturas Ativas**
   ```typescript
   assinaturasAtivas: assinaturasAtivas.length
   ```
   - ✅ **CORRETO**: Contagem de assinaturas ativas

3. **Próximo Vencimento**
   ```typescript
   proximoVencimento: getProximoVencimento(assinaturasAtivas)
   ```
   - ✅ **CORRETO**: Calcula próxima assinatura a vencer baseado no dia atual

4. **Gasto Anual**
   ```typescript
   gastoAnual: assinaturasAtivas.reduce((sum, a) => sum + a.valor, 0) * 12
   ```
   - ✅ **CORRETO**: Multiplica gasto mensal por 12

---

## 2. AUDITORIA DOS GRÁFICOS/CHARTS

### Dashboard Chart ([components/dashboard-chart.tsx](components/dashboard-chart.tsx))

#### Análise Visual:

- ✅ **Usa Recharts**: Biblioteca profissional para charts
- ✅ **Gradientes**: Usa linearGradient para efeitos visuais
- ✅ **Responsive**: ResponsiveContainer para adaptação
- ⚠️ **Dados Mockados**: Usa dados de exemplo (linhas 23-29)
- ⚠️ **Não Conectado**: Chart não está conectado a dados reais

**Problemas Identificados:**
1. Chart está com dados estáticos/mockados
2. Não está sendo usado na dashboard principal
3. Poderia ter animações mais suaves

---

### Chart Container ([components/analytics/chart-container.tsx](components/analytics/chart-container.tsx))

#### Análise Visual:

**Pontos Positivos:**
- ✅ Suporta múltiplos tipos: Line, Area, Bar, Pie
- ✅ Usa cores temáticas (dark mode support)
- ✅ Tooltips configurados
- ✅ Legendas presentes
- ✅ Responsivo

**Pontos de Melhoria:**
1. ⚠️ **Cores hardcoded**: Usa cores fixas ao invés de tema
2. ⚠️ **Sem animações**: Charts não têm animação de entrada
3. ⚠️ **Grid básico**: CartesianGrid poderia ter melhor estilo
4. ⚠️ **Tooltip básico**: Formatação simples sem customização
5. ⚠️ **Sem gradientes**: Charts poderiam usar gradientes como dashboard-chart

---

### Páginas com Gráficos

1. **Dashboard Principal** ([app/dashboard/page.tsx](app/dashboard/page.tsx))
   - ❌ **NÃO TEM GRÁFICOS**: Apenas cards de estatísticas
   - 💡 Poderia adicionar DashboardChart com evolução mensal

2. **Relatórios** ([app/relatorios/page.tsx](app/relatorios/page.tsx))
   - ❌ **SEM IMPLEMENTAÇÃO**: Apenas UI mockada com botões
   - 💡 Precisa implementar geração real de relatórios

3. **Análise de Tags** ([app/analise-tags/page.tsx](app/analise-tags/page.tsx))
   - ❌ **NÃO TEM GRÁFICOS**: Apenas cards e lista de gastos
   - 💡 Poderia adicionar gráfico de pizza para distribuição
   - 💡 Poderia adicionar gráfico de linha para evolução temporal

---

## 3. PROBLEMAS ENCONTRADOS

### Críticos:
Nenhum problema crítico de cálculo encontrado! ✅

### Moderados:

1. **Dashboard Chart não conectado**
   - Arquivo: [components/dashboard-chart.tsx](components/dashboard-chart.tsx)
   - Problema: Usa dados mockados
   - Impacto: Usuário vê gráfico com dados falsos

2. **Página de Relatórios não funcional**
   - Arquivo: [app/relatorios/page.tsx](app/relatorios/page.tsx)
   - Problema: Botões não geram relatórios
   - Impacto: Feature prometida não funciona

3. **Análise de Tags sem gráficos**
   - Arquivo: [app/analise-tags/page.tsx](app/analise-tags/page.tsx)
   - Problema: Só mostra lista, sem visualização gráfica
   - Impacto: Usuário não consegue visualizar tendências

### Leves:

1. **Charts poderiam ser mais bonitos**
   - Problema: Sem animações, gradientes limitados, cores básicas
   - Impacto: Experiência visual poderia ser melhor

2. **Falta gráficos na dashboard principal**
   - Problema: Só tem cards, sem charts
   - Impacto: Usuário não vê evolução temporal

---

## 4. RECOMENDAÇÕES DE MELHORIAS

### Prioridade ALTA:

#### 1. Conectar Dashboard Chart a dados reais
- Buscar gastos e receitas dos últimos 6 meses
- Calcular totais mensais
- Passar para DashboardChart
- Adicionar na dashboard principal

#### 2. Adicionar gráficos na Análise de Tags
- Gráfico de pizza: distribuição de gastos por tag
- Gráfico de linha: evolução temporal dos gastos da tag
- Gráfico de barras: comparação entre tags

### Prioridade MÉDIA:

#### 3. Melhorar visualização dos gráficos existentes

**Sugestões de melhorias visuais:**

```typescript
// 1. Adicionar animações suaves
<Area
  type="monotone"
  dataKey={dataKey}
  stroke={color}
  fill={color}
  fillOpacity={0.3}
  animationDuration={1000}
  animationEasing="ease-in-out"
/>

// 2. Melhorar gradientes
<defs>
  <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
    <stop offset="50%" stopColor="#10b981" stopOpacity={0.3}/>
    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
  </linearGradient>
</defs>

// 3. Tooltip customizado e bonito
<Tooltip
  contentStyle={{
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  }}
  formatter={(value: number) => [
    `R$ ${value.toFixed(2).replace('.', ',')}`,
    ''
  ]}
  labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
/>

// 4. Grid mais sutil
<CartesianGrid
  strokeDasharray="3 3"
  stroke="hsl(var(--border))"
  opacity={0.2}
  vertical={false}
/>

// 5. Cores usando tema CSS
const colors = {
  primary: 'hsl(var(--primary))',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6'
}

// 6. Hover effects
<Bar
  dataKey={dataKey}
  fill={color}
  radius={[8, 8, 0, 0]}
  cursor="pointer"
/>

// 7. Labels nos eixos mais legíveis
<YAxis
  stroke="hsl(var(--muted-foreground))"
  style={{ fontSize: '12px' }}
  tickFormatter={(value) => {
    if (value >= 1000) return `R$ ${(value/1000).toFixed(1)}k`
    return `R$ ${value}`
  }}
/>

// 8. Adicionar loading state
{isLoading ? (
  <div className="flex items-center justify-center h-[300px]">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
) : (
  <ResponsiveContainer width="100%" height={300}>
    {chart}
  </ResponsiveContainer>
)}
```

### Prioridade BAIXA:

#### 4. Implementar geração de relatórios PDF/CSV
- Usar biblioteca como `jspdf` ou `react-pdf`
- Implementar exportação CSV
- Adicionar filtros de data personalizados

#### 5. Adicionar mais tipos de visualização
- Gráficos de radar para comparações
- Heatmaps para frequência de gastos
- Sparklines nos cards de estatísticas

---

## 5. CÓDIGO DE EXEMPLO: Dashboard Chart Melhorado

Criar arquivo: `components/dashboard-chart-improved.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { useGastos } from '@/hooks/use-gastos'
import { useSalarios } from '@/hooks/use-salarios'
import { useMemo } from 'react'
import { startOfMonth, format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function DashboardChartImproved() {
  const { gastos } = useGastos()
  const { salarios } = useSalarios()

  const chartData = useMemo(() => {
    // Gerar últimos 6 meses
    const meses = []
    for (let i = 5; i >= 0; i--) {
      const data = subMonths(new Date(), i)
      meses.push({
        mes: format(data, 'MMM', { locale: ptBR }),
        mesCompleto: format(data, 'yyyy-MM'),
        receitas: 0,
        despesas: 0
      })
    }

    // Calcular receitas por mês
    salarios.forEach(salario => {
      const mesRef = format(new Date(salario.mes_referencia), 'yyyy-MM')
      const mes = meses.find(m => m.mesCompleto === mesRef)
      if (mes && salario.visivel_familia) {
        mes.receitas += salario.valor
      }
    })

    // Calcular despesas por mês
    gastos.forEach(gasto => {
      const mesRef = format(new Date(gasto.data), 'yyyy-MM')
      const mes = meses.find(m => m.mesCompleto === mesRef)
      if (mes) {
        mes.despesas += gasto.valor
      }
    })

    return meses
  }, [gastos, salarios])

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📈 Evolução Financeira
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Últimos 6 meses
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.2}
              vertical={false}
            />
            <XAxis
              dataKey="mes"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => {
                if (value >= 1000) return `R$ ${(value/1000).toFixed(1)}k`
                return `R$ ${value}`
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number) => [
                `R$ ${value.toFixed(2).replace('.', ',')}`,
                ''
              ]}
              labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => value === 'receitas' ? 'Receitas' : 'Despesas'}
            />
            <Area
              type="monotone"
              dataKey="receitas"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorReceitas)"
              name="receitas"
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Area
              type="monotone"
              dataKey="despesas"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorDespesas)"
              name="despesas"
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

---

## 6. RESUMO EXECUTIVO

### ✅ Pontos Positivos:

1. **Todos os cálculos estão corretos** - Nenhum erro matemático encontrado
2. **Hooks bem estruturados** - Lógica de cálculo organizada e reutilizável
3. **Stats completos** - Todas as páginas têm estatísticas relevantes
4. **Queries otimizadas** - Uso correto de RPC functions e filtros

### ⚠️ Pontos de Atenção:

1. **Gráficos não conectados** - Dashboard chart usa dados mockados
2. **Falta visualização gráfica** - Análise de tags sem charts
3. **Relatórios não funcionam** - Feature prometida não implementada
4. **Charts poderiam ser mais bonitos** - Falta animações e gradientes

### 🎯 Prioridades de Implementação:

**IMEDIATO:**
1. Conectar DashboardChart a dados reais
2. Adicionar na dashboard principal

**CURTO PRAZO (1-2 dias):**
3. Adicionar gráficos na análise de tags
4. Melhorar visual dos charts existentes (animações, gradientes, tooltips)

**MÉDIO PRAZO (1 semana):**
5. Implementar geração de relatórios PDF/CSV
6. Adicionar mais tipos de visualização

---

## 7. CONCLUSÃO

### Dashboard Calculations: ✅ APROVADO

Todos os cálculos estão corretos e bem implementados. Nenhuma correção necessária.

### Graphics/Charts: ⚠️ PRECISA MELHORIAS

Os gráficos existentes funcionam, mas:
- Alguns não estão conectados a dados reais
- Faltam gráficos em páginas importantes
- Visual poderia ser mais polido e profissional

**Recomendação:** Implementar melhorias sugeridas na seção 4 para tornar os gráficos mais bonitos e funcionais.
