import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogIn } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10" />
      
      {/* Botão de Login no canto superior direito */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="h-10 md:h-12"
        >
          <Link href="/login">
            <LogIn className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Entrar
          </Link>
        </Button>
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full mb-6 animate-bounce">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-semibold text-primary">
              Novidades: Mesada Digital, IA, Tags e muito mais!
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Controle Financeiro
            <span className="text-primary"> Inteligente</span>
            <br />
            para Toda Família
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 px-4">
            Organize gastos, investimentos e metas com inteligência artificial.
            <br className="hidden md:block" />
            <span className="font-semibold text-foreground">Simples, completo e revolucionário.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8 px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>9 novas funcionalidades</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>100% gratuito</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Sem cartão de crédito</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button
              asChild
              size="lg"
              className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link href="/register">
                Começar Grátis
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg"
            >
              <Link href="#features">
                Ver Funcionalidades
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
