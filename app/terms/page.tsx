export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
          
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              <strong>Última atualização:</strong> 08 de outubro de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o Sistema de Controle Financeiro Familiar, você concorda em cumprir 
                e estar vinculado aos termos e condições de uso estabelecidos neste documento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
              <p>
                O Sistema de Controle Financeiro Familiar é uma aplicação web que permite aos usuários:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Gerenciar gastos pessoais e familiares</li>
                <li>Controlar investimentos e metas financeiras</li>
                <li>Organizar cartões de crédito e parcelas</li>
                <li>Compartilhar informações financeiras com membros da família</li>
                <li>Gerar relatórios e análises financeiras</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Conta do Usuário</h2>
              <p>
                Para usar o serviço, você deve criar uma conta fornecendo informações precisas e atualizadas. 
                Você é responsável por:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Manter a confidencialidade de sua senha</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
                <li>Ser responsável por todas as atividades que ocorrem em sua conta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Uso Aceitável</h2>
              <p>Você concorda em não usar o serviço para:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Atividades ilegais ou não autorizadas</li>
                <li>Interferir com o funcionamento do serviço</li>
                <li>Tentar acessar contas de outros usuários</li>
                <li>Transmitir vírus ou código malicioso</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Privacidade e Proteção de Dados</h2>
              <p>
                Suas informações financeiras são tratadas com extrema confidencialidade. 
                Consulte nossa Política de Privacidade para mais detalhes sobre como coletamos, 
                usamos e protegemos seus dados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Limitação de Responsabilidade</h2>
              <p>
                O serviço é fornecido &quot;como está&quot; sem garantias de qualquer tipo. Não nos responsabilizamos 
                por perdas financeiras resultantes do uso do sistema.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Modificações</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As alterações entrarão em vigor imediatamente após a publicação.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através 
                dos canais disponibilizados na plataforma.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
