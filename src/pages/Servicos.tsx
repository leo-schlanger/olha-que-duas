import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Instagram,
  Video,
  Lightbulb,
  Music,
  Radio,
  Mic,
  Globe,
  Wrench,
  Palette,
  TrendingUp,
  Megaphone,
  Handshake,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated, AnimatedGrid } from '@/components/ui/animated';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';
import { siteConfig } from '@/config/site';

// Service categories data
const serviceCategories = [
  {
    id: 'conteudo-digital',
    title: 'Conteudo Digital',
    shortTitle: 'Digital',
    icon: Instagram,
    color: 'vermelho',
    description: 'Criamos conteudo que conecta a sua marca com o publico certo.',
    services: [
      {
        name: 'Post Instagram',
        description: 'Design + copy otimizado para engagement',
        details: 'Arte estatica com texto estrategico para maximizar alcance e interacao.',
      },
      {
        name: 'Carrossel Instagram',
        description: 'Ate 10 slides com narrativa visual',
        details: 'Design coeso que conta uma historia e mantem o publico envolvido.',
      },
      {
        name: 'Pack Stories',
        description: '5 unidades personalizadas',
        details: 'Templates exclusivos alinhados com a identidade da sua marca.',
      },
      {
        name: 'Reel Simples',
        description: 'Ate 30 segundos editados',
        details: 'Edicao profissional com musica e legendas para maior alcance.',
      },
      {
        name: 'Reel com IA Avancada',
        description: '30-60 segundos de producao premium',
        details: 'Producao com ferramentas de IA profissionais para resultados impactantes.',
      },
    ],
  },
  {
    id: 'producao-video',
    title: 'Producao de Video',
    shortTitle: 'Video',
    icon: Video,
    color: 'amarelo',
    description: 'Videos profissionais que contam a historia da sua marca.',
    services: [
      {
        name: 'Video Comercial Curto',
        description: 'Ate 30 segundos',
        details: 'Ideal para anuncios e redes sociais com mensagem direta e impactante.',
      },
      {
        name: 'Video Comercial',
        description: '1-2 minutos completos',
        details: 'Roteiro, producao e edicao completa para apresentar o seu negocio.',
      },
      {
        name: 'Video Institucional',
        description: '2-3 minutos profissionais',
        details: 'Apresentacao profissional da marca com qualidade cinematografica.',
      },
      {
        name: 'Video Longo / Documentario',
        description: '5+ minutos de producao',
        details: 'Producao completa com entrevistas e narrativa envolvente.',
      },
    ],
  },
  {
    id: 'consultoria-marca',
    title: 'Consultoria de Marca',
    shortTitle: 'Marca',
    icon: Lightbulb,
    color: 'vermelho',
    description: 'Estrategia e posicionamento para marcas com proposito.',
    services: [
      {
        name: 'Sessao de Consultoria',
        description: '1 hora de orientacao',
        details: 'Orientacao estrategica personalizada para os seus desafios de marca.',
      },
      {
        name: 'Diagnostico de Marca',
        description: 'Analise completa',
        details: 'Avaliacao profunda da sua marca com relatorio detalhado e recomendacoes.',
      },
      {
        name: 'Estrategia de Marca Completa',
        description: 'Posicionamento total',
        details: 'Definicao de posicionamento, tom de voz e guidelines de comunicacao.',
      },
      {
        name: 'Rebranding Completo',
        description: 'Nova identidade',
        details: 'Transformacao completa da identidade visual e estrategica da marca.',
      },
    ],
  },
  {
    id: 'producao-audio',
    title: 'Producao Audio',
    shortTitle: 'Audio',
    icon: Music,
    color: 'amarelo',
    description: 'Som profissional para radio, podcast e publicidade.',
    services: [
      {
        name: 'Jingle Basico',
        description: '15-30 segundos',
        details: 'Composicao original com voz profissional para a sua marca.',
      },
      {
        name: 'Jingle Profissional',
        description: '30-60 segundos premium',
        details: 'Producao completa com instrumentos e arranjo profissional.',
      },
      {
        name: 'Pacote Jingle',
        description: 'Versoes 15s + 30s + 60s',
        details: 'Versoes adaptadas para diferentes usos e plataformas.',
      },
      {
        name: 'Spot Radio',
        description: 'Anuncio profissional',
        details: 'Anuncio de voz com mixagem profissional para veiculacao.',
      },
      {
        name: 'Vinheta / Intro Audio',
        description: 'Abertura personalizada',
        details: 'Abertura profissional para podcast ou programa de radio.',
      },
    ],
  },
  {
    id: 'radio-digital',
    title: 'Radio Digital',
    shortTitle: 'Radio',
    icon: Radio,
    color: 'vermelho',
    description: 'Veiculacao na nossa radio online 24 horas.',
    services: [
      {
        name: 'Spot Rotativo',
        description: 'Veiculacao semanal',
        details: 'Spot de 30 segundos em horarios variados ao longo da semana.',
      },
      {
        name: 'Spot Prime Time',
        description: 'Horario nobre',
        details: 'Veiculacao nos horarios de maior audiencia: 8h-10h e 17h-20h.',
      },
      {
        name: 'Mencao ao Vivo',
        description: 'Durante programa',
        details: 'Citacao da sua marca durante programa ao vivo.',
      },
      {
        name: 'Patrocinio de Programa',
        description: 'Mensal',
        details: '"Este programa e oferecido por..." - associacao direta com conteudo.',
      },
      {
        name: 'Pacote Mensal',
        description: '20 spots',
        details: 'Veiculacao diaria com desconto especial para compromisso mensal.',
      },
    ],
  },
  {
    id: 'podcast',
    title: 'Podcast',
    shortTitle: 'Podcast',
    icon: Mic,
    color: 'amarelo',
    description: 'Participe ou crie o seu proprio podcast.',
    services: [
      {
        name: 'Participacao como Convidado',
        description: 'Entrevista no nosso podcast',
        details: 'Seja entrevistado no podcast Olha que Duas e alcance a nossa audiencia.',
      },
      {
        name: 'Episodio Patrocinado',
        description: 'Episodio dedicado',
        details: 'Episodio completamente dedicado a sua marca ou tema de interesse.',
      },
      {
        name: 'Producao de Podcast',
        description: 'Por episodio',
        details: 'Gravacao, edicao profissional e publicacao nas plataformas.',
      },
      {
        name: 'Lancamento de Podcast',
        description: 'Pacote completo',
        details: 'Estrategia, branding e 4 episodios iniciais para comecar com forca.',
      },
      {
        name: 'Gestao Mensal de Podcast',
        description: '4 episodios + distribuicao',
        details: 'Producao, distribuicao e promocao mensal completa do seu podcast.',
      },
    ],
  },
  {
    id: 'websites',
    title: 'Websites',
    shortTitle: 'Web',
    icon: Globe,
    color: 'vermelho',
    description: 'Sites modernos e funcionais para o seu negocio.',
    services: [
      {
        name: 'Landing Page Simples',
        description: '1 pagina responsiva',
        details: 'Pagina unica com formulario para captura de leads.',
      },
      {
        name: 'Landing Page Avancada',
        description: 'Com animacoes e SEO',
        details: 'Animacoes modernas, integracoes e otimizacao para buscadores.',
      },
      {
        name: 'Site Institucional Basico',
        description: '3-5 paginas',
        details: 'Design responsivo, formulario de contacto e SEO basico.',
      },
      {
        name: 'Site Institucional Completo',
        description: '5-10 paginas',
        details: 'Portfolio, galeria, blog integrado e analytics.',
      },
      {
        name: 'Site Premium',
        description: 'Ate 10 paginas exclusivas',
        details: 'Design exclusivo, animacoes avancadas e performance otimizada.',
      },
    ],
  },
  {
    id: 'manutencao-web',
    title: 'Manutencao Web',
    shortTitle: 'Manutencao',
    icon: Wrench,
    color: 'amarelo',
    description: 'Mantenha o seu site sempre atualizado e seguro.',
    services: [
      {
        name: 'Plano Basico',
        description: 'Essencial',
        details: 'Updates de seguranca e backup mensal para manter o site protegido.',
      },
      {
        name: 'Plano Standard',
        description: 'Recomendado',
        details: 'Plano basico + pequenas alteracoes mensais de conteudo.',
      },
      {
        name: 'Plano Premium',
        description: 'Completo',
        details: 'Alteracoes ilimitadas e suporte prioritario para o seu site.',
      },
    ],
  },
  {
    id: 'servicos-adicionais',
    title: 'Servicos Adicionais',
    shortTitle: 'Extras',
    icon: Palette,
    color: 'vermelho',
    description: 'Complementos para potenciar a sua comunicacao.',
    services: [
      {
        name: 'Design de Logo',
        description: 'Identidade visual',
        details: 'Criacao de logotipo profissional que representa a sua marca.',
      },
      {
        name: 'Copywriting',
        description: 'Por pagina',
        details: 'Textos persuasivos e estrategicos para o seu site ou materiais.',
      },
      {
        name: 'Sessao Fotografica',
        description: 'Profissional',
        details: 'Fotos profissionais para perfil, produtos ou eventos.',
      },
      {
        name: 'Video Hero / Background',
        description: 'Para website',
        details: 'Video de fundo impactante para a pagina inicial do seu site.',
      },
      {
        name: 'Integracao WhatsApp / Chat',
        description: 'Atendimento direto',
        details: 'Adicione chat ao vivo no seu site para falar com clientes.',
      },
      {
        name: 'Traducao',
        description: 'Por idioma',
        details: 'Traducao profissional do seu site para outros idiomas.',
      },
    ],
  },
  {
    id: 'planos-marketing',
    title: 'Planos de Marketing',
    shortTitle: 'Planos',
    icon: TrendingUp,
    color: 'amarelo',
    description: 'Gestao completa das suas redes sociais.',
    services: [
      {
        name: 'Starter',
        description: 'Para negocios locais',
        details: '8-12 posts/mes, 2 Reels, gestao de 1 rede social, relatorio mensal.',
      },
      {
        name: 'Growth',
        description: 'Para PMEs em crescimento',
        details: '16-20 posts/mes, 4 Reels, 2 redes sociais, 1 video comercial, consultoria mensal.',
      },
      {
        name: 'Premium',
        description: 'Para empresas estabelecidas',
        details: 'Ate 30 posts/mes, 8 Reels, 3 redes, 2 videos, veiculacao radio, consultoria semanal.',
      },
      {
        name: 'Enterprise',
        description: 'Para grandes marcas',
        details: 'Tudo do Premium + campanhas integradas, producao ilimitada, account manager dedicado.',
      },
    ],
  },
  {
    id: 'campanhas',
    title: 'Campanhas Avulsas',
    shortTitle: 'Campanhas',
    icon: Megaphone,
    color: 'vermelho',
    description: 'Campanhas pontuais para momentos especiais.',
    services: [
      {
        name: 'Campanha de Lancamento',
        description: 'Novos produtos',
        details: 'Estrategia completa para lancar novos produtos ou servicos no mercado.',
      },
      {
        name: 'Campanha Sazonal',
        description: 'Datas especiais',
        details: 'Campanhas para Natal, Pascoa, Dia das Maes e outras datas importantes.',
      },
      {
        name: 'Campanha Redes Sociais',
        description: '1 mes de foco',
        details: 'Campanha focada em engagement e crescimento das redes sociais.',
      },
      {
        name: 'Campanha Integrada',
        description: 'Digital + Radio',
        details: 'Presenca multicanal com alcance maximo combinando digital e radio.',
      },
    ],
  },
  {
    id: 'colaboracoes',
    title: 'Colaboracoes e Parcerias',
    shortTitle: 'Parcerias',
    icon: Handshake,
    color: 'amarelo',
    description: 'Parcerias estrategicas para ampliar o seu alcance.',
    services: [
      {
        name: 'Mencao no Site',
        description: 'Badge ou logo',
        details: 'Presenca como parceiro no nosso site com link para o seu negocio.',
      },
      {
        name: 'Post Patrocinado',
        description: 'Nas nossas redes',
        details: 'Publicacao com o alcance da nossa audiencia nas redes sociais.',
      },
      {
        name: 'Video Colaboracao',
        description: 'Conteudo conjunto',
        details: 'Participacao em conteudo de video colaborativo.',
      },
      {
        name: 'Pacote Influencer',
        description: '3 posts + stories',
        details: 'Divulgacao completa da sua marca nas nossas plataformas.',
      },
      {
        name: 'Parceria Trimestral',
        description: 'Pacote completo',
        details: 'Site + Redes + Radio + Podcast - presenca total por 3 meses.',
      },
    ],
  },
];

export default function Servicos() {
  const [activeTab, setActiveTab] = useState('conteudo-digital');

  useMetaTags({
    title: 'Servicos',
    description: 'Descubra todos os servicos da Olha que Duas: conteudo digital, producao de video, consultoria de marca, radio, podcast, websites e muito mais.',
    url: 'https://www.olhaqueduas.com/servicos',
    jsonLd: getPageBreadcrumbJsonLd('Servicos', 'https://www.olhaqueduas.com/servicos'),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeCategory = serviceCategories.find((cat) => cat.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 md:pt-28">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-20 md:py-28 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-vermelho/10 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amarelo/10 rounded-full blur-3xl animate-float" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-vermelho/5 to-transparent rounded-full" />

            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0V0zm1 1v58h58V1H1z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <Animated animation="fade-down">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermelho/10 border border-vermelho/20 mb-6">
                  <Sparkles className="w-4 h-4 text-vermelho" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-vermelho">
                    Os Nossos Servicos
                  </span>
                </div>
              </Animated>

              {/* Title */}
              <Animated animation="fade-up" delay={100}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-cream mb-6 leading-tight">
                  Comunicacao com{' '}
                  <span className="text-gradient-brand">Proposito</span>
                </h1>
              </Animated>

              {/* Description */}
              <Animated animation="fade-up" delay={200}>
                <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto leading-relaxed mb-10">
                  Do conteudo digital a producao de audio e video, oferecemos solucoes completas
                  para marcas que querem comunicar com autenticidade e impacto.
                </p>
              </Animated>

              {/* Stats */}
              <Animated animation="fade-up" delay={300}>
                <div className="flex justify-center gap-8 md:gap-16">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-vermelho">
                      12
                    </div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">
                      Categorias
                    </div>
                  </div>
                  <div className="w-px h-12 bg-cream/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-cream">
                      50+
                    </div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">
                      Servicos
                    </div>
                  </div>
                  <div className="w-px h-12 bg-cream/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-amarelo">
                      24h
                    </div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">
                      Radio Online
                    </div>
                  </div>
                </div>
              </Animated>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="hsl(var(--background))"
              />
            </svg>
          </div>
        </section>

        {/* Services Content */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Back button */}
            <Animated animation="fade-right">
              <div className="mb-8">
                <Link to="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao inicio
                  </Button>
                </Link>
              </div>
            </Animated>

            {/* Tabs */}
            <Animated animation="fade-up" delay={100}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Tab List - Scrollable on mobile */}
                <div className="mb-10 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                  <TabsList className="inline-flex h-auto p-1.5 bg-muted/50 rounded-2xl gap-1 min-w-max">
                    {serviceCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <TabsTrigger
                          key={category.id}
                          value={category.id}
                          className={`
                            flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                            transition-all duration-300
                            data-[state=active]:bg-background data-[state=active]:shadow-lg
                            data-[state=active]:text-primary
                            hover:bg-background/50
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{category.title}</span>
                          <span className="sm:hidden">{category.shortTitle}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>

                {/* Tab Content */}
                {serviceCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsContent
                      key={category.id}
                      value={category.id}
                      className="focus-visible:outline-none"
                    >
                      {/* Category Header */}
                      <div className="mb-10 text-center">
                        <div
                          className={`
                            inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4
                            ${category.color === 'vermelho' ? 'bg-vermelho/10' : 'bg-amarelo/10'}
                          `}
                        >
                          <Icon
                            className={`w-8 h-8 ${
                              category.color === 'vermelho' ? 'text-vermelho' : 'text-amarelo'
                            }`}
                          />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                          {category.title}
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                          {category.description}
                        </p>
                      </div>

                      {/* Services Grid */}
                      <AnimatedGrid
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto"
                        staggerDelay={80}
                        animation="fade-up"
                      >
                        {category.services.map((service, index) => (
                          <div
                            key={service.name}
                            className={`
                              group relative rounded-2xl p-6 bg-card border border-border/50
                              hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5
                              transition-all duration-500 card-3d cursor-default
                            `}
                          >
                            {/* Service number */}
                            <div
                              className={`
                                absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center
                                text-xs font-bold shadow-lg
                                ${
                                  category.color === 'vermelho'
                                    ? 'bg-vermelho text-white'
                                    : 'bg-amarelo text-charcoal'
                                }
                              `}
                            >
                              {(index + 1).toString().padStart(2, '0')}
                            </div>

                            {/* Content */}
                            <div className="pt-2">
                              <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {service.name}
                              </h3>
                              <p
                                className={`
                                text-sm font-medium mb-3
                                ${
                                  category.color === 'vermelho'
                                    ? 'text-vermelho'
                                    : 'text-amarelo-soft'
                                }
                              `}
                              >
                                {service.description}
                              </p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {service.details}
                              </p>
                            </div>

                            {/* Checkmark */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <CheckCircle2
                                className={`w-5 h-5 ${
                                  category.color === 'vermelho'
                                    ? 'text-vermelho/50'
                                    : 'text-amarelo/50'
                                }`}
                              />
                            </div>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl bg-primary/10" />
                          </div>
                        ))}
                      </AnimatedGrid>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </Animated>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-vermelho/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amarelo/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated animation="fade-up" className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-cream mb-6">
                Pronto para comecar?
              </h2>
              <p className="text-lg text-cream/70 mb-10 max-w-xl mx-auto">
                Entre em contacto connosco para um orcamento personalizado.
                Vamos criar algo incrivel juntos.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-glow btn-shine h-14 px-10 text-base font-medium border-none rounded-xl"
                >
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="inline-flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Pedir Orcamento
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-base font-medium rounded-xl border-cream/20 text-cream hover:bg-cream/10"
                >
                  <Link to="/#contacto" className="inline-flex items-center gap-2">
                    Falar Connosco
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>

              {/* Contact info */}
              <div className="mt-10 pt-10 border-t border-cream/10">
                <p className="text-sm text-cream/50 mb-2">Ou envie-nos um email diretamente:</p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-vermelho hover:text-vermelho/80 font-medium transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
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
