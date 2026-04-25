import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mic, Sparkles, Star, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';

export default function KidsKaraoke() {
  useMetaTags({
    title: 'Karaoke Kids',
    description:
      'Karaoke infantil do Cantinho da Pequenada! Canta connosco as músicas mais divertidas para os mais pequenos. Diversão em família com o Olha que Duas Kids.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Olha que Duas Kids — Karaoke infantil para cantar em família',
    url: 'https://www.olhaqueduas.com/kids/karaoke',
    tags: ['karaoke infantil', 'música para crianças', 'cantinho da pequenada', 'cantar em família', 'olha que duas kids'],
    jsonLd: getPageBreadcrumbJsonLd('Karaoke', 'https://www.olhaqueduas.com/kids/karaoke', [
      { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
    ]),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-28 md:pt-36 pb-20 md:pb-28"
          style={{
            background:
              'linear-gradient(180deg, #f472b6 0%, #ec4899 30%, #fce7f3 100%)',
          }}
        >
          {/* Decorative stars */}
          <Star className="absolute top-28 left-[10%] w-6 h-6 md:w-8 md:h-8 text-white/50 fill-white/30 animate-twinkle-1" />
          <Star className="absolute top-40 right-[15%] w-5 h-5 md:w-7 md:h-7 text-white/60 fill-white/40 animate-twinkle-2" />
          <Star className="absolute top-[55%] left-[80%] w-4 h-4 md:w-6 md:h-6 text-white/40 fill-white/20 animate-twinkle-3" />

          {/* Floating music notes */}
          <Music2 className="absolute top-32 right-[25%] w-5 h-5 text-white/40 animate-bob-fast" />
          <Music2 className="absolute top-[60%] left-[15%] w-6 h-6 text-white/30 animate-bob" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Back button */}
            <Animated animation="fade-down">
              <Link to="/kids">
                <Button
                  variant="ghost"
                  className="mb-6 gap-2 text-pink-900 hover:bg-white/30 font-bold rounded-full border-2 border-pink-800/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Kids
                </Button>
              </Link>
            </Animated>

            <Animated animation="fade-up" className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border-2 border-pink-300 shadow-lg mb-6">
                <Mic className="w-4 h-4 text-pink-700" />
                <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-pink-700">
                  Palco Aberto
                </span>
                <Sparkles className="w-4 h-4 text-pink-500" />
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-pink-900 drop-shadow-sm mb-4">
                Karaoke{' '}
                <span className="text-white drop-shadow-md">Kids</span>
              </h1>
              <p className="text-lg md:text-xl text-pink-800/80 max-w-xl mx-auto">
                Pega no microfone e canta connosco!
              </p>
            </Animated>
          </div>

          {/* Wavy bottom */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg
              viewBox="0 0 1440 120"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="hsl(var(--background))"
                d="M0 60 C360 120, 720 0, 1080 60 S1440 120, 1440 60 L1440 120 L0 120 Z"
              />
            </svg>
          </div>
        </section>

        {/* Video */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-10 md:space-y-14">
              <Animated animation="fade-up">
                <div className="rounded-3xl overflow-hidden border-4 border-pink-300 bg-white shadow-xl">
                  {/* Video embed */}
                  <div className="relative aspect-video">
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/w2neEwT1jO8"
                      title="Karaoke Kids — Olha que Duas"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5 md:p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Mic className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-xl md:text-2xl text-charcoal">
                          Canta Connosco!
                        </h2>
                        <p className="text-charcoal/60 text-sm md:text-base mt-1">
                          Acompanha a letra e diverte-te a cantar com toda a
                          família!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Animated>
            </div>

            {/* Coming soon message */}
            <Animated animation="fade-up" delay={300}>
              <div className="max-w-3xl mx-auto mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-50 border-2 border-pink-200">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  <span className="text-pink-700 font-semibold text-sm md:text-base">
                    Mais músicas em breve!
                  </span>
                </div>
              </div>
            </Animated>

            {/* Back to kids */}
            <Animated animation="fade-up" delay={400}>
              <div className="mt-10 text-center">
                <Link to="/kids">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-extrabold rounded-full bg-pink-400 hover:bg-pink-500 text-pink-900 shadow-[0_10px_0_rgba(157,23,77,0.4)] hover:shadow-[0_6px_0_rgba(157,23,77,0.4)] hover:translate-y-1 transition-all border-4 border-white"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar ao Kids
                  </Button>
                </Link>
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
