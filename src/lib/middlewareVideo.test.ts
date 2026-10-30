import { afterEach, describe, expect, it, vi } from "vitest";
import middleware from "../../middleware";

const MP4 = "https://jjifjbdfpvgeseqbjpkg.supabase.co/storage/v1/object/public/media-library/lenda-teste.mp4";

function postRow(extra: Record<string, unknown>) {
  return {
    title: "As bruxas de Trás-os-Montes",
    author: "",
    seo_title: "",
    seo_description: "Lenda de Trás-os-Montes",
    excerpt: "",
    content: "<p>Era uma vez.</p>",
    cover_url: "https://x.pt/capa.jpg",
    og_image_url: "https://x.pt/og.jpg",
    published_at: "2026-10-31T20:00:00+00:00",
    updated_at: "2026-10-31T20:00:00+00:00",
    exclusive_programs: { slug: "lendas-de-portugal", title: "Lendas de Portugal", author: "Olha que Duas" },
    ...extra,
  };
}

async function crawl(row: Record<string, unknown>) {
  const fetchMock = vi.fn(async (_url: string) => new Response(JSON.stringify([row])));
  vi.stubGlobal("fetch", fetchMock);
  const res = await middleware(
    new Request("https://www.olhaqueduas.com/exclusivo/lendas-de-portugal/bruxas-de-tras-os-montes", {
      headers: { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" },
    }),
  );
  return { res, fetchMock };
}

afterEach(() => vi.unstubAllGlobals());

describe("middleware: peça com vídeo", () => {
  it("pede select=* (funciona antes e depois da migração das colunas de vídeo)", async () => {
    const { fetchMock } = await crawl(postRow({}));
    expect(String(fetchMock.mock.calls[0][0])).toContain("select=*,exclusive_programs!inner");
  });

  it("põe og:video, a tag video e o VideoObject", async () => {
    const { res } = await crawl(postRow({ video_url: MP4, video_poster_url: "https://x.pt/poster.jpg", video_duration_seconds: 118 }));
    const html = await res!.text();
    expect(html).toContain(`<meta property="og:video" content="${MP4}">`);
    expect(html).toContain(`<video src="${MP4}" poster="https://x.pt/poster.jpg" controls playsinline preload="none"></video>`);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    expect(Array.isArray(ld)).toBe(true);
    expect(ld[0]["@type"]).toBe("NewsArticle");
    expect(ld[1]).toMatchObject({ "@type": "VideoObject", contentUrl: MP4, duration: "PT1M58S" });
  });

  it("sem vídeo fica igual ao que era", async () => {
    const { res } = await crawl(postRow({}));
    const html = await res!.text();
    expect(html).not.toContain("og:video");
    expect(html).not.toContain("<video");
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    expect(ld["@type"]).toBe("NewsArticle");
  });
});

describe("middleware: YouTube e programas sem peças", () => {
  it("peça com YouTube: iframe nocookie no HTML, VideoObject com embedUrl, sem og:video", async () => {
    const { res } = await crawl(postRow({ video_url: "https://youtube.com/shorts/dQw4w9WgXcQ", video_poster_url: "https://x.pt/poster.jpg" }));
    const html = await res!.text();
    expect(html).toContain('<iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"');
    expect(html).not.toContain("og:video");
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    expect(ld[1]).toMatchObject({ "@type": "VideoObject", embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" });
    expect(ld[1].thumbnailUrl).toEqual(["https://x.pt/poster.jpg"]);
  });

  async function programPage(leads: unknown[]) {
    const fetchMock = vi.fn(async (url: string) =>
      new Response(JSON.stringify(url.includes("/exclusive_programs?")
        ? [{ title: "Lendas de Portugal", author: "Alexandra Serra", tagline: "", description: "d", cover_url: "" }]
        : leads)),
    );
    vi.stubGlobal("fetch", fetchMock);
    const res = await middleware(
      new Request("https://www.olhaqueduas.com/exclusivo/lendas-de-portugal", {
        headers: { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" },
      }),
    );
    return { res: res!, fetchMock };
  }

  it("programa sem peças vivas dá 404 noindex", async () => {
    const { res, fetchMock } = await programPage([]);
    expect(res.status).toBe(404);
    expect(await res.text()).toContain("noindex");
    expect(String(fetchMock.mock.calls[1][0])).toContain("published_at.lte.");
  });

  it("programa com peça viva dá 200", async () => {
    const { res } = await programPage([{ cover_url: "https://x.pt/c.jpg", og_image_url: "https://x.pt/og.jpg" }]);
    expect(res.status).toBe(200);
  });
});
