import { useEffect, useMemo, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Loader2,
  AlertCircle,
  List,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { EpisodeSignup } from '@/components/stories/EpisodeSignup';
import { useEpisode, registerEpisodeView } from '@/hooks/useStories';
import { useMetaTags } from '@/hooks/useMetaTags';
import { sanitizeStoryHtml, splitForInterlude } from '@/lib/storyContent';

export default function StoryEpisode() {
  const { storySlug, episodeNumber } = useParams<{
    storySlug: string;
    episodeNumber: string;
  }>();
  const navigate = useNavigate();

  const number = Number(episodeNumber);
  const { data, isLoading, error } = useEpisode(storySlug || '', number);

  const story = data?.story;
  const episode = data?.episode;
  const available = data?.available ?? [];

  const previous = available.filter((n) => n < number).pop();
  const next = available.find((n) => n > number);
  const isLast = !next;

  useMetaTags({
    title: story && episode ? `${story.title} — Episódio ${episode.number}` : undefined,
    description:
      episode?.excerpt ||
      episode?.cliffhanger ||
      (story ? `Episódio ${number} de ${story.title}.` : undefined),
    image: episode?.cover_url || story?.cover_url || undefined,
    url:
      storySlug && episodeNumber
        ? `https://www.olhaqueduas.com/historias/${storySlug}/${episodeNumber}`
        : undefined,
    type: 'article',
    publishedTime: episode?.published_at || undefined,
    section: story?.genre || 'Histórias',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [storySlug, episodeNumber]);

  // Uma leitura por episódio visto, não por re-render.
  const countedId = useRef<string | null>(null);
  useEffect(() => {
    if (episode && countedId.current !== episode.id) {
      countedId.current = episode.id;
      void registerEpisodeView(episode.id);
    }
  }, [episode]);

  const [firstHalf, secondHalf] = useMemo(() => {
    if (!episode) return ['', ''];
    return splitForInterlude(sanitizeStoryHtml(episode.content));
  }, [episode]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${story?.title} — Episódio ${number}`,
          text: episode?.excerpt,
          url,
        });
      } catch {
        /* partilha cancelada */
      }
    } else {
      void navigator.clipboard.writeText(url);
    }
  };

  if (isLoading) {
    return (
      <Shell>
        <div className="flex flex-col items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-vermelho mb-4" />
          <p className="text-muted-foreground">A carregar episódio…</p>
        </div>
      </Shell>
    );
  }

  if (error || !story || !episode) {
    return (
      <Shell>
        <div className="text-center py-24 max-w-md mx-auto px-4">
          <AlertCircle className="w-10 h-10 text-vermelho mx-auto mb-4" />
          <h1 className="font-display text-xl font-semibold text-foreground mb-3">
            Episódio não encontrado
          </h1>
          <p className="text-muted-foreground mb-6">
            Este episódio ainda não foi publicado, ou o endereço está errado.
          </p>
          <Button
            onClick={() => navigate(`/historias/${storySlug || ''}`)}
            className="gap-2 bg-vermelho hover:bg-vermelho/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver a história
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main" className="flex-1 pt-24 md:pt-28">
        <article className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="max-w-2xl mx-auto">
            {/* Cabeçalho */}
            <Link
              to={`/historias/${story.slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-vermelho transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {story.title}
            </Link>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-vermelho mb-3">
              Episódio {episode.number}
              {story.planned_episodes > 0 && ` de ${story.planned_episodes}`}
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-4">
              {episode.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pb-8 mb-8 border-b border-border">
              <span className="flex items-center gap-1.5 tabular-nums">
                <Clock className="w-4 h-4" />
                {episode.reading_minutes} min de leitura
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-vermelho transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Partilhar
              </button>
            </div>

            {episode.cover_url && (
              <img
                src={episode.cover_url}
                alt=""
                className="w-full rounded-2xl object-cover aspect-video mb-10"
              />
            )}

            {/* Texto — primeira parte */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-vermelho"
              dangerouslySetInnerHTML={{ __html: firstHalf }}
            />

            {/* Interlúdio: captação de email e espaço de anúncio */}
            {secondHalf && (
              <>
                <EpisodeSignup storyTitle={story.title} variant="meio" />
                <AdSlot id="episodio-meio" />
                <div
                  className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-vermelho"
                  dangerouslySetInnerHTML={{ __html: secondHalf }}
                />
              </>
            )}

            {/* Gancho */}
            {episode.cliffhanger && (
              <p className="mt-10 font-display text-xl sm:text-2xl font-semibold text-foreground leading-snug border-l-4 border-vermelho pl-5">
                {episode.cliffhanger}
              </p>
            )}

            {/* Anúncio antes da saída — o clique para o próximo passa por aqui */}
            <AdSlot id="episodio-fim" />

            {/* Navegação */}
            <nav className="mt-10 pt-8 border-t border-border grid gap-3 sm:grid-cols-2">
              {previous ? (
                <Link
                  to={`/historias/${story.slug}/${previous}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-vermelho/40 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">
                      Episódio anterior
                    </span>
                    <span className="block font-semibold text-foreground truncate">
                      Episódio {previous}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {next && (
                <Link
                  to={`/historias/${story.slug}/${next}`}
                  className="group flex items-center justify-end gap-3 p-4 rounded-xl bg-vermelho text-white hover:bg-vermelho/90 transition-colors sm:col-start-2"
                >
                  <span className="min-w-0 text-right">
                    <span className="block text-xs text-white/70">
                      A seguir
                    </span>
                    <span className="block font-semibold truncate">
                      Episódio {next}
                    </span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </nav>

            {/* Fim da linha: é aqui que o email vale mais */}
            {isLast && (
              <EpisodeSignup
                storyTitle={story.title}
                variant={story.status === 'concluida' ? 'fim' : 'aguardar'}
              />
            )}

            <div className="mt-8 text-center">
              <Button asChild variant="ghost" className="gap-2">
                <Link to={`/historias/${story.slug}`}>
                  <List className="w-4 h-4" />
                  Todos os episódios
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

/**
 * Espaço reservado para uma unidade de anúncio.
 *
 * Fica vazio e sem ocupar altura enquanto o AdSense não estiver aprovado
 * — as posições ficam decididas agora, o script entra depois sem mexer
 * nestas páginas. Ver docs/adsense.md.
 */
function AdSlot({ id }: { id: string }) {
  return <div data-ad-slot={id} className="my-8 empty:my-0" />;
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
