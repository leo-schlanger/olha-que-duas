import { describe, expect, it } from "vitest";
import { articleVideo, isoDuration, videoObjectJsonLd } from "./articleVideo";
import { parseVinagrePost } from "@/types/vinagre";

const MP4 = "https://jjifjbdfpvgeseqbjpkg.supabase.co/storage/v1/object/public/media-library/lenda-teste.mp4";

describe("articleVideo", () => {
  it("devolve null sem vídeo ou com URL que não é https", () => {
    expect(articleVideo({})).toBeNull();
    expect(articleVideo({ video_url: "" })).toBeNull();
    expect(articleVideo({ video_url: "http://exemplo.pt/v.mp4" })).toBeNull();
    expect(articleVideo({ video_url: "javascript:alert(1)" })).toBeNull();
    expect(articleVideo({ video_url: 'https://x.pt/v.mp4" onerror="x' })).toBeNull();
  });

  it("usa o poster próprio e cai na capa quando não há", () => {
    expect(articleVideo({ video_url: MP4, video_poster_url: "https://x.pt/p.jpg", cover_url: "https://x.pt/c.jpg" })?.poster).toBe(
      "https://x.pt/p.jpg",
    );
    expect(articleVideo({ video_url: MP4, cover_url: "https://x.pt/c.jpg" })?.poster).toBe("https://x.pt/c.jpg");
    expect(articleVideo({ video_url: MP4, cover_url: "/exclusivo/local.jpg" })?.poster).toBe("");
  });

  it("só aceita duração inteira positiva", () => {
    expect(articleVideo({ video_url: MP4, video_duration_seconds: 118 })?.durationSeconds).toBe(118);
    expect(articleVideo({ video_url: MP4, video_duration_seconds: 0 })?.durationSeconds).toBeNull();
    expect(articleVideo({ video_url: MP4, video_duration_seconds: null })?.durationSeconds).toBeNull();
  });
});

describe("isoDuration", () => {
  it("formata em ISO 8601", () => {
    expect(isoDuration(118)).toBe("PT1M58S");
    expect(isoDuration(120)).toBe("PT2M");
    expect(isoDuration(45)).toBe("PT45S");
    expect(isoDuration(3725)).toBe("PT1H2M5S");
    expect(isoDuration(0)).toBe("PT0S");
  });
});

describe("videoObjectJsonLd", () => {
  it("monta o VideoObject com contentUrl, miniatura e duração", () => {
    const video = articleVideo({ video_url: MP4, video_poster_url: "https://x.pt/p.jpg", video_duration_seconds: 118 })!;
    const ld = videoObjectJsonLd(video, {
      name: "As bruxas de Trás-os-Montes",
      description: "Lenda",
      pageUrl: "https://www.olhaqueduas.com/exclusivo/lendas-de-portugal/x",
      uploadDate: "2026-10-31T20:00:00+00:00",
      fallbackThumbnail: "https://x.pt/og.jpg",
    });
    expect(ld["@type"]).toBe("VideoObject");
    expect(ld.contentUrl).toBe(MP4);
    expect(ld.thumbnailUrl).toEqual(["https://x.pt/p.jpg"]);
    expect(ld.duration).toBe("PT1M58S");
    expect(ld.uploadDate).toBe("2026-10-31T20:00:00+00:00");
  });

  it("sem poster usa a imagem de partilha e omite a duração desconhecida", () => {
    const video = articleVideo({ video_url: MP4 })!;
    const ld = videoObjectJsonLd(video, {
      name: "x",
      description: "y",
      pageUrl: "https://www.olhaqueduas.com/",
      fallbackThumbnail: "https://x.pt/og.jpg",
    });
    expect(ld.thumbnailUrl).toEqual(["https://x.pt/og.jpg"]);
    expect("duration" in ld).toBe(false);
  });
});

describe("parseVinagrePost com vídeo", () => {
  const base = {
    id: "1",
    slug: "s",
    title: "t",
    content: "<p>x</p>",
    created_at: "2026-10-30T00:00:00Z",
    updated_at: "2026-10-30T00:00:00Z",
    is_published: true,
  };

  it("lê as colunas de vídeo", () => {
    const post = parseVinagrePost({ ...base, video_url: MP4, video_poster_url: "https://x.pt/p.jpg", video_duration_seconds: 118 });
    expect(post?.video_url).toBe(MP4);
    expect(post?.video_poster_url).toBe("https://x.pt/p.jpg");
    expect(post?.video_duration_seconds).toBe(118);
  });

  it("aguenta linhas sem as colunas (base antes da migração)", () => {
    const post = parseVinagrePost(base);
    expect(post?.video_url).toBe("");
    expect(post?.video_duration_seconds).toBeNull();
  });
});

describe("articleVideo com YouTube", () => {
  const ID = "dQw4w9WgXcQ";
  it("reconhece shorts, watch e youtu.be e usa o embed youtube-nocookie", () => {
    for (const url of [`https://youtube.com/shorts/${ID}`, `https://www.youtube.com/watch?v=${ID}`, `https://youtu.be/${ID}`]) {
      const video = articleVideo({ video_url: url });
      expect(video?.kind).toBe("youtube");
      expect(video?.embedUrl).toBe(`https://www.youtube-nocookie.com/embed/${ID}`);
      expect(video?.src).toBe(`https://www.youtube.com/watch?v=${ID}`);
    }
  });

  it("poster próprio primeiro, senão a miniatura do YouTube (nunca a capa 16:10)", () => {
    expect(articleVideo({ video_url: `https://youtu.be/${ID}`, video_poster_url: "https://x.pt/p.jpg" })?.poster).toBe("https://x.pt/p.jpg");
    expect(articleVideo({ video_url: `https://youtu.be/${ID}`, cover_url: "https://x.pt/c.jpg" })?.poster).toBe(
      `https://i.ytimg.com/vi/${ID}/hqdefault.jpg`,
    );
  });

  it("URL do YouTube sem id válido não dá vídeo", () => {
    expect(articleVideo({ video_url: "https://www.youtube.com/channel/abc" })).toBeNull();
  });

  it("VideoObject com embedUrl e sem contentUrl", () => {
    const ld = videoObjectJsonLd(articleVideo({ video_url: `https://youtu.be/${ID}` })!, {
      name: "x",
      description: "y",
      pageUrl: "https://www.olhaqueduas.com/",
      fallbackThumbnail: "https://x.pt/og.jpg",
    });
    expect(ld.embedUrl).toBe(`https://www.youtube-nocookie.com/embed/${ID}`);
    expect("contentUrl" in ld).toBe(false);
  });
});
