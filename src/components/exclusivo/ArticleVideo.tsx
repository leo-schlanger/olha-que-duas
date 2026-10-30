import type { ArticleVideo as ArticleVideoData } from "@/lib/articleVideo";

/**
 * Reel 9:16 da peça. Mobile first: ocupa a largura no telemóvel; no desktop
 * fica centrado e limitado pela altura do ecrã, sem o encher.
 */
export function ArticleVideo({ video, title }: { video: ArticleVideoData; title: string }) {
  return (
    <figure className="mx-auto mt-8 w-[min(100%,24rem,calc(78svh*9/16))] min-w-0">
      <div className="aspect-[9/16] overflow-hidden rounded-2xl bg-[#0a0c11] shadow-lg">
        <video
          className="h-full w-full object-contain"
          src={video.src}
          poster={video.poster || undefined}
          controls
          playsInline
          preload="none"
          aria-label={`Vídeo: ${title}`}
        >
          <a href={video.src}>Ver o vídeo</a>
        </video>
      </div>
    </figure>
  );
}
