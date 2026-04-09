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

// Music playlists follow naming patterns — anything else with no valid metadata is likely a podcast
const MUSIC_PLAYLIST_PATTERNS = [
  /mix/i, /rotation/i, /playlist/i, /morning/i, /afternoon/i,
  /sunset/i, /night/i, /madrugada/i, /noite/i, /tarde/i,
  /manh[ãa]/i, /top\s?\d/i, /hits/i, /chill/i, /lounge/i,
  /general/i, /default/i, /shuffle/i,
];

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
    isPodcast: false,
    podcastName: "",
    podcastArt: "",
    loading: true,
  });

  const lastSongKeyRef = useRef<string | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    if (!streamUrl) {
      setState({ song: null, isMusic: false, isLiveShow: false, liveShowName: "", isPodcast: false, podcastName: "", podcastArt: "", loading: false });
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
          isPodcast: false,
          podcastName: "",
          podcastArt: "",
          loading: false,
        });
        return;
      }

      // 2. No now_playing data
      if (!nowPlaying?.song) {
        lastSongKeyRef.current = null;
        setState({ song: null, isMusic: false, isLiveShow: false, liveShowName: "", isPodcast: false, podcastName: "", podcastArt: "", loading: false });
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
        // Check if this is a podcast: not music, not a jingle, from a non-music playlist
        const playlistName = songData.playlist;
        const isMusicPlaylist = !playlistName || MUSIC_PLAYLIST_PATTERNS.some((p) => p.test(playlistName));
        const isLongContent = songData.duration >= MIN_SONG_DURATION;
        const isJingle = JINGLE_PATTERNS.some((p) => p.test(songData.title)) || JINGLE_PATTERNS.some((p) => p.test(songData.artist));

        if (!isMusicPlaylist && !isJingle && isLongContent) {
          // Podcast detected
          lastSongKeyRef.current = null;
          setState({
            song: null,
            isMusic: false,
            isLiveShow: false,
            liveShowName: "",
            isPodcast: true,
            podcastName: playlistName,
            podcastArt: nowPlaying.song.art || "",
            loading: false,
          });
          return;
        }

        // Regular jingle/transition
        setState({
          song: null,
          isMusic: false,
          isLiveShow: false,
          liveShowName: "",
          isPodcast: false,
          podcastName: "",
          podcastArt: "",
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
        isPodcast: false,
        podcastName: "",
        podcastArt: "",
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
