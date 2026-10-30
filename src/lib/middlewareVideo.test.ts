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
