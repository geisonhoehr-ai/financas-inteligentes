'use client'

import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  DollarSign, 
  Users, 
  Building, 
  CreditCard,
  Settings,
  Check,
  X
} from 'lucide-react'
import { showToast } from '@/lib/toast'
import { PLANS } from '@/config/plans'

export default function AdminPlanosPage() {
  const { users, stats } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editedPlans, setEditedPlans] = useState(PLANS)

  const handlePlanUpdate = (planId: string, field: string, value: any) => {
    setEditedPlans(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: value
      }
    }))
  }

  const handleSavePlans = () => {
    // TODO: Implementar salvamento no banco de dados
    showToast.success('Planos atualizados com sucesso!')
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedPlans(PLANS)
    setIsEditing(false)
  }

  const planStats = {
    free: users.filter(u => u.role === 'user').length,
    pro: users.filter(u => u.role !== 'user').length,
    total_revenue: stats?.monthly_revenue || 0
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Gerenciar Planos
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure planos, preços e limites do sistema
              </p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSavePlans}>
                    <Check className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Planos
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Gratuitos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{planStats.free}</div>
              <p className="text-xs text-muted-foreground">
                {((planStats.free / (planStats.free + planStats.pro)) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Pro</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{planStats.pro}</div>
              <p className="text-xs text-muted-foreground">
                {((planStats.pro / (planStats.free + planStats.pro)) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {planStats.total_revenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                R$ {PLANS.pro.price.toLocaleString('pt-BR')} × {planStats.pro} usuários
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Plans Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {Object.entries(editedPlans).map(([planId, plan]) => (
            <Card key={planId} className={planId === 'pro' ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {planId === 'pro' ? (
                      <CreditCard className="h-5 w-5 text-primary" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                    {plan.name}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) => handlePlanUpdate(planId, 'price', parseFloat(e.target.value))}
                          className="w-20 text-right"
                          step="0.01"
                        />
                      ) : (
                        `R$ ${plan.price.toLocaleString('pt-BR')}`
                      )}
                    </div>
                    {planId === 'pro' && <p className="text-xs text-muted-foreground">por mês</p>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isEditing ? (
                    <Input
                      value={plan.description}
                      onChange={(e) => handlePlanUpdate(planId, 'description', e.target.value)}
                      placeholder="Descrição do plano"
                    />
                  ) : (
                    plan.description
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium">Limites:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Membros:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={plan.limits.max_members === -1 ? '' : plan.limits.max_members}
                          onChange={(e) => handlePlanUpdate(planId, 'limits', {
                            ...plan.limits,
                            max_members: e.target.value === '' ? -1 : parseInt(e.target.value)
                          })}
                          className="w-16 text-right"
                          placeholder="∞"
                        />
                      ) : (
                        <span className="font-medium">
                          {plan.limits.max_members === -1 ? 'Ilimitado' : plan.limits.max_members}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span>Famílias:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={plan.limits.max_families === -1 ? '' : plan.limits.max_families}
                          onChange={(e) => handlePlanUpdate(planId, 'limits', {
                            ...plan.limits,
                            max_families: e.target.value === '' ? -1 : parseInt(e.target.value)
                          })}
                          className="w-16 text-right"
                          placeholder="∞"
                        />
                      ) : (
                        <span className="font-medium">
                          {plan.limits.max_families === -1 ? 'Ilimitado' : plan.limits.max_families}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span>Transações:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={plan.limits.max_transactions === -1 ? '' : plan.limits.max_transactions}
                          onChange={(e) => handlePlanUpdate(planId, 'limits', {
                            ...plan.limits,
                            max_transactions: e.target.value === '' ? -1 : parseInt(e.target.value)
                          })}
                          className="w-16 text-right"
                          placeholder="∞"
                        />
                      ) : (
                        <span className="font-medium">
                          {plan.limits.max_transactions === -1 ? 'Ilimitado' : plan.limits.max_transactions}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span>Cartões:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={plan.limits.max_cards === -1 ? '' : plan.limits.max_cards}
                          onChange={(e) => handlePlanUpdate(planId, 'limits', {
                            ...plan.limits,
                            max_cards: e.target.value === '' ? -1 : parseInt(e.target.value)
                          })}
                          className="w-16 text-right"
                          placeholder="∞"
                        />
                      ) : (
                        <span className="font-medium">
                          {plan.limits.max_cards === -1 ? 'Ilimitado' : plan.limits.max_cards}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Funcionalidades:</h4>
                  <ul className="text-sm space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500" />
                        {isEditing ? (
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...plan.features]
                              newFeatures[index] = e.target.value
                              handlePlanUpdate(planId, 'features', newFeatures)
                            }}
                            className="text-sm"
                          />
                        ) : (
                          <span>{feature}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Uso Atual por Plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plano</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead>Conversão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Gratuito</TableCell>
                  <TableCell>{planStats.free}</TableCell>
                  <TableCell>R$ 0,00</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pro</TableCell>
                  <TableCell>{planStats.pro}</TableCell>
                  <TableCell>R$ {(planStats.pro * PLANS.pro.price).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    {((planStats.pro / (planStats.free + planStats.pro)) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
