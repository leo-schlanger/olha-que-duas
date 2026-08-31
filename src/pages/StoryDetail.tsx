import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Loader2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { EpisodeSignup } from '@/components/stories/EpisodeSignup';
import { useStory } from '@/hooks/useStories';
import { useMetaTags } from '@/hooks/useMetaTags';
import { STORY_STATUS_LABELS } from '@/types/story';

export default function StoryDetail() {
  const { storySlug } = useParams<{ storySlug: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useStory(storySlug || '');

  const story = data?.story;
  const episodes = data?.episodes ?? [];

  useMetaTags({
    title: story?.title,
    description:
      story?.tagline ||
      story?.synopsis?.slice(0, 200) ||
      'Uma história em episódios do Olha que Duas.',
    image: story?.cover_url || undefined,
    url: storySlug
      ? `https://www.olhaqueduas.com/historias/${storySlug}`
      : undefined,
    type: 'article',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [storySlug]);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex flex-col items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-vermelho mb-4" />
          <p className="text-muted-foreground">A carregar história…</p>
        </div>
      </Shell>
    );
  }

  if (error || !story) {
    return (
      <Shell>
        <div className="text-center py-24 max-w-md mx-auto px-4">
          <AlertCircle className="w-10 h-10 text-vermelho mx-auto mb-4" />
          <h1 className="font-display text-xl font-semibold text-foreground mb-3">
            História não encontrada
          </h1>
          <p className="text-muted-foreground mb-6">
            Esta história não existe ou ainda não foi publicada.
          </p>
          <Button
            onClick={() => navigate('/historias')}
            className="gap-2 bg-vermelho hover:bg-vermelho/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver todas as histórias
          </Button>
        </div>
      </Shell>
    );
  }

  const remaining =
    story.planned_episodes > 0
      ? Math.max(0, story.planned_episodes - episodes.length)
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main" className="flex-1 pt-24 md:pt-28">
        {/* Capa */}
        <section className="bg-charcoal">
          <div className="container mx-auto px-4 sm:px-6 py-14 md:py-20">
            <Link
              to="/historias"
              className="inline-flex items-center gap-2 text-sm text-cream/60 hover:text-cream mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Histórias
            </Link>

            <div className="grid md:grid-cols-[1fr_320px] gap-10 items-start">
              <Animated animation="fade-up">
                <div className="flex items-center gap-3 mb-4 text-[11px] font-semibold uppercase tracking-widest">
                  {story.genre && (
                    <span className="text-vermelho">{story.genre}</span>
                  )}
                  <span className="text-cream/50">
                    {STORY_STATUS_LABELS[story.status]}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-cream leading-tight mb-4">
                  {story.title}
                </h1>

                {story.tagline && (
                  <p className="text-lg text-cream/80 mb-6">{story.tagline}</p>
                )}

                {story.synopsis && (
                  <p className="text-cream/60 leading-relaxed whitespace-pre-line max-w-2xl">
                    {story.synopsis}
                  </p>
                )}

                {episodes.length > 0 && (
                  <Button
                    asChild
                    className="mt-8 h-12 px-7 bg-vermelho hover:bg-vermelho/90 text-base"
                  >
                    <Link to={`/historias/${story.slug}/${episodes[0].number}`}>
                      Começar pelo episódio {episodes[0].number}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </Animated>

              {story.cover_url && (
                <Animated animation="fade-up" delay={100}>
                  <img
                    src={story.cover_url}
                    alt=""
                    className="w-full rounded-2xl object-cover aspect-[4/5] shadow-2xl"
                  />
                </Animated>
              )}
            </div>
          </div>
        </section>

        {/* Episódios */}
        <section className="container mx-auto px-4 sm:px-6 py-14 md:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Episódios
              </h2>
              <span className="text-sm text-muted-foreground tabular-nums">
                {episodes.length}
                {story.planned_episodes > 0 && ` de ${story.planned_episodes}`}
              </span>
            </div>

            {episodes.length === 0 ? (
              <div className="text-center py-14 rounded-2xl border border-border bg-card">
                <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  O primeiro episódio sai em breve.
                </p>
              </div>
            ) : (
              <ol className="space-y-3">
                {episodes.map((episode) => (
                  <li key={episode.id}>
                    <Link
                      to={`/historias/${story.slug}/${episode.number}`}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-vermelho/40 transition-colors focus:outline-none focus:ring-2 focus:ring-vermelho"
                    >
                      <span className="font-display text-2xl font-bold text-muted-foreground/40 tabular-nums w-10 text-center shrink-0 group-hover:text-vermelho transition-colors">
                        {episode.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate group-hover:text-vermelho transition-colors">
                          {episode.title}
                        </p>
                        {episode.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                            {episode.excerpt}
                          </p>
                        )}
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        {episode.reading_minutes} min
                      </span>
                    </Link>
                  </li>
                ))}

                {remaining > 0 && (
                  <li className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border text-muted-foreground">
                    <Lock className="w-4 h-4 ml-3 shrink-0" />
                    <span className="text-sm">
                      Faltam {remaining} episódio{remaining === 1 ? '' : 's'}.
                      Ainda por publicar.
                    </span>
                  </li>
                )}
              </ol>
            )}

            {story.status !== 'concluida' && (
              <EpisodeSignup storyTitle={story.title} variant="fim" />
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main id="main" className="flex-1 pt-32 md:pt-40">
        {children}
      </main>
      <Footer />
    </div>
  );
}
