export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              <strong>Última atualização:</strong> 08 de outubro de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p>
                Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas 
                informações pessoais quando você usa o Sistema de Controle Financeiro Familiar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
              <h3 className="text-xl font-medium mb-2">Informações Pessoais:</h3>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
                <li>Nome e endereço de email</li>
                <li>Dados de autenticação (senha criptografada)</li>
                <li>Informações de perfil (nome, foto opcional)</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-2">Informações Financeiras:</h3>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
                <li>Gastos e receitas registrados</li>
                <li>Investimentos e metas financeiras</li>
                <li>Informações de cartões de crédito (sem dados sensíveis)</li>
                <li>Dívidas e parcelas</li>
              </ul>

              <h3 className="text-xl font-medium mb-2">Dados Técnicos:</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Endereço IP</li>
                <li>Informações do navegador</li>
                <li>Logs de acesso e uso</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Como Usamos suas Informações</h2>
              <p>Utilizamos suas informações para:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Fornecer e manter o serviço</li>
                <li>Processar transações e operações financeiras</li>
                <li>Enviar notificações importantes sobre sua conta</li>
                <li>Melhorar a funcionalidade e segurança do sistema</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Informações</h2>
              <p>
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                exceto nas seguintes situações:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Com membros autorizados de sua família (conforme configuração)</li>
                <li>Para cumprir obrigações legais</li>
                <li>Para proteger nossos direitos e segurança</li>
                <li>Com seu consentimento explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança robustas para proteger suas informações:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Autenticação de dois fatores disponível</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e seguros</li>
                <li>Controle de acesso rigoroso</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos</h2>
              <p>Você tem o direito de:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incorretos</li>
                <li>Solicitar a exclusão de sua conta</li>
                <li>Exportar seus dados financeiros</li>
                <li>Revogar consentimentos</li>
                <li>Objetar ao processamento de dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
              <p>
                Mantemos suas informações apenas pelo tempo necessário para fornecer o serviço 
                e cumprir obrigações legais. Dados financeiros são mantidos por 7 anos após 
                o encerramento da conta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookies e Tecnologias Similares</h2>
              <p>
                Utilizamos cookies essenciais para o funcionamento do sistema e cookies 
                de análise para melhorar a experiência do usuário. Você pode gerenciar 
                suas preferências de cookies nas configurações do navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Menores de Idade</h2>
              <p>
                Nosso serviço não é destinado a menores de 18 anos. Não coletamos 
                intencionalmente informações de menores sem o consentimento dos pais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. 
                Notificaremos sobre mudanças significativas por email ou através do serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contato</h2>
              <p>
                Para questões sobre privacidade ou exercer seus direitos, entre em contato 
                conosco através dos canais disponibilizados na plataforma.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
