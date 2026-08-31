import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { useStories } from '@/hooks/useStories';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';
import { STORY_STATUS_LABELS, type Story } from '@/types/story';

export default function Stories() {
  const { data: stories, isLoading, error } = useStories();

  useMetaTags({
    title: 'Histórias',
    description:
      'Histórias em episódios para ler de uma sentada. Ficção original do Olha que Duas, publicada por capítulos — comece pelo primeiro e siga até ao fim.',
    url: 'https://www.olhaqueduas.com/historias',
    jsonLd: getPageBreadcrumbJsonLd(
      'Histórias',
      'https://www.olhaqueduas.com/historias'
    ),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main" className="flex-1 pt-24 md:pt-28">
        <section className="bg-charcoal py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <Animated animation="fade-up" className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermelho/10 border border-vermelho/20 mb-6">
                <BookOpen className="w-4 h-4 text-vermelho" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-vermelho">
                  Histórias
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-cream mb-5 leading-tight">
                Histórias que se leem por episódios
              </h1>
              <p className="text-lg text-cream/70 leading-relaxed">
                Começa uma e não consegue parar. Cada episódio novo sai no dia
                marcado — e fica aqui para sempre.
              </p>
            </Animated>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 py-14 md:py-20">
          {isLoading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-vermelho mb-4" />
              <p className="text-muted-foreground">A carregar histórias…</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertCircle className="w-10 h-10 text-vermelho mx-auto mb-4" />
              <p className="text-muted-foreground">
                Não foi possível carregar as histórias. Tente novamente daqui a
                pouco.
              </p>
            </div>
          ) : !stories || stories.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                A primeira história está a ser escrita
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Volte em breve — ou siga-nos nas redes para saber quando o
                primeiro episódio sai.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {stories.map((story, i) => (
                <Animated key={story.id} animation="fade-up" delay={i * 60}>
                  <StoryCard story={story} />
                </Animated>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      to={`/historias/${story.slug}`}
      className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-card hover:border-vermelho/40 transition-colors focus:outline-none focus:ring-2 focus:ring-vermelho"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {story.cover_url ? (
          <img
            src={story.cover_url}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-semibold uppercase tracking-widest">
          {story.genre && (
            <span className="text-vermelho">{story.genre}</span>
          )}
          <span className="text-muted-foreground">
            {STORY_STATUS_LABELS[story.status]}
          </span>
        </div>

        <h2 className="font-display text-xl font-bold text-foreground leading-tight mb-2 group-hover:text-vermelho transition-colors">
          {story.title}
        </h2>

        {story.tagline && (
          <p className="text-muted-foreground leading-relaxed">
            {story.tagline}
          </p>
        )}

        <span className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-semibold text-vermelho">
          Começar a ler
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
