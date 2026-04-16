import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Newspaper, Globe, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogList } from '@/components/blog/BlogList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated, AnimatedCounter } from '@/components/ui/animated';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';

export default function Blog() {
  // SEO Meta Tags
  useMetaTags({
    title: 'Notícias',
    description: 'Acompanhe as principais notícias de política, empreendedorismo, comunicação e acontecimentos em Portugal, Brasil e no mundo. Olha que Duas - Informação com propósito.',
    url: 'https://www.olhaqueduas.com/noticias',
    jsonLd: getPageBreadcrumbJsonLd('Notícias', 'https://www.olhaqueduas.com/noticias'),
  });

  // Scroll para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 md:pt-28">
        {/* Hero Section - Enhanced */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-20 md:py-28 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-vermelho/10 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amarelo/10 rounded-full blur-3xl animate-float" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-vermelho/5 to-transparent rounded-full" />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0V0zm1 1v58h58V1H1z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <Animated animation="fade-down">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermelho/10 border border-vermelho/20 mb-6">
                  <Newspaper className="w-4 h-4 text-vermelho" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-vermelho">
                    Notícias
                  </span>
                </div>
              </Animated>

              {/* Title */}
              <Animated animation="fade-up" delay={100}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-cream mb-6 leading-tight">
                  Últimas{' '}
                  <span className="text-gradient-brand">Notícias</span>
                </h1>
              </Animated>

              {/* Description */}
              <Animated animation="fade-up" delay={200}>
                <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto leading-relaxed mb-10">
                  Acompanhe as principais notícias de política, empreendedorismo e
                  acontecimentos em Portugal, Brasil e no mundo.
                </p>
              </Animated>

              {/* Stats */}
              <Animated animation="fade-up" delay={300}>
                <div className="flex justify-center gap-8 md:gap-16">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-vermelho">
                      <AnimatedCounter value={24} suffix="h" />
                    </div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1 flex items-center gap-1 justify-center">
                      <Clock className="w-3 h-3" />
                      Atualização
                    </div>
                  </div>
                  <div className="w-px h-12 bg-cream/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-cream">
                      <AnimatedCounter value={3} suffix="+" />
                    </div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1 flex items-center gap-1 justify-center">
                      <Globe className="w-3 h-3" />
                      Regiões
                    </div>
                  </div>
                  <div className="w-px h-12 bg-cream/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-cream">
                      <AnimatedCounter value={10} suffix="+" />
                    </div>
                    <div className="text-xs text-cream/50 uppercase tracking-wider mt-1 flex items-center gap-1 justify-center">
                      <TrendingUp className="w-3 h-3" />
                      Categorias
                    </div>
                  </div>
                </div>
              </Animated>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
            </svg>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-12 md:py-16">
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
                    Voltar ao início
                  </Button>
                </Link>
              </div>
            </Animated>

            <BlogList />
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
