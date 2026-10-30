import { useState } from "react";
import { Play } from "lucide-react";
import type { ArticleVideo as ArticleVideoData } from "@/lib/articleVideo";

/**
 * Reel 9:16 da peça. Mobile first: ocupa a largura no telemóvel; no desktop
 * fica centrado e limitado pela altura do ecrã, sem o encher.
 * YouTube: miniatura clicável e só depois o iframe (nada do YouTube carrega antes do clique).
 */
export function ArticleVideo({ video, title }: { video: ArticleVideoData; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="mx-auto mt-8 w-[min(100%,24rem,calc(78svh*9/16))] min-w-0">
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-[#0a0c11] shadow-lg">
        {video.kind === "mp4" ? (
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
        ) : playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`${video.embedUrl}?autoplay=1&playsinline=1&rel=0`}
            title={`Vídeo: ${title}`}
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Ver o vídeo: ${title}`}
            className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
          >
            {video.poster ? (
              <img src={video.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : null}
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-transform duration-200 group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-current" aria-hidden />
            </span>
          </button>
        )}
      </div>
    </figure>
  );
}
