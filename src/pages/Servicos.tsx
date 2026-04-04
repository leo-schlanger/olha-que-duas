import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Instagram,
  Video,
  Lightbulb,
  Music,
  Radio,
  Mic,
  Globe,
  Palette,
  TrendingUp,
  Megaphone,
  Handshake,
  Check,
  Star,
  Zap,
  Crown,
  Building2,
  Mail,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated, AnimatedGrid } from '@/components/ui/animated';
import { useMetaTags } from '@/hooks/useMetaTags';
import { siteConfig } from '@/config/site';

// JSON-LD Schema for Services Page
const servicesJsonLd = [
  // Breadcrumb
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: 'https://www.olhaqueduas.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Serviços',
        item: 'https://www.olhaqueduas.com/servicos',
      },
    ],
  },
  // Service Catalog
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://www.olhaqueduas.com/servicos#services',
    name: 'Serviços de Comunicação e Marketing Digital',
    description: 'Serviços completos de comunicação, marketing digital, produção de vídeo, consultoria de marca, rádio online e podcast em Portugal.',
    url: 'https://www.olhaqueduas.com/servicos',
    provider: {
      '@type': 'Organization',
      '@id': 'https://www.olhaqueduas.com/#organization',
      name: 'Olha que Duas',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Portugal',
    },
    serviceType: [
      'Marketing Digital',
      'Gestão de Redes Sociais',
      'Produção de Vídeo',
      'Produção de Áudio',
      'Consultoria de Marca',
      'Desenvolvimento Web',
      'Publicidade em Rádio',
      'Produção de Podcast',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo de Serviços Olha que Duas',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Planos de Marketing Digital',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Plano Starter',
                description: 'Gestão de 1 rede social, 8-12 posts/mês, 2 Reels, relatório mensal',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Plano Growth',
                description: 'Gestão de 2 redes sociais, 16-20 posts/mês, 4 Reels, vídeo comercial, consultoria mensal',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Plano Premium',
                description: 'Gestão de 3 redes sociais, até 30 posts/mês, 8 Reels, 2 vídeos, veiculação rádio, consultoria semanal',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Plano Enterprise',
                description: 'Solução completa personalizada com campanhas integradas e account manager dedicado',
              },
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Produção de Vídeo',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Vídeo Comercial',
                description: 'Produção de vídeos comerciais de 30 segundos a 3 minutos',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Vídeo Institucional',
                description: 'Vídeos institucionais com qualidade cinematográfica',
              },
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Rádio e Podcast',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Veiculação em Rádio',
                description: 'Spots publicitários na rádio online 24h',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Produção de Podcast',
                description: 'Gravação, edição e distribuição de podcasts',
              },
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Desenvolvimento Web',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Criação de Websites',
                description: 'Landing pages e sites institucionais modernos e responsivos',
              },
            },
          ],
        },
      ],
    },
  },
  // FAQ Schema
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quais serviços de marketing digital a Olha que Duas oferece?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oferecemos gestão completa de redes sociais, criação de conteúdo (posts, Reels, Stories), produção de vídeo, consultoria de marca, produção de áudio, publicidade em rádio online e produção de podcast.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como funcionam os planos de marketing digital?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Temos 4 planos: Starter (negócios locais), Growth (PMEs em crescimento), Premium (empresas estabelecidas) e Enterprise (grandes marcas). Cada plano inclui gestão de redes sociais, criação de conteúdo, relatórios e suporte, com diferentes níveis de serviço.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Olha que Duas produz vídeos para empresas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, produzimos vídeos comerciais (30 segundos a 2 minutos), vídeos institucionais (2-3 minutos) e documentários (5+ minutos), com roteiro, produção e edição profissional.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como posso anunciar na rádio Olha que Duas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oferecemos spots rotativos, spots em horário nobre (8h-10h e 17h-20h), menções ao vivo durante programas, patrocínio de programas e pacotes mensais com 20 spots.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Olha que Duas cria websites?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, criamos landing pages simples e avançadas, sites institucionais (3-10 páginas) e sites premium com design exclusivo, animações e performance optimizada.',
        },
      },
    ],
  },
];

// Planos de Marketing Digital
const marketingPlans = [
  {
    name: 'Starter',
    icon: Zap,
    description: 'Ideal para negócios locais que querem começar a marcar presença digital.',
    badge: null,
    features: [
      '8 a 12 publicações por mês no Instagram',
      '2 Reels editados com música e legendas',
      'Gestão completa de 1 rede social',
      'Calendário editorial mensal',
      'Relatório de métricas básico',
      'Suporte por email',
    ],
  },
  {
    name: 'Growth',
    icon: TrendingUp,
    description: 'Para PMEs em crescimento que precisam de uma estratégia mais robusta.',
    badge: 'Mais Popular',
    features: [
      '16 a 20 publicações por mês',
      '4 Reels profissionais (2 com IA avançada)',
      'Gestão de 2 redes sociais',
      '1 vídeo comercial por mês (até 1 min)',
      'Sessão de consultoria mensal (1 hora)',
      'Relatório detalhado com análise de métricas',
      'Suporte prioritário por WhatsApp',
    ],
  },
  {
    name: 'Premium',
    icon: Crown,
    description: 'Para empresas estabelecidas que querem dominar todos os canais.',
    badge: null,
    features: [
      'Até 30 publicações por mês',
      '8 Reels profissionais com produção premium',
      'Gestão de 3 redes sociais',
      '2 vídeos comerciais por mês',
      'Veiculação de spots na nossa rádio',
      'Consultoria estratégica semanal',
      'Copywriting profissional incluído',
      'Account manager dedicado',
    ],
  },
  {
    name: 'Enterprise',
    icon: Building2,
    description: 'Solução completa e personalizada para grandes marcas.',
    badge: 'Sob Medida',
    features: [
      'Tudo do plano Premium incluído',
      'Campanhas integradas multicanal',
      'Produção de conteúdo ilimitada',
      'Espaço privilegiado na rádio',
      'Participações no podcast',
      'Estratégia de influencer marketing',
      'Relatórios executivos personalizados',
      'Reuniões semanais de alinhamento',
    ],
  },
];

// Serviços de Conteúdo Digital
const digitalServices = [
  {
    name: 'Post Instagram',
    subtitle: 'Design + Copywriting',
    description: 'Arte estática profissional com texto otimizado para engagement. Inclui design alinhado à identidade visual da sua marca e copy estratégico.',
  },
  {
    name: 'Carrossel Instagram',
    subtitle: 'Até 10 slides',
    description: 'Design coeso com narrativa visual que conta uma história. Ideal para conteúdo educativo, lançamentos e storytelling da marca.',
  },
  {
    name: 'Pack Stories',
    subtitle: '5 unidades',
    description: 'Templates personalizados e alinhados com a identidade da sua marca. Perfeitos para o dia a dia, promoções e bastidores.',
  },
  {
    name: 'Reel Simples',
    subtitle: 'Até 30 segundos',
    description: 'Edição profissional com música trending, legendas estilizadas e transições dinâmicas. Optimizado para o algoritmo.',
  },
  {
    name: 'Reel com IA Avançada',
    subtitle: '30-60 segundos',
    description: 'Produção premium utilizando ferramentas de IA profissionais. Avatar digital, voiceover sintético, efeitos visuais avançados.',
  },
];

// Serviços de Produção de Vídeo
const videoServices = [
  {
    name: 'Vídeo Comercial Curto',
    subtitle: 'Até 30 segundos',
    description: 'Ideal para anúncios em redes sociais e YouTube Ads. Mensagem directa e impactante que converte.',
  },
  {
    name: 'Vídeo Comercial',
    subtitle: '1-2 minutos',
    description: 'Roteiro, produção e edição completa. Apresentação profissional do seu negócio, produto ou serviço.',
  },
  {
    name: 'Vídeo Institucional',
    subtitle: '2-3 minutos',
    description: 'Qualidade cinematográfica para apresentar a sua empresa. Inclui entrevistas, imagens de cobertura e pós-produção premium.',
  },
  {
    name: 'Documentário',
    subtitle: '5+ minutos',
    description: 'Produção completa com entrevistas, narrativa envolvente e storytelling profissional. Ideal para histórias de marca.',
  },
];

// Serviços de Consultoria
const consultingServices = [
  {
    name: 'Sessão de Consultoria',
    subtitle: '1 hora',
    description: 'Orientação estratégica personalizada para os seus desafios de marca, comunicação ou marketing digital.',
  },
  {
    name: 'Diagnóstico de Marca',
    subtitle: 'Análise completa',
    description: 'Avaliação profunda da sua marca com relatório detalhado, análise SWOT e recomendações accionáveis.',
  },
  {
    name: 'Estratégia de Marca',
    subtitle: 'Posicionamento completo',
    description: 'Definição de posicionamento, tom de voz, guidelines de comunicação e manual de identidade verbal.',
  },
  {
    name: 'Rebranding Completo',
    subtitle: 'Nova identidade',
    description: 'Transformação completa da identidade visual e estratégica. Inclui logo, paleta, tipografia e aplicações.',
  },
];

// Serviços de Áudio
const audioServices = [
  {
    name: 'Jingle',
    subtitle: '15-60 segundos',
    description: 'Composição original com voz profissional. Disponível em versões de 15s, 30s e 60s para diferentes aplicações.',
  },
  {
    name: 'Spot de Rádio',
    subtitle: 'Anúncio profissional',
    description: 'Locução profissional com mixagem de alta qualidade. Pronto para veiculação em rádio ou podcast.',
  },
  {
    name: 'Vinheta / Intro',
    subtitle: 'Abertura personalizada',
    description: 'Identidade sonora para o seu podcast, programa de rádio ou canal de YouTube.',
  },
];

// Serviços de Rádio
const radioServices = [
  {
    name: 'Spot Rotativo',
    subtitle: 'Por semana',
    description: 'Veiculação do seu anúncio de 30 segundos em horários variados ao longo da semana na nossa rádio online 24h.',
  },
  {
    name: 'Spot Prime Time',
    subtitle: 'Horário nobre',
    description: 'Veiculação nos horários de maior audiência: manhã (8h-10h) e fim de tarde (17h-20h).',
  },
  {
    name: 'Menção ao Vivo',
    subtitle: 'Durante programa',
    description: 'A sua marca mencionada ao vivo durante os nossos programas. Autenticidade e conexão directa.',
  },
  {
    name: 'Patrocínio de Programa',
    subtitle: 'Mensal',
    description: '"Este programa é oferecido por..." - Associação directa da sua marca com o nosso conteúdo.',
  },
  {
    name: 'Pacote Mensal',
    subtitle: '20 spots',
    description: 'Veiculação diária garantida com condições especiais. Presença constante na nossa programação.',
  },
];

// Serviços de Podcast
const podcastServices = [
  {
    name: 'Participação como Convidado',
    subtitle: 'Entrevista',
    description: 'Seja entrevistado no podcast Olha que Duas. Partilhe a sua história e alcance a nossa audiência.',
  },
  {
    name: 'Episódio Patrocinado',
    subtitle: 'Episódio dedicado',
    description: 'Um episódio completamente dedicado à sua marca, produto ou tema de interesse.',
  },
  {
    name: 'Produção de Podcast',
    subtitle: 'Por episódio',
    description: 'Gravação em estúdio, edição profissional, masterização e publicação em todas as plataformas.',
  },
  {
    name: 'Lançamento de Podcast',
    subtitle: 'Pacote completo',
    description: 'Estratégia, identidade visual e sonora, 4 episódios iniciais gravados e editados, distribuição configurada.',
  },
  {
    name: 'Gestão Mensal',
    subtitle: '4 episódios + promoção',
    description: 'Produção mensal completa: gravação, edição, publicação e promoção nas redes sociais.',
  },
];

// Serviços Web
const webServices = [
  {
    name: 'Landing Page Simples',
    subtitle: '1 página',
    description: 'Página única responsiva com formulário de captação de leads. Design moderno e optimizado para conversão.',
  },
  {
    name: 'Landing Page Avançada',
    subtitle: 'Com animações',
    description: 'Animações modernas, integrações com ferramentas de marketing, SEO optimizado e analytics.',
  },
  {
    name: 'Site Institucional',
    subtitle: '3-5 páginas',
    description: 'Apresentação completa do seu negócio. Design responsivo, formulário de contacto e SEO básico.',
  },
  {
    name: 'Site Completo',
    subtitle: '5-10 páginas',
    description: 'Portfolio, galeria, blog integrado, área de clientes e integração com Google Analytics.',
  },
  {
    name: 'Site Premium',
    subtitle: 'Até 10 páginas',
    description: 'Design exclusivo, animações avançadas, performance optimizada e experiência de utilizador premium.',
  },
];

// Serviços Adicionais
const additionalServices = [
  { name: 'Design de Logo', description: 'Criação de logótipo profissional com variações e manual de aplicação.' },
  { name: 'Copywriting', description: 'Textos persuasivos e estratégicos para websites, redes sociais ou materiais.' },
  { name: 'Sessão Fotográfica', description: 'Fotos profissionais para perfil, produtos, equipa ou eventos.' },
  { name: 'Vídeo Hero', description: 'Vídeo de fundo impactante para a página inicial do seu website.' },
  { name: 'Integração WhatsApp', description: 'Chat ao vivo no seu site para atendimento directo ao cliente.' },
  { name: 'Tradução', description: 'Tradução profissional do seu site ou materiais para outros idiomas.' },
];

// Campanhas
const campaignServices = [
  {
    name: 'Campanha de Lançamento',
    description: 'Estratégia completa para lançar novos produtos ou serviços. Inclui teaser, lançamento e pós-lançamento.',
  },
  {
    name: 'Campanha Sazonal',
    description: 'Campanhas para datas especiais: Natal, Páscoa, Dia das Mães, Black Friday e outras ocasiões.',
  },
  {
    name: 'Campanha de Redes Sociais',
    description: 'Um mês de conteúdo focado em engagement, crescimento de seguidores ou conversões.',
  },
  {
    name: 'Campanha Integrada',
    description: 'Presença multicanal combinando digital e rádio para alcance máximo.',
  },
];

// Parcerias
const partnershipServices = [
  { name: 'Menção no Site', description: 'O seu logo como parceiro no nosso website com link para o seu negócio.' },
  { name: 'Post Patrocinado', description: 'Publicação dedicada nas nossas redes sociais com o alcance da nossa audiência.' },
  { name: 'Vídeo Colaboração', description: 'Participação em conteúdo de vídeo conjunto para ambas as audiências.' },
  { name: 'Pacote Influencer', description: '3 posts + stories completos para divulgação da sua marca.' },
  { name: 'Parceria Trimestral', description: 'Presença completa: Site + Redes + Rádio + Podcast durante 3 meses.' },
];

// Componente de Card de Serviço
function ServiceCard({ name, subtitle, description }: { name: string; subtitle?: string; description: string }) {
  return (
    <div className="group relative rounded-2xl p-6 bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <h4 className="text-lg font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {name}
      </h4>
      {subtitle && (
        <p className="text-sm font-medium text-primary/80 mb-3">{subtitle}</p>
      )}
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// Componente de Card Simples
function SimpleCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

// Componente de Secção
function Section({
  id,
  title,
  subtitle,
  icon: Icon,
  children,
  className = ''
}: {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <Animated animation="fade-up" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </Animated>
        {children}
      </div>
    </section>
  );
}

export default function Servicos() {
  useMetaTags({
    title: 'Serviços de Marketing Digital e Comunicação',
    description: 'Serviços profissionais de marketing digital, gestão de redes sociais, produção de vídeo, consultoria de marca, rádio online 24h e podcast em Portugal. Planos desde gestão básica até soluções enterprise. Peça orçamento.',
    url: 'https://www.olhaqueduas.com/servicos',
    image: 'https://www.olhaqueduas.com/og-servicos.jpg',
    imageAlt: 'Serviços de Marketing Digital e Comunicação - Olha que Duas',
    jsonLd: servicesJsonLd,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 md:pt-28">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vermelho/10 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amarelo/10 rounded-full blur-3xl animate-float" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-vermelho/5 to-transparent rounded-full" />
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0V0zm1 1v58h58V1H1z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Animated animation="fade-down">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermelho/10 border border-vermelho/20 mb-8">
                  <Sparkles className="w-4 h-4 text-vermelho" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-vermelho">
                    Os Nossos Serviços
                  </span>
                </div>
              </Animated>

              <Animated animation="fade-up" delay={100}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-cream mb-6 leading-tight">
                  Comunicação com{' '}
                  <span className="text-gradient-brand">Propósito</span>
                </h1>
              </Animated>

              <Animated animation="fade-up" delay={200}>
                <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto leading-relaxed mb-12">
                  Do conteúdo digital à produção audiovisual, oferecemos soluções completas
                  para marcas que querem comunicar com autenticidade e impacto.
                </p>
              </Animated>

              <Animated animation="fade-up" delay={300}>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-vermelho">50+</div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Serviços</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-cream/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-cream">24h</div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Rádio Online</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-cream/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-amarelo">100%</div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Personalizado</div>
                  </div>
                </div>
              </Animated>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
            </svg>
          </div>
        </section>

        {/* Planos de Marketing Digital */}
        <section id="planos" className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <Animated animation="fade-up" className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Planos Mensais
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Planos de Marketing Digital
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Gestão completa das suas redes sociais com estratégia, conteúdo e resultados.
                Escolha o plano ideal para o seu negócio.
              </p>
            </Animated>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {marketingPlans.map((plan, index) => {
                const Icon = plan.icon;
                const isPopular = plan.badge === 'Mais Popular';

                return (
                  <Animated key={plan.name} animation="fade-up" delay={index * 100}>
                    <div
                      className={`relative h-full rounded-2xl p-6 transition-all duration-300 ${
                        isPopular
                          ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/20 scale-[1.02] lg:scale-105'
                          : 'bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg'
                      }`}
                    >
                      {plan.badge && (
                        <div
                          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            isPopular
                              ? 'bg-amarelo text-charcoal'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {plan.badge}
                        </div>
                      )}

                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        isPopular ? 'bg-white/20' : 'bg-primary/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${isPopular ? 'text-white' : 'text-primary'}`} />
                      </div>

                      <h3 className={`text-xl font-display font-bold mb-2 ${
                        isPopular ? 'text-white' : 'text-foreground'
                      }`}>
                        {plan.name}
                      </h3>

                      <p className={`text-sm mb-6 ${
                        isPopular ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        {plan.description}
                      </p>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                              isPopular ? 'text-amarelo' : 'text-primary'
                            }`} />
                            <span className={`text-sm ${
                              isPopular ? 'text-white/90' : 'text-foreground/80'
                            }`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        asChild
                        className={`w-full ${
                          isPopular
                            ? 'bg-white text-primary hover:bg-white/90'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        <a href="#contacto-section">
                          Pedir Orçamento
                        </a>
                      </Button>
                    </div>
                  </Animated>
                );
              })}
            </div>
          </div>
        </section>

        {/* Conteúdo Digital */}
        <Section
          id="digital"
          title="Conteúdo Digital"
          subtitle="Criamos conteúdo que conecta a sua marca com o público certo nas redes sociais."
          icon={Instagram}
        >
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto" staggerDelay={80}>
            {digitalServices.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </AnimatedGrid>
        </Section>

        {/* Produção de Vídeo */}
        <Section
          id="video"
          title="Produção de Vídeo"
          subtitle="Vídeos profissionais que contam a história da sua marca com qualidade cinematográfica."
          icon={Video}
          className="bg-muted/30"
        >
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto" staggerDelay={80}>
            {videoServices.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </AnimatedGrid>
        </Section>

        {/* Consultoria de Marca */}
        <Section
          id="consultoria"
          title="Consultoria de Marca"
          subtitle="Estratégia e posicionamento para marcas que querem comunicar com propósito."
          icon={Lightbulb}
        >
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto" staggerDelay={80}>
            {consultingServices.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </AnimatedGrid>
        </Section>

        {/* Produção de Áudio */}
        <Section
          id="audio"
          title="Produção de Áudio"
          subtitle="Identidade sonora profissional para rádio, podcast e publicidade."
          icon={Music}
          className="bg-muted/30"
        >
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto" staggerDelay={80}>
            {audioServices.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </AnimatedGrid>
        </Section>

        {/* Rádio Digital */}
        <Section
          id="radio"
          title="Rádio Digital"
          subtitle="Veiculação na nossa rádio online 24 horas com audiência qualificada."
          icon={Radio}
        >
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto" staggerDelay={80}>
            {radioServices.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </AnimatedGrid>
        </Section>

        {/* Podcast */}
        <Section
          id="podcast"
          title="Podcast"
          subtitle="Participe do nosso podcast ou crie o seu próprio com a nossa produção."
          icon={Mic}
          className="bg-muted/30"
        >
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto" staggerDelay={80}>
            {podcastServices.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </AnimatedGrid>
        </Section>

        {/* Websites */}
        <Section
          id="websites"
          title="Websites"
          subtitle="Sites modernos, responsivos e optimizados para conversão."
          icon={Globe}
        >
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto" staggerDelay={80}>
            {webServices.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </AnimatedGrid>
        </Section>

        {/* Serviços Adicionais */}
        <Section
          id="adicionais"
          title="Serviços Adicionais"
          subtitle="Complementos para potenciar a sua comunicação."
          icon={Palette}
          className="bg-muted/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {additionalServices.map((service, index) => (
              <Animated key={service.name} animation="fade-up" delay={index * 50}>
                <SimpleCard {...service} />
              </Animated>
            ))}
          </div>
        </Section>

        {/* Campanhas */}
        <Section
          id="campanhas"
          title="Campanhas Avulsas"
          subtitle="Campanhas pontuais para momentos especiais do seu negócio."
          icon={Megaphone}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {campaignServices.map((service, index) => (
              <Animated key={service.name} animation="fade-up" delay={index * 50}>
                <SimpleCard {...service} />
              </Animated>
            ))}
          </div>
        </Section>

        {/* Parcerias */}
        <Section
          id="parcerias"
          title="Colaborações e Parcerias"
          subtitle="Parcerias estratégicas para ampliar o alcance da sua marca."
          icon={Handshake}
          className="bg-muted/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {partnershipServices.map((service, index) => (
              <Animated key={service.name} animation="fade-up" delay={index * 50}>
                <SimpleCard {...service} />
              </Animated>
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <section id="contacto-section" className="py-20 md:py-28 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-vermelho/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amarelo/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated animation="fade-up" className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermelho/10 border border-vermelho/20 mb-8">
                <Star className="w-4 h-4 text-vermelho" />
                <span className="text-xs font-semibold uppercase tracking-widest text-vermelho">
                  Vamos Começar
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-cream mb-6">
                Pronto para transformar a sua comunicação?
              </h2>

              <p className="text-lg text-cream/70 mb-10 max-w-xl mx-auto">
                Entre em contacto connosco para um orçamento personalizado.
                Vamos criar algo incrível juntos.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base font-medium rounded-xl bg-vermelho hover:bg-vermelho/90 text-white"
                >
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="inline-flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Pedir Orçamento
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base font-medium rounded-xl border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/50"
                >
                  <Link to="/#contacto" className="inline-flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Enviar Mensagem
                  </Link>
                </Button>
              </div>

              <div className="pt-8 border-t border-cream/10">
                <p className="text-sm text-cream/50 mb-4">Ou contacte-nos directamente:</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="flex items-center gap-2 text-cream hover:text-vermelho transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">{siteConfig.contact.email}</span>
                  </a>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cream hover:text-vermelho transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm font-medium">@olhaqueduas2025</span>
                  </a>
                </div>
              </div>
            </Animated>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
