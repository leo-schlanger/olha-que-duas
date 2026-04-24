import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
  Share2,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { PhotoGrid, VideoSection } from '@/components/gallery';
import { useGalleryAlbum } from '@/hooks/useGallery';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function GalleryAlbum() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: album, isLoading, error } = useGalleryAlbum(slug || '');

  // Cover photo is the first photo in the album
  const coverPhoto = album?.photos[0];
  const coverImageUrl = coverPhoto
    ? getCloudinaryUrl(coverPhoto.cloudinary_public_id, 'og', coverPhoto.version)
    : undefined;

  // SEO Meta Tags
  useMetaTags({
    title: album?.title || 'Álbum',
    description: album?.description || `Galeria de fotos: ${album?.title}. Veja ${album?.photo_count || 0} fotos deste momento especial.`,
    image: coverImageUrl,
    url: `https://www.olhaqueduas.com/galeria/${slug}`,
    jsonLd: album ? [
      getPageBreadcrumbJsonLd(
        album.title,
        `https://www.olhaqueduas.com/galeria/${slug}`,
        [{ name: 'Galeria', url: 'https://www.olhaqueduas.com/galeria' }]
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: album.title,
        description: album.description,
        datePublished: album.published_at,
        dateCreated: album.event_date,
        numberOfItems: album.photo_count,
        ...(album.location && { contentLocation: { '@type': 'Place', name: album.location } }),
      },
    ] : undefined,
  });

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: album?.title,
          text: album?.description || `Galeria de fotos: ${album?.title}`,
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
              Galeria não configurada
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
            <p className="text-muted-foreground">A carregar álbum...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 md:pt-40 flex items-center justify-center">
          <Animated animation="fade-up" className="text-center py-16 max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground mb-3">
              Álbum não encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              O álbum que procura não existe ou foi removido.
            </p>
            <Button
              onClick={() => navigate('/galeria')}
              className="gap-2 bg-vermelho hover:bg-vermelho/90"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver toda a galeria
            </Button>
          </Animated>
        </main>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(album.event_date);
  const formattedDate = format(eventDate, "d 'de' MMMM 'de' yyyy", { locale: pt });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 md:pt-28">
        {/* Hero with Cover Image */}
        <section className="relative h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
          {coverPhoto ? (
            <img
              src={getCloudinaryUrl(coverPhoto.cloudinary_public_id, 'hero', coverPhoto.version)}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal flex items-center justify-center">
              <Camera className="w-24 h-24 text-cream/30" />
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
                  <Badge className="bg-vermelho text-white shadow-lg">
                    <Camera className="w-3 h-3 mr-1" />
                    {album.photo_count} fotos
                  </Badge>
                  {album.location && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {album.location}
                    </Badge>
                  )}
                </Animated>

                {/* Title */}
                <Animated animation="fade-up" delay={100}>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
                    {album.title}
                  </h1>
                </Animated>

                {/* Description */}
                {album.description && (
                  <Animated animation="fade-up" delay={200}>
                    <p className="text-base md:text-lg text-white/80 max-w-3xl leading-relaxed">
                      {album.description}
                    </p>
                  </Animated>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Album Content */}
        <section className="container mx-auto px-4 sm:px-6 py-10 md:py-14">
          {/* Back Button & Meta */}
          <Animated animation="fade-up">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border/50">
              <Link to="/galeria">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-primary/5 hover:text-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar à galeria
                </Button>
              </Link>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </div>
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

          {/* Videos (before photos) */}
          {album.videos.length > 0 && (
            <Animated animation="fade-up" delay={100}>
              <VideoSection videos={album.videos} className="mb-8" />
            </Animated>
          )}

          {/* Photo Grid */}
          <Animated animation="fade-up" delay={album.videos.length > 0 ? 200 : 100}>
            <PhotoGrid photos={album.photos} />
          </Animated>

          {/* Empty state */}
          {album.photos.length === 0 && (
            <Animated animation="fade-up" className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                Nenhuma foto disponível
              </h3>
              <p className="text-muted-foreground">
                As fotos deste álbum ainda não foram carregadas.
              </p>
            </Animated>
          )}

          {/* CTA */}
          <Animated animation="fade-up" delay={200}>
            <div className="mt-12 text-center">
              <Link to="/galeria">
                <Button
                  size="lg"
                  className="bg-vermelho hover:bg-vermelho/90 text-white rounded-xl h-12 px-8 btn-shine"
                >
                  Ver mais álbuns
                </Button>
              </Link>
            </div>
          </Animated>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
