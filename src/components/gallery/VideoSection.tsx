import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getYouTubeId, getYouTubeEmbedUrl } from '@/lib/youtube';
import type { GalleryVideo } from '@/types/gallery';

interface VideoSectionProps {
  videos: GalleryVideo[];
  className?: string;
}

export function VideoSection({ videos, className }: VideoSectionProps) {
  if (videos.length === 0) return null;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Section header */}
      <div className="flex items-center gap-2 text-foreground">
        <Play className="w-5 h-5 text-vermelho" />
        <h2 className="text-lg font-display font-semibold">
          {videos.length === 1 ? 'Vídeo' : 'Vídeos'}
        </h2>
      </div>

      {/* Video grid */}
      <div
        className={cn(
          'grid gap-4',
          videos.length === 1 ? 'grid-cols-1 max-w-3xl' : 'grid-cols-1 md:grid-cols-2'
        )}
      >
        {videos.map((video) => {
          const videoId = getYouTubeId(video.youtube_url);
          if (!videoId) return null;

          return (
            <div key={video.id} className="space-y-2">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 border border-border/50">
                <iframe
                  src={getYouTubeEmbedUrl(videoId)}
                  title={video.title || 'Vídeo do evento'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
              {video.title && (
                <p className="text-sm font-medium text-foreground">{video.title}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
