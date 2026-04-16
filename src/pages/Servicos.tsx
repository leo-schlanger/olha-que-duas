import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
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
  MessageCircle,
  Facebook,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated, AnimatedGrid } from '@/components/ui/animated';
import { useMetaTags } from '@/hooks/useMetaTags';
import { siteConfig } from '@/config/site';

// JSON-LD Schema for Services Page - SEO Optimizado
const servicesJsonLd = [
  // Breadcrumb Navigation
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.olhaqueduas.com' },
      { '@type': 'ListItem', position: 2, name: 'Serviços', item: 'https://www.olhaqueduas.com/servicos' },
    ],
  },
  // Professional Service - Main Entity
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://www.olhaqueduas.com/servicos#professionalservice',
    name: 'Olha que Duas - Agência de Comunicação e Marketing Digital',
    description: 'Agência de comunicação e marketing digital em Portugal especializada em gestão de redes sociais, produção de vídeo, consultoria de marca, rádio online 24h e podcast.',
    url: 'https://www.olhaqueduas.com/servicos',
    telephone: '+351',
    email: 'olhaqueduas.assessoria@gmail.com',
    image: 'https://www.olhaqueduas.com/og-image.jpg',
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Transferência Bancária, MBWay',
    areaServed: [
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Country', name: 'Brasil' },
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: 38.7223, longitude: -9.1393 },
      geoRadius: '500000',
    },
    knowsLanguage: ['pt-PT', 'pt-BR', 'en'],
    slogan: 'Comunicação com Propósito',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      '@id': 'https://www.olhaqueduas.com/servicos#catalog',
      name: 'Serviços de Comunicação e Marketing',
      itemListElement: [
        // Marketing Digital
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.olhaqueduas.com/servicos#marketing-digital',
            name: 'Gestão de Redes Sociais e Marketing Digital',
            description: 'Planos mensais de gestão completa de redes sociais incluindo criação de conteúdo, posts, Reels, Stories, calendário editorial, relatórios de métricas e consultoria estratégica.',
            serviceType: 'Social Media Marketing',
            provider: { '@id': 'https://www.olhaqueduas.com/#organization' },
            areaServed: { '@type': 'Country', name: 'Portugal' },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Planos de Marketing Digital',
              itemListElement: [
                { '@type': 'Offer', name: 'Plano Starter', description: '8-12 posts/mês, 2 Reels, 1 rede social, relatório mensal. Ideal para negócios locais.' },
                { '@type': 'Offer', name: 'Plano Growth', description: '16-20 posts/mês, 4 Reels, 2 redes sociais, vídeo comercial, consultoria mensal. Para PMEs em crescimento.' },
                { '@type': 'Offer', name: 'Plano Premium', description: '30 posts/mês, 8 Reels, 3 redes sociais, 2 vídeos, veiculação rádio, consultoria semanal. Para empresas estabelecidas.' },
                { '@type': 'Offer', name: 'Plano Enterprise', description: 'Solução personalizada com campanhas integradas, produção ilimitada, account manager dedicado. Para grandes marcas.' },
              ],
            },
          },
        },
        // Produção de Conteúdo Digital
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.olhaqueduas.com/servicos#conteudo-digital',
            name: 'Criação de Conteúdo Digital',
            description: 'Design de posts para Instagram, carrosséis até 10 slides, pack de Stories, Reels simples e Reels com IA avançada para redes sociais.',
            serviceType: 'Content Creation',
            provider: { '@id': 'https://www.olhaqueduas.com/#organization' },
          },
        },
        // Produção de Vídeo
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.olhaqueduas.com/servicos#producao-video',
            name: 'Produção de Vídeo Profissional',
            description: 'Produção de vídeos comerciais (30s-2min), vídeos institucionais (2-3min) e documentários (5+min) com roteiro, captação e edição profissional.',
            serviceType: 'Video Production',
            provider: { '@id': 'https://www.olhaqueduas.com/#organization' },
          },
        },
        // Consultoria de Marca
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.olhaqueduas.com/servicos#consultoria-marca',
            name: 'Consultoria e Estratégia de Marca',
            description: 'Sessões de consultoria, diagnóstico de marca, estratégia de posicionamento, tom de voz, guidelines de comunicação e rebranding completo.',
            serviceType: 'Brand Consulting',
            provider: { '@id': 'https://www.olhaqueduas.com/#organization' },
          },
        },
        // Produção de Áudio
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.olhaqueduas.com/servicos#producao-audio',
            name: 'Produção de Áudio e Jingles',
            description: 'Criação de jingles (15s-60s), spots de rádio, vinhetas e intros para podcast com composição original e locução profissional.',
            serviceType: 'Audio Production',
            provider: { '@id': 'https://www.olhaqueduas.com/#organization' },
          },
        },
        // Publicidade em Rádio
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.olhaqueduas.com/servicos#radio-publicidade',
            name: 'Publicidade em Rádio Online',
            description: 'Veiculação de spots publicitários na rádio Olha que Duas 24h: spots rotativos, prime time (8h-10h, 17h-20h), menções ao vivo, patrocínio de programas.',
            serviceType: 'Radio Advertising',
            provider: { '@id': 'https://www.olhaqueduas.com/#organization' },
          },
        },
        // Podcast
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.olhaqueduas.com/servicos#podcast',
            name: 'Produção e Gestão de Podcast',
            description: 'Participação como convidado, episódios patrocinados, produção completa de podcast (gravação, edição, distribuição), lançamento e gestão mensal.',
            serviceType: 'Podcast Production',
            provider: { '@id': 'https://www.olhaqueduas.com/#organization' },
          },
        },
        // Desenvolvimento Web
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.olhaqueduas.com/servicos#desenvolvimento-web',
            name: 'Criação de Websites',
            description: 'Desenvolvimento de landing pages, sites institucionais (3-10 páginas) e sites premium com design responsivo, SEO, animações e alta performance.',
            serviceType: 'Web Development',
            provider: { '@id': 'https://www.olhaqueduas.com/#organization' },
          },
        },
        // Campanhas
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': 'https://www.olhaqueduas.com/servicos#campanhas',
            name: 'Campanhas de Marketing',
            description: 'Campanhas de lançamento de produto, campanhas sazonais (Natal, Páscoa, Dia das Mães), campanhas focadas em redes sociais e campanhas integradas digital + rádio.',
            serviceType: 'Marketing Campaign',
            provider: { '@id': 'https://www.olhaqueduas.com/#organization' },
          },
        },
      ],
    },
    sameAs: [
      'https://www.instagram.com/olhaqueduas2025',
      'https://www.facebook.com/share/17npXT7nNb/',
      'https://www.tiktok.com/@olha.que.duas_',
      'https://youtube.com/@olhaqueduas-l9m',
    ],
  },
  // WebPage
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.olhaqueduas.com/servicos#webpage',
    url: 'https://www.olhaqueduas.com/servicos',
    name: 'Serviços de Marketing Digital e Comunicação | Olha que Duas',
    description: 'Serviços profissionais de marketing digital, gestão de redes sociais, produção de vídeo, consultoria de marca, publicidade em rádio online e podcast em Portugal.',
    isPartOf: { '@id': 'https://www.olhaqueduas.com/#website' },
    about: { '@id': 'https://www.olhaqueduas.com/servicos#professionalservice' },
    mainEntity: { '@id': 'https://www.olhaqueduas.com/servicos#professionalservice' },
    inLanguage: 'pt-PT',
    datePublished: '2025-01-01',
    dateModified: '2026-04-05',
  },
  // FAQ Schema - Perguntas relevantes sobre os serviços
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://www.olhaqueduas.com/servicos#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quais são os planos de marketing digital disponíveis?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oferecemos 4 planos: Starter (ideal para negócios locais, inclui 8-12 posts/mês, 2 Reels e gestão de 1 rede social), Growth (para PMEs, 16-20 posts/mês, 4 Reels, 2 redes sociais), Premium (empresas estabelecidas, até 30 posts/mês, 8 Reels, 3 redes, veiculação rádio) e Enterprise (solução personalizada para grandes marcas).',
        },
      },
      {
        '@type': 'Question',
        name: 'A Olha que Duas produz vídeos comerciais e institucionais?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, produzimos vídeos comerciais curtos (até 30 segundos) ideais para anúncios, vídeos comerciais de 1-2 minutos com roteiro e edição completa, vídeos institucionais de 2-3 minutos com qualidade cinematográfica, e documentários de 5+ minutos com entrevistas e narrativa profissional.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como funciona a publicidade na rádio Olha que Duas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oferecemos várias opções: spots rotativos de 30 segundos veiculados ao longo da semana, spots em horário prime time (8h-10h e 17h-20h), menções ao vivo durante programas, patrocínio de programas mensais, e pacotes mensais com 20 spots. A rádio transmite 24 horas online.',
        },
      },
      {
        '@type': 'Question',
        name: 'Que tipos de conteúdo digital a Olha que Duas cria?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Criamos posts para Instagram (design + copywriting), carrosséis até 10 slides com narrativa visual, packs de 5 Stories personalizados, Reels simples até 30 segundos com edição profissional, e Reels com IA avançada de 30-60 segundos utilizando ferramentas de inteligência artificial.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Olha que Duas desenvolve websites?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, desenvolvemos landing pages simples e avançadas (com animações e SEO), sites institucionais de 3-5 páginas ou 5-10 páginas completas com blog e galeria, e sites premium com design exclusivo, animações avançadas e performance optimizada. Também oferecemos planos de manutenção mensal.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como posso participar do podcast Olha que Duas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oferecemos participação como convidado para entrevistas, episódios patrocinados dedicados à sua marca ou tema, e também produzimos podcasts para clientes incluindo gravação, edição, masterização e publicação em todas as plataformas.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Olha que Duas oferece consultoria de marca?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, oferecemos sessões de consultoria de 1 hora, diagnóstico completo de marca com relatório e recomendações, estratégia de marca com posicionamento e tom de voz, e rebranding completo incluindo nova identidade visual e estratégica.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quais serviços adicionais a Olha que Duas oferece?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Além dos serviços principais, oferecemos design de logo, copywriting profissional, sessões fotográficas, vídeos hero para websites, integração de WhatsApp/chat, traduções, e campanhas de marketing sazonais ou de lançamento de produtos.',
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
                  className="h-14 px-8 text-base font-medium rounded-xl bg-amarelo hover:bg-amarelo/90 text-charcoal"
                >
                  <Link to="/#contacto" className="inline-flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Enviar Mensagem
                  </Link>
                </Button>
              </div>

              <div className="pt-8 border-t border-cream/10">
                <p className="text-sm text-cream/50 mb-4">Ou contacte-nos directamente:</p>
                <div className="flex flex-wrap items-center justify-center gap-6">
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
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cream hover:text-vermelho transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="text-sm font-medium">Facebook</span>
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
