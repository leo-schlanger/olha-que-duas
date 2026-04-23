import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { MapPin, Camera, Calendar, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getCloudinaryUrl, getCloudinaryPlaceholder } from '@/lib/cloudinary';
import type { GalleryAlbum } from '@/types/gallery';

interface GalleryAlbumCardProps {
  album: GalleryAlbum;
  className?: string;
}

export function GalleryAlbumCard({ album, className }: GalleryAlbumCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const eventDate = new Date(album.event_date);
  const formattedDate = format(eventDate, "d 'de' MMMM 'de' yyyy", { locale: pt });
  const coverImageId = album.cover_photo?.cloudinary_public_id;
  const coverVersion = album.cover_photo?.version;

  return (
    <Link
      to={`/galeria/${album.slug}`}
      className={cn(
        'group block',
        className
      )}
    >
      <div
        className={cn(
          'relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg transition-all duration-300',
          'hover:shadow-xl hover:border-vermelho/30 hover:-translate-y-1'
        )}
      >
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          {coverImageId ? (
            <>
              {/* Blur placeholder */}
              <img
                src={getCloudinaryPlaceholder(coverImageId, coverVersion)}
                alt=""
                className={cn(
                  'absolute inset-0 w-full h-full object-cover blur-lg scale-110 transition-opacity duration-300',
                  isImageLoaded ? 'opacity-0' : 'opacity-100'
                )}
                aria-hidden="true"
              />

              {/* Main image */}
              <img
                src={getCloudinaryUrl(coverImageId, 'thumbnail', coverVersion)}
                alt={album.title}
                className={cn(
                  'w-full h-full object-cover transition-transform duration-500',
                  'group-hover:scale-105',
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-charcoal via-charcoal/90 to-charcoal flex items-center justify-center">
              <Camera className="w-12 h-12 text-cream/30" />
            </div>
          )}

          {/* Photo count badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {!!album.video_count && (
              <Badge className="bg-vermelho/90 backdrop-blur-sm text-white border-0 shadow-lg">
                <Play className="w-3 h-3 mr-1" />
                {album.video_count}
              </Badge>
            )}
            <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 shadow-lg">
              <Camera className="w-3 h-3 mr-1" />
              {album.photo_count} fotos
            </Badge>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          {/* Title */}
          <h3 className="font-display font-bold text-foreground text-lg md:text-xl mb-2 line-clamp-2 group-hover:text-vermelho transition-colors">
            {album.title}
          </h3>

          {/* Description */}
          {album.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {album.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            {album.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{album.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
