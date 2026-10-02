import { Link } from "react-router-dom";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";

const PrivacyPolicy = () => {
  // SEO Meta Tags
  useMetaTags({
    title: 'Política de Privacidade',
    description: 'Política de Privacidade do Olha que Duas. Saiba como recolhemos, utilizamos e protegemos os seus dados pessoais em conformidade com o RGPD.',
    url: 'https://www.olhaqueduas.com/privacidade',
    jsonLd: getPageBreadcrumbJsonLd('Política de Privacidade', 'https://www.olhaqueduas.com/privacidade'),
  });

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
            Última atualização: 2 de outubro de 2026
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
            <p className="text-gray-300 leading-relaxed">No website:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><strong>Formulário de contacto:</strong> nome, email e a mensagem que nos envia</li>
              <li><strong>Pedido de auditoria:</strong> nome, empresa, email, telefone, redes sociais e mensagem</li>
              <li><strong>Newsletter:</strong> email e, opcionalmente, nome</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">Na aplicação móvel:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Informações de compra (quando adquire a versão premium)</li>
              <li>Preferências de utilização da aplicação</li>
              <li>Preferências de notificações e lembretes de programas</li>
            </ul>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">2.2 Dados de Localização</h3>
            <p className="text-gray-300 leading-relaxed">
              Com a sua autorização, recolhemos dados de localização para fornecer previsões meteorológicas
              personalizadas para a sua área. Estes dados:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>São utilizados apenas para obter dados meteorológicos da sua região</li>
              <li>Não são armazenados nos nossos servidores</li>
              <li>Não são partilhados com terceiros além do serviço de meteorologia</li>
              <li>Pode desativar esta funcionalidade a qualquer momento nas definições do dispositivo</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-2">
              Se não autorizar o acesso à localização, será utilizada uma localização predefinida (Lisboa).
            </p>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">2.3 Dados Recolhidos Automaticamente</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Identificadores de dispositivo (para funcionamento de anúncios)</li>
              <li>Dados de utilização anónimos (estatísticas de uso)</li>
              <li>Informações técnicas (versão do sistema operativo, modelo do dispositivo)</li>
            </ul>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">2.4 Dados de Terceiros</h3>
            <p className="text-gray-300 leading-relaxed">
              Utilizamos serviços de terceiros que podem recolher dados:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><strong>Google AdMob:</strong> Para exibição de anúncios na app móvel (pode ser desativado na versão premium)</li>
              <li><strong>Google Play / Apple App Store:</strong> Para processamento de compras</li>
              <li><strong>Open-Meteo:</strong> Recebe coordenadas de localização para fornecer previsões meteorológicas</li>
              <li><strong>Supabase:</strong> Para sincronização de dados de programação da rádio, armazenamento de metadados e encaminhamento das inscrições na newsletter</li>
              <li><strong>Cloudinary:</strong> Para alojamento e entrega otimizada de imagens da galeria de fotos</li>
              <li><strong>Vercel:</strong> Para alojamento do website e execução de funções serverless</li>
              <li><strong>Brevo (Sendinblue):</strong> Para gestão e envio da newsletter</li>
              <li><strong>FormSubmit.co:</strong> Para entregar no nosso email as mensagens do formulário de contacto e os pedidos de auditoria</li>
              <li><strong>YouTube:</strong> Para os vídeos incorporados no website, carregados em modo de privacidade reforçada (youtube-nocookie.com). O YouTube só guarda dados no seu navegador quando inicia a reprodução de um vídeo</li>
              <li><strong>Umami Analytics:</strong> Para estatísticas de utilização anónimas e sem cookies (conforme RGPD)</li>
              <li><strong>Google Fonts:</strong> Para carregamento de tipos de letra no website</li>
            </ul>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">2.5 Cookies e Armazenamento Local</h3>
            <p className="text-gray-300 leading-relaxed">
              O nosso website utiliza os seguintes cookies e mecanismos de armazenamento local:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><strong>Preferência de consentimento:</strong> Armazena a sua escolha sobre cookies (estritamente necessário)</li>
              <li><strong>Leitor da rádio:</strong> Guarda o volume, o estado de som desligado e o modo de reprodução compatível com o seu navegador (necessário para o funcionamento que pediu)</li>
              <li><strong>Jogos da área Kids:</strong> Guarda a pontuação máxima e a preferência de som, apenas no seu dispositivo (necessário para o funcionamento que pediu)</li>
              <li><strong>Avisos do site:</strong> Regista, só durante a sessão, se fechou um aviso para que não volte a aparecer (necessário)</li>
              <li><strong>Instalação da app:</strong> Regista se dispensou o convite de instalação da app (funcional, requer consentimento)</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-2">
              Estes dados ficam no armazenamento local do seu navegador, não são enviados para os nossos
              servidores e pode apagá-los a qualquer momento nas definições do navegador.
              Não utilizamos cookies de rastreamento, publicidade ou de terceiros para fins de marketing.
              O Umami Analytics que utilizamos não requer cookies e está em conformidade com o RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Como Utilizamos os Seus Dados</h2>
            <p className="text-gray-300 leading-relaxed">Utilizamos os dados recolhidos para:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Fornecer e manter o serviço de rádio, notícias e website</li>
              <li>Processar compras e transações</li>
              <li>Enviar a newsletter (com o seu consentimento explícito)</li>
              <li>Responder a mensagens enviadas pelo formulário de contacto</li>
              <li>Exibir anúncios na app móvel (com o seu consentimento)</li>
              <li>Mostrar previsões meteorológicas da sua área (com a sua autorização)</li>
              <li>Enviar notificações de lembretes de programas (quando ativadas por si)</li>
              <li>Obter estatísticas anónimas de utilização do website (via Umami, sem dados pessoais)</li>
              <li>Melhorar a experiência do utilizador</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">3.1 Dados Armazenados Localmente</h3>
            <p className="text-gray-300 leading-relaxed">
              Os seguintes dados são armazenados apenas no seu dispositivo e não são enviados para os nossos servidores:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Preferências de notificações e lembretes de programas</li>
              <li>Configurações de reprodução de rádio (volume, reprodução em segundo plano)</li>
              <li>Consentimento de anúncios (RGPD)</li>
              <li>Preferência de tema (claro/escuro)</li>
            </ul>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">3.2 Fundamento Legal</h3>
            <p className="text-gray-300 leading-relaxed">
              Tratamos os seus dados com base nos seguintes fundamentos do artigo 6.º do RGPD:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><strong>Consentimento:</strong> newsletter, anúncios personalizados, localização e armazenamento funcional no navegador</li>
              <li><strong>Diligências pré-contratuais a seu pedido:</strong> resposta a mensagens de contacto e a pedidos de auditoria ou orçamento</li>
              <li><strong>Execução de contrato:</strong> compras na aplicação</li>
              <li><strong>Interesse legítimo:</strong> estatísticas anónimas de utilização e segurança do website</li>
              <li><strong>Obrigação legal:</strong> conservação de registos de compras exigida pela legislação fiscal</li>
            </ul>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">3.3 Transferências Internacionais</h3>
            <p className="text-gray-300 leading-relaxed">
              Alguns dos prestadores indicados acima (por exemplo, Google, Vercel, Cloudinary e FormSubmit)
              podem tratar dados fora do Espaço Económico Europeu. Nesses casos, as transferências são
              feitas ao abrigo de mecanismos previstos no RGPD, como o Quadro de Privacidade de Dados
              UE-EUA ou as Cláusulas Contratuais-Tipo aprovadas pela Comissão Europeia.
            </p>
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
              Para deixar de receber a newsletter, basta usar a ligação de cancelamento incluída em
              cada envio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Retenção de Dados</h2>
            <p className="text-gray-300 leading-relaxed">
              Mantemos os seus dados apenas pelo tempo necessário para os fins descritos nesta política,
              ou conforme exigido por lei. Em concreto:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><strong>Newsletter:</strong> até cancelar a inscrição</li>
              <li><strong>Mensagens de contacto e pedidos de auditoria:</strong> enquanto durar o assunto ou a relação comercial a que dizem respeito, e eliminadas depois disso</li>
              <li><strong>Dados de compra:</strong> pelo prazo exigido pela legislação fiscal aplicável</li>
              <li><strong>Armazenamento local:</strong> até o apagar no seu navegador ou dispositivo</li>
            </ul>
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
              A nossa aplicação, a newsletter e os formulários não se destinam a menores de 16 anos.
              Não recolhemos intencionalmente dados pessoais de menores de 16 anos. Se tomarmos
              conhecimento de que recolhemos dados de um menor, tomaremos medidas para eliminar essas
              informações.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              A área Kids do website não pede nem recolhe dados pessoais: os jogos guardam apenas a
              pontuação e a preferência de som no próprio dispositivo. Recomendamos que as crianças a
              utilizem acompanhadas por um adulto.
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
              <p className="text-white"><strong>Email:</strong> geral@olhaqueduas.com</p>
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
