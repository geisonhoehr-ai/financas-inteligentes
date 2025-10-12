// ============================================
// VALIDAÇÕES ROBUSTAS PARA FORMULÁRIOS
// ============================================

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export interface ValidationRule {
  field: string
  value: any
  rules: Array<{
    type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'email' | 'pattern' | 'custom'
    value?: any
    message: string
    validator?: (value: any) => boolean
  }>
}

// ============================================
// VALIDADOR PRINCIPAL
// ============================================

export function validate(rules: ValidationRule[]): ValidationResult {
  const errors: string[] = []

  for (const rule of rules) {
    const { field, value, rules: fieldRules } = rule

    for (const fieldRule of fieldRules) {
      let isValid = true
      const { type, value: ruleValue, message, validator } = fieldRule

      switch (type) {
        case 'required':
          isValid = value !== null && value !== undefined && value !== ''
          break

        case 'min':
          isValid = typeof value === 'number' && value >= ruleValue
          break

        case 'max':
          isValid = typeof value === 'number' && value <= ruleValue
          break

        case 'minLength':
          isValid = typeof value === 'string' && value.length >= ruleValue
          break

        case 'maxLength':
          isValid = typeof value === 'string' && value.length <= ruleValue
          break

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          isValid = typeof value === 'string' && emailRegex.test(value)
          break

        case 'pattern':
          isValid = typeof value === 'string' && new RegExp(ruleValue).test(value)
          break

        case 'custom':
          isValid = validator ? validator(value) : true
          break

        default:
          break
      }

      if (!isValid) {
        errors.push(`${field}: ${message}`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// ============================================
// VALIDAÇÕES ESPECÍFICAS POR ENTIDADE
// ============================================

export const gastoValidation = {
  validate: (data: {
    descricao: string
    valor: number | string
    data: string
    categoria_id?: string
  }): ValidationResult => {
    return validate([
      {
        field: 'descrição',
        value: data.descricao,
        rules: [
          { type: 'required', message: 'A descrição é obrigatória' },
          { type: 'minLength', value: 3, message: 'A descrição deve ter no mínimo 3 caracteres' },
          { type: 'maxLength', value: 200, message: 'A descrição deve ter no máximo 200 caracteres' }
        ]
      },
      {
        field: 'valor',
        value: typeof data.valor === 'string' ? parseFloat(data.valor) : data.valor,
        rules: [
          { type: 'required', message: 'O valor é obrigatório' },
          { type: 'min', value: 0.01, message: 'O valor deve ser maior que zero' },
          { type: 'max', value: 1000000, message: 'O valor deve ser menor que R$ 1.000.000' },
          {
            type: 'custom',
            message: 'O valor deve ser um número válido',
            validator: (v) => !isNaN(v) && isFinite(v)
          }
        ]
      },
      {
        field: 'data',
        value: data.data,
        rules: [
          { type: 'required', message: 'A data é obrigatória' },
          {
            type: 'custom',
            message: 'Data inválida',
            validator: (v) => {
              const date = new Date(v)
              return date instanceof Date && !isNaN(date.getTime())
            }
          }
        ]
      }
    ])
  }
}

export const categoriaValidation = {
  validate: (data: {
    nome: string
    icone: string
    tipo: string
  }): ValidationResult => {
    return validate([
      {
        field: 'nome',
        value: data.nome,
        rules: [
          { type: 'required', message: 'O nome é obrigatório' },
          { type: 'minLength', value: 2, message: 'O nome deve ter no mínimo 2 caracteres' },
          { type: 'maxLength', value: 50, message: 'O nome deve ter no máximo 50 caracteres' }
        ]
      },
      {
        field: 'ícone',
        value: data.icone,
        rules: [
          { type: 'required', message: 'O ícone é obrigatório' },
          { type: 'maxLength', value: 2, message: 'O ícone deve ter no máximo 2 caracteres (emoji)' }
        ]
      },
      {
        field: 'tipo',
        value: data.tipo,
        rules: [
          { type: 'required', message: 'O tipo é obrigatório' },
          {
            type: 'custom',
            message: 'Tipo inválido. Deve ser: gasto, parcela ou receita',
            validator: (v) => ['gasto', 'parcela', 'receita'].includes(v)
          }
        ]
      }
    ])
  }
}

export const metaValidation = {
  validate: (data: {
    nome: string
    valor_objetivo: number | string
    valor_atual?: number | string
  }): ValidationResult => {
    const valorObjetivo = typeof data.valor_objetivo === 'string' ? parseFloat(data.valor_objetivo) : data.valor_objetivo
    const valorAtual = data.valor_atual ? (typeof data.valor_atual === 'string' ? parseFloat(data.valor_atual) : data.valor_atual) : 0

    return validate([
      {
        field: 'nome',
        value: data.nome,
        rules: [
          { type: 'required', message: 'O nome da meta é obrigatório' },
          { type: 'minLength', value: 3, message: 'O nome deve ter no mínimo 3 caracteres' },
          { type: 'maxLength', value: 100, message: 'O nome deve ter no máximo 100 caracteres' }
        ]
      },
      {
        field: 'valor_objetivo',
        value: valorObjetivo,
        rules: [
          { type: 'required', message: 'O valor da meta é obrigatório' },
          { type: 'min', value: 1, message: 'O valor deve ser maior que zero' },
          { type: 'max', value: 10000000, message: 'O valor deve ser menor que R$ 10.000.000' }
        ]
      },
      {
        field: 'valor_atual',
        value: valorAtual,
        rules: [
          { type: 'min', value: 0, message: 'O valor atual não pode ser negativo' },
          {
            type: 'custom',
            message: 'O valor atual não pode ser maior que o valor objetivo',
            validator: (v) => v <= valorObjetivo
          }
        ]
      }
    ])
  }
}

export const cartaoValidation = {
  validate: (data: {
    nome: string
    limite: number | string
    dia_vencimento: number | string
    dia_fechamento: number | string
  }): ValidationResult => {
    const limite = typeof data.limite === 'string' ? parseFloat(data.limite) : data.limite
    const diaVencimento = typeof data.dia_vencimento === 'string' ? parseInt(data.dia_vencimento) : data.dia_vencimento
    const diaFechamento = typeof data.dia_fechamento === 'string' ? parseInt(data.dia_fechamento) : data.dia_fechamento

    return validate([
      {
        field: 'nome',
        value: data.nome,
        rules: [
          { type: 'required', message: 'O nome do cartão é obrigatório' },
          { type: 'minLength', value: 2, message: 'O nome deve ter no mínimo 2 caracteres' },
          { type: 'maxLength', value: 50, message: 'O nome deve ter no máximo 50 caracteres' }
        ]
      },
      {
        field: 'limite',
        value: limite,
        rules: [
          { type: 'required', message: 'O limite é obrigatório' },
          { type: 'min', value: 0, message: 'O limite não pode ser negativo' },
          { type: 'max', value: 1000000, message: 'O limite deve ser menor que R$ 1.000.000' }
        ]
      },
      {
        field: 'dia_vencimento',
        value: diaVencimento,
        rules: [
          { type: 'required', message: 'O dia de vencimento é obrigatório' },
          { type: 'min', value: 1, message: 'O dia deve estar entre 1 e 31' },
          { type: 'max', value: 31, message: 'O dia deve estar entre 1 e 31' }
        ]
      },
      {
        field: 'dia_fechamento',
        value: diaFechamento,
        rules: [
          { type: 'required', message: 'O dia de fechamento é obrigatório' },
          { type: 'min', value: 1, message: 'O dia deve estar entre 1 e 31' },
          { type: 'max', value: 31, message: 'O dia deve estar entre 1 e 31' }
        ]
      }
    ])
  }
}

export const parcelaValidation = {
  validate: (data: {
    produto: string
    valor_total: number | string
    total_parcelas: number | string
    valor_parcela: number | string
    dia_vencimento: number | string
  }): ValidationResult => {
    const valorTotal = typeof data.valor_total === 'string' ? parseFloat(data.valor_total) : data.valor_total
    const totalParcelas = typeof data.total_parcelas === 'string' ? parseInt(data.total_parcelas) : data.total_parcelas
    const valorParcela = typeof data.valor_parcela === 'string' ? parseFloat(data.valor_parcela) : data.valor_parcela
    const diaVencimento = typeof data.dia_vencimento === 'string' ? parseInt(data.dia_vencimento) : data.dia_vencimento

    return validate([
      {
        field: 'produto',
        value: data.produto,
        rules: [
          { type: 'required', message: 'A descrição do produto é obrigatória' },
          { type: 'minLength', value: 3, message: 'A descrição deve ter no mínimo 3 caracteres' },
          { type: 'maxLength', value: 200, message: 'A descrição deve ter no máximo 200 caracteres' }
        ]
      },
      {
        field: 'valor_total',
        value: valorTotal,
        rules: [
          { type: 'required', message: 'O valor total é obrigatório' },
          { type: 'min', value: 0.01, message: 'O valor deve ser maior que zero' },
          { type: 'max', value: 1000000, message: 'O valor deve ser menor que R$ 1.000.000' }
        ]
      },
      {
        field: 'total_parcelas',
        value: totalParcelas,
        rules: [
          { type: 'required', message: 'O número de parcelas é obrigatório' },
          { type: 'min', value: 1, message: 'Deve ter no mínimo 1 parcela' },
          { type: 'max', value: 60, message: 'O máximo é 60 parcelas' },
          {
            type: 'custom',
            message: 'O número de parcelas deve ser inteiro',
            validator: (v) => Number.isInteger(v)
          }
        ]
      },
      {
        field: 'valor_parcela',
        value: valorParcela,
        rules: [
          { type: 'required', message: 'O valor da parcela é obrigatório' },
          { type: 'min', value: 0.01, message: 'O valor da parcela deve ser maior que zero' },
          {
            type: 'custom',
            message: 'O valor total deve ser aproximadamente igual ao valor da parcela × número de parcelas',
            validator: (v) => {
              const diferenca = Math.abs(valorTotal - (v * totalParcelas))
              return diferenca < 1 // Tolera diferença de até R$ 1,00 por arredondamento
            }
          }
        ]
      },
      {
        field: 'dia_vencimento',
        value: diaVencimento,
        rules: [
          { type: 'required', message: 'O dia de vencimento é obrigatório' },
          { type: 'min', value: 1, message: 'O dia deve estar entre 1 e 31' },
          { type: 'max', value: 31, message: 'O dia deve estar entre 1 e 31' }
        ]
      }
    ])
  }
}

export const investimentoValidation = {
  validate: (data: {
    nome: string
    valor_inicial: number | string
    valor_atual?: number | string
  }): ValidationResult => {
    const valorInicial = typeof data.valor_inicial === 'string' ? parseFloat(data.valor_inicial) : data.valor_inicial
    const valorAtual = data.valor_atual ? (typeof data.valor_atual === 'string' ? parseFloat(data.valor_atual) : data.valor_atual) : valorInicial

    return validate([
      {
        field: 'nome',
        value: data.nome,
        rules: [
          { type: 'required', message: 'O nome do investimento é obrigatório' },
          { type: 'minLength', value: 2, message: 'O nome deve ter no mínimo 2 caracteres' },
          { type: 'maxLength', value: 100, message: 'O nome deve ter no máximo 100 caracteres' }
        ]
      },
      {
        field: 'valor_inicial',
        value: valorInicial,
        rules: [
          { type: 'required', message: 'O valor inicial é obrigatório' },
          { type: 'min', value: 0.01, message: 'O valor deve ser maior que zero' },
          { type: 'max', value: 100000000, message: 'O valor deve ser menor que R$ 100.000.000' }
        ]
      },
      {
        field: 'valor_atual',
        value: valorAtual,
        rules: [
          { type: 'min', value: 0, message: 'O valor atual não pode ser negativo' }
        ]
      }
    ])
  }
}

// ============================================
// SANITIZAÇÃO DE DADOS
// ============================================

export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
}

export function sanitizeNumber(value: number | string, decimals: number = 2): number {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Valor numérico inválido')
  }
  return parseFloat(num.toFixed(decimals))
}

export function sanitizeDate(date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    throw new Error('Data inválida')
  }
  return d.toISOString().split('T')[0]
}
