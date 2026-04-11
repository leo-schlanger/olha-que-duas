import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getCloudinaryUrl, getCloudinaryPlaceholder } from '@/lib/cloudinary';
import type { GalleryPhoto } from '@/types/gallery';
import { GalleryLightbox } from './GalleryLightbox';

interface PhotoGridProps {
  photos: GalleryPhoto[];
  className?: string;
}

export function PhotoGrid({ photos, className }: PhotoGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma foto neste álbum.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3',
          className
        )}
      >
        {photos.map((photo, index) => (
          <PhotoGridItem
            key={photo.cloudinary_public_id}
            photo={photo}
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      <GalleryLightbox
        photos={photos}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

interface PhotoGridItemProps {
  photo: GalleryPhoto;
  onClick: () => void;
}

function PhotoGridItem({ photo, onClick }: PhotoGridItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="relative aspect-square group overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-vermelho focus-visible:ring-offset-2"
      aria-label="Ver foto em tamanho maior"
    >
      {/* Blur placeholder */}
      <img
        key={`blur-${photo.cloudinary_public_id}`}
        src={getCloudinaryPlaceholder(photo.cloudinary_public_id, photo.version)}
        alt=""
        className={cn(
          'absolute inset-0 w-full h-full object-cover blur-lg scale-110 transition-opacity duration-300',
          isLoaded ? 'opacity-0' : 'opacity-100'
        )}
        aria-hidden="true"
      />

      {/* Main image */}
      <img
        key={`main-${photo.cloudinary_public_id}`}
        src={getCloudinaryUrl(photo.cloudinary_public_id, 'grid', photo.version)}
        alt=""
        className={cn(
          'w-full h-full object-cover transition-all duration-300',
          'group-hover:scale-105',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
