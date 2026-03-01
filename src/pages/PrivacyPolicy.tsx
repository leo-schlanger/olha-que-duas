import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-[#FFD700] hover:underline mb-4 inline-block">
            ← Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold text-[#FFD700] mb-2">
            Política de Privacidade
          </h1>
          <p className="text-gray-400">
            Última atualização: {new Date().toLocaleDateString('pt-PT')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introdução</h2>
            <p className="text-gray-300 leading-relaxed">
              A Olha que Duas ("nós", "nosso" ou "nossa") está comprometida em proteger a sua privacidade.
              Esta Política de Privacidade explica como recolhemos, usamos e protegemos as suas informações
              quando utiliza a nossa aplicação móvel e website.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Ao utilizar os nossos serviços, concorda com a recolha e utilização de informações de acordo
              com esta política. Esta política está em conformidade com o Regulamento Geral de Proteção de
              Dados (RGPD) da União Europeia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Dados que Recolhemos</h2>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2">2.1 Dados Fornecidos por Si</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Informações de compra (quando adquire a versão premium)</li>
              <li>Preferências de utilização da aplicação</li>
            </ul>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">2.2 Dados Recolhidos Automaticamente</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Identificadores de dispositivo (para funcionamento de anúncios)</li>
              <li>Dados de utilização anónimos (estatísticas de uso)</li>
              <li>Informações técnicas (versão do sistema operativo, modelo do dispositivo)</li>
            </ul>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">2.3 Dados de Terceiros</h3>
            <p className="text-gray-300 leading-relaxed">
              Utilizamos serviços de terceiros que podem recolher dados:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><strong>Google AdMob:</strong> Para exibição de anúncios (pode ser desativado na versão premium)</li>
              <li><strong>Google Play / Apple App Store:</strong> Para processamento de compras</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Como Utilizamos os Seus Dados</h2>
            <p className="text-gray-300 leading-relaxed">Utilizamos os dados recolhidos para:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Fornecer e manter o serviço</li>
              <li>Processar compras e transações</li>
              <li>Exibir anúncios (com o seu consentimento)</li>
              <li>Melhorar a experiência do utilizador</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Anúncios e Consentimento</h2>
            <p className="text-gray-300 leading-relaxed">
              A nossa aplicação exibe anúncios através do Google AdMob. De acordo com o RGPD,
              solicitamos o seu consentimento antes de exibir anúncios personalizados.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li><strong>Anúncios personalizados:</strong> Baseados nos seus interesses (requer consentimento)</li>
              <li><strong>Anúncios não personalizados:</strong> Anúncios genéricos (não requerem consentimento)</li>
              <li><strong>Sem anúncios:</strong> Disponível na versão premium</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Pode alterar as suas preferências de anúncios a qualquer momento nas definições da aplicação.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Os Seus Direitos (RGPD)</h2>
            <p className="text-gray-300 leading-relaxed">
              Ao abrigo do RGPD, tem os seguintes direitos:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><strong>Direito de acesso:</strong> Solicitar uma cópia dos seus dados pessoais</li>
              <li><strong>Direito de retificação:</strong> Corrigir dados inexatos</li>
              <li><strong>Direito ao apagamento:</strong> Solicitar a eliminação dos seus dados</li>
              <li><strong>Direito à portabilidade:</strong> Receber os seus dados num formato estruturado</li>
              <li><strong>Direito de oposição:</strong> Opor-se ao processamento dos seus dados</li>
              <li><strong>Direito de retirar consentimento:</strong> Retirar o consentimento a qualquer momento</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Para exercer qualquer destes direitos, contacte-nos através do email indicado abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Retenção de Dados</h2>
            <p className="text-gray-300 leading-relaxed">
              Mantemos os seus dados apenas pelo tempo necessário para os fins descritos nesta política,
              ou conforme exigido por lei. Dados de compra são mantidos conforme requisitos fiscais aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Segurança dos Dados</h2>
            <p className="text-gray-300 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger
              os seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Menores de Idade</h2>
            <p className="text-gray-300 leading-relaxed">
              A nossa aplicação não se destina a menores de 16 anos. Não recolhemos intencionalmente
              dados pessoais de menores de 16 anos. Se tomarmos conhecimento de que recolhemos dados
              de um menor, tomaremos medidas para eliminar essas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Alterações a Esta Política</h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre
              alterações significativas através da aplicação ou por email. Recomendamos que reveja
              esta política regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Contacto</h2>
            <p className="text-gray-300 leading-relaxed">
              Se tiver questões sobre esta Política de Privacidade ou pretender exercer os seus direitos,
              contacte-nos:
            </p>
            <div className="bg-[#2a2a2a] p-4 rounded-lg mt-4">
              <p className="text-white"><strong>Email:</strong> olhaqueduas.assessoria@gmail.com</p>
              <p className="text-white mt-2"><strong>Responsável pelo tratamento:</strong> Olha que Duas</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Autoridade de Supervisão</h2>
            <p className="text-gray-300 leading-relaxed">
              Se considerar que o tratamento dos seus dados pessoais viola o RGPD, tem o direito de
              apresentar uma reclamação junto da autoridade de supervisão competente. Em Portugal,
              a autoridade competente é a Comissão Nacional de Proteção de Dados (CNPD).
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <Link to="/" className="text-[#FFD700] hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
