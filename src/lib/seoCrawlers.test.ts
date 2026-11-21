import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToRegexp } from "path-to-regexp";
import middleware, { config } from "../../middleware";
import { ROUTE_META } from "./routeMeta";
import { pieceArticleJsonLd, pieceBreadcrumbJsonLd } from "./pieceJsonLd";
import { LOGO_URL, PUBLISHER } from "./publisher";
import { videoObjectJsonLd } from "./articleVideo";

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

describe("aggregated news: noindex, follow (Leo, 21/11/2026)", () => {
  const row = { title: "Notícia", summary: "Resumo", slug: "uma-noticia" };

  it("/noticias/:slug for Googlebot: noindex, follow in robots and googlebot, own canonical", async () => {
    const { res, text } = await crawl("/noticias/uma-noticia", [row]);
    expect(res?.status).toBe(200);
    expect(text).toContain('<meta name="robots" content="noindex, follow" />');
    expect(text).toContain('<meta name="googlebot" content="noindex, follow" />');
    expect(text).toContain('<link rel="canonical" href="https://www.olhaqueduas.com/noticias/uma-noticia" />');
    expect(text).toContain('<div id="root">'); // people-visible page, same SPA
  });

  it("social preview page carries the same robots", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([row]))));
    const res = await middleware(new Request("https://www.olhaqueduas.com/noticias/uma-noticia", { headers: { "user-agent": "facebookexternalhit/1.1" } }));
    expect(await res!.text()).toContain('<meta name="robots" content="noindex, follow">');
  });

  it.each(["/noticias", "/programas", "/servicos"])("%s stays indexable", async (path) => {
    const { text } = await crawl(path, []);
    expect(text).toContain('<meta name="robots" content="index, follow, max-image-preview:large');
    expect(text).not.toContain("noindex");
  });

  it("the sitemap index no longer lists the news; sitemap-noticias is empty", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("[]")));
    const { default: handler } = await import("../../api/sitemap");
    const run = async (t: string) => {
      let body = "";
      const res = { setHeader: () => res, status: () => res, send: (b: string) => { body = b; return res; } };
      await handler({ query: { t } } as never, res as never);
      return body;
    };
    const index = await run("index");
    expect(index).not.toContain("sitemap-noticias");
    expect(index).toContain("sitemap-programas.xml");
    expect(index).toContain("sitemap-google-news.xml");
    expect(await run("noticias")).not.toContain("<url>");
  });
});

describe("qa 21/11/2026: publisher logo, sitemap index, home description, no .single()", () => {
  const tracked = execSync("git ls-files src api middleware.ts", { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f));
  const sources = tracked.map((f) => [f, readFileSync(resolve(root, f), "utf8")] as const);

  it("every publisher/provider block is the shared PUBLISHER or an @id reference", () => {
    const bad = sources.flatMap(([f, s]) =>
      [...s.matchAll(/\b(publisher|provider):\s*(\S[^\n]{0,40})/g)]
        .filter((m) => !/^(PUBLISHER\b|\{\s*["']@id["'])/.test(m[2]))
        .map((m) => `${f}: ${m[0]}`),
    );
    expect(bad).toEqual([]);
  });

  it("no logo points at the share image or a missing logo.png", () => {
    const bad = sources.flatMap(([f, s]) =>
      [...s.matchAll(/logo["']?:\s*(\{[^}]*\}|["'][^"']*["'])/g)]
        .filter((m) => /og-image\.jpg|\/logo\.png/.test(m[1]))
        .map((m) => `${f}: ${m[0]}`),
    );
    expect(bad).toEqual([]);
    expect(shell).not.toMatch(/"logo":\s*\{[^}]*og-image/);
  });

  it("VideoObject publisher has the square logo", () => {
    const ld = videoObjectJsonLd(
      { kind: "youtube", id: "dQw4w9WgXcQ", embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", watchUrl: "", thumbnail: "" } as never,
      { name: "x", description: "y", pageUrl: "https://www.olhaqueduas.com/x", uploadDate: "2026-11-20T10:00:00Z", fallbackThumbnail: "https://x.pt/a.jpg" },
    ) as { publisher: unknown };
    expect(ld.publisher).toEqual(PUBLISHER);
    expect(PUBLISHER.logo).toEqual({ "@type": "ImageObject", url: LOGO_URL, width: 512, height: 512 });
  });

  it("no .single() on slug lookups (406 in the console when missing)", () => {
    expect(sources.filter(([, s]) => /\.single\(\)/.test(s)).map(([f]) => f)).toEqual([]);
  });

  it("home description: ≤155 characters and the same everywhere", () => {
    const home = [...shell.matchAll(/<meta (?:name="(?:description|twitter:description)"|property="og:description")\s+content="([^"]+)"/g)].map((m) => m[1]);
    expect(home).toHaveLength(3);
    const index = readFileSync(resolve(root, "src/pages/Index.tsx"), "utf8");
    for (const d of home) {
      expect(d.length).toBeLessThanOrEqual(155);
      expect(d).toBe(home[0]);
      expect(index).toContain(d);
    }
  });

  it("sitemap index: each child's lastmod is the newest inside it", async () => {
    const rows: Record<string, unknown[]> = {
      gallery_albums: [{ slug: "a", title: "A", event_date: "2026-06-28", updated_at: null }],
      blog_posts: [{ published_at: "2026-11-21T00:15:00" }],
      vinagre_posts: [
        { slug: "p", title: "P", og_image_url: "", cover_url: "", published_at: "2026-11-19T10:00:00Z", updated_at: "2026-11-20T09:00:00Z", exclusive_programs: { slug: "prog", title: "Prog" } },
      ],
      exclusive_programs: [{ slug: "prog", title: "Prog", author: "X", cover_url: "", updated_at: "2026-10-01T00:00:00Z", event_id: null }],
    };
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      const table = String(url).split("/rest/v1/")[1].split("?")[0];
      const recentOnly = String(url).includes("published_at=gte.");
      return new Response(JSON.stringify(recentOnly ? [] : rows[table] ?? []));
    }));
    const { default: handler } = await import("../../api/sitemap");
    let body = "";
    const res = { setHeader: () => res, status: () => res, send: (b: string) => { body = b; return res; } };
    await handler({ query: { t: "index" } } as never, res as never);
    const site = STATIC_LASTMODS_MAX(["2026-11-21", "2026-11-20", "2026-06-28"]);
    expect(body).toContain(`<loc>https://www.olhaqueduas.com/sitemap-site.xml</loc><lastmod>${site}</lastmod>`);
    expect(body).toContain("<loc>https://www.olhaqueduas.com/sitemap-programas.xml</loc><lastmod>2026-11-20</lastmod>");
    expect(body).toContain("<loc>https://www.olhaqueduas.com/sitemap-google-news.xml</loc></sitemap>"); // empty: no lastmod
  });
});

// Newest of the hard-coded STATIC_PAGES dates and the given hub days.
function STATIC_LASTMODS_MAX(hubs: string[]): string {
  const src = readFileSync(resolve(root, "api/sitemap.ts"), "utf8");
  return [...src.matchAll(/lastmod: '(\d{4}-\d{2}-\d{2})'/g)].map((m) => m[1]).concat(hubs).sort().pop()!;
}
