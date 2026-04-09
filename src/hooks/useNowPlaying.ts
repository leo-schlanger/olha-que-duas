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
  loading: boolean;
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
const POLL_INTERVAL = 5000; // 5 seconds — faster updates

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

export function useNowPlaying(streamUrl: string | undefined, isPlaying: boolean = true) {
  const [state, setState] = useState<NowPlayingState>({
    song: null,
    isMusic: false,
    isLiveShow: false,
    liveShowName: "",
    loading: true,
  });

  const lastSongKeyRef = useRef<string | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    if (!streamUrl) {
      setState({ song: null, isMusic: false, isLiveShow: false, liveShowName: "", loading: false });
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
      const nowPlaying = data.now_playing;
      const live = data.live;

      // 1. Live show/podcast — streamer is broadcasting live
      if (live?.is_live) {
        lastSongKeyRef.current = null;
        setState({
          song: null,
          isMusic: false,
          isLiveShow: true,
          liveShowName: live.streamer_name || "Programa ao Vivo",
          loading: false,
        });
        return;
      }

      // 2. No now_playing data
      if (!nowPlaying?.song) {
        lastSongKeyRef.current = null;
        setState({ song: null, isMusic: false, isLiveShow: false, liveShowName: "", loading: false });
        return;
      }

      const songData = {
        title: nowPlaying.song.title || "",
        artist: nowPlaying.song.artist || "",
        playlist: nowPlaying.playlist || "",
        duration: nowPlaying.duration || 0,
      };

      const isMusic = isValidSong(songData);
      const songKey = `${songData.title}-${songData.artist}`;

      // 3. Jingle/vinheta/transition — clear song immediately, show logo
      if (!isMusic) {
        // Don't clear lastSongKeyRef so we can detect when the next real song starts
        setState({
          song: null,
          isMusic: false,
          isLiveShow: false,
          liveShowName: "",
          loading: false,
        });
        return;
      }

      // 4. Valid music — update song info
      lastSongKeyRef.current = songKey;
      setState({
        song: {
          title: songData.title,
          artist: songData.artist,
          album: nowPlaying.song.album || "",
          art: nowPlaying.song.art || "",
        },
        isMusic: true,
        isLiveShow: false,
        liveShowName: "",
        loading: false,
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [streamUrl]);

  useEffect(() => {
    if (!isPlaying) return;

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [fetchNowPlaying, isPlaying]);

  return { ...state, refetch: fetchNowPlaying };
}
