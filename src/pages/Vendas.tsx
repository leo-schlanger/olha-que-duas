import { useEffect, useState } from "react";
import { Bell, Heart, ShoppingBag, Sparkles, Instagram, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

// Importar imagens
import canecaDestaque from "@/assets/merch/caneca-cenario-destaque.jpg";
import caneca01 from "@/assets/merch/caneca-olha-que-duas-01.jpg";
import caneca02 from "@/assets/merch/caneca-olha-que-duas-02.jpg";
import caneca03 from "@/assets/merch/caneca-olha-que-duas-03.jpg";
import caneca04 from "@/assets/merch/caneca-olha-que-duas-04.jpg";
import canecaPerfil01 from "@/assets/merch/caneca-perfil-01.jpg";
import canecaPerfil02 from "@/assets/merch/caneca-perfil-02.jpg";

const produtos = [
  { id: 1, img: caneca01, nome: "Caneca Olha que Duas - Modelo 1" },
  { id: 2, img: caneca02, nome: "Caneca Olha que Duas - Modelo 2" },
  { id: 3, img: caneca03, nome: "Caneca Olha que Duas - Modelo 3" },
  { id: 4, img: caneca04, nome: "Caneca Olha que Duas - Modelo 4" },
  { id: 5, img: canecaPerfil01, nome: "Caneca Olha que Duas - Perfil" },
  { id: 6, img: canecaPerfil02, nome: "Caneca Olha que Duas - Especial" },
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

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {produtos.map((produto, index) => (
                <div
                  key={produto.id}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedImage(produto.img)}
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={produto.img}
                      alt={produto.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="bg-amarelo/90 text-charcoal text-center py-2 px-3 rounded-lg font-medium text-sm">
                        Em Breve
                      </div>
                    </div>
                  </div>

                  {/* Coming soon badge */}
                  <div className="absolute top-3 right-3 bg-vermelho text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    NOVO
                  </div>
                </div>
              ))}
            </div>
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
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Produto em destaque"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-charcoal hover:bg-amarelo transition-colors shadow-lg"
              onClick={() => setSelectedImage(null)}
            >
              <span className="text-xl font-bold">&times;</span>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amarelo text-charcoal px-6 py-2 rounded-full font-medium shadow-lg">
              Em Breve
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendas;
