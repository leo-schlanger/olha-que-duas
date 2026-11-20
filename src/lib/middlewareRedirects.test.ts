import { afterEach, describe, expect, it, vi } from "vitest";
import { pathToRegexp } from "path-to-regexp";
import middleware, { config, legacyRedirect } from "../../middleware";
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

describe("one hop, any case (qa 20/11)", () => {
  it.each([
    ["/loja", "/"], ["/loja/", "/"], ["/LOJA", "/"], ["/Loja/x", "/"],
    ["/viagens", "/"], ["/viagens/", "/"], ["/Viagens", "/"], ["/VIAGENS/", "/"],
    ["/exclusivo/Mente-Aberta", "/programas/mente-aberta"],
    ["/exclusivo/abel-dias-o-ze-nunca-bateu-na-betty", "/programas/noticias-olha-que-duas/abel-dias-o-ze-nunca-bateu-na-betty"],
    ["/Exclusivo/Pedro-Mourinho-Fora-Do-Now/", "/programas/noticias-olha-que-duas/pedro-mourinho-fora-do-now"],
    ["/exclusivo/olha-que-duas-e-eu", "/programas/noticias-olha-que-duas"],
    ["/galeria/senhor-televisao-carlos-cruz-20260920", "/programas/entrevistas/carlos-cruz-senhor-televisao"],
    ["/Galeria/Helena-Isabel-20260707/", "/programas/entrevistas/helena-isabel"],
  ])("%s -> %s", async (from, to) => {
    expect(legacyRedirect(from)).toBe(to);
    const res = await hit(from);
    expect(res?.status).toBe(301);
    expect(res?.headers.get("Location")).toBe(`https://www.olhaqueduas.com${to}`);
  });

  it.each(["/loja", "/loja/", "/LOJA", "/Viagens/", "/viagens/a/b", "/Exclusivo/X", "/Galeria/Helena-Isabel-20260707/"])("the matcher sends %s to the middleware", (path) => {
    expect(config.matcher.some((m) => pathToRegexp(m).test(path))).toBe(true);
  });

  it("vercel.json has no redirects left (vercel.json runs first and would add a second hop)", () => {
    expect((vercel as { redirects?: unknown[] }).redirects ?? []).toEqual([]);
  });

  it("no redirect for files or for the new addresses", () => {
    expect(legacyRedirect("/exclusivo/capa.jpg")).toBeNull();
    expect(legacyRedirect("/programas/mente-aberta")).toBeNull();
    expect(legacyRedirect("/lojas-do-centro")).toBeNull();
  });
});
