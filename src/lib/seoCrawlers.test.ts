import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToRegexp } from "path-to-regexp";
import middleware, { config } from "../../middleware";
import { ROUTE_META } from "./routeMeta";
import { LOGO_URL, pieceArticleJsonLd, pieceBreadcrumbJsonLd } from "./pieceJsonLd";

// SEO audit 21/11/2026: route coverage for crawlers, real 404s, piece JSON-LD.
const root = resolve(__dirname, "../..");
const shell = readFileSync(resolve(root, "index.html"), "utf8");
const app = readFileSync(resolve(root, "src/App.tsx"), "utf8").replace(/\{\/\*[\s\S]*?\*\/\}/g, ""); // drop commented-out routes
const GOOGLE = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

afterEach(() => vi.unstubAllGlobals());

async function crawl(path: string, rows: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      String(url) === "https://www.olhaqueduas.com/" ? new Response(shell) : new Response(JSON.stringify(rows)),
    ),
  );
  const res = await middleware(new Request(`https://www.olhaqueduas.com${path}`, { headers: { "user-agent": GOOGLE } }));
  return { res, text: res ? await res.text() : "" };
}

// Fixed routes the SPA serves with the home head on purpose.
const NOT_IN_ROUTE_META = new Set([
  "/", // index.html already carries the home head
  "/historias", // standby (CLAUDE.md, Histórias): not linked, not in the sitemap
  "/viagens", // 301 in the middleware
  "/loja", // 301 in the middleware
]);

describe("every fixed SPA route has its own head for search engines", () => {
  const fixed = [...app.matchAll(/<Route path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((p) => !p.includes(":") && !p.includes("*"));

  it("App.tsx was parsed", () => {
    expect(fixed.length).toBeGreaterThan(15);
  });

  it.each(fixed)("%s is in ROUTE_META (or explicitly left out)", (path) => {
    expect(NOT_IN_ROUTE_META.has(path) || Boolean(ROUTE_META[path])).toBe(true);
  });

  it.each(Object.keys(ROUTE_META))("the matcher covers %s", (path) => {
    expect(config.matcher.some((m) => pathToRegexp(m).test(path))).toBe(true);
  });
});

describe("index.html head is valid on every route", () => {
  it("no hreflang pointing every page at the home, no home-only BreadcrumbList", () => {
    expect(shell).not.toContain("hreflang");
    expect(shell).not.toContain('"BreadcrumbList"');
  });

  it("Organization logo is the square logo", () => {
    expect(shell).toContain(`"url": "${LOGO_URL}"`);
  });
});

describe("real 404 for crawlers on missing news and albums", () => {
  it.each([
    ["/noticias/noticia-que-nao-existe", "/noticias"],
    ["/galeria/album-que-nao-existe", "/galeria"],
  ])("%s -> 404 noindex", async (path, back) => {
    const { res, text } = await crawl(path, []);
    expect(res?.status).toBe(404);
    expect(text).toContain('<meta name="robots" content="noindex, nofollow">');
    expect(text).toContain(`href="https://www.olhaqueduas.com${back}"`);
  });

  it.each(["/noticias/uma-noticia", "/galeria/um-album"])("%s with a Supabase error falls back to the SPA, never 404", async (path) => {
    const { res } = await crawl(path, { message: "boom" });
    expect(res).toBeUndefined();
  });
});

describe("odd news slugs from the cron (ending in '-', longer than 100)", () => {
  it.each([`${"a".repeat(98)}x-`, `${"b".repeat(106)}c`])("%s still gets its own head", async (slug) => {
    const { res, text } = await crawl(`/noticias/${slug}`, [{ title: "Notícia", summary: "Resumo", slug }]);
    expect(res?.status).toBe(200);
    expect(text).toContain(`<link rel="canonical" href="https://www.olhaqueduas.com/noticias/${slug}" />`);
  });
});

describe("piece page for crawlers", () => {
  const row = {
    title: "Kina: A Mulher que se Fez Sozinha",
    author: "",
    seo_title: "",
    seo_description: "Biografia da estilista",
    excerpt: "",
    content: "<p>Texto.</p>",
    cover_url: "https://x.pt/capa.jpg",
    og_image_url: "https://x.pt/og.jpg",
    published_at: "2026-11-20T14:14:43+00:00",
    updated_at: "2026-11-20T15:00:00+00:00",
    exclusive_programs: { slug: "curtas-biografias", title: "Curtas Biografias", author: "Alexandra Serra" },
  };

  it("robots meta, visible breadcrumb links and the SAME JSON-LD as the SPA", async () => {
    const { res, text } = await crawl("/programas/curtas-biografias/kina", [row]);
    expect(res?.status).toBe(200);
    expect(text).toContain('<meta name="robots" content="index, follow, max-image-preview:large');
    expect(text).toContain('<a href="https://www.olhaqueduas.com/programas">Programas</a>');
    expect(text).toContain('<a href="https://www.olhaqueduas.com/programas/curtas-biografias">Curtas Biografias</a>');
    const ld = JSON.parse(text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    // What ExclusivoPost builds for the same row (src/pages/ExclusivoPost.tsx).
    const spa = {
      title: row.title,
      seoTitle: row.seo_title,
      description: row.seo_description,
      image: row.og_image_url,
      publishedAt: row.published_at,
      updatedAt: row.updated_at,
      section: "Curtas Biografias",
      author: "Alexandra Serra",
      pageUrl: "https://www.olhaqueduas.com/programas/curtas-biografias/kina",
      programUrl: "https://www.olhaqueduas.com/programas/curtas-biografias",
    };
    expect(ld).toEqual(JSON.parse(JSON.stringify([pieceArticleJsonLd(spa), pieceBreadcrumbJsonLd(spa)])));
    expect(ld[0].author).toEqual({ "@type": "Person", name: "Alexandra Serra" });
    expect(ld[0].publisher.logo.url).toBe(LOGO_URL);
    expect(ld[1].itemListElement.map((i: { name: string }) => i.name)).toEqual([
      "Início",
      "Programas",
      "Curtas Biografias",
      row.title,
    ]);
  });
});
