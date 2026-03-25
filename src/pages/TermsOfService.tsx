import { Link } from "react-router-dom";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";

const TermsOfService = () => {
  // SEO Meta Tags
  useMetaTags({
    title: 'Termos de Utilização',
    description: 'Termos de Utilização do Olha que Duas. Ao utilizar os nossos serviços, concorda com estes termos. Leia atentamente antes de continuar.',
    url: 'https://www.olhaqueduas.com/termos',
    jsonLd: getPageBreadcrumbJsonLd('Termos de Utilização', 'https://www.olhaqueduas.com/termos'),
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
            Termos de Utilização
          </h1>
          <p className="text-gray-400">
            Última atualização: {new Date().toLocaleDateString('pt-PT')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-300 leading-relaxed">
              Ao descarregar, instalar ou utilizar a aplicação Olha que Duas ("Aplicação"),
              concorda em ficar vinculado a estes Termos de Utilização ("Termos"). Se não concordar
              com estes Termos, não utilize a Aplicação.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-300 leading-relaxed">
              A Olha que Duas é uma aplicação móvel que oferece:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Transmissão de rádio ao vivo 24 horas por dia</li>
              <li>Acesso a notícias e conteúdos informativos</li>
              <li>Previsão meteorológica (requer autorização de localização)</li>
              <li>Lembretes de programas via notificações (opcional)</li>
              <li>Opção de subscrição premium para remoção de anúncios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Utilização da Aplicação</h2>
            <p className="text-gray-300 leading-relaxed">
              Ao utilizar a Aplicação, concorda em:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Utilizar a Aplicação apenas para fins legais</li>
              <li>Não tentar interferir com o funcionamento da Aplicação</li>
              <li>Não copiar, modificar ou distribuir o conteúdo sem autorização</li>
              <li>Não utilizar a Aplicação de forma que possa danificar, desativar ou sobrecarregar os nossos sistemas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Conteúdo de Notícias</h2>
            <p className="text-gray-300 leading-relaxed">
              O conteúdo noticioso disponibilizado através da Aplicação:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>É agregado de várias fontes públicas</li>
              <li>Pode conter opiniões que não representam a posição da Olha que Duas</li>
              <li>É fornecido apenas para fins informativos</li>
              <li>Não constitui aconselhamento profissional de qualquer natureza</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Não garantimos a precisão, completude ou atualidade de qualquer informação apresentada.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Transmissão de Rádio</h2>
            <p className="text-gray-300 leading-relaxed">
              A transmissão de rádio está sujeita a:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Disponibilidade técnica e de rede</li>
              <li>Interrupções para manutenção</li>
              <li>Variações de qualidade dependendo da sua ligação à internet</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Não garantimos disponibilidade contínua do serviço de streaming.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Previsão Meteorológica</h2>
            <p className="text-gray-300 leading-relaxed">
              A funcionalidade de previsão meteorológica:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Requer autorização de acesso à localização do dispositivo</li>
              <li>Utiliza dados de serviços meteorológicos de terceiros</li>
              <li>Pode apresentar uma localização predefinida (Lisboa) caso não autorize o acesso à localização</li>
              <li>É fornecida apenas para fins informativos</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Não garantimos a precisão dos dados meteorológicos, que são obtidos de fontes externas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Notificações e Lembretes</h2>
            <p className="text-gray-300 leading-relaxed">
              A Aplicação permite configurar lembretes para programas de rádio:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Requer autorização de envio de notificações</li>
              <li>Pode configurar o tempo de antecedência do lembrete</li>
              <li>Pode desativar lembretes individuais ou todos de uma vez</li>
              <li>As preferências são armazenadas apenas no seu dispositivo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Compras na Aplicação</h2>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2">6.1 Versão Premium</h3>
            <p className="text-gray-300 leading-relaxed">
              A versão premium remove anúncios da Aplicação mediante pagamento único.
              Esta compra é processada através da Google Play Store ou Apple App Store.
            </p>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">6.2 Política de Reembolso</h3>
            <p className="text-gray-300 leading-relaxed">
              Os reembolsos são processados de acordo com as políticas da loja onde efetuou a compra
              (Google Play Store ou Apple App Store). Para solicitar um reembolso, deve contactar
              diretamente a respetiva loja.
            </p>

            <h3 className="text-xl font-medium text-[#FFD700] mb-2 mt-4">6.3 Restauração de Compras</h3>
            <p className="text-gray-300 leading-relaxed">
              Se reinstalar a Aplicação ou mudar de dispositivo, pode restaurar a sua compra
              através da opção "Restaurar compra anterior" nas definições da Aplicação, desde que
              utilize a mesma conta Google ou Apple ID.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Anúncios</h2>
            <p className="text-gray-300 leading-relaxed">
              A versão gratuita da Aplicação exibe anúncios fornecidos pelo Google AdMob.
              Ao utilizar a versão gratuita, consente a exibição de anúncios de acordo com
              as suas preferências de privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Propriedade Intelectual</h2>
            <p className="text-gray-300 leading-relaxed">
              A Aplicação, incluindo mas não limitado ao seu design, logótipos, gráficos e software,
              é propriedade da Olha que Duas e está protegida por leis de propriedade intelectual.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              O conteúdo de notícias de terceiros permanece propriedade dos respetivos detentores
              de direitos de autor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Limitação de Responsabilidade</h2>
            <p className="text-gray-300 leading-relaxed">
              Na máxima extensão permitida por lei:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>A Aplicação é fornecida "tal como está" sem garantias de qualquer tipo</li>
              <li>Não somos responsáveis por quaisquer danos diretos, indiretos, incidentais ou consequenciais</li>
              <li>Não somos responsáveis por interrupções no serviço</li>
              <li>Não somos responsáveis pela precisão do conteúdo de terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Modificações aos Termos</h2>
            <p className="text-gray-300 leading-relaxed">
              Reservamo-nos o direito de modificar estes Termos a qualquer momento.
              Alterações significativas serão comunicadas através da Aplicação.
              A continuação da utilização após alterações constitui aceitação dos novos Termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Rescisão</h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos suspender ou terminar o seu acesso à Aplicação a qualquer momento,
              por qualquer motivo, sem aviso prévio. Pode deixar de utilizar a Aplicação
              a qualquer momento desinstalando-a do seu dispositivo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">14. Lei Aplicável</h2>
            <p className="text-gray-300 leading-relaxed">
              Estes Termos são regidos pelas leis de Portugal. Quaisquer disputas serão
              submetidas à jurisdição exclusiva dos tribunais portugueses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">15. Contacto</h2>
            <p className="text-gray-300 leading-relaxed">
              Para questões sobre estes Termos, contacte-nos:
            </p>
            <div className="bg-[#2a2a2a] p-4 rounded-lg mt-4">
              <p className="text-white"><strong>Email:</strong> olhaqueduas.assessoria@gmail.com</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center space-x-4">
          <Link to="/privacidade" className="text-[#FFD700] hover:underline">
            Política de Privacidade
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/" className="text-[#FFD700] hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
