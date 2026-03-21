import { useState, useEffect, useCallback } from "react";

interface NowPlayingSong {
  title: string;
  artist: string;
  album: string;
  art: string;
}

interface NowPlayingState {
  song: NowPlayingSong | null;
  isMusic: boolean;
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
    loading: true,
  });

  const fetchNowPlaying = useCallback(async () => {
    if (!streamUrl) {
      setState({ song: null, isMusic: false, loading: false });
      return;
    }

    try {
      // Extrai o base URL do stream
      const url = new URL(streamUrl);
      const apiUrl = `${url.protocol}//${url.host}/api/nowplaying/olha_que_duas`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      const nowPlaying = data.now_playing;

      if (nowPlaying?.song) {
        const songData = {
          title: nowPlaying.song.title || "",
          artist: nowPlaying.song.artist || "",
          playlist: nowPlaying.song.playlist || "",
          duration: nowPlaying.duration || 0,
        };

        const isMusic = isValidSong(songData);

        setState({
          song: isMusic
            ? {
                title: songData.title,
                artist: songData.artist,
                album: nowPlaying.song.album || "",
                art: nowPlaying.song.art || "",
              }
            : null,
          isMusic,
          loading: false,
        });
      } else {
        setState({ song: null, isMusic: false, loading: false });
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [streamUrl]);

  useEffect(() => {
    fetchNowPlaying();

    // Atualiza a cada 15 segundos
    const interval = setInterval(fetchNowPlaying, 15000);

    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  return state;
}
