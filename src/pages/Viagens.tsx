import { Link } from 'react-router-dom';
import {
  Plane,
  Hotel,
  UtensilsCrossed,
  MapPin,
  Heart,
  Users,
  Briefcase,
  Mountain,
  Compass,
  Star,
  Shield,
  Clock,
  Handshake,
  HeadphonesIcon,
  ArrowRight,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated, AnimatedGrid } from '@/components/ui/animated';
import { useMetaTags } from '@/hooks/useMetaTags';
import { siteConfig } from '@/config/site';
import tripLogo from '@/assets/olhaqueduas-trip-logo.jpg';

// JSON-LD Schema for Travel Page - SEO Exclusivo Olha que Duas Trip
const travelJsonLd = [
  // Breadcrumb Navigation
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.olhaqueduas.com' },
      { '@type': 'ListItem', position: 2, name: 'Viagens', item: 'https://www.olhaqueduas.com/viagens' },
    ],
  },
  // WebPage - Identificação exclusiva da página
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.olhaqueduas.com/viagens#webpage',
    url: 'https://www.olhaqueduas.com/viagens',
    name: 'Olha que Duas Trip — Viagens Personalizadas & Experiências Exclusivas',
    description: 'Descubra o mundo com a Olha que Duas Trip! Planeamento de viagens à medida, estadias em hotéis de charme, passagens aéreas com as melhores tarifas e experiências gourmet inesquecíveis.',
    isPartOf: { '@id': 'https://www.olhaqueduas.com/#website' },
    about: { '@id': 'https://www.olhaqueduas.com/viagens#travelagency' },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://www.olhaqueduas.com/og-viagens.jpg',
      width: 1200,
      height: 630,
      caption: 'Olha que Duas Trip — Promotora de Viagens Personalizadas',
    },
    inLanguage: 'pt-PT',
    dateModified: '2026-04-06',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.text-muted-foreground'],
    },
  },
  // TravelAgency - Entidade principal
  {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': 'https://www.olhaqueduas.com/viagens#travelagency',
    name: 'Olha que Duas Trip',
    alternateName: 'Olha que Duas Trip - Promotora de Viagens',
    description: 'Promotora de viagens especializada em planeamento personalizado. Estadias exclusivas em hotéis de charme, passagens aéreas com as melhores tarifas, experiências gourmet e roteiros à medida para Portugal, Europa e todo o mundo. Orçamento gratuito e suporte 24/7.',
    url: 'https://www.olhaqueduas.com/viagens',
    email: 'olhaqueduas.assessoria@gmail.com',
    image: {
      '@type': 'ImageObject',
      url: 'https://www.olhaqueduas.com/og-viagens.jpg',
      width: 1200,
      height: 630,
      caption: 'Olha que Duas Trip — Promotora de Viagens',
    },
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.olhaqueduas.com/og-viagens.jpg',
      width: 1200,
      height: 630,
    },
    priceRange: '€€-€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Transferência Bancária, MBWay, Cartão de Crédito',
    areaServed: [
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Continent', name: 'Europa' },
      { '@type': 'Place', name: 'Mundo' },
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: 38.7223, longitude: -9.1393 },
      geoRadius: '20000000',
    },
    knowsLanguage: ['pt-PT', 'pt-BR', 'en'],
    slogan: 'A sua viagem dos sonhos começa aqui',
    keywords: 'viagens personalizadas, promotora de viagens, agência de viagens Portugal, estadias exclusivas, passagens aéreas baratas, experiências gourmet, lua de mel, viagens em família, escapadinhas, circuitos culturais, orçamento de viagem grátis',
    parentOrganization: {
      '@type': 'Organization',
      '@id': 'https://www.olhaqueduas.com/#organization',
      name: 'Olha que Duas',
      url: 'https://www.olhaqueduas.com',
    },
    sameAs: [
      'https://www.instagram.com/olhaqueduas2025',
      'https://www.facebook.com/share/17npXT7nNb/',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços de Viagem Personalizados',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Planeamento de Viagens Personalizado',
            description: 'Consultoria completa com roteiros exclusivos, orçamentos detalhados e itinerários à medida. Do primeiro contacto à viagem, tratamos de cada detalhe.',
            serviceType: 'Travel Planning',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Estadias & Alojamento Premium',
            description: 'Reservas em hotéis de charme, resorts exclusivos, villas privadas e apartamentos seleccionados nos melhores destinos do mundo.',
            serviceType: 'Hotel Booking',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Passagens Aéreas ao Melhor Preço',
            description: 'Pesquisa e reserva das melhores tarifas aéreas com rotas optimizadas, voos directos e opções de upgrade.',
            serviceType: 'Flight Booking',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Experiências Gourmet & Wine Tours',
            description: 'Restaurantes com estrela Michelin, wine tours em vinícolas premiadas, aulas de culinária local e experiências gastronómicas inesquecíveis.',
            serviceType: 'Food Experience',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Viagens em Família & Lua de Mel',
            description: 'Pacotes especiais para famílias com actividades para todas as idades e destinos românticos para casais e lua de mel.',
            serviceType: 'Family Travel',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Viagens Corporativas & Team Building',
            description: 'Organização completa de viagens de negócios, congressos, eventos corporativos e experiências de team building.',
            serviceType: 'Corporate Travel',
          },
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '1',
      bestRating: '5',
    },
  },
  // FAQ - Perguntas Frequentes
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://www.olhaqueduas.com/viagens#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Como funciona o planeamento de viagens com a Olha que Duas Trip?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'É simples! Contacte-nos com o seu destino desejado, datas e preferências. Elaboramos um orçamento personalizado e gratuito com todas as opções de estadias, voos e experiências. Após aprovação, tratamos de todas as reservas e entregamos o seu itinerário completo.',
        },
      },
      {
        '@type': 'Question',
        name: 'Que tipos de viagens a Olha que Duas Trip organiza?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Organizamos viagens em família, lua de mel e viagens românticas, viagens de grupo, corporativas e team building, escapadinhas de fim de semana e circuitos culturais para qualquer destino no mundo. Cada viagem é personalizada ao seu perfil e orçamento.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Olha que Duas Trip oferece suporte durante a viagem?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! Disponibilizamos suporte 24/7 durante toda a sua viagem. Qualquer imprevisto ou necessidade, estamos a uma chamada de distância para garantir que tudo corre como planeado.',
        },
      },
      {
        '@type': 'Question',
        name: 'O orçamento de viagem é gratuito?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, o orçamento é totalmente gratuito e sem compromisso. Contacte-nos, partilhe o seu sonho de viagem e receba uma proposta personalizada com as melhores opções.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quais destinos a Olha que Duas Trip cobre?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Abrangemos destinos em todo o mundo! Desde escapadinhas em Portugal e pela Europa até viagens intercontinentais para as Caraíbas, Ásia, África e Américas. Qualquer que seja o seu destino de sonho, nós organizamos.',
        },
      },
    ],
  },
];

// Unsplash images (free to use) — auto format for device compatibility
const images = {
  hero: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=75&auto=format',
  estadias: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=75&auto=format',
  passagens: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&q=75&auto=format',
  gourmet: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=75&auto=format',
  familia: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=400&q=75&auto=format',
  luademel: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=400&q=75&auto=format',
  grupo: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&q=75&auto=format',
  corporativo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=75&auto=format',
  escapadinha: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=75&auto=format',
  circuitos: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=75&auto=format',
};

// Main travel services
const mainServices = [
  {
    icon: Hotel,
    title: 'Estadias & Alojamento',
    description: 'Hotéis de charme, resorts exclusivos, apartamentos e villas seleccionadas nos melhores destinos. Encontramos o alojamento perfeito para cada tipo de viagem.',
    image: images.estadias,
  },
  {
    icon: Plane,
    title: 'Passagens Aéreas',
    description: 'Pesquisa e reserva das melhores tarifas com rotas optimizadas. Voos directos, escalas estratégicas e upgrades para garantir o melhor custo-benefício.',
    image: images.passagens,
  },
  {
    icon: UtensilsCrossed,
    title: 'Experiências Gourmet',
    description: 'Restaurantes com estrela Michelin, wine tours em vinícolas premiadas, aulas de culinária local e experiências gastronómicas inesquecíveis.',
    image: images.gourmet,
  },
];

// Travel categories
const travelCategories = [
  {
    icon: Users,
    title: 'Viagens em Família',
    description: 'Destinos family-friendly com actividades para todas as idades. Hotéis com kids club, parques temáticos e aventuras em família.',
    image: images.familia,
  },
  {
    icon: Heart,
    title: 'Lua de Mel & Românticas',
    description: 'Destinos de sonho para casais. Resorts com spa, jantares à luz de velas, passeios românticos e momentos inesquecíveis a dois.',
    image: images.luademel,
  },
  {
    icon: MapPin,
    title: 'Viagens de Grupo',
    description: 'Organização completa para grupos de amigos, associações ou comunidades. Roteiros partilhados com experiências únicas.',
    image: images.grupo,
  },
  {
    icon: Briefcase,
    title: 'Corporativo & Incentivos',
    description: 'Viagens de negócios, team building, congressos e eventos corporativos. Logística completa e serviços VIP.',
    image: images.corporativo,
  },
  {
    icon: Mountain,
    title: 'Escapadinhas de Fim de Semana',
    description: 'Fugas rápidas para recarregar energias. Destinos próximos com experiências marcantes para 2 a 3 dias.',
    image: images.escapadinha,
  },
  {
    icon: Compass,
    title: 'Circuitos Culturais',
    description: 'Roteiros temáticos por cidades históricas, museus, monumentos e património mundial. Cultura e conhecimento em cada paragem.',
    image: images.circuitos,
  },
];

// How it works steps
const steps = [
  {
    number: '01',
    title: 'Conte-nos o Seu Sonho',
    description: 'Entre em contacto connosco e partilhe os seus desejos: destino, datas, orçamento e preferências. Cada viagem começa com uma conversa.',
  },
  {
    number: '02',
    title: 'Orçamento Personalizado',
    description: 'Elaboramos uma proposta à medida com as melhores opções de voos, alojamento e experiências, tudo adaptado ao seu perfil e orçamento.',
  },
  {
    number: '03',
    title: 'Viaje Sem Preocupações',
    description: 'Tratamos de todas as reservas e logística. Receba o seu itinerário completo e aproveite a viagem com total tranquilidade e suporte 24/7.',
  },
];

// Benefits
const benefits = [
  {
    icon: HeadphonesIcon,
    title: 'Atendimento Personalizado',
    description: 'Cada viagem é única. Ouvimos os seus desejos e criamos experiências à medida que superam expectativas.',
  },
  {
    icon: Shield,
    title: 'Segurança & Confiança',
    description: 'Trabalhamos com parceiros certificados e seguros de viagem para garantir total tranquilidade.',
  },
  {
    icon: Clock,
    title: 'Suporte 24/7',
    description: 'Estamos consigo antes, durante e após a viagem. Qualquer imprevisto, estamos a uma chamada de distância.',
  },
  {
    icon: Handshake,
    title: 'Parcerias Exclusivas',
    description: 'Acordos com hotéis, companhias aéreas e operadores que nos permitem oferecer condições especiais.',
  },
];

export default function Viagens() {
  useMetaTags({
    title: 'Olha que Duas Trip — Viagens Personalizadas & Experiências Exclusivas',
    description: 'Descubra o mundo com a Olha que Duas Trip! Planeamento de viagens à medida, estadias em hotéis de charme, passagens aéreas com as melhores tarifas e experiências gourmet inesquecíveis. Peça já o seu orçamento gratuito e viaje sem preocupações.',
    image: 'https://www.olhaqueduas.com/og-viagens.jpg',
    imageAlt: 'Olha que Duas Trip — Promotora de Viagens Personalizadas em Portugal e no Mundo',
    url: 'https://www.olhaqueduas.com/viagens',
    jsonLd: travelJsonLd,
  });

  return (
    <div className="min-h-screen flex flex-col">
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
                <div className="flex justify-center mb-8">
                  <img
                    src={tripLogo}
                    alt="Olha que Duas Trip - Promotora de Viagens"
                    className="h-28 md:h-36 w-auto rounded-2xl shadow-2xl shadow-black/30"
                  />
                </div>
              </Animated>

              <Animated animation="fade-up" delay={100}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-cream mb-6 leading-tight">
                  A sua viagem dos{' '}
                  <span className="text-gradient-brand">sonhos</span>{' '}
                  começa aqui
                </h1>
              </Animated>

              <Animated animation="fade-up" delay={200}>
                <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto leading-relaxed mb-12">
                  Planeamento personalizado, orçamentos à medida e experiências inesquecíveis.
                  Do destino ao regresso, cuidamos de cada detalhe para que só precise de aproveitar.
                </p>
              </Animated>

              <Animated animation="fade-up" delay={300}>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-10">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-vermelho">
                      <Plane className="w-8 h-8 mx-auto mb-1 text-vermelho" />
                    </div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Destinos Mundiais</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-cream/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-cream">
                      <Star className="w-8 h-8 mx-auto mb-1 text-amarelo" />
                    </div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Experiências Únicas</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-cream/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-amarelo">
                      <Shield className="w-8 h-8 mx-auto mb-1 text-cream" />
                    </div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">100% Personalizado</div>
                  </div>
                </div>
              </Animated>

              <Animated animation="fade-up" delay={400}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="h-14 px-8 text-base font-medium rounded-xl bg-vermelho hover:bg-vermelho/90 text-white btn-shine btn-magnetic"
                  >
                    <a href="#orcamento" className="inline-flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Pedir Orçamento
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="h-14 px-8 text-base font-medium rounded-xl bg-amarelo hover:bg-amarelo/90 text-charcoal btn-magnetic"
                  >
                    <a href="#servicos" className="inline-flex items-center gap-2">
                      <Compass className="w-5 h-5" />
                      Explorar Serviços
                    </a>
                  </Button>
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

        {/* Main Services - O Que Fazemos */}
        <section id="servicos" className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <Animated animation="fade-up" className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <Compass className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  O Que Fazemos
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Serviços de Viagem <span className="text-gradient-brand">Premium</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Desde a pesquisa do destino perfeito até ao regresso a casa, tratamos de tudo
                para que a sua viagem seja inesquecível.
              </p>
            </Animated>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {mainServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Animated key={service.title} animation="fade-up" delay={index * 150}>
                    <div className="group relative h-full rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500">
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <div className="w-12 h-12 rounded-xl bg-vermelho/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Animated>
                );
              })}
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <Animated animation="fade-up" className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amarelo/10 border border-amarelo/20 mb-6">
                <MapPin className="w-4 h-4 text-amarelo" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amarelo">
                  Simples e Fácil
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Como <span className="text-gradient-brand">Funciona</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Em três passos simples, transformamos o seu sonho de viagem em realidade.
              </p>
            </Animated>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <Animated key={step.number} animation="fade-up" delay={index * 150}>
                  <div className="relative text-center p-8">
                    <div className="text-7xl md:text-8xl font-display font-bold text-primary/10 absolute top-0 left-1/2 -translate-x-1/2">
                      {step.number}
                    </div>
                    <div className="relative pt-12">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vermelho to-vermelho-soft flex items-center justify-center mx-auto mb-6 shadow-lg shadow-vermelho/20">
                        <span className="text-2xl font-display font-bold text-white">{step.number}</span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className="w-6 h-6 text-primary/30" />
                      </div>
                    )}
                  </div>
                </Animated>
              ))}
            </div>
          </div>
        </section>

        {/* Travel Categories */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <Animated animation="fade-up" className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <Plane className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Para Cada Ocasião
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Tipos de <span className="text-gradient-brand">Viagem</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cada viajante é único. Por isso, adaptamos cada experiência ao seu perfil,
                estilo e momento de vida.
              </p>
            </Animated>

            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" staggerDelay={100} animation="fade-up">
              {travelCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.title}
                    className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent group-hover:from-charcoal/95 transition-all duration-500" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-vermelho/80 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-display font-bold text-white">
                          {category.title}
                        </h3>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                        {category.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </AnimatedGrid>
          </div>
        </section>

        {/* Benefits - Porque Nos */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <Animated animation="fade-up" className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amarelo/10 border border-amarelo/20 mb-6">
                <Star className="w-4 h-4 text-amarelo" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amarelo">
                  Diferenciais
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Porque escolher a{' '}
                <span className="text-gradient-brand">Olha que Duas Trip</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Mais do que uma agência, somos as suas companheiras de viagem.
                Tratamos de tudo com carinho, dedicação e profissionalismo.
              </p>
            </Animated>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Animated key={benefit.title} animation="fade-up" delay={index * 100}>
                    <div className="group text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vermelho/10 to-amarelo/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-display font-bold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </Animated>
                );
              })}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <Animated animation="fade-right">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                        Tudo Incluído
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                      O que está incluído no nosso{' '}
                      <span className="text-gradient-brand">serviço</span>?
                    </h2>
                    <ul className="space-y-4">
                      {[
                        'Consultoria e planeamento personalizado',
                        'Pesquisa e comparação de voos e alojamentos',
                        'Orçamento detalhado sem compromisso',
                        'Reservas e gestão de toda a logística',
                        'Itinerário completo e organizado',
                        'Recomendações de restaurantes e actividades',
                        'Seguro de viagem e assistência',
                        'Suporte 24/7 durante toda a viagem',
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-vermelho/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-vermelho" />
                          </div>
                          <span className="text-foreground/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Animated>

                <Animated animation="fade-left" delay={200}>
                  <div className="relative">
                    <img
                      src={images.hero}
                      alt="Viagem dos sonhos"
                      className="rounded-2xl shadow-2xl w-full h-[450px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-5 shadow-xl border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-vermelho flex items-center justify-center">
                          <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-foreground">Orçamento Grátis</p>
                          <p className="text-sm text-muted-foreground">Sem compromisso</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Animated>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="orcamento" className="py-20 md:py-28 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-vermelho/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amarelo/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated animation="fade-up" className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <img
                  src={tripLogo}
                  alt="Olha que Duas Trip"
                  className="h-20 md:h-24 w-auto rounded-xl shadow-lg"
                />
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-cream mb-6">
                Pronto para a sua próxima <span className="text-amarelo">aventura</span>?
              </h2>

              <p className="text-lg text-cream/70 mb-10 max-w-xl mx-auto">
                Peça já o seu orçamento gratuito e sem compromisso.
                Vamos transformar o seu sonho de viagem em realidade.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base font-medium rounded-xl bg-vermelho hover:bg-vermelho/90 text-white btn-shine"
                >
                  <a
                    href={`mailto:${siteConfig.contact.email}?subject=Orçamento de Viagem`}
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
