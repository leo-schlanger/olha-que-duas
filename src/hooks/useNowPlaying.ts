import { useState, useEffect, useCallback, useRef } from "react";

interface NowPlayingSong {
  title: string;
  artist: string;
  album: string;
  art: string;
}

interface NowPlayingState {
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
interface AzuraEntry {
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
const POLL_INTERVAL = 5000; // 5 segundos — actualizações rápidas
const RETRY_DELAY = 2000;   // retry rápido após falha de fetch

// Buffer típico do ouvinte: icecast burst (~2-3s @ 192kbps) + decode buffer
// do browser (~3-5s). Ajustar empiricamente se a UI ainda chegar adiantada
// (subir) ou atrasada (descer) face ao áudio.
const LISTENER_BUFFER_SECONDS = 4;

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
// durante uma lacuna na API. Cobre jingles curtos típicos (5-8s) sem
// mostrar logo a piscar. Se a lacuna exceder este valor, cai para neutro.
const HOLD_PREVIOUS_ON_GAP_SECONDS = 8;

function isValidSong(data: {
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
 * transmitir AGORA", mas o ouvinte ouve com vários segundos de atraso —
 * por isso precisamos olhar para o histórico recente.
 *
 * Importante: o `song_history` do AzuraCast NÃO inclui vinhetas/jingles —
 * só músicas. Isto significa que entre duas faixas há sempre uma "lacuna"
 * de 5-15s onde tocou uma vinheta que não está em lado nenhum dos dados.
 * Quando o ouvinte está nessa lacuna, devolvemos `undefined` para a UI
 * cair no estado neutro (logo) — em vez de mostrar a capa errada da
 * próxima música prematuramente.
 */
function pickAudibleEntry(
  nowPlaying: AzuraEntry | undefined,
  history: AzuraEntry[],
  nowEpoch: number,
): AzuraEntry | undefined {
  if (!nowPlaying) return undefined;

  // Posição (em wall-clock) onde o ouvinte está agora
  const listenerWallClock = nowEpoch - LISTENER_BUFFER_SECONDS;

  // Constrói lista por ordem cronológica decrescente: mais recente primeiro
  const candidates: AzuraEntry[] = [nowPlaying, ...history];

  for (const entry of candidates) {
    const playedAt = entry.played_at;
    const duration = entry.duration;
    if (typeof playedAt !== "number" || typeof duration !== "number" || duration <= 0) continue;
    if (playedAt <= listenerWallClock && listenerWallClock < playedAt + duration) {
      return entry;
    }
  }

  // Sem match: o ouvinte está numa lacuna entre faixas conhecidas
  // (tipicamente uma vinheta que o AzuraCast não inclui no histórico).
  // Devolver undefined → UI mostra logo, em vez da capa errada da
  // próxima música antes do ouvinte realmente a receber.
  return undefined;
}

export function useNowPlaying(streamUrl: string | undefined, isPlaying: boolean = true) {
  const [state, setState] = useState<NowPlayingState>({
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
  });

  const lastSongKeyRef = useRef<string | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextFetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchRef = useRef<() => void>(() => {});
  // Epoch (s) em que a última entrada válida (música/podcast/anúncio)
  // termina segundo o servidor. Usado para segurar a UI durante lacunas
  // curtas (jingles sem metadados) em vez de cair logo para neutro.
  const lastAudibleEndAtRef = useRef<number | null>(null);

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
   * Devolve true se ainda estamos dentro da janela de graça após o fim da
   * última entrada válida — e portanto devemos manter o estado actual
   * (capa/título da música ou podcast/anúncio anterior) em vez de cair
   * para o logo da rádio durante uma lacuna curta.
   */
  const shouldHoldPrevious = (): boolean => {
    const endsAt = lastAudibleEndAtRef.current;
    if (endsAt === null) return false;
    const nowEpoch = Date.now() / 1000;
    return nowEpoch < endsAt + HOLD_PREVIOUS_ON_GAP_SECONDS;
  };

  const recordAudibleEnd = (audible: AzuraEntry) => {
    const playedAt = audible.played_at;
    const duration = audible.duration;
    if (typeof playedAt === "number" && typeof duration === "number" && duration > 0) {
      lastAudibleEndAtRef.current = playedAt + duration;
    }
  };

  /**
   * Agenda um refetch one-shot exactamente quando o ouvinte terminar a faixa
   * actual, em vez de esperar pelo próximo poll de 5s. Usa a janela
   * [played_at, played_at+duration) da entrada audível para calcular quantos
   * segundos faltam até o ouvinte transicionar. No pior caso isto reduz o
   * delay de detecção de ~5s (polling) para ~1s (margem). Funciona para
   * qualquer entry (now_playing ou histórico) já que ambas têm played_at e
   * duration.
   */
  const scheduleSmartRefetch = (audible: AzuraEntry | undefined, listenerWallClock: number) => {
    clearNextFetch();
    if (!audible) return;
    const playedAt = audible.played_at;
    const duration = audible.duration;
    if (typeof playedAt !== "number" || typeof duration !== "number" || duration <= 0) return;

    const secondsUntilTransition = playedAt + duration - listenerWallClock;
    if (secondsUntilTransition <= 0) return;

    // +1s de margem para garantir que a API já reflectiu a próxima faixa
    const delayMs = (secondsUntilTransition + 1) * 1000;

    nextFetchTimeoutRef.current = setTimeout(() => {
      nextFetchTimeoutRef.current = null;
      fetchRef.current();
    }, delayMs);
  };

  const fetchNowPlaying = useCallback(async () => {
    if (!streamUrl) {
      setState({ song: null, isMusic: false, isLiveShow: false, liveShowName: "", isPodcast: false, podcastName: "", podcastArt: "", isAnnouncement: false, announcementName: "", announcementArt: "", loading: false });
      return;
    }

    try {
      const url = new URL(streamUrl);
      const apiUrl = `${url.protocol}//${url.host}/api/nowplaying/olha_que_duas`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      const live = data.live;

      // 1. Programa ao vivo — streamer está a transmitir; ignora buffer offset
      // (live tem prioridade absoluta e não há histórico relevante)
      if (live?.is_live) {
        clearRetry();
        clearNextFetch();
        lastSongKeyRef.current = null;
        lastAudibleEndAtRef.current = null;
        setState({
          song: null,
          isMusic: false,
          isLiveShow: true,
          liveShowName: live.streamer_name || "Programa ao Vivo",
          isPodcast: false,
          podcastName: "",
          podcastArt: "",
          isAnnouncement: false,
          announcementName: "",
          announcementArt: "",
          loading: false,
        });
        return;
      }

      // 2. Calcula a entrada que o ouvinte está realmente a ouvir agora
      // (com base no buffer estimado), em vez de usar o now_playing cru
      const nowPlaying: AzuraEntry | undefined = data.now_playing;
      const history: AzuraEntry[] = Array.isArray(data.song_history) ? data.song_history : [];
      const listenerWallClock = Date.now() / 1000 - LISTENER_BUFFER_SECONDS;
      const audible = pickAudibleEntry(nowPlaying, history, Date.now() / 1000);

      if (!audible?.song) {
        clearRetry();
        // Lacuna (vinheta) — não temos played_at/duration confiável. Se a
        // última entrada válida terminou há pouco tempo, seguramos o estado
        // actual (capa da música/podcast/anúncio anterior) em vez de cair
        // para o logo — elimina o piscar entre faixas.
        if (shouldHoldPrevious()) {
          // Não tocamos no setState. O próximo poll (5s) resolve.
          return;
        }
        clearNextFetch();
        lastSongKeyRef.current = null;
        lastAudibleEndAtRef.current = null;
        setState({ song: null, isMusic: false, isLiveShow: false, liveShowName: "", isPodcast: false, podcastName: "", podcastArt: "", isAnnouncement: false, announcementName: "", announcementArt: "", loading: false });
        return;
      }

      const songData = {
        title: audible.song.title || "",
        artist: audible.song.artist || "",
        playlist: audible.playlist || "",
        duration: audible.duration || 0,
      };

      const isMusic = isValidSong(songData);
      const songKey = `${songData.title}-${songData.artist}`;

      // 3. Jingle/vinheta/transição — limpa música, mostra logo
      if (!isMusic) {
        // Verifica se é podcast: não é música, não é jingle, playlist não é de música
        const playlistName = songData.playlist;
        const isMusicPlaylist = !playlistName || MUSIC_PLAYLIST_PATTERNS.some((p) => p.test(playlistName));
        const isLongContent = songData.duration >= MIN_SONG_DURATION;
        const isJingle = JINGLE_PATTERNS.some((p) => p.test(songData.title)) || JINGLE_PATTERNS.some((p) => p.test(songData.artist));
        const isAnnouncementPlaylist = !!playlistName && ANNOUNCEMENT_PLAYLIST_PATTERNS.some((p) => p.test(playlistName));

        if (!isMusicPlaylist && !isJingle && isLongContent) {
          // Podcast detectado
          clearRetry();
          lastSongKeyRef.current = null;
          recordAudibleEnd(audible);
          setState({
            song: null,
            isMusic: false,
            isLiveShow: false,
            liveShowName: "",
            isPodcast: true,
            podcastName: playlistName,
            podcastArt: audible.song.art || "",
            isAnnouncement: false,
            announcementName: "",
            announcementArt: "",
            loading: false,
          });
          // Podcast pode durar bastante; agenda refetch para o seu fim
          scheduleSmartRefetch(audible, listenerWallClock);
          return;
        }

        // Anúncio/spot especial — playlist dedicada com artwork próprio,
        // sem restrição de duração mínima (spots podem ter 10-30s).
        if (isAnnouncementPlaylist && !isJingle) {
          clearRetry();
          lastSongKeyRef.current = null;
          recordAudibleEnd(audible);
          setState({
            song: null,
            isMusic: false,
            isLiveShow: false,
            liveShowName: "",
            isPodcast: false,
            podcastName: "",
            podcastArt: "",
            isAnnouncement: true,
            announcementName: songData.title || playlistName,
            announcementArt: audible.song.art || "",
            loading: false,
          });
          scheduleSmartRefetch(audible, listenerWallClock);
          return;
        }

        // Jingle/transição normal — se a faixa válida anterior acabou há
        // pouco, seguramos o estado; caso contrário cai para logo.
        clearRetry();
        if (shouldHoldPrevious()) {
          scheduleSmartRefetch(audible, listenerWallClock);
          return;
        }
        lastAudibleEndAtRef.current = null;
        setState({
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
          loading: false,
        });
        scheduleSmartRefetch(audible, listenerWallClock);
        return;
      }

      // 4. Música válida — actualiza info
      clearRetry();
      lastSongKeyRef.current = songKey;
      recordAudibleEnd(audible);
      setState({
        song: {
          title: songData.title,
          artist: songData.artist,
          album: audible.song.album || "",
          art: audible.song.art || "",
        },
        isMusic: true,
        isLiveShow: false,
        liveShowName: "",
        isPodcast: false,
        podcastName: "",
        podcastArt: "",
        isAnnouncement: false,
        announcementName: "",
        announcementArt: "",
        loading: false,
      });
      // Agenda refetch para o momento exacto da próxima transição
      scheduleSmartRefetch(audible, listenerWallClock);
    } catch {
      // Falha de fetch (timeout, rede, parse). Retry rápido uma vez para
      // não esperar 5s pelo próximo poll. Não tocamos no estado para evitar
      // flicker — a UI mantém os últimos metadados válidos.
      setState((prev) => (prev.loading ? { ...prev, loading: false } : prev));
      clearRetry();
      retryTimeoutRef.current = setTimeout(() => {
        retryTimeoutRef.current = null;
        fetchNowPlaying();
      }, RETRY_DELAY);
    }
  }, [streamUrl]);

  // Mantém uma ref estável para o smart refetch poder chamar a versão actual
  // do fetchNowPlaying mesmo após re-renders
  useEffect(() => {
    fetchRef.current = fetchNowPlaying;
  }, [fetchNowPlaying]);

  // Polling principal — só corre quando o utilizador está a ouvir
  useEffect(() => {
    if (!isPlaying) {
      clearRetry();
      clearNextFetch();
      return;
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
      clearRetry();
      clearNextFetch();
    };
  }, [fetchNowPlaying, isPlaying]);

  // Refetch imediato quando a aba volta a ficar visível — recupera de
  // throttling do setInterval em background (Chrome limita a ~1/min)
  useEffect(() => {
    if (!isPlaying) return;

    const onVisibility = () => {
      if (!document.hidden) {
        fetchNowPlaying();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [fetchNowPlaying, isPlaying]);

  return { ...state, refetch: fetchNowPlaying };
}
