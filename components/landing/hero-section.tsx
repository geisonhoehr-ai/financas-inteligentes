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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Controle Financeiro para
            <span className="text-primary"> Toda Família</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 px-4">
            Organize gastos, investimentos e metas em um só lugar.
            Simples, completo e compartilhado.
          </p>

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
