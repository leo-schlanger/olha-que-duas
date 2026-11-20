import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import middleware, { withHead } from "../../middleware";

// SEO (20/11/2026): Googlebot/Bingbot get the SPA shell with the route's own head.
const shell = readFileSync(resolve(__dirname, "../../index.html"), "utf8");
const GOOGLE = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

afterEach(() => vi.unstubAllGlobals());

async function get(path: string, ua: string, rows: unknown[] = []) {
  const fetchMock = vi.fn(async (url: string) =>
    String(url) === "https://www.olhaqueduas.com/" ? new Response(shell) : new Response(JSON.stringify(rows)),
  );
  vi.stubGlobal("fetch", fetchMock);
  const res = await middleware(new Request(`https://www.olhaqueduas.com${path}`, { headers: { "user-agent": ua } }));
  return { res, text: res ? await res.text() : "" };
}

describe("search engines get the SPA shell with the route head", () => {
  it("withHead swaps title, description, canonical and OG, keeps the app", () => {
    const out = withHead(shell, {
      title: "Serviços de comunicação para negócios",
      description: "Consultoria de comunicação para o seu negócio.",
      url: "https://www.olhaqueduas.com/servicos",
      image: "https://www.olhaqueduas.com/og-image.jpg",
    });
    expect(out).toContain("<title>Serviços de comunicação para negócios | Olha que Duas</title>");
    expect(out).toContain('<link rel="canonical" href="https://www.olhaqueduas.com/servicos" />');
    expect(out).toContain('<meta property="og:url" content="https://www.olhaqueduas.com/servicos" />');
    expect(out).toContain('<meta name="description" content="Consultoria de comunicação para o seu negócio." />');
    expect(out).not.toContain('<link rel="canonical" href="https://www.olhaqueduas.com" />');
    expect(out.match(/<title>/g)).toHaveLength(1);
    expect(out).toContain('<div id="root">'); // same SPA, same content
  });

  it("/servicos for Googlebot: right title and canonical in the raw HTML", async () => {
    const { res, text } = await get("/servicos", GOOGLE);
    expect(res?.status).toBe(200);
    expect(res?.headers.get("Cache-Control")).toContain("no-store");
    expect(text).toContain("<title>Serviços de comunicação para negócios | Olha que Duas</title>");
    expect(text).toContain('href="https://www.olhaqueduas.com/servicos"');
    expect(text).toContain('<div id="root">');
  });

  it("/noticias/:slug for Bingbot gets the article canonical", async () => {
    const row = { title: "Uma notícia", excerpt: "Resumo", slug: "uma-noticia", cover_url: "https://x.pt/c.jpg", published_at: "2026-11-20T10:00:00Z" };
    const { text } = await get("/noticias/uma-noticia", "Mozilla/5.0 (compatible; bingbot/2.0)", [row]);
    expect(text).toContain('<link rel="canonical" href="https://www.olhaqueduas.com/noticias/uma-noticia" />');
  });

  it("social previews keep the small meta page; people get the SPA untouched", async () => {
    const social = await get("/servicos", "facebookexternalhit/1.1");
    expect(social.text).not.toContain('<div id="root">');
    expect(social.text).toContain("<title>Serviços de comunicação para negócios | Olha que Duas</title>");
    const person = await get("/servicos", "Mozilla/5.0 Chrome/131");
    expect(person.res).toBeUndefined();
  });
});
