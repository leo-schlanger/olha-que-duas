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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/blog';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useBlogPost(slug || '');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex flex-col bg-beige-light">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              Blog não configurado
            </h3>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-beige-light">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-vermelho" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-beige-light">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              Notícia não encontrada
            </h3>
            <p className="text-muted-foreground mb-6">
              A notícia que procura não existe ou foi removida.
            </p>
            <Button onClick={() => navigate('/noticias')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Ver todas as notícias
            </Button>
          </div>
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

  return (
    <div className="min-h-screen flex flex-col bg-beige-light">
      <Header />

      <main className="flex-1">
        {/* Hero with Image */}
        {post.image_url && (
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
          </div>
        )}

        {/* Article Content */}
        <article className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Link to="/noticias" className="inline-block mb-6">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar às notícias
              </Button>
            </Link>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${categoryColor} text-white`}>
                {categoryLabel}
              </Badge>
              {post.region && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.region}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-charcoal mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Summary */}
            {post.summary && (
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {post.summary}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 mb-6 border-b border-beige-medium">
              {publishedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {publishedDate}
                </div>
              )}
              <a
                href={post.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-vermelho transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Fonte: {post.source_name}
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-1 ml-auto"
              >
                <Share2 className="w-4 h-4" />
                Partilhar
              </Button>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-charcoal/90 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-beige-medium">
                <h3 className="text-sm font-semibold text-charcoal mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Source Attribution */}
            <div className="mt-8 p-4 bg-beige-warm rounded-lg">
              <p className="text-sm text-muted-foreground">
                Esta notícia foi originalmente publicada em{' '}
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vermelho hover:underline"
                >
                  {post.source_name}
                </a>
                . O conteúdo foi reescrito para fins informativos.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
