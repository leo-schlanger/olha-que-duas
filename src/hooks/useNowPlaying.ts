import { useState, useEffect, useCallback, useRef, type RefObject } from "react";

export interface NowPlayingSong {
  title: string;
  artist: string;
  album: string;
  art: string;
}

export interface NowPlayingState {
  song: NowPlayingSong | null;
  isMusic: boolean;
  isLiveShow: boolean;
  liveShowName: string;
  isPodcast: boolean;
  podcastName: string;
  podcastArt: string;
  isAnnouncement: boolean;
  announcementName: string;
  announcementArt: string;
  loading: boolean;
}

// Forma de uma entrada now_playing / song_history vinda da API AzuraCast
export interface AzuraEntry {
  played_at?: number;
  duration?: number;
  elapsed?: number;
  remaining?: number;
  playlist?: string;
  song?: {
    title?: string;
    artist?: string;
    album?: string;
    art?: string;
  };
}

export interface AzuraResponse {
  now_playing?: AzuraEntry;
  song_history?: AzuraEntry[];
  live?: { is_live?: boolean; streamer_name?: string };
}

// Padrões que indicam jingles/interrupções
const JINGLE_PATTERNS = [
  /^jingle/i, /^vinheta/i, /^id\s/i, /^spot/i, /^promo/i,
  /^interrup/i, /^bumper/i, /^sweeper/i, /^liner/i,
  /^station\s?id/i, /^hora\s?certa/i, /^cortina/i,
];

const JINGLE_PLAYLISTS = [
  /jingle/i, /vinheta/i, /interrup/i, /spot/i, /promo/i,
];

const MIN_SONG_DURATION = 60;

// Polling activo (utilizador a ouvir) vs passivo (página aberta sem play).
// Activo a 3s: trade-off entre carga na API e tempo até detectar transição.
// AzuraCast publica o now_playing com ~1-3s de delay próprio, então 3s é
// o sweet spot prático.
const POLL_INTERVAL_ACTIVE = 3000;
const POLL_INTERVAL_PASSIVE = 15_000;

// Chave de localStorage para override manual do buffer estimado. Permite
// calibração ao vivo sem deploy: `localStorage.setItem('radio.bufferSec','3')`
const LS_BUFFER_OVERRIDE_KEY = "radio.bufferSec";

/**
 * Lê override de buffer do localStorage. Devolve `null` se não definido,
 * inválido, ou em ambiente sem `localStorage` (SSR/sandbox).
 */
export function readBufferOverride(): number | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(LS_BUFFER_OVERRIDE_KEY);
    if (raw === null) return null;
    const num = Number(raw);
    if (!Number.isFinite(num) || num < 0 || num > 30) return null;
    return num;
  } catch {
    return null;
  }
}

// Backoff exponencial após falhas de fetch — cap em 30s para não
// drenar bateria em mobile quando a rede está persistentemente offline.
const FETCH_BACKOFF_MS = [2_000, 4_000, 8_000, 15_000, 30_000];

// Buffer base estimado quando não conseguimos medir do `<audio>`. Esta
// constante representa o delay TOTAL do ouvinte: burst icecast (~3s @
// 192kbps) + decoder buffer do browser (~1-2s) + RTT (~0.3s). Não somar
// nada por cima — é a estimativa completa quando não há leitura real.
const DEFAULT_LISTENER_BUFFER_SECONDS = 5;

// Burst extra ao iniciar — só usado COMO COMPLEMENTO quando temos leitura
// real de `audio.buffered`, que sub-conta o burst (mede só o que está
// pré-carregado mas não consumido). Sem leitura real, o default já cobre
// tudo. Decay agressivo (15s) — o burst esvazia rápido na realidade.
const BURST_COMPENSATION_SECONDS = 3;
const BURST_DECAY_MS = 15_000;

// Playlists de música seguem padrões — outras coisas com metadados sem música
// válida são tratadas como podcast
const MUSIC_PLAYLIST_PATTERNS = [
  /mix/i, /rotation/i, /playlist/i, /morning/i, /afternoon/i,
  /sunset/i, /night/i, /madrugada/i, /noite/i, /tarde/i,
  /manh[ãa]/i, /top\s?\d/i, /hits/i, /chill/i, /lounge/i,
  /general/i, /default/i, /shuffle/i,
];

// Playlists de anúncios/conteúdo especial: devem mostrar artwork próprio
// mesmo quando a faixa é curta (< MIN_SONG_DURATION). Crucial para spots
// promocionais de eventos, patrocínios e avisos onde importa o retrato.
const ANNOUNCEMENT_PLAYLIST_PATTERNS = [
  /an[uú]ncio/i, /especial/i, /destaque/i, /aviso/i, /evento/i,
];

// Quanto tempo manter o estado anterior (música/podcast/anúncio) visível
// durante uma lacuna na API. 0 = não segurar — durante vinhetas/transições
// cai para neutro (logo). Antes seguramos para evitar piscar entre faixas,
// mas combinado com o delay próprio do AzuraCast a publicar now_playing,
// isto contribuía para o efeito de "capa atrasada por 10-15s".
const HOLD_PREVIOUS_ON_GAP_SECONDS = 0;

// Smoothing do offset estimado entre relógio servidor↔cliente. Sem isto,
// jitter de rede oscila o offset entre polls (5s) e pode empurrar a UI
// para trás/frente em torno das transições.
const SERVER_OFFSET_EMA_ALPHA = 0.3;
const SERVER_OFFSET_MIN_DELTA_SEC = 0.5;

// Quando faltam menos do que este valor para o fim da faixa actual,
// fazemos um "warmup" da API sem actualizar o estado — garante que o
// próximo fetch de transição responde rápido (cache TCP/DNS quente).
const PREFETCH_WARMUP_SECONDS = 5;

const INITIAL_STATE: NowPlayingState = {
  song: null,
  isMusic: false,
  isLiveShow: false,
  liveShowName: "",
  isPodcast: false,
  podcastName: "",
  podcastArt: "",
  isAnnouncement: false,
  announcementName: "",
  announcementArt: "",
  loading: true,
};

const NEUTRAL_STATE: NowPlayingState = { ...INITIAL_STATE, loading: false };

/**
 * Categoria do que está a ser ouvido — discriminated union. Permite separar
 * a decisão (`pickCategory`) do efeito (`buildState`/setState) e testar a
 * lógica isolada.
 */
export type NowPlayingCategory =
  | { kind: "live"; name: string }
  | { kind: "gap" }
  | { kind: "music"; song: NowPlayingSong; audible: AzuraEntry }
  | { kind: "podcast"; name: string; art: string; audible: AzuraEntry }
  | { kind: "announcement"; name: string; art: string; audible: AzuraEntry }
  | { kind: "jingle"; audible: AzuraEntry };

/**
 * Compara dois estados do now-playing campo a campo. Permite saltar setState
 * quando o resultado do poll é idêntico ao actual — evita re-render do
 * RadioPlayer (e do schedule inteiro) a cada 5s mesmo quando nada mudou.
 */
export function statesEqual(a: NowPlayingState, b: NowPlayingState): boolean {
  if (a.loading !== b.loading) return false;
  if (a.isMusic !== b.isMusic) return false;
  if (a.isLiveShow !== b.isLiveShow) return false;
  if (a.isPodcast !== b.isPodcast) return false;
  if (a.isAnnouncement !== b.isAnnouncement) return false;
  if (a.liveShowName !== b.liveShowName) return false;
  if (a.podcastName !== b.podcastName) return false;
  if (a.podcastArt !== b.podcastArt) return false;
  if (a.announcementName !== b.announcementName) return false;
  if (a.announcementArt !== b.announcementArt) return false;
  if (a.song === b.song) return true;
  if (!a.song || !b.song) return false;
  return (
    a.song.title === b.song.title &&
    a.song.artist === b.song.artist &&
    a.song.album === b.song.album &&
    a.song.art === b.song.art
  );
}

export function isValidSong(data: {
  title?: string;
  artist?: string;
  playlist?: string;
  duration?: number;
}): boolean {
  const { title, artist, playlist, duration } = data;

  if (!title || title.trim() === "") return false;
  if (!artist || artist.trim() === "" || artist.toLowerCase() === "unknown") return false;
  if (duration && duration < MIN_SONG_DURATION) return false;
  if (JINGLE_PATTERNS.some((p) => p.test(title!))) return false;
  if (JINGLE_PATTERNS.some((p) => p.test(artist!))) return false;
  if (playlist && JINGLE_PLAYLISTS.some((p) => p.test(playlist))) return false;

  return true;
}

/**
 * Devolve a entrada que o ouvinte está realmente a ouvir agora, dado o
 * buffer de stream estimado. A API AzuraCast diz "o que o servidor está a
 * transmitir AGORA", mas o ouvinte ouve com vários segundos de atraso.
 *
 * Importante: o `song_history` do AzuraCast NÃO inclui vinhetas/jingles —
 * só músicas. Entre duas faixas há sempre uma "lacuna" de 5-15s onde tocou
 * uma vinheta que não está nos dados. Quando o ouvinte está nessa lacuna,
 * devolvemos `undefined` para a UI cair no estado neutro (logo) — em vez de
 * mostrar a capa errada da próxima música prematuramente.
 */
export function pickAudibleEntry(
  nowPlaying: AzuraEntry | undefined,
  history: AzuraEntry[],
  listenerWallClockSec: number,
): AzuraEntry | undefined {
  if (!nowPlaying) return undefined;

  // Lista por ordem cronológica decrescente: mais recente primeiro
  const candidates: AzuraEntry[] = [nowPlaying, ...history];

  for (const entry of candidates) {
    const playedAt = entry.played_at;
    const duration = entry.duration;
    if (typeof playedAt !== "number" || typeof duration !== "number" || duration <= 0) continue;
    if (playedAt <= listenerWallClockSec && listenerWallClockSec < playedAt + duration) {
      return entry;
    }
  }

  // Sem match: o ouvinte está numa lacuna entre faixas conhecidas
  return undefined;
}

/**
 * Decide a categoria a partir da resposta + offset do ouvinte. Função pura
 * — toda a lógica de classificação testável em isolamento.
 */
export function pickCategory(
  response: AzuraResponse,
  listenerWallClockSec: number,
): NowPlayingCategory {
  // 1. Programa ao vivo — prioridade absoluta
  if (response.live?.is_live) {
    return { kind: "live", name: response.live.streamer_name || "Programa ao Vivo" };
  }

  const history = Array.isArray(response.song_history) ? response.song_history : [];
  const audible = pickAudibleEntry(response.now_playing, history, listenerWallClockSec);

  if (!audible?.song) return { kind: "gap" };

  const songData = {
    title: audible.song.title || "",
    artist: audible.song.artist || "",
    playlist: audible.playlist || "",
    duration: audible.duration || 0,
  };

  if (isValidSong(songData)) {
    return {
      kind: "music",
      audible,
      song: {
        title: songData.title,
        artist: songData.artist,
        album: audible.song.album || "",
        art: audible.song.art || "",
      },
    };
  }

  const playlistName = songData.playlist;
  const isMusicPlaylist = !playlistName || MUSIC_PLAYLIST_PATTERNS.some((p) => p.test(playlistName));
  const isLongContent = songData.duration >= MIN_SONG_DURATION;
  const isJingle = JINGLE_PATTERNS.some((p) => p.test(songData.title)) || JINGLE_PATTERNS.some((p) => p.test(songData.artist));
  const isAnnouncementPlaylist = !!playlistName && ANNOUNCEMENT_PLAYLIST_PATTERNS.some((p) => p.test(playlistName));

  if (!isMusicPlaylist && !isJingle && isLongContent) {
    return {
      kind: "podcast",
      audible,
      name: playlistName,
      art: audible.song.art || "",
    };
  }

  if (isAnnouncementPlaylist && !isJingle) {
    return {
      kind: "announcement",
      audible,
      name: songData.title || playlistName,
      art: audible.song.art || "",
    };
  }

  return { kind: "jingle", audible };
}

/**
 * Constrói o `NowPlayingState` final a partir da categoria. Função pura.
 */
export function buildState(category: NowPlayingCategory): NowPlayingState {
  switch (category.kind) {
    case "live":
      return { ...NEUTRAL_STATE, isLiveShow: true, liveShowName: category.name };
    case "music":
      return { ...NEUTRAL_STATE, isMusic: true, song: category.song };
    case "podcast":
      return { ...NEUTRAL_STATE, isPodcast: true, podcastName: category.name, podcastArt: category.art };
    case "announcement":
      return { ...NEUTRAL_STATE, isAnnouncement: true, announcementName: category.name, announcementArt: category.art };
    case "gap":
    case "jingle":
      return NEUTRAL_STATE;
  }
}

/**
 * Estima o offset entre o relógio do servidor AzuraCast e o relógio local
 * a partir do `now_playing.played_at + elapsed` (= "wall clock" do servidor
 * agora). Útil quando o relógio do cliente está dessincronizado.
 *
 * Devolve segundos a SOMAR ao `Date.now()` local para obter o tempo do
 * servidor. `null` quando não há dados confiáveis (vs 0, que é um valor
 * legítimo). Permite ao caller decidir se mantém o offset anterior em vez
 * de saltar para 0.
 */
export function estimateServerOffsetSeconds(response: AzuraResponse): number | null {
  const np = response.now_playing;
  if (!np || typeof np.played_at !== "number" || typeof np.elapsed !== "number") return null;
  const serverNow = np.played_at + np.elapsed;
  const clientNow = Date.now() / 1000;
  const offset = serverNow - clientNow;
  // Sanity check — offsets > 1h são quase certamente erro
  if (Math.abs(offset) > 3600) return null;
  return offset;
}

/**
 * Smoothing EMA do offset servidor↔cliente para evitar oscilação por
 * jitter de rede. Pequenos deltas (< 0.5s) são ignorados — a maior fonte
 * de "saltos" da UI nas transições é o offset a balançar entre polls.
 *
 * @param current valor actual mantido em ref
 * @param sample novo sample (resultado de estimateServerOffsetSeconds)
 * @param alpha factor EMA (0-1). Maior = mais peso ao novo sample.
 * @param minDelta deltas absolutos abaixo deste valor são ignorados.
 */
export function smoothServerOffset(
  current: number,
  sample: number | null,
  alpha: number = SERVER_OFFSET_EMA_ALPHA,
  minDelta: number = SERVER_OFFSET_MIN_DELTA_SEC,
): number {
  if (sample === null) return current;
  if (Math.abs(sample - current) < minDelta) return current;
  return current + alpha * (sample - current);
}

/**
 * Lê o buffer real do `<audio>` element, em segundos à frente do
 * `currentTime`. Para livestreams o `currentTime` cresce continuamente
 * a partir do start; o buffer indica quanto está pré-carregado adiante.
 * Se não disponível, devolve null.
 */
export function readAudioBufferAhead(audio: HTMLAudioElement | null | undefined): number | null {
  if (!audio) return null;
  const buffered = audio.buffered;
  if (!buffered || buffered.length === 0) return null;
  try {
    const lastEnd = buffered.end(buffered.length - 1);
    const currentTime = audio.currentTime;
    const ahead = lastEnd - currentTime;
    if (!Number.isFinite(ahead) || ahead < 0) return null;
    return ahead;
  } catch {
    return null;
  }
}

interface UseNowPlayingOptions {
  /** Ref para o `<audio>` — usada para ler buffer real do browser. */
  audioRef?: RefObject<HTMLAudioElement | null>;
  /**
   * Ref para epoch (ms) do último `playing` event do <audio>. Ref em vez
   * de prop para evitar re-render do RadioPlayer em cada playing event
   * (que pode disparar várias vezes durante buffering reentrante).
   */
  playingStartedAtRef?: RefObject<number | null>;
}

/**
 * Snapshot lido pelo `<RadioDebugOverlay>` quando `?debug=radio`. Toda a
 * informação útil para diagnosticar atrasos na sincronização áudio↔imagem.
 * Refrescado a cada fetch com sucesso.
 */
export interface DebugSnapshot {
  /** Wall clock do servidor estimado (epoch s) */
  serverNow: number;
  /** Posição efectiva do ouvinte (epoch s) */
  listenerWallClock: number;
  /** Buffer total estimado (segundos) */
  bufferEst: number;
  /** Offset servidor↔cliente após smoothing (segundos) */
  serverOffsetSec: number;
  /** Origem do buffer: 'override' | 'real' | 'default' */
  bufferSource: "override" | "real" | "default";
  /** Buffer real lido do `<audio>.buffered`, se disponível */
  bufferReal: number | null;
  /** Categoria classificada nesta iteração */
  category: NowPlayingCategory["kind"];
  /** Título da faixa audível, se aplicável */
  audibleTitle: string | null;
  /** played_at da faixa audível, se aplicável */
  audiblePlayedAt: number | null;
  /** Segundos até o ouvinte transicionar (negativo = passado) */
  secondsUntilTransition: number | null;
  /** Detectou mudança de played_at face ao último fetch? */
  serverTransition: boolean;
  /** Timestamp do snapshot */
  timestamp: number;
}

/**
 * Compara `now_playing.played_at` actual com o último visto. Se mudou,
 * o servidor passou para uma faixa nova — sinal de que devemos forçar
 * transição na UI mesmo que o `listenerWallClock` ainda aponte para a
 * janela da faixa anterior. Compensa o delay próprio do AzuraCast
 * a publicar o `now_playing` (~1-3s).
 */
export function detectServerTransition(
  current: number | null | undefined,
  previous: number | null,
): boolean {
  if (typeof current !== "number") return false;
  if (previous === null) return false;
  return current !== previous;
}

/**
 * Identidade de uma faixa para comparação entre fetches. Usa título +
 * artista — `played_at` por si só pode falhar se o AzuraCast republica
 * a mesma faixa com timestamp ligeiramente diferente, ou se a faixa
 * actual é actualizada antes do `played_at` (acontece em alguns setups).
 */
export function trackKey(entry: AzuraEntry | undefined): string | null {
  if (!entry?.song) return null;
  const t = entry.song.title?.trim() ?? "";
  const a = entry.song.artist?.trim() ?? "";
  if (!t && !a) return null;
  return `${t}|${a}`;
}

/**
 * Decide se devemos antecipar a transição na UI (mostrar a nova faixa
 * imediatamente, ignorando o buffer do ouvinte) com base na categoria e
 * duração da nova faixa.
 *
 * SIM para conteúdo longo (música, podcast, live) — capa antecipa em
 * ~5s mas depois fica certa por minutos. Trade-off bom.
 *
 * NÃO para anúncios curtos e jingles — antecipar 5s numa faixa de 15s
 * deixaria a UI errada em ~30% da duração. Melhor esperar pelo ouvinte.
 */
export function shouldAnticipateTransition(category: NowPlayingCategory): boolean {
  switch (category.kind) {
    case "live":
      return true;
    case "music":
      return (category.audible.duration ?? 0) >= 60;
    case "podcast":
      return (category.audible.duration ?? 0) >= 60;
    case "announcement":
    case "jingle":
    case "gap":
      return false;
  }
}

export function useNowPlaying(
  streamUrl: string | undefined,
  isPlaying: boolean = true,
  options: UseNowPlayingOptions = {},
) {
  const { audioRef, playingStartedAtRef } = options;
  const [state, setState] = useState<NowPlayingState>(INITIAL_STATE);

  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextFetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchRef = useRef<() => void>(() => {});
  const failureCountRef = useRef(0);
  // Cache do parsing da URL — evita re-construir/re-validar em cada fetch
  const apiUrlRef = useRef<{ source: string | undefined; api: string | null }>({ source: undefined, api: null });
  // Offset estimado entre relógio do servidor e local (segundos)
  const serverOffsetSecRef = useRef(0);
  // Marcador para o primeiro sample válido (evita ficar preso em 0 enquanto
  // o EMA converge — saltamos directamente ao primeiro valor real)
  const serverOffsetSeededRef = useRef(false);
  // Epoch (s) em que a última entrada válida termina segundo o servidor.
  // Usado para segurar a UI durante lacunas curtas (jingles sem metadados).
  const lastAudibleEndAtRef = useRef<number | null>(null);
  // Marca da última faixa para a qual já fizemos warmup (evita prefetches
  // repetidos durante a janela final da mesma faixa)
  const warmupDoneForRef = useRef<string | null>(null);
  // Último `now_playing.played_at` visto. Quando muda entre fetches, o
  // servidor passou para uma faixa nova — forçamos transição imediata.
  const lastSeenPlayedAtRef = useRef<number | null>(null);
  // Último trackKey (title|artist) visto. Sinal complementar ao played_at:
  // alguns AzuraCast actualizam o título antes do timestamp, ou re-publicam
  // o mesmo played_at com canção diferente.
  const lastSeenTrackKeyRef = useRef<string | null>(null);
  // Último snapshot de debug (lido pelo overlay). Ref para não causar
  // re-renders quando o overlay não está montado.
  const debugSnapshotRef = useRef<DebugSnapshot | null>(null);
  // Refs estáveis para opções variáveis (evita recriar fetchNowPlaying)
  const audioRefRef = useRef(audioRef);
  audioRefRef.current = audioRef;
  const playingStartedAtRefRef = useRef(playingStartedAtRef);
  playingStartedAtRefRef.current = playingStartedAtRef;

  const clearRetry = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  const clearNextFetch = () => {
    if (nextFetchTimeoutRef.current) {
      clearTimeout(nextFetchTimeoutRef.current);
      nextFetchTimeoutRef.current = null;
    }
  };

  /**
   * Resolve a URL da API AzuraCast a partir do streamUrl do `<audio>`.
   * Cacheia o resultado e devolve null sem lançar se a URL for inválida.
   */
  const resolveApiUrl = (source: string | undefined): string | null => {
    if (apiUrlRef.current.source === source) return apiUrlRef.current.api;
    let api: string | null = null;
    if (source) {
      try {
        const url = new URL(source);
        api = `${url.protocol}//${url.host}/api/nowplaying/olha_que_duas`;
      } catch {
        api = null;
      }
    }
    apiUrlRef.current = { source, api };
    return api;
  };

  /**
   * Estima o delay total do ouvinte (segundos atrás do "now" do servidor).
   *
   * Ordem de precedência:
   *  1. Override manual via `localStorage.radio.bufferSec` (calibração).
   *  2. Leitura real do `<audio>` + burst compensation.
   *  3. Default constante (5s) que já inclui burst+decoder+RTT.
   */
  const estimateListenerBufferSeconds = (): number => {
    const override = readBufferOverride();
    if (override !== null) return override;

    const real = readAudioBufferAhead(audioRefRef.current?.current);
    if (real === null) return DEFAULT_LISTENER_BUFFER_SECONDS;

    let total = real;
    const startedAt = playingStartedAtRefRef.current?.current ?? null;
    if (startedAt !== null) {
      const elapsed = Date.now() - startedAt;
      if (elapsed >= 0 && elapsed < BURST_DECAY_MS) {
        const decay = 1 - elapsed / BURST_DECAY_MS;
        total += BURST_COMPENSATION_SECONDS * decay;
      }
    }
    // Floor no default — não deixar a estimativa cair abaixo da realidade
    // típica mesmo com leitura real magra.
    return Math.max(total, DEFAULT_LISTENER_BUFFER_SECONDS);
  };

  const shouldHoldPrevious = (): boolean => {
    const endsAt = lastAudibleEndAtRef.current;
    if (endsAt === null) return false;
    const nowEpoch = Date.now() / 1000 + serverOffsetSecRef.current;
    return nowEpoch < endsAt + HOLD_PREVIOUS_ON_GAP_SECONDS;
  };

  const setStateIfChanged = (next: NowPlayingState) => {
    setState((prev) => (statesEqual(prev, next) ? prev : next));
  };

  const recordAudibleEnd = (audible: AzuraEntry) => {
    const playedAt = audible.played_at;
    const duration = audible.duration;
    if (typeof playedAt === "number" && typeof duration === "number" && duration > 0) {
      lastAudibleEndAtRef.current = playedAt + duration;
      // Marca a faixa actual; warmup será re-permitido para a próxima.
      const newKey = `${playedAt}-${duration}`;
      if (warmupDoneForRef.current !== newKey) {
        warmupDoneForRef.current = null;
      }
    }
  };

  /**
   * Agenda um refetch one-shot exactamente quando o ouvinte terminar a faixa
   * actual. Reduz o delay de detecção de ~5s (polling) para ~1s (margem).
   */
  const scheduleSmartRefetch = (audible: AzuraEntry | undefined, listenerWallClock: number) => {
    clearNextFetch();
    if (!audible) return;
    const playedAt = audible.played_at;
    const duration = audible.duration;
    if (typeof playedAt !== "number" || typeof duration !== "number" || duration <= 0) return;

    const secondsUntilTransition = playedAt + duration - listenerWallClock;
    if (secondsUntilTransition <= 0) return;

    // Warmup HEAD request a PREFETCH_WARMUP_SECONDS antes do fim — aquece
    // DNS/TCP/TLS para o fetch de transição responder imediatamente. Só
    // uma vez por faixa.
    const audibleKey = `${playedAt}-${duration}`;
    if (
      secondsUntilTransition > PREFETCH_WARMUP_SECONDS &&
      warmupDoneForRef.current !== audibleKey
    ) {
      const warmupDelayMs = (secondsUntilTransition - PREFETCH_WARMUP_SECONDS) * 1000;
      setTimeout(() => {
        if (warmupDoneForRef.current === audibleKey) return;
        warmupDoneForRef.current = audibleKey;
        const apiUrl = apiUrlRef.current.api;
        if (!apiUrl) return;
        // Fire-and-forget — não actualiza estado, só "aquece" a ligação
        fetch(apiUrl, { method: "HEAD" }).catch(() => {});
      }, warmupDelayMs);
    }

    // +0.3s de margem — antes era 1s, atrasava a UI no momento da transição
    const delayMs = (secondsUntilTransition + 0.3) * 1000;

    nextFetchTimeoutRef.current = setTimeout(() => {
      nextFetchTimeoutRef.current = null;
      fetchRef.current();
    }, delayMs);
  };

  /**
   * Agenda refetch para quando a janela de hold expirar — evita esperar
   * pelo poll de 5/15s para sair do estado "segurado" da última faixa.
   */
  const scheduleHoldExpiryRefetch = () => {
    const endsAt = lastAudibleEndAtRef.current;
    if (endsAt === null) return;
    const expiresAt = endsAt + HOLD_PREVIOUS_ON_GAP_SECONDS;
    const nowEpoch = Date.now() / 1000 + serverOffsetSecRef.current;
    const secsUntil = expiresAt - nowEpoch;
    if (secsUntil <= 0) return;
    clearNextFetch();
    nextFetchTimeoutRef.current = setTimeout(() => {
      nextFetchTimeoutRef.current = null;
      fetchRef.current();
    }, (secsUntil + 0.5) * 1000);
  };

  const fetchNowPlaying = useCallback(async () => {
    const apiUrl = resolveApiUrl(streamUrl);
    if (!apiUrl) {
      // streamUrl ausente ou inválido — sai sem retry
      clearRetry();
      clearNextFetch();
      setStateIfChanged({ ...NEUTRAL_STATE });
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: AzuraResponse = await response.json();

      // Sucesso → reset backoff
      failureCountRef.current = 0;
      clearRetry();

      // Actualiza offset do relógio servidor com smoothing (EMA). No
      // primeiro sample válido, salta directamente para o valor (sem
      // smoothing) — evita estado transiente de 0 enquanto o EMA converge.
      const offsetSample = estimateServerOffsetSeconds(data);
      if (!serverOffsetSeededRef.current && offsetSample !== null) {
        serverOffsetSecRef.current = offsetSample;
        serverOffsetSeededRef.current = true;
      } else {
        serverOffsetSecRef.current = smoothServerOffset(
          serverOffsetSecRef.current,
          offsetSample,
        );
      }

      // Calcula posição efectiva do ouvinte
      const bufferSource: "override" | "real" | "default" =
        readBufferOverride() !== null ? "override"
        : readAudioBufferAhead(audioRefRef.current?.current) !== null ? "real"
        : "default";
      const bufferReal = readAudioBufferAhead(audioRefRef.current?.current);
      const bufferSec = estimateListenerBufferSeconds();
      const serverNow = Date.now() / 1000 + serverOffsetSecRef.current;
      let listenerWallClock = serverNow - bufferSec;

      // Detecta mudança de faixa no servidor por DOIS sinais independentes:
      //  - played_at: timestamp do início no servidor (mudou = faixa nova)
      //  - trackKey: title+artist (alguns AzuraCast actualizam isto primeiro)
      // Qualquer um a disparar é suficiente — captura mais transições.
      const currentPlayedAt = data.now_playing?.played_at;
      const currentTrackKey = trackKey(data.now_playing);
      const playedAtChanged = detectServerTransition(
        currentPlayedAt,
        lastSeenPlayedAtRef.current,
      );
      const trackKeyChanged =
        currentTrackKey !== null &&
        lastSeenTrackKeyRef.current !== null &&
        currentTrackKey !== lastSeenTrackKeyRef.current;
      const serverTransition = playedAtChanged || trackKeyChanged;

      // Picka categoria com listenerWallClock atrasado pelo buffer (para
      // saber qual faixa o ouvinte está REALMENTE a ouvir).
      let category = pickCategory(data, listenerWallClock);

      // Antecipação agressiva: se o servidor passou para uma faixa nova E
      // ela é conteúdo longo (música/podcast/live ≥60s), mostramos JÁ —
      // mesmo que o ouvinte ainda esteja a ouvir a anterior. A capa pode
      // ir 4-5s à frente do áudio, mas é muito melhor que ficar 10-15s
      // atrás (sintoma reportado). Para anúncios curtos e jingles
      // mantemos o comportamento normal (esperar pelo ouvinte).
      if (serverTransition && typeof currentPlayedAt === "number") {
        const futureCategory = pickCategory(data, currentPlayedAt + 0.1);
        if (shouldAnticipateTransition(futureCategory)) {
          category = futureCategory;
          // Para o smart refetch saber agendar correctamente
          listenerWallClock = currentPlayedAt + 0.1;
        }
      }

      if (typeof currentPlayedAt === "number") {
        lastSeenPlayedAtRef.current = currentPlayedAt;
      }
      if (currentTrackKey !== null) {
        lastSeenTrackKeyRef.current = currentTrackKey;
      }

      // Snapshot para o overlay de debug (não causa re-render)
      const audibleEntry =
        category.kind === "music" || category.kind === "podcast" ||
        category.kind === "announcement" || category.kind === "jingle"
          ? category.audible : null;
      debugSnapshotRef.current = {
        serverNow,
        listenerWallClock,
        bufferEst: bufferSec,
        serverOffsetSec: serverOffsetSecRef.current,
        bufferSource,
        bufferReal,
        category: category.kind,
        audibleTitle:
          category.kind === "music" ? category.song.title
          : category.kind === "podcast" || category.kind === "announcement" ? category.name
          : category.kind === "live" ? category.name
          : null,
        audiblePlayedAt: audibleEntry?.played_at ?? null,
        secondsUntilTransition:
          audibleEntry && typeof audibleEntry.played_at === "number" && typeof audibleEntry.duration === "number"
            ? audibleEntry.played_at + audibleEntry.duration - listenerWallClock
            : null,
        serverTransition,
        timestamp: Date.now(),
      };

      // 1. Live show
      if (category.kind === "live") {
        clearNextFetch();
        lastAudibleEndAtRef.current = null;
        setStateIfChanged(buildState(category));
        return;
      }

      // 2. Lacuna entre faixas (sem now_playing válido OU vinheta sem metadata)
      if (category.kind === "gap") {
        if (shouldHoldPrevious()) {
          // Não tocamos no setState — agendamos refetch para quando o hold expirar
          scheduleHoldExpiryRefetch();
          return;
        }
        clearNextFetch();
        lastAudibleEndAtRef.current = null;
        setStateIfChanged(NEUTRAL_STATE);
        return;
      }

      // 3. Jingle (com metadata mas que classificamos como interrupção)
      if (category.kind === "jingle") {
        if (shouldHoldPrevious()) {
          scheduleSmartRefetch(category.audible, listenerWallClock);
          return;
        }
        lastAudibleEndAtRef.current = null;
        setStateIfChanged(NEUTRAL_STATE);
        scheduleSmartRefetch(category.audible, listenerWallClock);
        return;
      }

      // 4. Música, podcast ou anúncio — actualiza UI e agenda próxima transição
      recordAudibleEnd(category.audible);
      setStateIfChanged(buildState(category));
      scheduleSmartRefetch(category.audible, listenerWallClock);
    } catch {
      // Falha de fetch (timeout, rede, parse). Backoff exponencial com cap.
      failureCountRef.current += 1;
      setState((prev) => (prev.loading ? { ...prev, loading: false } : prev));
      clearRetry();
      const idx = Math.min(failureCountRef.current - 1, FETCH_BACKOFF_MS.length - 1);
      const delay = FETCH_BACKOFF_MS[idx];
      retryTimeoutRef.current = setTimeout(() => {
        retryTimeoutRef.current = null;
        fetchNowPlaying();
      }, delay);
    }
    // scheduleSmartRefetch / scheduleHoldExpiryRefetch são closures definidas
    // no body do hook que apenas leem refs — não precisam de ser deps (não
    // mudam de identidade que importe; reincluí-las invalidaria o callback
    // a cada render sem benefício).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl]);

  // Mantém uma ref estável para o smart refetch poder chamar a versão actual
  useEffect(() => {
    fetchRef.current = fetchNowPlaying;
  }, [fetchNowPlaying]);

  // Polling principal — sempre activo (taxa varia conforme isPlaying)
  useEffect(() => {
    fetchNowPlaying();
    const intervalMs = isPlaying ? POLL_INTERVAL_ACTIVE : POLL_INTERVAL_PASSIVE;
    const interval = setInterval(fetchNowPlaying, intervalMs);

    return () => {
      clearInterval(interval);
      clearRetry();
      clearNextFetch();
    };
  }, [fetchNowPlaying, isPlaying]);

  // Reset do hold quando o utilizador pausa — evita usar timestamp velho
  // ao retomar (a UI pode ter ficado "segura" numa faixa que já passou).
  useEffect(() => {
    if (!isPlaying) {
      lastAudibleEndAtRef.current = null;
    }
  }, [isPlaying]);

  // Refetch imediato quando a aba volta a ficar visível — recupera de
  // throttling do setInterval em background (Chrome limita a ~1/min)
  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) {
        fetchNowPlaying();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [fetchNowPlaying]);

  return {
    ...state,
    refetch: fetchNowPlaying,
    /** Ref para o snapshot de debug — leitura on-demand (não causa re-render) */
    debugRef: debugSnapshotRef,
  };
}
