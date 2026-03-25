import { useState } from "react";
import { Link } from "react-router-dom";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "Sobre a Aplicação",
    icon: "📱",
    items: [
      {
        question: "O que é o Olha que Duas?",
        answer: "O Olha que Duas é uma aplicação móvel e rádio online portuguesa que oferece entretenimento, bem-estar e conversas autênticas. Temos uma programação diversificada com programas sobre nutrição, motivação, empreendedorismo feminino e muito mais, 24 horas por dia.",
      },
      {
        question: "Onde posso descarregar a aplicação?",
        answer: (
          <>
            A aplicação está disponível para dispositivos Android na{" "}
            <a href="https://play.google.com/store/apps/details?id=com.olhaqueduas.app" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline">
              Google Play Store
            </a>
            . A versão para iOS (iPhone/iPad) estará disponível em breve na App Store.
          </>
        ),
      },
      {
        question: "A aplicação é gratuita?",
        answer: "Sim, a aplicação é totalmente gratuita para descarregar e utilizar. A versão gratuita inclui anúncios. Se preferir uma experiência sem anúncios, pode adquirir a versão premium através de uma compra única dentro da aplicação.",
      },
      {
        question: "A aplicação funciona offline?",
        answer: "A rádio e as notícias requerem ligação à internet para funcionar. No entanto, algumas funcionalidades como as definições e preferências ficam guardadas localmente no seu dispositivo.",
      },
      {
        question: "Quais são os requisitos mínimos para usar a aplicação?",
        answer: "Para Android, é necessário a versão 6.0 (Marshmallow) ou superior. Para iOS, será necessário iOS 13 ou superior. Recomendamos uma ligação à internet estável para a melhor experiência de streaming.",
      },
    ],
  },
  {
    title: "Rádio e Streaming",
    icon: "📻",
    items: [
      {
        question: "Como posso ouvir a rádio?",
        answer: "Basta abrir a aplicação e tocar no botão de play na página principal. A rádio começará a transmitir automaticamente. Pode ajustar o volume usando o controlo deslizante abaixo do botão de play.",
      },
      {
        question: "Posso ouvir a rádio em segundo plano?",
        answer: "Sim! A aplicação suporta reprodução em segundo plano. Pode minimizar a aplicação ou bloquear o ecrã e a rádio continuará a tocar. Os controlos de reprodução também aparecem no ecrã de bloqueio e na área de notificações.",
      },
      {
        question: "A rádio está a cortar ou sem som. O que fazer?",
        answer: (
          <>
            Se estiver a ter problemas com o streaming, experimente:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Verificar a sua ligação à internet</li>
              <li>Tocar no botão de atualizar (ícone de seta circular)</li>
              <li>Fechar e reabrir a aplicação</li>
              <li>Verificar se o volume do dispositivo não está em silêncio</li>
              <li>Verificar se não tem outras aplicações de áudio em conflito</li>
            </ul>
          </>
        ),
      },
      {
        question: "Qual é a qualidade do streaming?",
        answer: "O streaming é transmitido em 192kbps, oferecendo uma qualidade de áudio alta e clara. O consumo de dados é aproximadamente 86MB por hora de escuta.",
      },
      {
        question: "Posso ver que música está a tocar?",
        answer: "Sim! Quando uma música está a tocar, a aplicação mostra o título e artista da música atual, incluindo a capa do álbum quando disponível. Esta informação também aparece no ecrã de bloqueio.",
      },
    ],
  },
  {
    title: "Programação e Lembretes",
    icon: "🔔",
    items: [
      {
        question: "Onde posso ver a programação da rádio?",
        answer: "A programação semanal está disponível na página principal da aplicação, na secção 'Programação Semanal'. Também pode aceder através do botão de informação (i) no topo da página da rádio.",
      },
      {
        question: "Como ativo lembretes para os meus programas favoritos?",
        answer: "Na lista de programação, cada programa tem um ícone de sininho ao lado. Toque no sininho para ativar o lembrete. Receberá uma notificação antes do programa começar. Pode configurar a antecedência do lembrete nas Definições.",
      },
      {
        question: "Com que antecedência recebo os lembretes?",
        answer: "Por defeito, os lembretes são enviados 15 minutos antes do programa começar. Pode alterar para 5, 15, 30 ou 60 minutos nas Definições da aplicação, na secção 'Notificações'.",
      },
      {
        question: "Como desativo os lembretes?",
        answer: "Pode desativar lembretes individuais tocando novamente no sininho do programa. Para desativar todos os lembretes de uma vez, vá às Definições e desative a opção 'Notificações'.",
      },
      {
        question: "Porque não estou a receber os lembretes?",
        answer: (
          <>
            Se não estiver a receber lembretes, verifique:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Se as notificações estão ativadas nas Definições da aplicação</li>
              <li>Se as notificações estão permitidas nas definições do dispositivo</li>
              <li>Se o modo 'Não Incomodar' está desativado</li>
              <li>Se a aplicação não está a ser otimizada/restringida pelo sistema</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    title: "Previsão Meteorológica",
    icon: "🌤️",
    items: [
      {
        question: "Como funciona a previsão do tempo?",
        answer: "A aplicação mostra a previsão meteorológica para a sua localização atual, incluindo temperatura, condições atmosféricas, previsão horária e previsão para os próximos dias.",
      },
      {
        question: "Porque me pede autorização de localização?",
        answer: "Para mostrar a previsão do tempo da sua área, a aplicação precisa de aceder à sua localização. Esta informação é usada apenas para obter os dados meteorológicos e não é armazenada nem partilhada.",
      },
      {
        question: "Posso usar o clima sem dar acesso à localização?",
        answer: "Sim! Se não autorizar o acesso à localização, a aplicação mostrará a previsão meteorológica de Lisboa como localização predefinida. Pode alterar esta preferência a qualquer momento nas definições do dispositivo.",
      },
      {
        question: "Com que frequência os dados são atualizados?",
        answer: "Os dados meteorológicos são atualizados automaticamente quando abre a aplicação ou a página do clima. Também pode atualizar manualmente puxando o ecrã para baixo (pull-to-refresh) ou tocando no botão de atualizar.",
      },
      {
        question: "Os dados meteorológicos são precisos?",
        answer: "Os dados são obtidos de serviços meteorológicos profissionais. No entanto, como qualquer previsão do tempo, podem haver variações. Para informações críticas, recomendamos consultar também o IPMA (Instituto Português do Mar e da Atmosfera).",
      },
    ],
  },
  {
    title: "Premium e Compras",
    icon: "⭐",
    items: [
      {
        question: "O que inclui a versão premium?",
        answer: "A versão premium remove todos os anúncios da aplicação, oferecendo uma experiência limpa e sem interrupções. Todas as funcionalidades da aplicação (rádio, notícias, clima, lembretes) estão disponíveis tanto na versão gratuita como na premium.",
      },
      {
        question: "Quanto custa a versão premium?",
        answer: "A versão premium está disponível através de um pagamento único. O preço atual pode ser consultado na secção 'Premium' dentro das Definições da aplicação. O pagamento é processado de forma segura através da Google Play Store ou Apple App Store.",
      },
      {
        question: "É uma subscrição ou pagamento único?",
        answer: "É um pagamento único! Não há mensalidades nem renovações automáticas. Após a compra, a remoção de anúncios é permanente.",
      },
      {
        question: "Mudei de telemóvel. Como recupero a minha compra?",
        answer: "Se reinstalar a aplicação ou mudar de dispositivo, pode restaurar a sua compra nas Definições, tocando em 'Restaurar compra anterior'. Certifique-se de que está a usar a mesma conta Google ou Apple ID com que fez a compra original.",
      },
      {
        question: "Como posso pedir um reembolso?",
        answer: (
          <>
            Os reembolsos são processados pela loja onde efetuou a compra:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Google Play:</strong> Aceda a play.google.com/store/account/orderhistory</li>
              <li><strong>App Store:</strong> Aceda a reportaproblem.apple.com</li>
            </ul>
            Os pedidos de reembolso estão sujeitos às políticas de cada loja.
          </>
        ),
      },
    ],
  },
  {
    title: "Privacidade e Dados",
    icon: "🔒",
    items: [
      {
        question: "Que dados a aplicação recolhe?",
        answer: (
          <>
            Recolhemos apenas os dados necessários para o funcionamento da aplicação:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Localização (apenas com a sua autorização, para o clima)</li>
              <li>Identificador de anúncios (para exibir publicidade)</li>
              <li>Preferências da aplicação (armazenadas localmente no dispositivo)</li>
            </ul>
            Para mais detalhes, consulte a nossa{" "}
            <Link to="/privacidade" className="text-[#FFD700] hover:underline">
              Política de Privacidade
            </Link>.
          </>
        ),
      },
      {
        question: "Os meus dados são vendidos a terceiros?",
        answer: "Não. Os seus dados pessoais nunca são vendidos. Utilizamos serviços de terceiros (Google AdMob para anúncios, serviço de meteorologia) que podem processar dados de acordo com as suas próprias políticas, mas não vendemos nem partilhamos os seus dados para fins de marketing.",
      },
      {
        question: "Como posso controlar os anúncios personalizados?",
        answer: "Quando instala a aplicação pela primeira vez, é apresentado um ecrã de consentimento onde pode escolher entre anúncios personalizados ou não personalizados. Pode alterar esta preferência a qualquer momento nas Definições, na secção 'Privacidade'.",
      },
      {
        question: "Como posso eliminar os meus dados?",
        answer: "As preferências e dados da aplicação são armazenados localmente no seu dispositivo. Para os eliminar, basta desinstalar a aplicação. Se tiver questões sobre outros dados, contacte-nos através do email olhaqueduas.assessoria@gmail.com.",
      },
      {
        question: "A aplicação cumpre o RGPD?",
        answer: "Sim, a aplicação está em total conformidade com o Regulamento Geral de Proteção de Dados (RGPD). Respeitamos todos os seus direitos, incluindo o direito de acesso, retificação, eliminação e portabilidade dos dados.",
      },
    ],
  },
  {
    title: "Problemas Técnicos",
    icon: "🔧",
    items: [
      {
        question: "A aplicação está a crashar. O que fazer?",
        answer: (
          <>
            Se a aplicação estiver a fechar inesperadamente:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Certifique-se de que tem a versão mais recente da aplicação</li>
              <li>Reinicie o dispositivo</li>
              <li>Limpe a cache da aplicação nas definições do sistema</li>
              <li>Se o problema persistir, desinstale e reinstale a aplicação</li>
            </ul>
          </>
        ),
      },
      {
        question: "A aplicação está a gastar muita bateria?",
        answer: "O streaming de áudio em segundo plano consome alguma bateria, mas otimizamos ao máximo. Se notar consumo excessivo, verifique se não tem outras aplicações em conflito e se a ligação à internet está estável (ligações instáveis consomem mais bateria).",
      },
      {
        question: "Os dados móveis estão a ser consumidos rapidamente?",
        answer: "O streaming de rádio consome aproximadamente 86MB por hora. Para poupar dados, recomendamos utilizar Wi-Fi quando possível. A previsão meteorológica e as notícias consomem dados mínimos.",
      },
      {
        question: "A aplicação não abre ou fica bloqueada no loading?",
        answer: (
          <>
            Experimente:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Verificar a ligação à internet</li>
              <li>Forçar o encerramento da aplicação e reabrir</li>
              <li>Reiniciar o dispositivo</li>
              <li>Verificar se há atualizações disponíveis</li>
              <li>Limpar cache e dados da aplicação</li>
            </ul>
          </>
        ),
      },
      {
        question: "Como reporto um bug ou problema?",
        answer: (
          <>
            Agradecemos o seu feedback! Pode reportar problemas:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Por email: olhaqueduas.assessoria@gmail.com</li>
              <li>Através das redes sociais (Instagram, Facebook)</li>
              <li>Deixando um comentário na Google Play Store</li>
            </ul>
            Por favor, inclua o modelo do dispositivo, versão do sistema operativo e uma descrição detalhada do problema.
          </>
        ),
      },
    ],
  },
  {
    title: "Contacto e Suporte",
    icon: "💬",
    items: [
      {
        question: "Como posso contactar a equipa?",
        answer: (
          <>
            Pode contactar-nos através de:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Email:</strong> olhaqueduas.assessoria@gmail.com</li>
              <li><strong>Instagram:</strong> @olhaqueduas</li>
              <li><strong>Facebook:</strong> Olha que Duas</li>
            </ul>
          </>
        ),
      },
      {
        question: "Qual é o tempo de resposta do suporte?",
        answer: "Fazemos o nosso melhor para responder a todas as questões no prazo de 48 horas úteis. Questões mais complexas podem demorar um pouco mais.",
      },
      {
        question: "Posso sugerir novos programas ou funcionalidades?",
        answer: "Claro que sim! Adoramos ouvir as sugestões da nossa comunidade. Envie as suas ideias por email ou através das redes sociais. Todas as sugestões são lidas e consideradas pela equipa.",
      },
      {
        question: "Como posso participar nos programas da rádio?",
        answer: "Alguns dos nossos programas aceitam participação dos ouvintes! Siga-nos nas redes sociais para saber quando há oportunidades de participação, ou envie-nos uma mensagem a manifestar o seu interesse.",
      },
      {
        question: "Posso anunciar na Olha que Duas?",
        answer: "Sim, temos várias opções de publicidade e parcerias. Para mais informações sobre oportunidades comerciais, envie um email para olhaqueduas.assessoria@gmail.com com o assunto 'Publicidade'.",
      },
    ],
  },
];

const FAQAccordion = ({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-start justify-between text-left hover:bg-[#2a2a2a] transition-colors px-4 -mx-4"
      >
        <span className="text-white font-medium pr-4">{item.question}</span>
        <span className={`text-[#FFD700] text-xl transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-300 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // SEO Meta Tags
  useMetaTags({
    title: 'Perguntas Frequentes (FAQ)',
    description: 'Encontre respostas para as perguntas mais frequentes sobre a aplicação Olha que Duas. Saiba como usar a rádio, configurar lembretes, gerir a sua conta e muito mais.',
    url: 'https://www.olhaqueduas.com/faq',
    jsonLd: getPageBreadcrumbJsonLd('FAQ', 'https://www.olhaqueduas.com/faq'),
  });

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    faqData.forEach((category, catIndex) => {
      category.items.forEach((_, itemIndex) => {
        allOpen[`${catIndex}-${itemIndex}`] = true;
      });
    });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-[#FFD700] hover:underline mb-4 inline-block">
            ← Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold text-[#FFD700] mb-2">
            Perguntas Frequentes
          </h1>
          <p className="text-gray-400 mb-6">
            Encontre respostas para as dúvidas mais comuns sobre a aplicação Olha que Duas.
          </p>

          {/* Expand/Collapse buttons */}
          <div className="flex gap-4">
            <button
              onClick={expandAll}
              className="text-sm text-[#FFD700] hover:underline"
            >
              Expandir todas
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={collapseAll}
              className="text-sm text-[#FFD700] hover:underline"
            >
              Recolher todas
            </button>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Navegação Rápida</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {faqData.map((category, index) => (
              <a
                key={index}
                href={`#category-${index}`}
                className="flex items-center gap-2 text-gray-300 hover:text-[#FFD700] transition-colors"
              >
                <span>{category.icon}</span>
                <span className="text-sm">{category.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <section key={categoryIndex} id={`category-${categoryIndex}`} className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-2xl font-semibold text-white">{category.title}</h2>
              </div>

              <div className="bg-[#242424] rounded-lg p-4">
                {category.items.map((item, itemIndex) => (
                  <FAQAccordion
                    key={itemIndex}
                    item={item}
                    isOpen={openItems[`${categoryIndex}-${itemIndex}`] || false}
                    onToggle={() => toggleItem(categoryIndex, itemIndex)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still need help section */}
        <div className="mt-12 bg-gradient-to-r from-[#d6402e] to-[#FFD700] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-white/90 mb-6">
            Se não encontrou a resposta que procurava, não hesite em contactar-nos.
            Estamos sempre disponíveis para ajudar!
          </p>
          <a
            href="mailto:olhaqueduas.assessoria@gmail.com"
            className="inline-block bg-white text-[#1a1a1a] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Enviar Email
          </a>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center space-x-4">
          <Link to="/privacidade" className="text-[#FFD700] hover:underline">
            Política de Privacidade
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/termos" className="text-[#FFD700] hover:underline">
            Termos de Utilização
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

export default FAQ;
