import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10" />
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Controle Financeiro para
            <span className="text-primary"> Toda Família</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12">
            Organize gastos, investimentos e metas em um só lugar.
            Simples, completo e compartilhado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-lg"
            >
              <Link href="/register">
                Começar Grátis
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8 text-lg"
            >
              <Link href="#features">
                Ver Funcionalidades
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
