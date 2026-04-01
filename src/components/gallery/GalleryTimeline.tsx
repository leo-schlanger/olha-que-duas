import { cn } from '@/lib/utils';
import { Animated } from '@/components/ui/animated';
import { GalleryAlbumCard } from './GalleryAlbumCard';
import type { GalleryAlbumsByYear } from '@/types/gallery';

interface GalleryTimelineProps {
  albumsByYear: GalleryAlbumsByYear[];
  className?: string;
}

export function GalleryTimeline({ albumsByYear, className }: GalleryTimelineProps) {
  if (albumsByYear.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Nenhum álbum disponível.</p>
      </div>
    );
  }

  let albumIndex = 0;

  return (
    <div className={cn('relative', className)}>
      {/* Vertical timeline line - desktop only */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

      {albumsByYear.map((yearGroup, yearIndex) => (
        <div key={yearGroup.year} className="relative">
          {/* Year badge */}
          <Animated animation="zoom-in" delay={yearIndex * 100}>
            <div className="relative z-10 flex justify-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-vermelho text-white font-display font-bold text-2xl shadow-lg">
                {yearGroup.year}
              </div>
            </div>
          </Animated>

          {/* Albums for this year */}
          <div className="relative space-y-8 md:space-y-0 pb-12 md:pb-16">
            {yearGroup.albums.map((album, index) => {
              const globalIndex = albumIndex++;
              const isLeft = globalIndex % 2 === 0;

              return (
                <div
                  key={album.id}
                  className={cn(
                    'relative md:flex md:items-center',
                    // Staggered positioning on desktop
                    isLeft ? 'md:justify-start' : 'md:justify-end',
                    // Spacing between items in same year
                    index > 0 && 'md:mt-8'
                  )}
                >
                  {/* Timeline dot - desktop only */}
                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-4 h-4 rounded-full bg-vermelho border-4 border-background shadow-md" />
                  </div>

                  {/* Connector line - desktop only */}
                  <div
                    className={cn(
                      'hidden md:block absolute top-1/2 h-px bg-border',
                      isLeft ? 'left-[calc(50%+8px)] right-[calc(50%-8px)] w-8' : 'right-[calc(50%+8px)] left-[calc(50%-8px)] w-8',
                      isLeft ? 'left-[calc(50%+8px)]' : 'right-[calc(50%+8px)]'
                    )}
                    style={{
                      width: '40px',
                      [isLeft ? 'right' : 'left']: 'calc(50% + 8px)',
                    }}
                  />

                  {/* Card container */}
                  <Animated
                    animation={isLeft ? 'fade-right' : 'fade-left'}
                    delay={index * 100}
                    className={cn(
                      'w-full md:w-[calc(50%-60px)]',
                      isLeft ? 'md:pr-0' : 'md:pl-0'
                    )}
                  >
                    <GalleryAlbumCard
                      album={album}
                      position={isLeft ? 'left' : 'right'}
                    />
                  </Animated>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
