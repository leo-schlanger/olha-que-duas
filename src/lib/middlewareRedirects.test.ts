import { afterEach, describe, expect, it, vi } from "vitest";
import { pathToRegexp } from "path-to-regexp";
import middleware, { config } from "../../middleware";
import vercel from "../../vercel.json";

// 20/11/2026: «Especiais» (/exclusivo) became «Programas» (/programas); Loja and Viagens left.
afterEach(() => vi.unstubAllGlobals());

async function hit(path: string, ua = "Mozilla/5.0") {
  vi.stubGlobal("fetch", vi.fn(async () => new Response("[]")));
  return middleware(new Request(`https://www.olhaqueduas.com${path}`, { headers: { "user-agent": ua } }));
}

describe("middleware: /exclusivo -> /programas", () => {
  it.each([
    ["/exclusivo", "/programas"],
    ["/exclusivo/", "/programas"],
    ["/exclusivo/mente-aberta", "/programas/mente-aberta"],
    ["/Exclusivo/Mente-Aberta/", "/programas/mente-aberta"],
    ["/exclusivo/lendas-de-portugal/bruxas-de-tras-os-montes", "/programas/lendas-de-portugal/bruxas-de-tras-os-montes"],
    ["/exclusivo/olha-que-duas-e-eu/x", "/programas/noticias-olha-que-duas/x"],
  ])("%s -> 301 %s", async (from, to) => {
    const res = await hit(from);
    expect(res?.status).toBe(301);
    expect(res?.headers.get("Location")).toBe(`https://www.olhaqueduas.com${to}`);
  });

  it.each(["/Exclusivo", "/EXCLUSIVO/Mente-Aberta", "/Exclusivo/lendas-de-portugal/X"])(
    "the matcher sends %s to the middleware (any case)",
    (path) => {
      expect(config.matcher.some((m) => pathToRegexp(m).test(path))).toBe(true);
    },
  );

  it("/EXCLUSIVO/Lendas-De-Portugal/ -> one 301 to the lower-case /programas address", async () => {
    const res = await hit("/EXCLUSIVO/Lendas-De-Portugal/");
    expect(res?.status).toBe(301);
    expect(res?.headers.get("Location")).toBe("https://www.olhaqueduas.com/programas/lendas-de-portugal");
  });

  it("keeps the files under /exclusivo/ (covers used by the pieces)", async () => {
    expect(await hit("/exclusivo/abel-dias-betty-og.jpg")).toBeUndefined();
  });

  it("lets people through on /programas (SPA)", async () => {
    expect(await hit("/programas/mente-aberta")).toBeUndefined();
  });
});

describe("vercel.json redirects", () => {
  const redirects = vercel.redirects as Array<{ source: string; destination: string; statusCode: number }>;
  const find = (source: string) => redirects.find((r) => r.source === source);

  it.each(["/loja", "/loja/:path*", "/viagens", "/viagens/:path*"])("%s -> 301 /", (source) => {
    expect(find(source)).toMatchObject({ destination: "/", statusCode: 301 });
  });

  it("sends /exclusivo/* to /programas/* except files", () => {
    const rule = redirects.find((r) => r.destination === "/programas/:path");
    expect(rule?.statusCode).toBe(301);
    const re = new RegExp(`^${rule!.source.replace("/exclusivo/:path", "/exclusivo/")}$`);
    expect(re.test("/exclusivo/mente-aberta/peca")).toBe(true);
    expect(re.test("/exclusivo/capa.jpg")).toBe(false);
  });

  it("all redirects are 301 (not Vercel's default 308)", () => {
    expect(redirects.every((r) => r.statusCode === 301)).toBe(true);
  });

  it("no redirect still points to /exclusivo", () => {
    expect(redirects.filter((r) => r.destination.startsWith("/exclusivo"))).toEqual([]);
  });
});
