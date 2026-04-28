import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';

const stories = [
  {
    id: 'MSs0rQRX4v8',
    title: 'A Maratona de Dança',
    description: 'O Baby Shark e os amigos entram numa maratona de dança cheia de ritmo e diversão!',
    color: 'from-pink-400 to-rose-500',
    borderColor: 'border-pink-300',
  },
  {
    id: 'OKvw2XMgCVM',
    title: 'Rexy e o Coração de Ouro',
    description: 'O Rexy descobre que a verdadeira força está no coração. Uma história da Enseada Carnívora!',
    color: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-300',
  },
];

const storiesJsonLd = [
  // Breadcrumb
  getPageBreadcrumbJsonLd('Histórias Encantadas', 'https://www.olhaqueduas.com/kids/historias', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
  ]),
  // WebPage
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://www.olhaqueduas.com/kids/historias#webpage',
    url: 'https://www.olhaqueduas.com/kids/historias',
    name: 'Histórias Infantis para Crianças — Contos Narrados do Cantinho da Pequenada',
    description:
      'Histórias infantis narradas em vídeo para crianças dos 3 aos 12 anos. Contos e aventuras do Cantinho da Pequenada com a Leonor — conteúdo seguro, gratuito e educativo para toda a família.',
    isPartOf: { '@id': 'https://www.olhaqueduas.com/kids#webpage' },
    inLanguage: 'pt-PT',
    dateModified: '2026-04-28',
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 3,
      suggestedMaxAge: 12,
      audienceType: 'Crianças e Famílias',
    },
  },
  // VideoObject — A Maratona de Dança
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'A Maratona de Dança — História Infantil',
    description: 'O Baby Shark e os amigos entram numa maratona de dança cheia de ritmo e diversão! História narrada do Cantinho da Pequenada.',
    thumbnailUrl: 'https://img.youtube.com/vi/MSs0rQRX4v8/hqdefault.jpg',
    uploadDate: '2026-04-11',
    contentUrl: 'https://www.youtube.com/watch?v=MSs0rQRX4v8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/MSs0rQRX4v8',
    publisher: {
      '@type': 'Organization',
      name: 'Olha que Duas',
      url: 'https://www.olhaqueduas.com',
    },
    inLanguage: 'pt-PT',
    isFamilyFriendly: true,
  },
  // VideoObject — Rexy e o Coração de Ouro
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Rexy e o Coração de Ouro — História Infantil',
    description: 'O Rexy descobre que a verdadeira força está no coração. Uma história da Enseada Carnívora narrada no Cantinho da Pequenada.',
    thumbnailUrl: 'https://img.youtube.com/vi/OKvw2XMgCVM/hqdefault.jpg',
    uploadDate: '2026-04-11',
    contentUrl: 'https://www.youtube.com/watch?v=OKvw2XMgCVM',
    embedUrl: 'https://www.youtube-nocookie.com/embed/OKvw2XMgCVM',
    publisher: {
      '@type': 'Organization',
      name: 'Olha que Duas',
      url: 'https://www.olhaqueduas.com',
    },
    inLanguage: 'pt-PT',
    isFamilyFriendly: true,
  },
];

export default function KidsStories() {
  useMetaTags({
    title: 'Histórias Infantis para Crianças — Contos Narrados do Cantinho da Pequenada',
    description:
      'Ouve histórias infantis narradas em vídeo no espaço Kids do Olha que Duas! Contos e aventuras do Cantinho da Pequenada com a Leonor — Baby Shark, Rexy e muitas mais. Conteúdo seguro, gratuito e educativo para crianças dos 3 aos 12 anos.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Olha que Duas Kids — Histórias Encantadas narradas para crianças',
    url: 'https://www.olhaqueduas.com/kids/historias',
    tags: [
      'histórias infantis',
      'contos para crianças',
      'histórias narradas',
      'vídeos infantis',
      'cantinho da pequenada',
      'olha que duas kids',
      'baby shark história',
      'histórias educativas',
      'contos em português',
      'histórias para dormir',
    ],
    jsonLd: storiesJsonLd,
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
            background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 30%, #fef3c7 100%)',
          }}
        >
          {/* Decorative stars */}
          <Star className="absolute top-28 left-[10%] w-6 h-6 md:w-8 md:h-8 text-white/50 fill-white/30 animate-twinkle-1" />
          <Star className="absolute top-40 right-[15%] w-5 h-5 md:w-7 md:h-7 text-white/60 fill-white/40 animate-twinkle-2" />
          <Star className="absolute top-[55%] left-[80%] w-4 h-4 md:w-6 md:h-6 text-white/40 fill-white/20 animate-twinkle-3" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Back button */}
            <Animated animation="fade-down">
              <Link to="/kids">
                <Button
                  variant="ghost"
                  className="mb-6 gap-2 text-amber-900 hover:bg-white/30 font-bold rounded-full border-2 border-amber-800/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Kids
                </Button>
              </Link>
            </Animated>

            <Animated animation="fade-up" className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border-2 border-amber-300 shadow-lg mb-6">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-amber-700">
                  Hora da História
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-amber-900 drop-shadow-sm mb-4">
                Histórias <span className="text-white drop-shadow-md">Encantadas</span>
              </h1>
              <p className="text-lg md:text-xl text-amber-800/80 max-w-xl mx-auto">
                Aconchega-te e prepara-te para ouvir histórias incríveis!
              </p>
            </Animated>
          </div>

          {/* Wavy bottom */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg viewBox="0 0 1440 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="hsl(var(--background))"
                d="M0 60 C360 120, 720 0, 1080 60 S1440 120, 1440 60 L1440 120 L0 120 Z"
              />
            </svg>
          </div>
        </section>

        {/* Stories */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-10 md:space-y-14">
              {stories.map((story, index) => (
                <Animated key={story.id} animation="fade-up" delay={index * 150}>
                  <div className={`rounded-3xl overflow-hidden border-4 ${story.borderColor} bg-white shadow-xl`}>
                    {/* Video */}
                    <div className="relative aspect-video">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${story.id}`}
                        title={story.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-5 md:p-6">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${story.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="font-display font-bold text-xl md:text-2xl text-charcoal">
                            {story.title}
                          </h2>
                          <p className="text-charcoal/60 text-sm md:text-base mt-1">
                            {story.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Animated>
              ))}
            </div>

            {/* Coming soon message */}
            <Animated animation="fade-up" delay={300}>
              <div className="max-w-3xl mx-auto mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-50 border-2 border-amber-200">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-amber-700 font-semibold text-sm md:text-base">
                    Mais histórias em breve!
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
                    className="h-14 px-8 text-base font-extrabold rounded-full bg-amber-400 hover:bg-amber-500 text-amber-900 shadow-[0_10px_0_rgba(180,120,0,0.5)] hover:shadow-[0_6px_0_rgba(180,120,0,0.5)] hover:translate-y-1 transition-all border-4 border-white"
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
