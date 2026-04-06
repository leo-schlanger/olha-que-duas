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
  isTransition: boolean;
  loading: boolean;
}

// Padrões que indicam jingles/interrupções (case insensitive)
const JINGLE_PATTERNS = [
  /^jingle/i,
  /^vinheta/i,
  /^id\s/i,
  /^spot/i,
  /^promo/i,
  /^interrup/i,
  /^bumper/i,
  /^sweeper/i,
  /^liner/i,
  /^station\s?id/i,
  /^hora\s?certa/i,
  /^cortina/i,
];

// Playlists que provavelmente são jingles
const JINGLE_PLAYLISTS = [
  /jingle/i,
  /vinheta/i,
  /interrup/i,
  /spot/i,
  /promo/i,
];

// Duração mínima para considerar uma música (em segundos)
const MIN_SONG_DURATION = 60;

// Tempo de transição após mudança de música (em ms)
const TRANSITION_DURATION = 2000;

function isValidSong(data: {
  title?: string;
  artist?: string;
  playlist?: string;
  duration?: number;
}): boolean {
  const { title, artist, playlist, duration } = data;

  // Se não tem título, não é válido
  if (!title || title.trim() === "") return false;

  // Se não tem artista ou artista é genérico, provavelmente é jingle
  if (!artist || artist.trim() === "" || artist.toLowerCase() === "unknown") {
    return false;
  }

  // Se a duração é muito curta, provavelmente é jingle
  if (duration && duration < MIN_SONG_DURATION) return false;

  // Verifica padrões de jingle no título
  if (JINGLE_PATTERNS.some((pattern) => pattern.test(title))) return false;

  // Verifica padrões de jingle no artista
  if (JINGLE_PATTERNS.some((pattern) => pattern.test(artist))) return false;

  // Verifica se a playlist é de jingles
  if (playlist && JINGLE_PLAYLISTS.some((pattern) => pattern.test(playlist))) {
    return false;
  }

  return true;
}

export function useNowPlaying(streamUrl: string | undefined) {
  const [state, setState] = useState<NowPlayingState>({
    song: null,
    isMusic: false,
    isTransition: false,
    loading: true,
  });

  const lastSongRef = useRef<string | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    if (!streamUrl) {
      setState({ song: null, isMusic: false, isTransition: false, loading: false });
      return;
    }

    try {
      // Extrai o base URL do stream
      const url = new URL(streamUrl);
      const apiUrl = `${url.protocol}//${url.host}/api/nowplaying/olha_que_duas`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      const nowPlaying = data.now_playing;

      if (nowPlaying?.song) {
        const songData = {
          title: nowPlaying.song.title || "",
          artist: nowPlaying.song.artist || "",
          playlist: nowPlaying.playlist || "",
          duration: nowPlaying.duration || 0,
        };
        const remaining = nowPlaying.remaining || 0;

        const isMusic = isValidSong(songData);
        const songKey = `${songData.title}-${songData.artist}`;
        const songChanged = lastSongRef.current !== null && lastSongRef.current !== songKey;

        // Se remaining é muito baixo ou negativo, provavelmente está em transição/jingle
        const isEndingSoon = remaining <= 5 && remaining >= 0;

        // Se a música está acabando, mostrar transição
        if (isEndingSoon && isMusic) {
          setState((prev) => ({
            ...prev,
            isTransition: true,
          }));
          return;
        }

        // Se a música mudou, ativar transição
        if (songChanged && isMusic) {
          // Limpar timeout anterior se existir
          if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
          }

          // Mostrar transição
          setState((prev) => ({ ...prev, isTransition: true }));

          // Após TRANSITION_DURATION, mostrar a nova música
          transitionTimeoutRef.current = setTimeout(() => {
            setState({
              song: {
                title: songData.title,
                artist: songData.artist,
                album: nowPlaying.song.album || "",
                art: nowPlaying.song.art || "",
              },
              isMusic: true,
              isTransition: false,
              loading: false,
            });
          }, TRANSITION_DURATION);

          lastSongRef.current = songKey;
          return;
        }

        // Atualizar referência da música atual
        if (isMusic) {
          lastSongRef.current = songKey;
        }

        // Se não está em transição, atualizar normalmente
        setState((prev) => {
          // Se está em transição, não atualizar (deixar o timeout resolver)
          if (prev.isTransition) return prev;

          return {
            song: isMusic
              ? {
                  title: songData.title,
                  artist: songData.artist,
                  album: nowPlaying.song.album || "",
                  art: nowPlaying.song.art || "",
                }
              : null,
            isMusic,
            isTransition: false,
            loading: false,
          };
        });
      } else {
        setState({ song: null, isMusic: false, isTransition: false, loading: false });
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [streamUrl]);

  useEffect(() => {
    fetchNowPlaying();

    // Atualiza a cada 8 segundos
    const interval = setInterval(fetchNowPlaying, 8000);

    return () => {
      clearInterval(interval);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [fetchNowPlaying]);

  return state;
}
