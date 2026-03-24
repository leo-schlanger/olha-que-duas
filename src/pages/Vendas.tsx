import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Sparkles, Instagram, Facebook, MessageCircle, Star, Package, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { siteConfig } from "@/config/site";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";
import { Animated, AnimatedGrid, AnimatedCounter } from "@/components/ui/animated";

// Imagem destaque
import canecaDestaque from "@/assets/merch/caneca-cenario-destaque.jpg";

// Canecas principais - visibilidade importante
import caneca01 from "@/assets/merch/caneca-olha-que-duas-01.jpg";
import caneca02 from "@/assets/merch/caneca-olha-que-duas-02.jpg";
import caneca03 from "@/assets/merch/caneca-olha-que-duas-03.jpg";
import caneca04 from "@/assets/merch/caneca-olha-que-duas-04.jpg";

// Preview da loja - imagens temporárias (serão substituídas no lançamento)
import preview1 from "@/assets/merch/preview-1.jpg";
import preview2 from "@/assets/merch/preview-2.jpg";
import preview3 from "@/assets/merch/preview-3.jpg";
import preview4 from "@/assets/merch/preview-4.jpg";
import preview5 from "@/assets/merch/preview-5.jpg";
import preview6 from "@/assets/merch/preview-6.jpg";
import preview7 from "@/assets/merch/preview-7.jpg";
import preview8 from "@/assets/merch/preview-8.jpg";
import preview9 from "@/assets/merch/preview-9.jpg";
import preview10 from "@/assets/merch/preview-10.jpg";
import preview11 from "@/assets/merch/preview-11.jpg";
import preview12 from "@/assets/merch/preview-12.jpg";
import preview13 from "@/assets/merch/preview-13.jpg";
import preview14 from "@/assets/merch/preview-14.jpg";
import preview15 from "@/assets/merch/preview-15.jpg";
import preview16 from "@/assets/merch/preview-16.jpg";

// Galeria de produtos - temporário até lançamento da loja
const produtos = [
  // Canecas principais (destaque)
  { id: 1, img: caneca01, featured: true },
  { id: 2, img: caneca02, featured: true },
  { id: 3, img: caneca03, featured: true },
  { id: 4, img: caneca04, featured: true },
  // Preview adicional
  { id: 5, img: preview1 },
  { id: 6, img: preview2 },
  { id: 7, img: preview3 },
  { id: 8, img: preview4 },
  { id: 9, img: preview5 },
  { id: 10, img: preview6 },
  { id: 11, img: preview7 },
  { id: 12, img: preview8 },
  { id: 13, img: preview9 },
  { id: 14, img: preview10 },
  { id: 15, img: preview11 },
  { id: 16, img: preview12 },
  { id: 17, img: preview13 },
  { id: 18, img: preview14 },
  { id: 19, img: preview15 },
  { id: 20, img: preview16 },
];

const Vendas = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // SEO Meta Tags
  useMetaTags({
    title: 'Loja Oficial',
    description: 'Loja oficial Olha que Duas. Canecas exclusivas, produtos únicos e muito estilo. Encomende já os seus produtos favoritos e leve o Olha que Duas consigo!',
    url: 'https://www.olhaqueduas.com/loja',
    jsonLd: [
      getPageBreadcrumbJsonLd('Loja', 'https://www.olhaqueduas.com/loja'),
      {
        '@context': 'https://schema.org',
        '@type': 'Store',
        '@id': 'https://www.olhaqueduas.com/loja#store',
        name: 'Loja Olha que Duas',
        description: 'Loja oficial com produtos exclusivos Olha que Duas',
        url: 'https://www.olhaqueduas.com/loja',
        priceRange: '€€',
        areaServed: {
          '@type': 'Country',
          name: 'Portugal',
        },
      },
    ],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative min-h-[90vh] bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal overflow-hidden flex items-center">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -right-32 w-64 md:w-96 h-64 md:h-96 bg-amarelo/15 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-1/4 -left-32 w-48 md:w-72 h-48 md:h-72 bg-vermelho/10 rounded-full blur-3xl animate-float" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-amarelo/5 to-transparent rounded-full" />

            {/* Sparkle particles */}
            <div className="absolute top-20 left-[10%] text-amarelo/40 animate-float">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute top-40 right-[15%] text-amarelo/30 animate-float-slow">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute bottom-32 left-1/4 text-amarelo/35 animate-float">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="absolute top-1/3 left-[20%] text-vermelho/30 animate-float-slow">
              <Heart className="w-4 h-4" />
            </div>
            <div className="absolute bottom-1/4 right-[25%] text-vermelho/25 animate-float">
              <Heart className="w-5 h-5" />
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-32 pb-16">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Content */}
              <div className="text-cream space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
                <Animated animation="fade-down">
                  <div className="inline-flex items-center gap-2 bg-amarelo/20 text-amarelo px-4 py-2 rounded-full text-sm font-medium border border-amarelo/20">
                    <ShoppingBag className="w-4 h-4" />
                    Loja Oficial
                  </div>
                </Animated>

                <Animated animation="fade-up" delay={100}>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
                    Leva o{' '}
                    <span className="text-gradient-brand">Olha que Duas</span>
                    {' '}contigo!
                  </h1>
                </Animated>

                <Animated animation="fade-up" delay={200}>
                  <p className="text-lg md:text-xl text-cream/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Canecas exclusivas, produtos únicos e muito estilo para o teu dia a dia!
                    <strong className="text-amarelo"> Faz já a tua encomenda</strong> e garante o teu antes que esgote!
                  </p>
                </Animated>

                {/* Stats */}
                <Animated animation="fade-up" delay={300}>
                  <div className="flex justify-center lg:justify-start gap-8 py-4">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-display font-bold text-amarelo">
                        <AnimatedCounter value={20} suffix="+" />
                      </div>
                      <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Produtos</div>
                    </div>
                    <div className="w-px h-12 bg-cream/10" />
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-display font-bold text-cream">
                        <AnimatedCounter value={100} suffix="%" />
                      </div>
                      <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Exclusivo</div>
                    </div>
                    <div className="w-px h-12 bg-cream/10" />
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-display font-bold text-cream flex items-center justify-center gap-1">
                        <Heart className="w-5 h-5 text-vermelho fill-vermelho" />
                      </div>
                      <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Feito com amor</div>
                    </div>
                  </div>
                </Animated>

                {/* CTA Card */}
                <Animated animation="fade-up" delay={400}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4 border border-white/10">
                    <div className="flex items-center gap-2 text-amarelo">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-semibold">Queres encomendar? Fala connosco!</span>
                    </div>
                    <p className="text-cream/60 text-sm">
                      Envia-nos mensagem nas redes sociais para fazeres a tua encomenda. Respondemos rapidamente!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-vermelho to-vermelho-soft text-white hover:opacity-90 font-semibold h-12 rounded-xl shadow-lg shadow-vermelho/30 btn-shine btn-magnetic"
                      >
                        <a
                          href={siteConfig.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <Instagram className="w-5 h-5" />
                          Instagram
                        </a>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        className="flex-1 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold h-12 rounded-xl shadow-lg shadow-blue-500/30 btn-magnetic"
                      >
                        <a
                          href={siteConfig.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <Facebook className="w-5 h-5" />
                          Facebook
                        </a>
                      </Button>
                    </div>
                  </div>
                </Animated>
              </div>

              {/* Featured Image */}
              <Animated animation="fade-left" delay={200} className="relative flex justify-center order-1 lg:order-2">
                <div className="relative w-full max-w-md">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amarelo/30 to-vermelho/30 rounded-3xl blur-2xl scale-95 animate-pulse-glow" />

                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 card-3d">
                    <img
                      src={canecaDestaque}
                      alt="Canecas Olha que Duas"
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />

                    {/* Floating badge */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-gradient-to-r from-amarelo to-amarelo-soft text-charcoal px-5 py-3 rounded-xl font-display text-lg font-bold shadow-lg flex items-center justify-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Disponível para Encomenda
                      </div>
                    </div>
                  </div>

                  {/* Decorative floating elements */}
                  <div className="absolute -top-4 -right-4 bg-vermelho text-white p-3 rounded-full shadow-lg animate-float">
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 bg-amarelo text-charcoal p-2 rounded-full shadow-lg animate-float-slow">
                    <Star className="w-5 h-5 fill-current" />
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

        {/* Preview Section - Products Gallery */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-vermelho/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-amarelo/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <Animated animation="fade-up" className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                  Os Nossos Produtos
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 leading-tight">
                Descobre a nossa{' '}
                <span className="text-gradient-brand">coleção</span>
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Produtos exclusivos feitos com muito carinho. Escolhe o teu favorito e encomenda já!
              </p>
            </Animated>

            {/* Product Grid with staggered animation */}
            <AnimatedGrid
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              staggerDelay={50}
              animation="fade-up"
            >
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer bg-card border border-border/50 hover:border-primary/30 card-3d ${
                    produto.featured ? 'ring-2 ring-amarelo/30' : ''
                  }`}
                  onClick={() => setSelectedImage(produto.img)}
                >
                  {/* Featured badge */}
                  {produto.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-amarelo text-charcoal rounded-full shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        Destaque
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={produto.img}
                      alt={`Produto ${produto.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="bg-gradient-to-r from-amarelo to-amarelo-soft text-charcoal text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Ver mais
                    </span>
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl bg-primary/10" />
                </div>
              ))}
            </AnimatedGrid>

            {/* Info */}
            <Animated animation="fade-up" delay={500}>
              <p className="text-center text-muted-foreground text-sm mt-10">
                Clica nas imagens para ver em tamanho maior
              </p>
            </Animated>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal text-cream relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amarelo/10 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-vermelho/10 rounded-full blur-3xl animate-float" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              {/* Animated icon */}
              <Animated animation="zoom-in">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-amarelo/20 rounded-2xl flex items-center justify-center animate-pulse-glow">
                      <MessageCircle className="w-12 h-12 text-amarelo" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-vermelho rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </Animated>

              <Animated animation="fade-up" delay={100}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold">
                  Pronto para{' '}
                  <span className="text-gradient-brand">encomendar?</span>
                </h2>
              </Animated>

              <Animated animation="fade-up" delay={200}>
                <p className="text-cream/70 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                  É simples! Envia-nos uma mensagem no Instagram ou Facebook com o produto que queres.
                  Respondemos rapidamente e tratamos de tudo para ti!
                </p>
              </Animated>

              <Animated animation="fade-up" delay={300}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-vermelho to-vermelho-soft text-white hover:opacity-90 font-semibold h-14 px-8 rounded-xl shadow-lg shadow-vermelho/30 btn-shine btn-magnetic"
                  >
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Instagram className="w-5 h-5" />
                      Encomendar no Instagram
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold h-14 px-8 rounded-xl shadow-lg shadow-blue-500/30 btn-magnetic"
                  >
                    <a
                      href={siteConfig.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Facebook className="w-5 h-5" />
                      Encomendar no Facebook
                    </a>
                  </Button>
                </div>
              </Animated>

              {/* Trust badges */}
              <Animated animation="fade-up" delay={400}>
                <div className="flex flex-wrap justify-center gap-8 pt-10">
                  <div className="flex items-center gap-2 text-cream/60">
                    <div className="w-10 h-10 rounded-xl bg-vermelho/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-vermelho" />
                    </div>
                    <span className="text-sm">Feito com amor</span>
                  </div>
                  <div className="flex items-center gap-2 text-cream/60">
                    <div className="w-10 h-10 rounded-xl bg-amarelo/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amarelo" />
                    </div>
                    <span className="text-sm">Produtos exclusivos</span>
                  </div>
                  <div className="flex items-center gap-2 text-cream/60">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-cream/70" />
                    </div>
                    <span className="text-sm">Envio para Portugal</span>
                  </div>
                </div>
              </Animated>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />

      {/* Lightbox Modal - Enhanced */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl animate-zoom-in">
            <img
              src={selectedImage}
              alt="Produto"
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              className="absolute -top-4 -right-4 md:top-4 md:right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-charcoal hover:bg-amarelo transition-colors shadow-lg btn-magnetic"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* CTA under image */}
            <div className="mt-6 flex justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-vermelho to-vermelho-soft text-white font-semibold rounded-xl shadow-lg"
              >
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2"
                >
                  <Instagram className="w-5 h-5" />
                  Encomendar
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendas;
