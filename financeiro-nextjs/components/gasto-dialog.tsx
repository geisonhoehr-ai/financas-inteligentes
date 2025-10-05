'use client'

import { useState } from 'react'
import { useGastos } from '@/hooks/use-gastos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CATEGORIAS, TIPOS_PAGAMENTO, InsertGasto } from '@/types'

interface GastoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GastoDialog({ open, onOpenChange }: GastoDialogProps) {
  const { createGasto, isCreating } = useGastos()
  const [form, setForm] = useState<Partial<InsertGasto>>({
    descricao: '',
    valor: 0,
    usuario_id: 1, // TODO: Get from context
    data: new Date().toISOString().split('T')[0],
    categoria: 'Alimentação',
    tipo_pagamento: 'PIX',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.descricao || !form.valor) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    createGasto(form as InsertGasto)
    setForm({
      descricao: '',
      valor: 0,
      usuario_id: 1,
      data: new Date().toISOString().split('T')[0],
      categoria: 'Alimentação',
      tipo_pagamento: 'PIX',
    })
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">Novo Gasto</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Descrição</label>
            <Input
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Ex: Mercado"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Valor</label>
            <Input
              type="number"
              step="0.01"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: parseFloat(e.target.value) })}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Categoria</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Tipo de Pagamento</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.tipo_pagamento}
              onChange={(e) => setForm({ ...form, tipo_pagamento: e.target.value })}
            >
              {TIPOS_PAGAMENTO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Data</label>
            <Input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating} className="flex-1">
              {isCreating ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
