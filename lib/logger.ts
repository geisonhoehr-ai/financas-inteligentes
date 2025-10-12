// ============================================
// SISTEMA DE LOGGING E MONITORAMENTO
// ============================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
  userId?: string
  sessionId?: string
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry
    let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`

    if (context && Object.keys(context).length > 0) {
      formatted += `\n  Context: ${JSON.stringify(context, null, 2)}`
    }

    if (error) {
      formatted += `\n  Error: ${error.message}`
      if (error.stack && this.isDevelopment) {
        formatted += `\n  Stack: ${error.stack}`
      }
    }

    return formatted
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    }

    // Console logging (sempre ativo)
    const formatted = this.formatMessage(entry)

    switch (level) {
      case 'debug':
        if (this.isDevelopment) console.debug(formatted)
        break
      case 'info':
        console.info(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'error':
      case 'fatal':
        console.error(formatted)
        break
    }

    // Em produção, enviar para serviço de logging
    if (!this.isDevelopment && (level === 'error' || level === 'fatal')) {
      this.sendToMonitoring(entry)
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    // TODO: Integrar com Sentry, LogRocket, ou outro serviço
    // Exemplo básico:
    try {
      // if (window.Sentry) {
      //   Sentry.captureException(entry.error, {
      //     level: entry.level,
      //     extra: entry.context
      //   })
      // }

      // Ou enviar para endpoint próprio:
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch (err) {
      console.error('Erro ao enviar log para monitoramento:', err)
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error)
  }

  fatal(message: string, error: Error, context?: Record<string, any>) {
    this.log('fatal', message, context, error)
  }

  // Capturar erros não tratados
  setupGlobalErrorHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.error('Erro não capturado', event.error, {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.error('Promise rejeitada não tratada', event.reason, {
          promise: String(event.promise)
        })
      })
    }
  }
}

// Exportar instância única
export const logger = new Logger()

// Helper para erros de API/Supabase
export function logSupabaseError(
  operation: string,
  error: any,
  context?: Record<string, any>
) {
  logger.error(`Erro Supabase: ${operation}`, error, {
    ...context,
    errorCode: error?.code,
    errorDetails: error?.details,
    errorHint: error?.hint
  })
}

// Helper para track de performance
export function trackPerformance(metricName: string, duration: number) {
  logger.info(`Performance: ${metricName}`, {
    duration: `${duration.toFixed(2)}ms`,
    metric: metricName
  })

  // Em produção, enviar para analytics
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Exemplo: Web Vitals, Google Analytics, etc.
  }
}

// Helper para timing de operações
export async function measureTime<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    trackPerformance(operation, duration)
    return result
  } catch (error) {
    const duration = performance.now() - start
    logger.error(`Falha em ${operation} (${duration.toFixed(2)}ms)`, error as Error)
    throw error
  }
}

// Decorator para logging automático de métodos
export function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: any[]) {
    logger.debug(`Executando ${propertyKey}`, { args })
    try {
      const result = await originalMethod.apply(this, args)
      logger.debug(`${propertyKey} completou com sucesso`)
      return result
    } catch (error) {
      logger.error(`Erro em ${propertyKey}`, error as Error, { args })
      throw error
    }
  }

  return descriptor
}

// Setup inicial (chamar no _app.tsx ou layout.tsx)
export function initializeLogger() {
  logger.setupGlobalErrorHandlers()
  logger.info('Logger inicializado', {
    env: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown'
  })
}
