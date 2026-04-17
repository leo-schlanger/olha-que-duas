import { useEffect, useCallback, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogOverlay, DialogPortal, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getCloudinaryUrl, getCloudinaryPlaceholder } from '@/lib/cloudinary';
import type { GalleryPhoto } from '@/types/gallery';

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryLightbox({ photos, initialIndex, isOpen, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const currentPhoto = photos[currentIndex];
  const hasNext = currentIndex < photos.length - 1;
  const hasPrev = currentIndex > 0;

  // Reset index when opening with new initialIndex
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsImageLoading(true);
    }
  }, [isOpen, initialIndex]);

  const goNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
      setIsImageLoading(true);
    }
  }, [hasNext]);

  const goPrev = useCallback(() => {
    if (hasPrev) {
      setCurrentIndex(prev => prev - 1);
      setIsImageLoading(true);
    }
  }, [hasPrev]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          goNext();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goNext, goPrev, onClose]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    setTouchStart(null);
  };

  if (!currentPhoto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/95 backdrop-blur-sm" />
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogClose>

          {/* Navigation - Previous */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goPrev}
            disabled={!hasPrev}
            className={cn(
              'absolute left-2 md:left-4 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-opacity',
              !hasPrev && 'opacity-30 cursor-not-allowed'
            )}
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Button>

          {/* Navigation - Next */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goNext}
            disabled={!hasNext}
            className={cn(
              'absolute right-2 md:right-4 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-opacity',
              !hasNext && 'opacity-30 cursor-not-allowed'
            )}
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </Button>

          {/* Image container */}
          <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center">
            {/* Loading placeholder */}
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  key={`placeholder-${currentPhoto.cloudinary_public_id}`}
                  src={getCloudinaryPlaceholder(currentPhoto.cloudinary_public_id, currentPhoto.version)}
                  alt=""
                  className="w-full h-full object-contain blur-lg scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              </div>
            )}

            {/* Main image */}
            <img
              key={currentPhoto.cloudinary_public_id}
              src={getCloudinaryUrl(currentPhoto.cloudinary_public_id, 'lightbox', currentPhoto.version)}
              alt=""
              className={cn(
                'max-w-full max-h-[85vh] object-contain transition-opacity duration-300',
                isImageLoading ? 'opacity-0' : 'opacity-100'
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-6">
            <div className="container mx-auto flex items-end justify-end">
              {/* Counter */}
              <div className="flex-shrink-0">
                <span className="text-white/70 text-sm font-medium">
                  {currentIndex + 1} / {photos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
