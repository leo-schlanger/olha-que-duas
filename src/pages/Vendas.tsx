import { useEffect, useState } from "react";
import { Bell, Heart, ShoppingBag, Sparkles, Instagram, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

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

// Galeria de produtos - temporário até lançamento da loja
const produtos = [
  // Canecas principais (destaque)
  { id: 1, img: caneca01 },
  { id: 2, img: caneca02 },
  { id: 3, img: caneca03 },
  { id: 4, img: caneca04 },
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
];

const Vendas = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-beige-light">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Em Breve */}
        <section className="relative min-h-[90vh] bg-hero-gradient overflow-hidden flex items-center">
          {/* Decorative elements */}
          <div className="absolute top-1/4 -right-32 w-64 md:w-96 h-64 md:h-96 bg-amarelo/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -left-32 w-48 md:w-72 h-48 md:h-72 bg-vermelho/15 rounded-full blur-3xl animate-pulse" />

          {/* Floating sparkles */}
          <div className="absolute top-20 left-10 text-amarelo/30 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute top-40 right-20 text-amarelo/20 animate-bounce delay-300">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute bottom-32 left-1/4 text-amarelo/25 animate-bounce delay-500">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-32 pb-16">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Content */}
              <div className="text-cream space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-amarelo/20 text-amarelo px-4 py-2 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Em Breve
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold leading-tight">
                  A Nossa <span className="text-amarelo">Loja</span> está quase a chegar!
                </h1>

                <p className="text-base md:text-lg text-cream/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Prepara-te para levar um pedacinho do <strong className="text-amarelo">Olha que Duas</strong> para a tua casa!
                  Canecas exclusivas e muito mais novidades estão a caminho.
                </p>

                {/* Email signup teaser */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4 border border-white/10">
                  <div className="flex items-center gap-2 text-amarelo">
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">Queres ser o primeiro a saber?</span>
                  </div>
                  <p className="text-cream/70 text-sm">
                    Segue-nos nas redes sociais para não perderes o lançamento!
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto btn-primary-glow font-medium h-11 md:h-12 px-6 md:px-8 border-none"
                  >
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Instagram className="w-5 h-5" />
                      Seguir no Instagram
                    </a>
                  </Button>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative flex justify-center order-1 lg:order-2">
                <div className="relative w-full max-w-md">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amarelo/30 to-vermelho/30 rounded-3xl blur-2xl scale-95" />

                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                    <img
                      src={canecaDestaque}
                      alt="Canecas Olha que Duas - Em Breve"
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />

                    {/* Floating badge */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-amarelo text-charcoal px-5 py-3 rounded-xl font-display text-lg font-semibold shadow-lg flex items-center justify-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Lançamento Exclusivo
                      </div>
                    </div>
                  </div>

                  {/* Decorative hearts */}
                  <div className="absolute -top-4 -right-4 bg-vermelho text-white p-3 rounded-full shadow-lg animate-pulse">
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
              <span className="label-sm text-primary mb-3 block">Sneak Peek</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-4">
                Espreita o que <span className="text-gradient-brand">vem aí</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Produtos exclusivos feitos com muito carinho para ti
              </p>
            </div>

            {/* Product Grid - Responsivo */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer bg-white"
                  onClick={() => setSelectedImage(produto.img)}
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={produto.img}
                      alt={`Produto ${produto.id}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay - apenas no hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="bg-amarelo text-charcoal text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                      Ver mais
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Info adicional */}
            <p className="text-center text-muted-foreground text-sm mt-8">
              Clica nas imagens para ver em tamanho maior
            </p>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-beige-dark text-cream">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              {/* Animated icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-amarelo/20 rounded-full flex items-center justify-center animate-pulse">
                    <ShoppingBag className="w-10 h-10 text-amarelo" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-vermelho rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold">
                Não percas o <span className="text-amarelo">lançamento!</span>
              </h2>

              <p className="text-cream/80 text-base md:text-lg max-w-xl mx-auto">
                A loja oficial do Olha que Duas está a ser preparada com todo o carinho.
                Segue-nos para seres o primeiro a saber quando abrir!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-glow font-medium h-12 px-8 border-none"
                >
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Instagram className="w-5 h-5" />
                    Instagram
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-amarelo/50 bg-amarelo/10 text-amarelo hover:bg-amarelo hover:text-charcoal font-medium h-12 px-8"
                >
                  <a href="/#contacto">
                    Entra em Contacto
                  </a>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 pt-8 text-cream/60 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-vermelho" />
                  <span>Feito com amor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amarelo" />
                  <span>Produtos exclusivos</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-cream/60" />
                  <span>Envio para Portugal</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-3xl">
            <img
              src={selectedImage}
              alt="Produto"
              className="w-full max-h-[85vh] object-contain rounded-lg"
            />
            <button
              className="absolute -top-3 -right-3 sm:top-2 sm:right-2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-charcoal hover:bg-amarelo transition-colors shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <span className="text-2xl font-bold leading-none">&times;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendas;
