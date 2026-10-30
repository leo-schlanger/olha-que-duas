/**
 * Vídeo de uma peça dos Especiais (reel 9:16 no media-library).
 * Partilhado pelo SPA (ExclusivoPost) e pelo middleware dos crawlers.
 */

export interface ArticleVideo {
  src: string;
  poster: string;
  durationSeconds: number | null;
}

interface VideoFields {
  video_url?: unknown;
  video_poster_url?: unknown;
  video_duration_seconds?: unknown;
  cover_url?: unknown;
}

const httpsUrl = (value: unknown): string => {
  const url = typeof value === "string" ? value.trim() : "";
  return /^https:\/\/[^\s"'<>]+$/i.test(url) ? url : "";
};

/** null when the piece has no playable https video. Poster falls back to the cover. */
export function articleVideo(post: VideoFields): ArticleVideo | null {
  const src = httpsUrl(post.video_url);
  if (!src) return null;
  const seconds = Number(post.video_duration_seconds);
  return {
    src,
    poster: httpsUrl(post.video_poster_url) || httpsUrl(post.cover_url),
    durationSeconds: Number.isInteger(seconds) && seconds > 0 ? seconds : null,
  };
}

/** ISO 8601 duration for schema.org (125 → "PT2M5S"). */
export function isoDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${seconds || (!hours && !minutes) ? `${seconds}S` : ""}`;
}

/** VideoObject for the piece's JSON-LD (Google video results). */
export function videoObjectJsonLd(
  video: ArticleVideo,
  meta: { name: string; description: string; pageUrl: string; uploadDate?: string | null; fallbackThumbnail: string },
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: meta.name,
    description: meta.description,
    thumbnailUrl: [video.poster || meta.fallbackThumbnail],
    uploadDate: meta.uploadDate || undefined,
    contentUrl: video.src,
    ...(video.durationSeconds ? { duration: isoDuration(video.durationSeconds) } : {}),
    inLanguage: "pt-PT",
    url: meta.pageUrl,
    publisher: {
      "@type": "Organization",
      name: "Olha que Duas",
      logo: { "@type": "ImageObject", url: "https://www.olhaqueduas.com/og-image.jpg" },
    },
  };
}
