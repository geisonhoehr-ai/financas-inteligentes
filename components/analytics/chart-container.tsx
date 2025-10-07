'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react'

interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface ChartContainerProps {
  data: ChartData[]
  title: string
  type: 'line' | 'area' | 'bar' | 'pie'
  dataKey: string
  color?: string
  height?: number
}

export function ChartContainer({ 
  data, 
  title, 
  type, 
  dataKey, 
  color = '#8884d8',
  height = 300 
}: ChartContainerProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
          </LineChart>
        )
      
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>
        )
      
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        )
      
      case 'pie':
        const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff']
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )
      
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'line' && <TrendingUp className="h-5 w-5" />}
          {type === 'area' && <TrendingUp className="h-5 w-5" />}
          {type === 'bar' && <DollarSign className="h-5 w-5" />}
          {type === 'pie' && <PieChartIcon className="h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface AnalyticsDashboardProps {
  gastosData: ChartData[]
  receitasData: ChartData[]
  categoriasData: ChartData[]
  investimentosData: ChartData[]
}

export function AnalyticsDashboard({ 
  gastosData, 
  receitasData, 
  categoriasData, 
  investimentosData 
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Análise Financeira</h2>
      </div>

      <Tabs defaultValue="gastos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gastos">Gastos</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="investimentos">Investimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="gastos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartContainer
              data={gastosData}
              title="Evolução dos Gastos"
              type="line"
              dataKey="valor"
              color="#ef4444"
            />
            <ChartContainer
              data={gastosData}
              title="Gastos por Período"
              type="bar"
              dataKey="valor"
              color="#f97316"
            />
          </div>
        </TabsContent>

        <TabsContent value="receitas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartContainer
              data={receitasData}
              title="Evolução das Receitas"
              type="area"
              dataKey="valor"
              color="#22c55e"
            />
            <ChartContainer
              data={receitasData}
              title="Receitas Mensais"
              type="bar"
              dataKey="valor"
              color="#10b981"
            />
          </div>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartContainer
              data={categoriasData}
              title="Distribuição por Categoria"
              type="pie"
              dataKey="valor"
              height={400}
            />
            <ChartContainer
              data={categoriasData}
              title="Gastos por Categoria"
              type="bar"
              dataKey="valor"
              color="#8b5cf6"
            />
          </div>
        </TabsContent>

        <TabsContent value="investimentos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartContainer
              data={investimentosData}
              title="Evolução dos Investimentos"
              type="area"
              dataKey="valor"
              color="#3b82f6"
            />
            <ChartContainer
              data={investimentosData}
              title="Rentabilidade"
              type="line"
              dataKey="rentabilidade"
              color="#06b6d4"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
