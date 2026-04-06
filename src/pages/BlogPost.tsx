import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ExternalLink,
  Share2,
  Loader2,
  AlertCircle,
  Newspaper,
  Clock,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { useMetaTags, getBlogPostMetaConfig } from '@/hooks/useMetaTags';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/blog';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useBlogPost(slug || '');

  // Atualiza meta tags para SEO e compartilhamento
  const metaConfig = post ? getBlogPostMetaConfig(post) : {};
  useMetaTags(metaConfig);

  // Scroll para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.summary,
          url: window.location.href,
        });
      } catch {
        // Share cancelled by user
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 md:pt-40 flex items-center justify-center">
          <Animated animation="fade-up" className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">
              Blog não configurado
            </h3>
          </Animated>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 md:pt-40 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-vermelho/10 flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-vermelho" />
            </div>
            <p className="text-muted-foreground">A carregar notícia...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 md:pt-40 flex items-center justify-center">
          <Animated animation="fade-up" className="text-center py-16 max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground mb-3">
              Notícia não encontrada
            </h3>
            <p className="text-muted-foreground mb-6">
              A notícia que procura não existe ou foi removida.
            </p>
            <Button
              onClick={() => navigate('/noticias')}
              className="gap-2 bg-vermelho hover:bg-vermelho/90"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todas as notícias
            </Button>
          </Animated>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[post.category] || post.category;
  const categoryColor = CATEGORY_COLORS[post.category] || 'bg-gray-500';
  const publishedDate = post.published_at
    ? format(new Date(post.published_at), "d 'de' MMMM 'de' yyyy, 'às' HH:mm", {
        locale: pt,
      })
    : null;

  const tags = post.tags ? JSON.parse(post.tags) : [];

  // Estimate reading time (200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 md:pt-28">
        {/* Hero with Image */}
        <section className="relative h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden">
          {post.image_url ? (
            <>
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.parentElement?.querySelector('.image-placeholder');
                  if (placeholder) {
                    (placeholder as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              <div className="image-placeholder hidden w-full h-full bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal items-center justify-center absolute inset-0">
                <Newspaper className="w-24 h-24 text-cream/30" />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal flex items-center justify-center">
              <Newspaper className="w-24 h-24 text-cream/30" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

          {/* Content over image */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 sm:px-6 pb-10 md:pb-14">
              <div className="max-w-4xl">
                {/* Meta badges */}
                <Animated animation="fade-up" className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className={`${categoryColor} text-white shadow-lg`}>
                    {categoryLabel}
                  </Badge>
                  {post.region && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {post.region}
                    </Badge>
                  )}
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readingTime} min de leitura
                  </Badge>
                </Animated>

                {/* Title */}
                <Animated animation="fade-up" delay={100}>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
                    {post.title}
                  </h1>
                </Animated>

                {/* Summary */}
                {post.summary && (
                  <Animated animation="fade-up" delay={200}>
                    <p className="text-base md:text-lg text-white/80 max-w-3xl leading-relaxed">
                      {post.summary}
                    </p>
                  </Animated>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="container mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            {/* Back Button & Meta */}
            <Animated animation="fade-up">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border/50">
                <Link to="/noticias">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-primary/5 hover:text-primary"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar às notícias
                  </Button>
                </Link>

                <div className="flex items-center gap-4">
                  {publishedDate && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {publishedDate}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2 rounded-xl hover:bg-primary/5 hover:border-primary/30"
                  >
                    <Share2 className="w-4 h-4" />
                    Partilhar
                  </Button>
                </div>
              </div>
            </Animated>

            {/* Content */}
            <Animated animation="fade-up" delay={100}>
              <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Animated>

            {/* Tags */}
            {tags.length > 0 && (
              <Animated animation="fade-up" delay={200}>
                <div className="mt-10 pt-8 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Tags:</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Animated>
            )}

            {/* Source Attribution */}
            <Animated animation="fade-up" delay={300}>
              <div className="mt-10 p-6 bg-muted/50 rounded-2xl border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Fonte original</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Esta notícia foi originalmente publicada em{' '}
                      <strong className="text-foreground">{post.source_name}</strong>.
                      O conteúdo foi reescrito para fins informativos.
                    </p>
                    <a
                      href={post.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Ver artigo original
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </Animated>

            {/* Related / CTA */}
            <Animated animation="fade-up" delay={400}>
              <div className="mt-10 text-center">
                <Link to="/noticias">
                  <Button
                    size="lg"
                    className="bg-vermelho hover:bg-vermelho/90 text-white rounded-xl h-12 px-8 btn-shine"
                  >
                    Ver mais notícias
                  </Button>
                </Link>
              </div>
            </Animated>
          </div>
        </article>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
