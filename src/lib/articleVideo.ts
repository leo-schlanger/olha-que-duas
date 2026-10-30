/**
 * Vídeo de uma peça dos Especiais (reel 9:16): YouTube (embed youtube-nocookie)
 * ou MP4 https. Partilhado pelo SPA (ExclusivoPost) e pelo middleware dos crawlers.
 */
import { getYouTubeEmbedUrl, getYouTubeId, getYouTubeThumbnail, getYouTubeWatchUrl } from "./youtube";

export interface ArticleVideo {
  kind: "youtube" | "mp4";
  /** MP4 file, or the YouTube watch URL. */
  src: string;
  /** youtube-nocookie embed; empty for MP4. */
  embedUrl: string;
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

const YOUTUBE_HOST = /^https:\/\/(www\.|m\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)\//i;

/**
 * null when the piece has no playable https video.
 * Poster: video_poster_url, else the YouTube thumbnail (YouTube) or the cover (MP4).
 */
export function articleVideo(post: VideoFields): ArticleVideo | null {
  const url = httpsUrl(post.video_url);
  if (!url) return null;
  const seconds = Number(post.video_duration_seconds);
  const durationSeconds = Number.isInteger(seconds) && seconds > 0 ? seconds : null;
  const ownPoster = httpsUrl(post.video_poster_url);
  if (YOUTUBE_HOST.test(url)) {
    const id = getYouTubeId(url);
    if (!id) return null;
    return {
      kind: "youtube",
      src: getYouTubeWatchUrl(id),
      embedUrl: getYouTubeEmbedUrl(id),
      poster: ownPoster || getYouTubeThumbnail(id),
      durationSeconds,
    };
  }
  return { kind: "mp4", src: url, embedUrl: "", poster: ownPoster || httpsUrl(post.cover_url), durationSeconds };
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
    ...(video.kind === "youtube" ? { embedUrl: video.embedUrl } : { contentUrl: video.src }),
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
