/**
 * Helpers de YouTube partilhados entre o componente que embebe o vídeo e o
 * JSON-LD que descreve esse mesmo vídeo aos motores de busca. Viviam dentro
 * do VideoSection; passaram para aqui quando a página do álbum passou a
 * precisar do id para montar o VideoObject — o id tem de ser extraído da
 * mesma forma nos dois sítios, senão o schema aponta para um vídeo e o
 * iframe mostra outro.
 */

/** Formatos aceites: youtu.be/ID, watch?v=ID, /embed/ID, /shorts/ID. */
export function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Miniatura do vídeo. `hqdefault` em vez de `maxresdefault` porque existe
 * sempre — o maxres só é gerado para vídeos acima de 720p e devolve 404 nos
 * restantes, o que dá uma miniatura partida no resultado de pesquisa.
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/** Embed sem cookies — o mesmo domínio que o iframe usa e que a CSP permite. */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

/** URL canónico da página do vídeo, para o `url` do VideoObject. */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
