'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useFamiliaAtiva } from '@/hooks/use-familia-ativa'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface EventoFinanceiro {
  id: string
  tipo: 'gasto' | 'receita' | 'conta_fixa' | 'parcela' | 'assinatura' | 'salario'
  descricao: string
  valor: number
  data: Date
  pago?: boolean
  cor: string
}

export default function CalendarioPage() {
  const { familiaAtivaId } = useFamiliaAtiva()
  const [mesAtual, setMesAtual] = useState(new Date())
  const [eventos, setEventos] = useState<EventoFinanceiro[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const carregarEventos = useCallback(async () => {
    setIsLoading(true)
    try {
      const inicio = startOfMonth(mesAtual)
      const fim = endOfMonth(mesAtual)

      const eventosCarregados: EventoFinanceiro[] = []

      // 1. Carregar Gastos
      const { data: gastos } = await supabase
        .from('gastos')
        .select('id, descricao, valor, data')
        .eq('deletado', false)
        .eq('familia_id', familiaAtivaId || '')
        .gte('data', format(inicio, 'yyyy-MM-dd'))
        .lte('data', format(fim, 'yyyy-MM-dd'))

      gastos?.forEach((g: any) => {
        eventosCarregados.push({
          id: g.id,
          tipo: 'gasto',
          descricao: g.descricao,
          valor: g.valor,
          data: new Date(g.data),
          pago: g.pago || false,
          cor: g.pago ? '#10B981' : '#EF4444'
        })
      })

      // 2. Carregar Salários (quando tabela estiver disponível)
      // const { data: salarios } = await supabase
      //   .from('salarios')
      //   .select('id, descricao, valor, data_recebimento')
      //   .eq('deletado', false)
      //   .eq('familia_id', familiaAtivaId || '')
      //   .gte('data_recebimento', format(inicio, 'yyyy-MM-dd'))
      //   .lte('data_recebimento', format(fim, 'yyyy-MM-dd'))

      // salarios?.forEach((s: any) => {
      //   eventosCarregados.push({
      //     id: s.id,
      //     tipo: 'salario',
      //     descricao: s.descricao,
      //     valor: s.valor,
      //     data: new Date(s.data_recebimento),
      //     pago: s.pago || true,
      //     cor: '#10B981'
      //   })
      // })

      // 3. Carregar Contas Fixas (gerar evento para cada dia de vencimento)
      const { data: contasFixas } = await supabase
        .from('contas_fixas')
        .select('id, nome, valor, dia_vencimento')
        .eq('deletado', false)
        .eq('familia_id', familiaAtivaId || '')

      contasFixas?.forEach((c: any) => {
        const diaVencimento = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), c.dia_vencimento)
        if (diaVencimento >= inicio && diaVencimento <= fim) {
          eventosCarregados.push({
            id: c.id,
            tipo: 'conta_fixa',
            descricao: c.nome,
            valor: c.valor,
            data: diaVencimento,
            pago: c.pago || false,
            cor: c.pago ? '#10B981' : '#F97316'
          })
        }
      })

      // 4. Carregar Assinaturas (gerar evento para cada dia de cobrança)
      const { data: assinaturas } = await supabase
        .from('assinaturas')
        .select('id, nome, valor, dia_vencimento, ativa')
        .eq('deletado', false)
        .eq('ativa', true)
        .eq('familia_id', familiaAtivaId || '')

      assinaturas?.forEach((a: any) => {
        const diaVenc = a.dia_vencimento || a.dia_cobranca || 1
        const diaCobranca = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), diaVenc)
        if (diaCobranca >= inicio && diaCobranca <= fim) {
          eventosCarregados.push({
            id: a.id,
            tipo: 'assinatura',
            descricao: a.nome,
            valor: a.valor,
            data: diaCobranca,
            cor: '#8B5CF6'
          })
        }
      })

      // 5. Carregar Parcelas (quando tabela estiver disponível)
      // const { data: parcelas } = await supabase
      //   .from('parcelas')
      //   .select('id, descricao, valor, data_vencimento')
      //   .eq('deletado', false)
      //   .eq('familia_id', familiaAtivaId || '')
      //   .gte('data_vencimento', format(inicio, 'yyyy-MM-dd'))
      //   .lte('data_vencimento', format(fim, 'yyyy-MM-dd'))

      // parcelas?.forEach((p: any) => {
      //   eventosCarregados.push({
      //     id: p.id,
      //     tipo: 'parcela',
      //     descricao: p.descricao,
      //     valor: p.valor,
      //     data: new Date(p.data_vencimento),
      //     pago: p.pago || false,
      //     cor: p.pago ? '#10B981' : '#F59E0B'
      //   })
      // })

      setEventos(eventosCarregados)
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [mesAtual, familiaAtivaId])

  useEffect(() => {
    carregarEventos()
  }, [carregarEventos])

  const dias = eachDayOfInterval({
    start: startOfMonth(mesAtual),
    end: endOfMonth(mesAtual)
  })

  const eventosNoDia = (dia: Date) => {
    return eventos.filter(e => 
      e.data.getDate() === dia.getDate() &&
      e.data.getMonth() === dia.getMonth() &&
      e.data.getFullYear() === dia.getFullYear()
    )
  }

  const totalReceitasMes = eventos
    .filter(e => e.tipo === 'salario' || e.tipo === 'receita')
    .reduce((sum, e) => sum + e.valor, 0)

  const totalDespesasMes = eventos
    .filter(e => e.tipo !== 'salario' && e.tipo !== 'receita')
    .reduce((sum, e) => sum + e.valor, 0)

  const totalPagoMes = eventos
    .filter(e => e.pago && e.tipo !== 'salario')
    .reduce((sum, e) => sum + e.valor, 0)

  const totalPendenteMes = eventos
    .filter(e => !e.pago && e.tipo !== 'salario')
    .reduce((sum, e) => sum + e.valor, 0)

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'salario': return '💰'
      case 'gasto': return '🛒'
      case 'conta_fixa': return '🏠'
      case 'parcela': return '💳'
      case 'assinatura': return '🔄'
      default: return '📝'
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            Calendário Financeiro
          </h2>
          <p className="text-sm text-muted-foreground">
            Visualize todas suas finanças em um calendário
          </p>
        </div>
      </div>

      {/* Resumo do Mês */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalReceitasMes)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-red-500/10 to-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDespesasMes)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalPagoMes)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalPendenteMes)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Navegação */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMesAtual(subMonths(mesAtual, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h3 className="text-xl font-bold capitalize">
              {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
            </h3>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setMesAtual(addMonths(mesAtual, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendário */}
      <Card>
        <CardContent className="p-0">
          {/* Dias da Semana */}
          <div className="grid grid-cols-7 border-b">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
              <div key={dia} className="p-2 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                {dia}
              </div>
            ))}
          </div>

          {/* Dias do Mês */}
          <div className="grid grid-cols-7">
            {/* Espaços vazios antes do primeiro dia */}
            {Array.from({ length: dias[0].getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px] border-r border-b bg-muted/20" />
            ))}

            {/* Dias do mês */}
            {dias.map((dia) => {
              const eventosHoje = eventosNoDia(dia)
              const totalDia = eventosHoje.reduce((sum, e) => {
                if (e.tipo === 'salario') return sum + e.valor
                return sum - e.valor
              }, 0)
              const ehHoje = isToday(dia)

              return (
                <div
                  key={dia.toISOString()}
                  className={`
                    min-h-[120px] p-2 border-r border-b relative
                    ${ehHoje ? 'bg-primary/5 ring-2 ring-primary ring-inset' : ''}
                    hover:bg-accent transition-colors
                  `}
                >
                  {/* Número do Dia */}
                  <div className={`
                    text-sm font-medium mb-2 flex items-center justify-between
                    ${ehHoje ? 'text-primary font-bold' : ''}
                  `}>
                    <span>{dia.getDate()}</span>
                    {totalDia !== 0 && (
                      <span className={`text-xs ${totalDia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalDia > 0 ? '+' : ''}{formatCurrency(totalDia)}
                      </span>
                    )}
                  </div>

                  {/* Eventos do Dia */}
                  <div className="space-y-1">
                    {eventosHoje.slice(0, 3).map((evento) => (
                      <div
                        key={evento.id}
                        className="text-xs p-1 rounded truncate"
                        style={{ 
                          backgroundColor: evento.cor + '20',
                          borderLeft: `3px solid ${evento.cor}`
                        }}
                        title={`${getTipoIcon(evento.tipo)} ${evento.descricao} - ${formatCurrency(evento.valor)}${evento.pago ? ' (Pago)' : ''}`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{getTipoIcon(evento.tipo)}</span>
                          <span className="truncate font-medium">{evento.descricao}</span>
                        </div>
                        <div className={`font-semibold ${evento.tipo === 'salario' ? 'text-green-600' : 'text-red-600'}`}>
                          {evento.tipo === 'salario' ? '+' : '-'}{formatCurrency(evento.valor)}
                        </div>
                      </div>
                    ))}
                    {eventosHoje.length > 3 && (
                      <div className="text-xs text-center text-muted-foreground font-medium">
                        +{eventosHoje.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-sm">💰 Salário</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-sm">🛒 Gasto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span className="text-sm">🏠 Conta Fixa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-sm">💳 Parcela</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span className="text-sm">🔄 Assinatura</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-sm">✓ Pago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

