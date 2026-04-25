import { Link } from 'react-router-dom';
import {
  Sparkles,
  Music2,
  Star,
  Heart,
  Radio,
  Headphones,
  BookOpen,
  Smile,
  Rocket,
  PartyPopper,
  Mail,
  Bell,
  Clock,
  Smartphone,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import KidsRadioPlayer from '@/components/kids/KidsRadioPlayer';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { useMetaTags } from '@/hooks/useMetaTags';
import logoKids from '@/assets/kids/logo-kids.webp';
import alexandraCartoon from '@/assets/kids/alexandra-cartoon.webp';
import marluceCartoon from '@/assets/kids/marluce-cartoon.webp';
import leoCartoon from '@/assets/kids/leo-cartoon.webp';
import cantinhoPoster from '@/assets/kids/cantinho-da-pequena.jpg';

// JSON-LD Schema for Kids Page — SEO completo e otimizado
const kidsJsonLd = [
  // Breadcrumb
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.olhaqueduas.com' },
      { '@type': 'ListItem', position: 2, name: 'Kids', item: 'https://www.olhaqueduas.com/kids' },
    ],
  },
  // WebPage principal
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.olhaqueduas.com/kids#webpage',
    url: 'https://www.olhaqueduas.com/kids',
    name: 'Olha que Duas Kids — Espaço Infantil de Rádio, Música e Histórias',
    description:
      'O espaço Kids do Olha que Duas já está no ar! Um espaço exclusivo para crianças, com música, histórias, brincadeiras e o programa "O Cantinho da Pequenada com a Leonor". Diversão segura e educativa para toda a família em Portugal.',
    isPartOf: { '@id': 'https://www.olhaqueduas.com/#website' },
    about: { '@id': 'https://www.olhaqueduas.com/kids#service' },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://www.olhaqueduas.com/og-kids.jpg',
      width: 1200,
      height: 630,
      caption: 'Olha que Duas Kids — Espaço Infantil',
    },
    inLanguage: 'pt-PT',
    dateModified: '2026-04-19',
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 3,
      suggestedMaxAge: 12,
      audienceType: 'Crianças e Famílias',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.text-charcoal'],
    },
  },
  // Service / Espaço Kids
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://www.olhaqueduas.com/kids#service',
    name: 'Olha que Duas Kids',
    serviceType: 'Programação Infantil de Rádio',
    description:
      'Espaço dedicado às crianças no Olha que Duas. Programação infantil com música, histórias, brincadeiras, jogos e convidados especiais. Conteúdo seguro, educativo e divertido para os mais pequenos.',
    provider: {
      '@type': 'Organization',
      name: 'Olha que Duas',
      url: 'https://www.olhaqueduas.com',
      logo: 'https://www.olhaqueduas.com/logo.png',
    },
    areaServed: { '@type': 'Country', name: 'Portugal' },
    availableLanguage: 'pt-PT',
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 3,
      suggestedMaxAge: 12,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'EUR',
      validFrom: '2026-04-11',
      description: 'Acesso gratuito para todas as famílias. Mais novidades estão por vir!',
    },
  },
  // RadioSeries — O Cantinho da Pequenada com a Leonor
  {
    '@context': 'https://schema.org',
    '@type': 'RadioSeries',
    '@id': 'https://www.olhaqueduas.com/kids#cantinho-da-pequenada',
    name: 'O Cantinho da Pequenada com a Leonor',
    alternateName: 'Cantinho da Pequenada',
    description:
      'Programa de rádio infantil apresentado pela Leonor: música, histórias, convidados especiais e brincadeiras para entreter, divertir e educar as crianças. Já no ar na rádio Olha que Duas!',
    inLanguage: 'pt-PT',
    image: 'https://www.olhaqueduas.com/og-cantinho-pequenada.jpg',
    creator: {
      '@type': 'Organization',
      name: 'Olha que Duas',
      url: 'https://www.olhaqueduas.com',
    },
    productionCompany: {
      '@type': 'Organization',
      name: 'Olha que Duas',
    },
    genre: ['Infantil', 'Música', 'Histórias', 'Educação'],
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 3,
      suggestedMaxAge: 12,
    },
  },
  // ItemList — O que vem aí no espaço Kids
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'O que há no Olha que Duas Kids',
    description: 'Aventuras, programas e atividades disponíveis e por vir no espaço Kids.',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: 4,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'CreativeWork',
          name: 'Música & Karaoke',
          description: 'Playlists infantis, canções animadas e momentos para cantar em família.',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'CreativeWork',
          name: 'Histórias Encantadas',
          description: 'Contos e aventuras narradas com muita imaginação para sonhar acordado.',
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'CreativeWork',
          name: 'Brincadeiras & Jogos',
          description: 'Atividades, desafios e diversão garantida para todas as idades.',
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'CreativeWork',
          name: 'Aventuras no Ar',
          description: 'Programas especiais com convidados, surpresas e muita energia boa.',
        },
      },
    ],
  },
  // FAQ
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'O espaço Kids do Olha que Duas já está no ar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! O espaço Kids já está no ar com o programa "O Cantinho da Pequenada com a Leonor". Mais novidades estão por vir — subscreve a nossa newsletter para não perderes nada!',
        },
      },
      {
        '@type': 'Question',
        name: 'Para que idades é o Olha que Duas Kids?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O conteúdo é pensado para crianças entre os 3 e os 12 anos, mas é divertido para toda a família. Música, histórias e brincadeiras adequadas a cada faixa etária.',
        },
      },
      {
        '@type': 'Question',
        name: 'O que é "O Cantinho da Pequenada com a Leonor"?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'É o primeiro programa do espaço Kids: um programa de rádio infantil apresentado pela Leonor, com música, histórias, convidados especiais e brincadeiras para os mais pequenos.',
        },
      },
      {
        '@type': 'Question',
        name: 'O acesso ao espaço Kids é gratuito?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! Todo o conteúdo do Olha que Duas Kids será gratuito e acessível a todas as famílias através da rádio Olha que Duas.',
        },
      },
    ],
  },
];

const upcoming = [
  {
    icon: Music2,
    title: 'Música & Karaoke',
    text: 'Playlists infantis, canções animadas e momentos para cantar em família.',
    color: 'from-pink-400 to-rose-500',
  },
  {
    icon: BookOpen,
    title: 'Histórias Encantadas',
    text: 'Contos e aventuras narradas com muita imaginação para sonhar acordado.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: Smile,
    title: 'Brincadeiras & Jogos',
    text: 'Atividades, desafios e diversão garantida para todas as idades.',
    color: 'from-sky-400 to-blue-500',
  },
  {
    icon: Rocket,
    title: 'Aventuras no Ar',
    text: 'Programas especiais com convidados, surpresas e muita energia boa.',
    color: 'from-emerald-400 to-teal-500',
  },
];

const Kids = () => {
  useMetaTags({
    title: 'Olha que Duas Kids | Espaço Infantil de Rádio, Música e Histórias',
    description:
      'O espaço Kids do Olha que Duas já está no ar! Um espaço exclusivo para crianças, com música, histórias, brincadeiras e o programa "O Cantinho da Pequenada com a Leonor". Conteúdo seguro e educativo para toda a família.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Olha que Duas Kids — Espaço infantil com música e histórias',
    url: 'https://www.olhaqueduas.com/kids',
    type: 'website',
    tags: [
      'kids',
      'crianças',
      'rádio infantil',
      'música infantil',
      'histórias para crianças',
      'olha que duas',
      'cantinho da pequenada',
      'programa infantil portugal',
    ],
    jsonLd: kidsJsonLd,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* HERO — céu com nuvens, logo + duas mascotes cartoon */}
        <section className="relative overflow-hidden pt-20 md:pt-24 pb-20 md:pb-28">
          {/* Sky background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 40%, #bae6fd 100%)',
            }}
          />

          {/* Sun */}
          <div className="absolute top-24 right-10 md:right-24 -z-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-yellow-300/60 blur-2xl scale-150 animate-pulse" />
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-400 shadow-[0_0_60px_rgba(253,224,71,0.7)]" />
            </div>
          </div>

          {/* Floating clouds */}
          <Cloud className="top-20 left-[5%] w-28 md:w-40 opacity-95 animate-cloud-slow" />
          <Cloud className="top-40 right-[8%] w-24 md:w-36 opacity-90 animate-cloud-medium" />
          <Cloud className="top-[55%] left-[12%] w-20 md:w-32 opacity-85 animate-cloud-fast" />
          <Cloud className="top-[60%] right-[18%] w-24 md:w-36 opacity-80 animate-cloud-medium" />
          <Cloud className="top-[75%] left-[40%] w-16 md:w-24 opacity-70 animate-cloud-slow" />

          {/* Floating sparkles */}
          <FloatingDot className="top-32 left-[28%] text-yellow-300 animate-float-1" />
          <FloatingDot className="top-48 right-[32%] text-pink-300 animate-float-2" />
          <FloatingDot className="top-[60%] left-[55%] text-white animate-float-3" />
          <FloatingDot className="top-[40%] right-[12%] text-amber-300 animate-float-1" />

          {/* Top "Já no Ar" ribbon */}
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated animation="fade-down" className="text-center mb-6 md:mb-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border-2 border-yellow-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-pink-600">
                  Já no Ar!
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
            </Animated>

            {/* Hero stage: Alexandra + Logo (above) + Marluce */}
            <div className="relative flex items-end justify-center gap-0 max-w-6xl mx-auto pt-8 md:pt-12">
              {/* Alexandra */}
              <Animated animation="fade-right" delay={150} className="flex justify-center md:justify-end">
                <div className="relative animate-bob-slow">
                  <div className="absolute -inset-6 rounded-full bg-white/30 blur-2xl" />
                  <img
                    src={alexandraCartoon}
                    alt="Alexandra cartoon"
                    className="relative h-56 sm:h-72 md:h-[26rem] lg:h-[30rem] w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]"
                    loading="eager"
                  />
                </div>
              </Animated>

              {/* Centro: Logo Kids */}
              <Animated animation="zoom-in" delay={250} className="flex justify-center">
                <div className="relative animate-bob-fast">
                  {/* Glow ring */}
                  <div className="absolute -inset-4 md:-inset-6 rounded-full bg-yellow-300/60 blur-2xl animate-pulse" />
                  <div
                    className="absolute -inset-2 md:-inset-3 rounded-full"
                    style={{
                      background:
                        'conic-gradient(from 0deg, #fde047, #f472b6, #60a5fa, #34d399, #fde047)',
                      filter: 'blur(8px)',
                      opacity: 0.7,
                    }}
                  />
                  <img
                    src={logoKids}
                    alt="Olha que Duas Kids"
                    className="relative w-32 sm:w-48 md:w-64 lg:w-80 h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                    loading="eager"
                  />
                  {/* Stars around */}
                  <Star className="absolute -top-2 -left-3 w-5 h-5 md:w-7 md:h-7 text-yellow-300 fill-yellow-300 animate-twinkle-1" />
                  <Star className="absolute top-4 -right-4 w-4 h-4 md:w-6 md:h-6 text-pink-300 fill-pink-300 animate-twinkle-2" />
                  <Star className="absolute -bottom-1 left-2 w-4 h-4 md:w-6 md:h-6 text-sky-300 fill-sky-300 animate-twinkle-3" />
                </div>
              </Animated>

              {/* Marluce — drawn at a slightly larger scale in source art,
                  so render her a touch smaller to match Alexandra visually */}
              <Animated animation="fade-left" delay={150} className="flex justify-center md:justify-start">
                <div className="relative animate-bob-medium">
                  <div className="absolute -inset-6 rounded-full bg-white/30 blur-2xl" />
                  <img
                    src={marluceCartoon}
                    alt="Marluce cartoon"
                    className="relative h-48 sm:h-60 md:h-[22rem] lg:h-[26rem] w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]"
                    loading="eager"
                  />
                </div>
              </Animated>
            </div>

            {/* Marketing message */}
            <Animated animation="fade-up" delay={500} className="text-center mt-10 md:mt-14 max-w-4xl mx-auto">
              <h1 className="font-display font-bold leading-[0.95] text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-pink-600 drop-shadow-sm">
                  O Olha que Duas
                </span>
                <span
                  className="block mt-2 md:mt-3 text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                  style={{
                    background:
                      'linear-gradient(180deg, #fde047 0%, #f59e0b 50%, #ef4444 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.15))',
                  }}
                >
                  tem Espaço Kids!
                </span>
              </h1>
              <p className="mt-5 md:mt-7 text-lg md:text-2xl font-bold text-sky-900 drop-shadow-sm">
                <span className="inline-flex items-center gap-2">
                  <PartyPopper className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />
                  Música, histórias, brincadeiras e muita imaginação para a pequenada!
                  <PartyPopper className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />
                </span>
              </p>

              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base font-extrabold rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-[0_10px_0_rgba(190,24,93,0.6)] hover:shadow-[0_6px_0_rgba(190,24,93,0.6)] hover:translate-y-1 transition-all duration-200 border-4 border-white"
                >
                  <a href="#cantinho" className="inline-flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Conhece o programa
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base font-extrabold rounded-full bg-yellow-400 hover:bg-yellow-500 text-pink-700 shadow-[0_10px_0_rgba(202,138,4,0.6)] hover:shadow-[0_6px_0_rgba(202,138,4,0.6)] hover:translate-y-1 transition-all duration-200 border-4 border-white"
                >
                  <Link to="/#contacto" className="inline-flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Quero saber mais
                  </Link>
                </Button>
              </div>
            </Animated>
          </div>

          {/* Wavy hill bottom */}
          <div className="absolute bottom-0 left-0 right-0 -z-0 pointer-events-none">
            <svg viewBox="0 0 1440 180" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#7CC576"
                d="M0 90 C240 30, 480 150, 720 90 S1200 30, 1440 90 L1440 180 L0 180 Z"
                opacity="0.85"
              />
              <path
                fill="#5BAE52"
                d="M0 130 C240 80, 520 180, 760 130 S1220 80, 1440 130 L1440 180 L0 180 Z"
              />
            </svg>
          </div>
        </section>

        {/* Cantinho da Pequenada */}
        <section
          id="cantinho"
          className="relative py-20 md:py-28 overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, #5BAE52 0%, #fef3c7 30%, #fff9e6 100%)',
          }}
        >
          {/* Confetti dots */}
          <ConfettiDots />

          {/* Floating musical notes & stars */}
          <FloatingParticles />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated animation="fade-up" className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500 text-white shadow-lg mb-6 border-4 border-white">
                <Radio className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-widest">
                  No Ar · Programa Infantil
                </span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-charcoal">
                Chegou <span className="text-gradient-brand">um canal só para crianças!</span>
              </h2>
              <p className="mt-4 text-lg md:text-xl text-charcoal/75 max-w-2xl mx-auto">
                Um cantinho especial cheio de música, histórias e
                surpresas. Conhece o primeiro programa que já está no ar:
              </p>
            </Animated>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-6xl mx-auto">
              {/* Poster + Radio Player */}
              <Animated animation="fade-right">
                <div className="flex flex-col gap-6">
                  <div className="relative group">
                    <div
                      className="absolute -inset-3 rounded-3xl"
                      style={{
                        background:
                          'conic-gradient(from 0deg, #f472b6, #fde047, #60a5fa, #34d399, #f472b6)',
                        filter: 'blur(12px)',
                        opacity: 0.8,
                      }}
                    />
                    <div className="relative rounded-3xl overflow-hidden border-[6px] border-white shadow-2xl bg-white">
                      <img
                        src={cantinhoPoster}
                        alt="O Cantinho da Pequenada com a Leonor"
                        className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    {/* Tape */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-300/80 rotate-[-2deg] rounded-sm shadow-md" />
                  </div>

                  {/* Kids Radio Player */}
                  <KidsRadioPlayer />
                </div>
              </Animated>

              {/* Info */}
              <Animated animation="fade-left" delay={150}>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-300 border-2 border-emerald-400 shadow-md">
                    <Headphones className="w-4 h-4 text-pink-600" />
                    <span className="text-xs font-extrabold uppercase tracking-wide text-pink-700">
                      Já no Ar
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-4xl md:text-5xl text-charcoal leading-tight">
                    O Cantinho da <span className="text-pink-600">Pequenada</span>
                    <span className="block text-2xl md:text-3xl mt-2 text-charcoal/70">
                      com a Leonor
                    </span>
                  </h3>

                  <p className="text-lg text-charcoal/80 leading-relaxed">
                    Um programa pensado para os mais pequenos: música, histórias,
                    convidados especiais e muita imaginação. A Leonor leva a pequenada
                    numa viagem cheia de cor, alegria e descoberta — todos os dias na
                    rádio Olha que Duas.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Music2, label: 'Canções', href: 'https://www.youtube.com/watch?v=r-vwsylOoqs', gradient: 'from-pink-500 to-rose-600' },
                      { icon: BookOpen, label: 'Histórias', route: '/kids/historias', gradient: 'from-amber-400 to-orange-500' },
                      { icon: Smile, label: 'Jogos', route: '/kids/jogos', gradient: 'from-sky-400 to-blue-600' },
                      { icon: Heart, label: 'Desenhos', href: `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent('Desenho do meu filho(a)')}&body=${encodeURIComponent('Olá! O meu filho(a) fez um desenho e gostaria de partilhar com vocês!\n\nNome da criança:\nIdade:\n\n(Anexe o desenho a este email)')}`, gradient: 'from-emerald-400 to-teal-500' },
                    ].map(({ icon: Icon, label, href, route, gradient }) => {
                      const content = (
                        <>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:animate-kids-wobble`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="font-bold text-charcoal text-base flex-1">{label}</span>
                          {(href || route) && <ExternalLink className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />}
                        </>
                      );
                      const cls = "group flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border-2 border-pink-200 shadow-md hover:border-pink-400 hover:shadow-xl hover:bg-pink-50/80 hover:-translate-y-1 active:translate-y-0 active:shadow-md transition-all duration-200 cursor-pointer";
                      if (route) {
                        return (
                          <Link key={label} to={route} className={cls}>
                            {content}
                          </Link>
                        );
                      }
                      return (
                        <a
                          key={label}
                          href={href}
                          target={href?.startsWith('mailto') ? undefined : '_blank'}
                          rel={href?.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                          className={cls}
                        >
                          {content}
                        </a>
                      );
                    })}
                  </div>

                  {/* Video do programa */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/_CfnGpI0_DI"
                      title="Cantinho da Pequenada"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  {/* Grelha de horários */}
                  <div className="rounded-2xl bg-white border-2 border-pink-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-display font-bold text-charcoal text-lg">Horários</h4>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-charcoal/80">
                        <Clock className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <span className="font-semibold">Dom a Sex</span>
                        <span className="ml-auto font-bold text-pink-600">18h30 — 19h30</span>
                      </div>
                      <hr className="border-pink-100" />
                      <div className="flex items-center gap-3 text-charcoal/80">
                        <Clock className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <span className="font-semibold">Sábado</span>
                        <span className="ml-auto font-bold text-pink-600">11h — 13h</span>
                      </div>
                      <div className="flex items-center gap-3 text-charcoal/80">
                        <Clock className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <span className="font-semibold">Sábado</span>
                        <span className="ml-auto font-bold text-pink-600">18h30 — 19h30</span>
                      </div>
                    </div>
                  </div>

                  {/* Botões: Ouve aqui + Fale connosco */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Button
                      asChild
                      size="lg"
                      className="h-14 px-8 text-base font-extrabold rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-[0_10px_0_rgba(190,24,93,0.6)] hover:shadow-[0_6px_0_rgba(190,24,93,0.6)] hover:translate-y-1 transition-all border-4 border-white"
                    >
                      <a
                        href={siteConfig.app.androidUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <Smartphone className="w-5 h-5" />
                        Ouve aqui
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="h-14 px-8 text-base font-extrabold rounded-full bg-yellow-400 hover:bg-yellow-500 text-pink-700 shadow-[0_10px_0_rgba(202,138,4,0.6)] hover:shadow-[0_6px_0_rgba(202,138,4,0.6)] hover:translate-y-1 transition-all border-4 border-white"
                    >
                      <Link to="/#contacto" className="inline-flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Fale connosco
                      </Link>
                    </Button>
                  </div>
                </div>
              </Animated>
            </div>
          </div>
        </section>

        {/* O QUE VEM AÍ */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#fff9e6] to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <Animated animation="fade-up" className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 border-2 border-sky-300 mb-6">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">
                  O Que Vem Aí
                </span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-charcoal">
                Um mundo de <span className="text-gradient-brand">diversão</span> à espera
              </h2>
              <p className="mt-4 text-lg text-charcoal/70 max-w-2xl mx-auto">
                O espaço Kids já está no ar e mais novidades estão por vir!
                Espreita o que temos preparado:
              </p>
            </Animated>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {upcoming.map(({ icon: Icon, title, text, color }, index) => (
                <Animated key={title} animation="fade-up" delay={index * 100}>
                  <div className="group relative h-full p-6 rounded-3xl bg-white border-2 border-pink-100 hover:border-pink-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-charcoal mb-2">
                      {title}
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed">{text}</p>
                  </div>
                </Animated>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 md:py-24 bg-background overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6">
              {/* Leo cartoon — acenando ao lado da box */}
              <Animated
                animation="fade-right"
                delay={100}
                className="lg:flex-shrink-0 lg:-mr-8 xl:-mr-12 relative z-10"
              >
                <div className="relative animate-greet origin-bottom">
                  {/* Glow atrás do Leo */}
                  <div className="absolute -inset-6 rounded-full bg-yellow-200/50 blur-3xl" />
                  {/* Balão "Olá!" */}
                  <div className="absolute -top-4 -right-2 md:-top-2 md:-right-6 z-20 animate-bob-fast">
                    <div className="relative px-4 py-2 rounded-2xl bg-white border-4 border-pink-300 shadow-[0_6px_0_rgba(0,0,0,0.12)]">
                      <span className="font-display font-extrabold text-pink-600 text-lg md:text-xl">
                        Olá!
                      </span>
                      {/* Cauda do balão */}
                      <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b-4 border-r-4 border-pink-300 rotate-45" />
                    </div>
                  </div>
                  {/* Estrelinhas ao redor */}
                  <Star className="absolute top-6 -left-4 w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-yellow-300 animate-twinkle-1" />
                  <Sparkles className="absolute top-20 -right-6 w-5 h-5 md:w-6 md:h-6 text-pink-400 fill-pink-300 animate-twinkle-2" />
                  <Star className="absolute bottom-10 -left-6 w-4 h-4 md:w-5 md:h-5 text-sky-400 fill-sky-300 animate-twinkle-3" />
                  <img
                    src={leoCartoon}
                    alt="Leo a acenar"
                    className="relative h-56 sm:h-64 md:h-80 lg:h-[26rem] w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.28)]"
                    loading="lazy"
                  />
                </div>
              </Animated>

              {/* Box "Fica atento!" */}
              <Animated animation="zoom-in" className="flex-1 w-full max-w-3xl">
                <div
                  className="relative rounded-[2rem] overflow-hidden p-10 md:p-14 text-center border-4 border-white shadow-2xl"
                  style={{
                    background:
                      'linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #fde047 100%)',
                  }}
                >
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
                  <PartyPopper className="w-12 h-12 text-white mx-auto mb-4 animate-bob-fast" />
                  <h2 className="font-display font-bold text-3xl md:text-5xl text-white drop-shadow-md">
                    O espaço Kids já está no ar!
                  </h2>
                  <p className="mt-4 text-lg md:text-xl text-white/95 max-w-2xl mx-auto">
                    Mais novidades estão por vir. Subscreve a nossa newsletter
                    para não perderes nada!
                  </p>
                  <div className="mt-8">
                    <Button
                      asChild
                      size="lg"
                      className="h-14 px-8 text-base font-extrabold rounded-full bg-white hover:bg-yellow-100 text-pink-600 shadow-[0_10px_0_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_rgba(0,0,0,0.15)] hover:translate-y-1 transition-all border-4 border-yellow-300"
                    >
                      <Link to="/newsletter" className="inline-flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Subscrever Newsletter
                      </Link>
                    </Button>
                  </div>
                </div>
              </Animated>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

/* ---------- Decorative subcomponents ---------- */

const Cloud = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 200 120"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute pointer-events-none drop-shadow-md ${className}`}
  >
    <g fill="white">
      <ellipse cx="60" cy="70" rx="40" ry="30" />
      <ellipse cx="100" cy="55" rx="45" ry="35" />
      <ellipse cx="140" cy="70" rx="38" ry="28" />
      <ellipse cx="100" cy="85" rx="60" ry="20" />
    </g>
  </svg>
);

const FloatingDot = ({ className = '' }: { className?: string }) => (
  <div className={`absolute pointer-events-none ${className}`}>
    <Sparkles className="w-6 h-6 md:w-8 md:h-8 fill-current" />
  </div>
);

const ConfettiDots = () => {
  const dots = [
    { top: '10%', left: '8%', cls: 'bg-pink-400 w-3 h-3 animate-float-1' },
    { top: '20%', left: '85%', cls: 'bg-yellow-400 w-4 h-4 animate-float-2' },
    { top: '35%', left: '15%', cls: 'bg-sky-400 w-2 h-2 animate-float-3' },
    { top: '50%', left: '92%', cls: 'bg-emerald-400 w-3 h-3 animate-float-1' },
    { top: '65%', left: '5%', cls: 'bg-rose-400 w-4 h-4 animate-float-2' },
    { top: '80%', left: '88%', cls: 'bg-amber-400 w-3 h-3 animate-float-3' },
    { top: '15%', left: '50%', cls: 'bg-purple-400 w-2 h-2 animate-float-1' },
    { top: '70%', left: '45%', cls: 'bg-cyan-400 w-3 h-3 animate-float-2' },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((dot, i) => (
        <span
          key={i}
          className={`absolute rounded-full opacity-70 ${dot.cls}`}
          style={{ top: dot.top, left: dot.left }}
        />
      ))}
    </div>
  );
};

/** SVG floating musical notes and stars — hidden on mobile to avoid clutter */
const FloatingParticles = () => {
  const particles = [
    { top: '8%', left: '6%', anim: 'animate-kids-float-note-1', el: 'note' },
    { top: '25%', left: '90%', anim: 'animate-kids-float-note-2', el: 'star' },
    { top: '45%', left: '4%', anim: 'animate-kids-sparkle-1', el: 'star' },
    { top: '60%', left: '93%', anim: 'animate-kids-float-note-3', el: 'note' },
    { top: '75%', left: '8%', anim: 'animate-kids-sparkle-2', el: 'star' },
    { top: '18%', left: '80%', anim: 'animate-kids-sparkle-3', el: 'note' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.anim}`}
          style={{ top: p.top, left: p.left }}
        >
          {p.el === 'note' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-pink-400/60">
              <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" fill="currentColor" opacity="0.6" />
              <circle cx="18" cy="16" r="3" fill="currentColor" opacity="0.6" />
            </svg>
          ) : (
            <Star className="w-5 h-5 text-yellow-400/60 fill-yellow-300/40" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Kids;
