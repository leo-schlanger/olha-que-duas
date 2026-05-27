import { describe, it, expect, afterEach } from "vitest";
import {
  isValidSong,
  pickAudibleEntry,
  pickCategory,
  buildState,
  estimateServerOffsetSeconds,
  smoothServerOffset,
  readAudioBufferAhead,
  readBufferOverride,
  detectServerTransition,
  trackKey,
  shouldAnticipateTransition,
  parseIcyStreamTitle,
  matchPlayingNext,
  statesEqual,
  type AzuraEntry,
  type AzuraResponse,
  type NowPlayingState,
} from "@/hooks/useNowPlaying";

const NEUTRAL: NowPlayingState = {
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
};

describe("isValidSong", () => {
  it("aceita música válida", () => {
    expect(isValidSong({
      title: "Bohemian Rhapsody",
      artist: "Queen",
      playlist: "Rotation",
      duration: 354,
    })).toBe(true);
  });

  it("rejeita título vazio ou ausente", () => {
    expect(isValidSong({ artist: "Queen", duration: 200 })).toBe(false);
    expect(isValidSong({ title: "", artist: "Queen", duration: 200 })).toBe(false);
    expect(isValidSong({ title: "   ", artist: "Queen", duration: 200 })).toBe(false);
  });

  it("rejeita artista 'unknown' ou vazio", () => {
    expect(isValidSong({ title: "X", artist: "Unknown", duration: 200 })).toBe(false);
    expect(isValidSong({ title: "X", artist: "", duration: 200 })).toBe(false);
  });

  it("aceita música curta acima do mínimo (≥25s, ex: faixas infantis)", () => {
    expect(isValidSong({ title: "X", artist: "Y", duration: 30 })).toBe(true);
    expect(isValidSong({ title: "X", artist: "Y", duration: 25 })).toBe(true);
  });

  it("rejeita duração muito curta (provavelmente vinheta)", () => {
    expect(isValidSong({ title: "X", artist: "Y", duration: 10 })).toBe(false);
    expect(isValidSong({ title: "X", artist: "Y", duration: 24 })).toBe(false);
  });

  it("rejeita títulos que parecem jingles", () => {
    expect(isValidSong({ title: "Jingle de abertura", artist: "Rádio", duration: 200 })).toBe(false);
    expect(isValidSong({ title: "Vinheta 01", artist: "Rádio", duration: 200 })).toBe(false);
    expect(isValidSong({ title: "Spot Promocional", artist: "Marca", duration: 200 })).toBe(false);
  });

  it("rejeita playlist de jingle/vinheta", () => {
    expect(isValidSong({
      title: "X", artist: "Y", duration: 200, playlist: "vinhetas",
    })).toBe(false);
  });

  it("aceita música quando duration ausente (campo opcional)", () => {
    expect(isValidSong({ title: "X", artist: "Y" })).toBe(true);
  });
});

describe("pickAudibleEntry", () => {
  const np: AzuraEntry = { played_at: 1000, duration: 200, song: { title: "Now" } };
  const h1: AzuraEntry = { played_at: 800, duration: 200, song: { title: "Prev1" } };
  const h2: AzuraEntry = { played_at: 600, duration: 200, song: { title: "Prev2" } };

  it("retorna now_playing quando ouvinte está dentro da sua janela", () => {
    expect(pickAudibleEntry(np, [h1, h2], 1100)).toBe(np);
  });

  it("retorna entrada do histórico quando ouvinte ainda está atrás", () => {
    // ouvinte em 850 → dentro de h1 (800-1000)
    expect(pickAudibleEntry(np, [h1, h2], 850)).toBe(h1);
  });

  it("retorna undefined quando ouvinte está numa lacuna entre faixas", () => {
    // gap fictício: h1 acaba em 1000 mas np começa em 1050
    const gappy: AzuraEntry = { played_at: 1050, duration: 200, song: { title: "Next" } };
    expect(pickAudibleEntry(gappy, [h1, h2], 1010)).toBeUndefined();
  });

  it("retorna undefined quando now_playing ausente", () => {
    expect(pickAudibleEntry(undefined, [h1, h2], 850)).toBeUndefined();
  });

  it("ignora entradas com duration <= 0 ou played_at inválido", () => {
    const bad: AzuraEntry = { played_at: undefined, duration: 200 };
    const ok: AzuraEntry = { played_at: 500, duration: 100, song: { title: "Old" } };
    expect(pickAudibleEntry(bad, [ok], 550)).toBe(ok);
  });
});

describe("pickCategory", () => {
  const baseSong = (overrides: Partial<AzuraEntry> = {}): AzuraResponse => ({
    now_playing: {
      played_at: 1000,
      duration: 200,
      playlist: "Rotation Manhã",
      song: { title: "Hit", artist: "Artist", album: "Album", art: "art.jpg" },
      ...overrides,
    },
    song_history: [],
  });

  it("classifica live show com prioridade absoluta", () => {
    const cat = pickCategory({
      live: { is_live: true, streamer_name: "DJ Cool" },
      now_playing: baseSong().now_playing,
    }, 1100);
    expect(cat.kind).toBe("live");
    if (cat.kind === "live") expect(cat.name).toBe("DJ Cool");
  });

  it("usa fallback de nome quando live sem streamer_name", () => {
    const cat = pickCategory({ live: { is_live: true } }, 1100);
    if (cat.kind === "live") expect(cat.name).toBe("Programa ao Vivo");
  });

  it("classifica música válida", () => {
    const cat = pickCategory(baseSong(), 1100);
    expect(cat.kind).toBe("music");
    if (cat.kind === "music") {
      expect(cat.song.title).toBe("Hit");
      expect(cat.song.artist).toBe("Artist");
      expect(cat.song.art).toBe("art.jpg");
    }
  });

  it("classifica gap quando ouvinte está entre faixas", () => {
    const cat = pickCategory(baseSong(), 5000); // muito depois do fim
    expect(cat.kind).toBe("gap");
  });

  it("classifica jingle (título identificado)", () => {
    const cat = pickCategory(baseSong({
      song: { title: "Jingle Abertura", artist: "Rádio" },
      duration: 200,
    }), 1100);
    expect(cat.kind).toBe("jingle");
  });

  it("classifica podcast (playlist não-musical, longa, sem artist válido)", () => {
    // Para cair em podcast a faixa NÃO pode passar isValidSong; aqui usamos
    // artist="Unknown" (sentinela típica do AzuraCast para conteúdo sem ID3
    // de música). Playlist não-musical + duração ≥ 60s → podcast.
    const cat = pickCategory(baseSong({
      playlist: "Programa Nutrição",
      duration: 1800,
      song: { title: "Episódio 5", artist: "Unknown", art: "podcast.jpg" },
    }), 1100);
    expect(cat.kind).toBe("podcast");
    if (cat.kind === "podcast") {
      expect(cat.name).toBe("Programa Nutrição");
      expect(cat.art).toBe("podcast.jpg");
    }
  });

  it("classifica anúncio (playlist 'Anúncio', duração curta permitida)", () => {
    // Faixa de 25s → ouvinte tem que estar dentro de [played_at, +25)
    const cat = pickCategory(baseSong({
      duration: 25,
      playlist: "Anúncios Eventos",
      song: { title: "Festival X", artist: "Sponsor", art: "ad.jpg" },
    }), 1010);
    expect(cat.kind).toBe("announcement");
    if (cat.kind === "announcement") {
      expect(cat.name).toBe("Festival X");
      expect(cat.art).toBe("ad.jpg");
    }
  });

  it("anúncio cai para nome da playlist quando título vazio", () => {
    const cat = pickCategory(baseSong({
      duration: 25,
      playlist: "Especiais",
      song: { title: "", artist: "Sponsor", art: "ad.jpg" },
    }), 1010);
    if (cat.kind === "announcement") expect(cat.name).toBe("Especiais");
  });

  it("classifica gap quando now_playing ausente", () => {
    expect(pickCategory({}, 1100).kind).toBe("gap");
  });

  // Casos reais reportados pelo utilizador (Canal Infantil)
  describe("setup Canal Infantil", () => {
    // Defaults + "Especiais Infantil" via siteConfig (como em produção)
    const customPatterns = [
      /an[uú]ncio/i, /destaqu/i, /aviso/i, /evento/i,
      /Especiais Infantil/i,
    ];

    it("Canal Infantil — música longa (Smash Mouth - All Star, 200s) → music", () => {
      const cat = pickCategory({
        now_playing: {
          played_at: 1000,
          duration: 200,
          playlist: "Canal Infantil",
          song: { title: "All Star", artist: "Smash Mouth", album: "Astro Lounge", art: "art.jpg" },
        },
      }, 1100, customPatterns);
      expect(cat.kind).toBe("music");
      if (cat.kind === "music") {
        expect(cat.song.title).toBe("All Star");
        expect(cat.song.artist).toBe("Smash Mouth");
      }
    });

    it("Canal Infantil — música curta (Clues, 26s) → music (não jingle)", () => {
      const cat = pickCategory({
        now_playing: {
          played_at: 1000,
          duration: 26,
          playlist: "Canal Infantil",
          song: { title: "Clues, Clues, Clues", artist: "Pinkfong", album: "Kids", art: "art.jpg" },
        },
      }, 1010, customPatterns);
      expect(cat.kind).toBe("music");
    });

    it("Especiais Infantil - Abertura (46s, artist 'Olha Que Duas') → announcement", () => {
      const cat = pickCategory({
        now_playing: {
          played_at: 1000,
          duration: 46,
          playlist: "Especiais Infantil - Abertura",
          song: {
            title: "Canal Infantil - Abertura",
            artist: "Olha Que Duas",
            album: "",
            art: "abertura.jpg",
          },
        },
      }, 1010, customPatterns);
      expect(cat.kind).toBe("announcement");
      if (cat.kind === "announcement") {
        expect(cat.name).toBe("Canal Infantil - Abertura");
        expect(cat.art).toBe("abertura.jpg");
      }
    });

    it("Especiais Infantil - Identidade (29s) → announcement", () => {
      const cat = pickCategory({
        now_playing: {
          played_at: 1000,
          duration: 29,
          playlist: "Especiais Infantil - Identidade",
          song: { title: "Canal Infantil - Identidade", artist: "Olha Que Duas", art: "id.jpg" },
        },
      }, 1010, customPatterns);
      expect(cat.kind).toBe("announcement");
    });

    it("Especiais Infantil - Fecho (42s) → announcement", () => {
      const cat = pickCategory({
        now_playing: {
          played_at: 1000,
          duration: 42,
          playlist: "Especiais Infantil - Fecho",
          song: { title: "Canal Infantil - Fecho", artist: "Olha Que Duas", art: "fecho.jpg" },
        },
      }, 1010, customPatterns);
      expect(cat.kind).toBe("announcement");
    });

    it("Especial do Dia — música real, NÃO anúncio (regression)", () => {
      const cat = pickCategory({
        now_playing: {
          played_at: 1000,
          duration: 200,
          playlist: "Especial do Dia",
          song: { title: "Tua Infinita Graça", artist: "Gerson Cardozo", art: "art.jpg" },
        },
      }, 1100, customPatterns);
      expect(cat.kind).toBe("music");
      if (cat.kind === "music") {
        expect(cat.song.title).toBe("Tua Infinita Graça");
        expect(cat.song.artist).toBe("Gerson Cardozo");
      }
    });

    it("vinheta com título 'Jingle XYZ' não escapa via playlist musical", () => {
      const cat = pickCategory({
        now_playing: {
          played_at: 1000,
          duration: 200,
          playlist: "Rotation Manhã",
          song: { title: "Jingle Hora Certa", artist: "Rádio", art: "" },
        },
      }, 1100, customPatterns);
      expect(cat.kind).toBe("jingle");
    });
  });

  it("aceita playlists customizadas via parâmetro", () => {
    // Sem custom patterns: "Cantinho da Pequena" não é announcement
    const baseCat = pickCategory({
      now_playing: {
        played_at: 1000,
        duration: 100,
        playlist: "Cantinho da Pequena",
        song: { title: "T", artist: "A", art: "x.jpg" },
      },
    }, 1050);
    expect(baseCat.kind).toBe("music");

    // Com custom: tratado como announcement
    const customCat = pickCategory({
      now_playing: {
        played_at: 1000,
        duration: 100,
        playlist: "Cantinho da Pequena",
        song: { title: "T", artist: "A", art: "x.jpg" },
      },
    }, 1050, [/cantinho/i]);
    expect(customCat.kind).toBe("announcement");
  });
});

describe("buildState", () => {
  it("constrói estado de música", () => {
    const state = buildState({
      kind: "music",
      audible: { played_at: 0, duration: 100 },
      song: { title: "T", artist: "A", album: "Al", art: "a.jpg" },
    });
    expect(state.isMusic).toBe(true);
    expect(state.song?.title).toBe("T");
    expect(state.isPodcast).toBe(false);
    expect(state.loading).toBe(false);
  });

  it("constrói estado de podcast", () => {
    const state = buildState({
      kind: "podcast",
      audible: { played_at: 0, duration: 100 },
      name: "Pod",
      art: "p.jpg",
    });
    expect(state.isPodcast).toBe(true);
    expect(state.podcastName).toBe("Pod");
    expect(state.podcastArt).toBe("p.jpg");
    expect(state.isMusic).toBe(false);
  });

  it("constrói estado de anúncio", () => {
    const state = buildState({
      kind: "announcement",
      audible: { played_at: 0, duration: 100 },
      name: "Ann",
      art: "ann.jpg",
    });
    expect(state.isAnnouncement).toBe(true);
    expect(state.announcementName).toBe("Ann");
  });

  it("constrói estado live", () => {
    const state = buildState({ kind: "live", name: "DJ" });
    expect(state.isLiveShow).toBe(true);
    expect(state.liveShowName).toBe("DJ");
  });

  it("gap e jingle dão estado neutro", () => {
    expect(buildState({ kind: "gap" })).toEqual(NEUTRAL);
    expect(buildState({
      kind: "jingle",
      audible: { played_at: 0, duration: 10 },
    })).toEqual(NEUTRAL);
  });
});

describe("estimateServerOffsetSeconds", () => {
  it("calcula offset positivo (servidor à frente do cliente)", () => {
    const clientNow = Date.now() / 1000;
    // Servidor diz: faixa começou há 50s
    const response: AzuraResponse = {
      now_playing: { played_at: clientNow - 40, elapsed: 50, duration: 200 },
    };
    const offset = estimateServerOffsetSeconds(response);
    expect(offset).not.toBeNull();
    // Servidor 'now' = (clientNow - 40) + 50 = clientNow + 10 → offset ≈ 10
    expect(offset!).toBeGreaterThan(8);
    expect(offset!).toBeLessThan(12);
  });

  it("devolve null quando dados ausentes (vs 0 = valor legítimo)", () => {
    expect(estimateServerOffsetSeconds({})).toBeNull();
    expect(estimateServerOffsetSeconds({
      now_playing: { played_at: 100 },
    })).toBeNull();
  });

  it("rejeita offsets absurdos (> 1h) — sanity check", () => {
    const response: AzuraResponse = {
      now_playing: { played_at: 0, elapsed: 100 }, // → server now ≈ 100 (epoch)
    };
    expect(estimateServerOffsetSeconds(response)).toBeNull();
  });
});

describe("smoothServerOffset", () => {
  it("aplica EMA quando delta excede o threshold", () => {
    const next = smoothServerOffset(0, 10, 0.3, 0.5);
    // 0 + 0.3 * (10 - 0) = 3
    expect(next).toBeCloseTo(3, 5);
  });

  it("ignora samples próximos do current (jitter)", () => {
    expect(smoothServerOffset(5, 5.2, 0.3, 0.5)).toBe(5);
    expect(smoothServerOffset(5, 4.8, 0.3, 0.5)).toBe(5);
  });

  it("aceita o sample quando excede threshold positivo", () => {
    expect(smoothServerOffset(5, 6.5, 0.5, 0.5)).toBeCloseTo(5.75, 5);
  });

  it("aceita o sample quando excede threshold negativo", () => {
    expect(smoothServerOffset(5, 3.5, 0.5, 0.5)).toBeCloseTo(4.25, 5);
  });

  it("mantém o current quando sample é null", () => {
    expect(smoothServerOffset(7, null, 0.3, 0.5)).toBe(7);
  });

  it("converge para o sample com aplicações sucessivas", () => {
    let v = 0;
    for (let i = 0; i < 50; i++) v = smoothServerOffset(v, 10, 0.3, 0.01);
    expect(v).toBeCloseTo(10, 1);
  });
});

describe("readAudioBufferAhead", () => {
  it("devolve null sem audio", () => {
    expect(readAudioBufferAhead(null)).toBeNull();
    expect(readAudioBufferAhead(undefined)).toBeNull();
  });

  it("devolve null quando buffered vazio", () => {
    const audio = {
      buffered: { length: 0, end: () => 0 },
      currentTime: 0,
    } as unknown as HTMLAudioElement;
    expect(readAudioBufferAhead(audio)).toBeNull();
  });

  it("calcula buffer ahead correctamente", () => {
    const audio = {
      buffered: {
        length: 1,
        end: (i: number) => (i === 0 ? 15 : 0),
      },
      currentTime: 10,
    } as unknown as HTMLAudioElement;
    expect(readAudioBufferAhead(audio)).toBe(5);
  });

  it("devolve null se ahead negativo (estado inconsistente)", () => {
    const audio = {
      buffered: { length: 1, end: () => 5 },
      currentTime: 10,
    } as unknown as HTMLAudioElement;
    expect(readAudioBufferAhead(audio)).toBeNull();
  });
});

describe("statesEqual", () => {
  it("trata estados idênticos como iguais", () => {
    expect(statesEqual(NEUTRAL, { ...NEUTRAL })).toBe(true);
  });

  it("detecta mudança de música", () => {
    const a: NowPlayingState = {
      ...NEUTRAL,
      isMusic: true,
      song: { title: "A", artist: "X", album: "", art: "" },
    };
    const b: NowPlayingState = {
      ...NEUTRAL,
      isMusic: true,
      song: { title: "B", artist: "X", album: "", art: "" },
    };
    expect(statesEqual(a, b)).toBe(false);
  });

  it("detecta toggle de loading", () => {
    expect(statesEqual(NEUTRAL, { ...NEUTRAL, loading: true })).toBe(false);
  });

  it("detecta mudança de live → música", () => {
    const live: NowPlayingState = { ...NEUTRAL, isLiveShow: true, liveShowName: "DJ" };
    const music: NowPlayingState = {
      ...NEUTRAL,
      isMusic: true,
      song: { title: "X", artist: "Y", album: "", art: "" },
    };
    expect(statesEqual(live, music)).toBe(false);
  });

  it("ignora reordenação de campos (mesmo conteúdo)", () => {
    const a: NowPlayingState = { ...NEUTRAL, isPodcast: true, podcastName: "P" };
    const b: NowPlayingState = { ...NEUTRAL, isPodcast: true, podcastName: "P" };
    expect(statesEqual(a, b)).toBe(true);
  });
});

describe("readBufferOverride", () => {
  afterEach(() => {
    localStorage.removeItem("radio.bufferSec");
  });

  it("devolve null sem chave definida", () => {
    expect(readBufferOverride()).toBeNull();
  });

  it("devolve número parseado quando válido", () => {
    localStorage.setItem("radio.bufferSec", "4.5");
    expect(readBufferOverride()).toBe(4.5);
  });

  it("aceita zero", () => {
    localStorage.setItem("radio.bufferSec", "0");
    expect(readBufferOverride()).toBe(0);
  });

  it("rejeita valores inválidos", () => {
    localStorage.setItem("radio.bufferSec", "abc");
    expect(readBufferOverride()).toBeNull();
  });

  it("rejeita negativos", () => {
    localStorage.setItem("radio.bufferSec", "-1");
    expect(readBufferOverride()).toBeNull();
  });

  it("rejeita valores absurdos (> 30s)", () => {
    localStorage.setItem("radio.bufferSec", "100");
    expect(readBufferOverride()).toBeNull();
  });
});

describe("detectServerTransition", () => {
  it("detecta mudança entre dois played_at diferentes", () => {
    expect(detectServerTransition(2000, 1000)).toBe(true);
  });

  it("não detecta mudança quando played_at igual", () => {
    expect(detectServerTransition(1000, 1000)).toBe(false);
  });

  it("não detecta no primeiro fetch (previous = null)", () => {
    expect(detectServerTransition(1000, null)).toBe(false);
  });

  it("não detecta quando current ausente", () => {
    expect(detectServerTransition(undefined, 1000)).toBe(false);
    expect(detectServerTransition(null, 1000)).toBe(false);
  });

  it("é direccional — qualquer mudança conta como transição", () => {
    // Mesmo retroceder (caso AzuraCast reordene) é considerado transição
    expect(detectServerTransition(1000, 2000)).toBe(true);
  });
});

describe("trackKey", () => {
  it("devolve title|artist", () => {
    expect(trackKey({ song: { title: "Hit", artist: "Queen" } })).toBe("Hit|Queen");
  });

  it("trims whitespace", () => {
    expect(trackKey({ song: { title: "  Hit  ", artist: " Queen " } })).toBe("Hit|Queen");
  });

  it("aceita só title", () => {
    expect(trackKey({ song: { title: "Jingle", artist: "" } })).toBe("Jingle|");
  });

  it("devolve null sem song", () => {
    expect(trackKey(undefined)).toBeNull();
    expect(trackKey({})).toBeNull();
  });

  it("devolve null se title E artist vazios", () => {
    expect(trackKey({ song: { title: "", artist: "" } })).toBeNull();
    expect(trackKey({ song: { title: "  ", artist: "  " } })).toBeNull();
  });
});

describe("shouldAnticipateTransition", () => {
  it("antecipa para live show", () => {
    expect(shouldAnticipateTransition({ kind: "live", name: "DJ" })).toBe(true);
  });

  it("antecipa para música longa", () => {
    expect(shouldAnticipateTransition({
      kind: "music",
      audible: { played_at: 0, duration: 200 },
      song: { title: "T", artist: "A", album: "", art: "" },
    })).toBe(true);
  });

  it("antecipa para música curta (faixas infantis legítimas <60s)", () => {
    // Filtros prévios (jingle, announcement, isValidSong) já apanharam
    // vinhetas; música curta classificada como music é música a sério.
    expect(shouldAnticipateTransition({
      kind: "music",
      audible: { played_at: 0, duration: 30 },
      song: { title: "T", artist: "A", album: "", art: "" },
    })).toBe(true);
  });

  it("antecipa para podcast", () => {
    expect(shouldAnticipateTransition({
      kind: "podcast",
      audible: { played_at: 0, duration: 1800 },
      name: "P", art: "",
    })).toBe(true);
  });

  it("NÃO antecipa para anúncio (curto, ofusca durante 30% da faixa)", () => {
    expect(shouldAnticipateTransition({
      kind: "announcement",
      audible: { played_at: 0, duration: 15 },
      name: "Ad", art: "",
    })).toBe(false);
  });

  it("NÃO antecipa para jingle", () => {
    expect(shouldAnticipateTransition({
      kind: "jingle",
      audible: { played_at: 0, duration: 5 },
    })).toBe(false);
  });

  it("NÃO antecipa para gap", () => {
    expect(shouldAnticipateTransition({ kind: "gap" })).toBe(false);
  });
});

describe("parseIcyStreamTitle", () => {
  it("parseia 'Artist - Title'", () => {
    expect(parseIcyStreamTitle("Gusttavo Lima - Falando de Amor")).toEqual({
      artist: "Gusttavo Lima",
      title: "Falando de Amor",
    });
  });

  it("parseia com múltiplos hífens no título", () => {
    expect(parseIcyStreamTitle("AC/DC - Back In Black - Remastered")).toEqual({
      artist: "AC/DC",
      title: "Back In Black - Remastered",
    });
  });

  it("trata StreamTitle sem separador como title só", () => {
    expect(parseIcyStreamTitle("Jingle da Rádio")).toEqual({
      artist: "",
      title: "Jingle da Rádio",
    });
  });

  it("devolve null para undefined/vazio", () => {
    expect(parseIcyStreamTitle(undefined)).toBeNull();
    expect(parseIcyStreamTitle("")).toBeNull();
  });

  it("trims whitespace", () => {
    expect(parseIcyStreamTitle("  Queen  -  Bohemian Rhapsody  ")).toEqual({
      artist: "Queen",
      title: "Bohemian Rhapsody",
    });
  });
});

describe("matchPlayingNext", () => {
  it("match por song.id quando ambos têm", () => {
    const a = { song: { title: "X", artist: "Y", id: "abc" } } as unknown as AzuraEntry;
    const b = { song: { title: "X", artist: "Y", id: "abc" } } as unknown as AzuraEntry;
    expect(matchPlayingNext(a, b)).toBe(true);
  });

  it("no match por id diferente", () => {
    const a = { song: { title: "X", artist: "Y", id: "abc" } } as unknown as AzuraEntry;
    const b = { song: { title: "X", artist: "Y", id: "def" } } as unknown as AzuraEntry;
    expect(matchPlayingNext(a, b)).toBe(false);
  });

  it("fallback por title+artist quando sem id", () => {
    const a: AzuraEntry = { song: { title: "Hit", artist: "Queen" } };
    const b: AzuraEntry = { song: { title: "Hit", artist: "Queen" } };
    expect(matchPlayingNext(a, b)).toBe(true);
  });

  it("false quando um dos dois é undefined", () => {
    expect(matchPlayingNext(undefined, { song: { title: "X" } })).toBe(false);
    expect(matchPlayingNext({ song: { title: "X" } }, undefined)).toBe(false);
  });
});
